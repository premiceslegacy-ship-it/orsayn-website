import { NextResponse, NextRequest } from 'next/server';
import { Client } from '@notionhq/client';
import { isRateLimited, getClientIP, errorResponse, methodNotAllowed, rateLimitedResponse } from '@/lib/api-security';

// ─── Types ────────────────────────────────────────────────────────────────────
interface CRMContact {
    nom: string;
    personne_cle?: string;
    email?: string;
    telephone?: string;
    linkedin?: string;
    url_site?: string;
    profil?: string;
}

const MAX_CSV_ENTRIES = 100;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const makeValidUrl = (ustr: string): string | null => {
    try {
        let parsed = (ustr || '').trim().replace(/[\"',;\s]+$/, '');
        if (!parsed) return null;
        if (!parsed.startsWith('http')) parsed = `https://${parsed}`;
        new URL(parsed);
        return parsed;
    } catch { return null; }
}

// ─── CSV Parser ───────────────────────────────────────────────────────────────
function parseCSVContacts(csv: string): CRMContact[] {
    const lines = csv.trim().split(/\r\n|\n|\r/);
    if (lines.length < 2) return [];

    const header = lines[0].split(/[,;|\t]/).map(h => h.trim().toLowerCase().replace(/[^a-z0-9_éèêàùçî]/g, ''));

    const colMatch = (row: string[], ...names: string[]): string => {
        for (const name of names) {
            const idx = header.findIndex(h => h.includes(name));
            if (idx >= 0) return (row[idx] || '').trim().replace(/^["']|["']$/g, '');
        }
        return '';
    };

    const contacts: CRMContact[] = [];
    // Only parse up to MAX_CSV_ENTRIES
    for (let i = 1; i < lines.length && contacts.length < MAX_CSV_ENTRIES; i++) {
        if (!lines[i].trim()) continue;
        const row = lines[i].split(/[,;|\t]/);

        const nom = colMatch(row, 'nom', 'cabinet', 'entreprise', 'name', 'societe', 'société');
        const url_site = colMatch(row, 'url', 'site', 'lien', 'domai', 'web').replace(/[\"',;\s]+$/, '');

        if (!nom && !url_site) continue;

        contacts.push({
            nom: nom || (url_site ? (() => { try { return new URL(url_site.startsWith('http') ? url_site : `https://${url_site}`).hostname.replace('www.', ''); } catch { return url_site; } })() : 'Cabinet Inconnu'),
            personne_cle: colMatch(row, 'personne', 'contact', 'associe', 'interlo', 'prenom', 'nom_contact') || undefined,
            email: colMatch(row, 'mail', 'email', 'courriel') || undefined,
            telephone: colMatch(row, 'tel', 'phone', 'portable', 'mobile', 'numero') || undefined,
            linkedin: colMatch(row, 'linkedin', 'linked') || undefined,
            url_site: url_site || undefined,
            profil: colMatch(row, 'profil', 'note', 'comment', 'descri') || undefined,
        });
    }
    return contacts;
}

// ─── Notion Client ────────────────────────────────────────────────────────────
const getNotionClient = () => {
    const token = process.env.NOTION_CRM_TOKEN;
    if (!token) throw new Error("Erreur de configuration serveur");
    return new Client({ auth: token });
};

// ─── POST Handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    try {
        // Rate limiting: 5 req/min
        const ip = getClientIP(req);
        if (isRateLimited(ip, 'notion-crm', 5, 60_000)) {
            return rateLimitedResponse();
        }

        const notion = getNotionClient();
        const databaseId = process.env.NOTION_CRM_DATABASE_ID;
        if (!databaseId) throw new Error("Erreur de configuration serveur");

        const contentType = req.headers.get('content-type') || '';
        let contacts: CRMContact[] = [];

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            const file = formData.get('file') as File | null;
            if (!file) return errorResponse("Fichier non trouvé.", 400);

            // Limit file size to 1MB
            if (file.size > 1024 * 1024) {
                return errorResponse("Fichier trop volumineux (max 1 MB)", 400);
            }

            const text = await file.text();
            contacts = parseCSVContacts(text);
        } else {
            const body = await req.json();
            const entries: { url?: string }[] = body.entries || body.urls?.map((u: string) => ({ url: u })) || [];
            contacts = entries.slice(0, MAX_CSV_ENTRIES).map((e) => ({
                nom: '',
                url_site: (e.url || '').replace(/[\"',;\s]+$/, ''),
            }));
        }

        if (contacts.length === 0) {
            return errorResponse("Aucune entrée valide trouvée. Vérifiez votre fichier CSV ou payloads.", 400);
        }

        const results: { nom: string; id: string }[] = [];
        const errors: { nom: string; error: string }[] = [];

        for (const contact of contacts) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const properties: Record<string, any> = {};

                let name = contact.nom;
                if (!name && contact.url_site) {
                    try { name = new URL(contact.url_site.startsWith('http') ? contact.url_site : `https://${contact.url_site}`).hostname.replace('www.', ''); } catch { name = contact.url_site; }
                }
                properties["Nom du cabinet"] = {
                    title: [{ text: { content: name || "Cabinet Inconnu" } }]
                };

                properties["Statut"] = { select: { name: "Cible identifiée" } };

                if (contact.personne_cle) {
                    properties["Personne clé"] = { rich_text: [{ text: { content: contact.personne_cle.slice(0, 500) } }] };
                }

                if (contact.email) {
                    properties["Mail"] = { email: contact.email };
                }

                if (contact.telephone) {
                    properties["Téléphone"] = { phone_number: contact.telephone.slice(0, 50) };
                }

                if (contact.linkedin) {
                    const validLi = makeValidUrl(contact.linkedin);
                    if (validLi) properties["URL LinkedIn"] = { url: validLi };
                }

                if (contact.url_site) {
                    const validWeb = makeValidUrl(contact.url_site);
                    if (validWeb) properties["URL site web"] = { url: validWeb };
                }

                if (contact.profil) {
                    properties["Profil"] = { rich_text: [{ text: { content: contact.profil.substring(0, 2000) } }] };
                }

                const response = await notion.pages.create({
                    parent: { database_id: databaseId },
                    properties
                });

                results.push({ nom: name || "Cabinet Inconnu", id: response.id });

            } catch (err: unknown) {
                // Never leak internal Notion API errors to the client
                console.error("Notion error:", contact.nom, (err as Error).message);
                errors.push({ nom: contact.nom, error: "Erreur d'insertion CRM" });
            }
        }

        return NextResponse.json({
            success: true,
            created: results.length,
            failed: errors.length,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error: unknown) {
        console.error("API Notion CRM Error:", (error as Error).message);
        return errorResponse("Erreur interne du serveur", 500);
    }
}

// Block all other HTTP methods
export async function GET() { return methodNotAllowed(); }
export async function PUT() { return methodNotAllowed(); }
export async function DELETE() { return methodNotAllowed(); }
export async function PATCH() { return methodNotAllowed(); }
