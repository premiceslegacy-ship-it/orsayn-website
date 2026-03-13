import { NextResponse } from 'next/server';
import { Client } from '@notionhq/client';

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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const makeValidUrl = (ustr: string): string | null => {
    try {
        let parsed = (ustr || '').trim().replace(/[\"',;\s]+$/, '');
        if (!parsed) return null;
        if (!parsed.startsWith('http')) parsed = `https://${parsed}`;
        new URL(parsed);
        return parsed;
    } catch { return null; }
};

// ─── CSV Parser ───────────────────────────────────────────────────────────────
// Reads all relevant CRM columns from the CSV: nom, personne_cle, mail, phone, linkedin, url, profil
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
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const row = lines[i].split(/[,;|\t]/);

        // Try to find the cabinet name from various column names
        const nom = colMatch(row, 'nom', 'cabinet', 'entreprise', 'name', 'societe', 'société');
        const url_site = colMatch(row, 'url', 'site', 'lien', 'domai', 'web').replace(/[\"',;\s]+$/, '');

        // A row must have at least a name or URL to be included
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
    if (!token) throw new Error("NOTION_CRM_TOKEN n'est pas configuré dans .env.local");
    return new Client({ auth: token });
};

// ─── POST Handler ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
    try {
        const notion = getNotionClient();
        const databaseId = process.env.NOTION_CRM_DATABASE_ID;
        if (!databaseId) throw new Error("NOTION_CRM_DATABASE_ID n'est pas configuré dans .env.local");

        const contentType = req.headers.get('content-type') || '';
        let contacts: CRMContact[] = [];

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            const file = formData.get('file') as File | null;
            if (!file) return NextResponse.json({ error: "Fichier non trouvé." }, { status: 400 });
            const text = await file.text();
            contacts = parseCSVContacts(text);
        } else {
            // JSON payload (e.g. from the URL tab)
            const body = await req.json();
            const entries: { url?: string }[] = body.entries || body.urls?.map((u: string) => ({ url: u })) || [];
            contacts = entries.map((e) => ({
                nom: '',  // will be filled by URL hostname fallback
                url_site: (e.url || '').replace(/[\"',;\s]+$/, ''),
            }));
        }

        if (contacts.length === 0) {
            return NextResponse.json({ error: "Aucune entrée valide trouvée. Vérifiez votre fichier CSV (colonnes: nom, url, mail, telephone, linkedin...)." }, { status: 400 });
        }

        const results: { nom: string; id: string }[] = [];
        const errors: { nom: string; error: string }[] = [];

        for (const contact of contacts) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const properties: Record<string, any> = {};

                // 1. Title (Nom du cabinet)
                let name = contact.nom;
                if (!name && contact.url_site) {
                    try { name = new URL(contact.url_site.startsWith('http') ? contact.url_site : `https://${contact.url_site}`).hostname.replace('www.', ''); } catch { name = contact.url_site; }
                }
                properties["Nom du cabinet"] = {
                    title: [{ text: { content: name || "Cabinet Inconnu" } }]
                };

                // 2. Statut = "Cible identifiée"
                properties["Statut"] = { select: { name: "Cible identifiée" } };

                // 3. Personne clé
                if (contact.personne_cle) {
                    properties["Personne clé"] = { rich_text: [{ text: { content: contact.personne_cle } }] };
                }

                // 4. Email
                if (contact.email) {
                    properties["Mail"] = { email: contact.email };
                }

                // 5. Téléphone
                if (contact.telephone) {
                    properties["Téléphone"] = { phone_number: contact.telephone };
                }

                // 6. LinkedIn URL
                if (contact.linkedin) {
                    const validLi = makeValidUrl(contact.linkedin);
                    if (validLi) properties["URL LinkedIn"] = { url: validLi };
                }

                // 7. URL site web
                if (contact.url_site) {
                    const validWeb = makeValidUrl(contact.url_site);
                    if (validWeb) properties["URL site web"] = { url: validWeb };
                }

                // 8. Profil (notes, description from CSV if provided)
                if (contact.profil) {
                    properties["Profil"] = { rich_text: [{ text: { content: contact.profil.substring(0, 2000) } }] };
                }

                const response = await notion.pages.create({
                    parent: { database_id: databaseId },
                    properties
                });

                results.push({ nom: name || "Cabinet Inconnu", id: response.id });

            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err);
                console.error("Notion error:", contact.nom, msg);
                errors.push({ nom: contact.nom, error: msg });
            }
        }

        return NextResponse.json({
            success: true,
            created: results.length,
            failed: errors.length,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Erreur interne";
        console.error("API Notion CRM Error:", error);
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
