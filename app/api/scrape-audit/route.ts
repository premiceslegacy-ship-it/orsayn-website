import { NextRequest, NextResponse } from 'next/server';
import { scrapeMultipleSites } from '@/lib/site-scraper';
import { generateAuditPDF } from '@/lib/pdf-generator';
import { createZipFromPDFs } from '@/lib/zip-generator';
import { isRateLimited, getClientIP, isValidUrl, sanitizeFilename, errorResponse, methodNotAllowed, rateLimitedResponse } from '@/lib/api-security';
import type { AuditForceData } from '@/lib/forces-selector';

const MAX_URLS = 20;

// ─── CSV Parser ───────────────────────────────────────────────────────────────
function parseCSV(csv: string): { url: string; overrides: Partial<AuditForceData> }[] {
    const lines = csv.trim().split(/\r\n|\n|\r/);
    if (lines.length < 2) return [];

    const header = lines[0].split(/[,;|\t]/).map(h => h.trim().toLowerCase().replace(/[^a-z0-9_]/g, ''));

    const colMatch = (row: string[], ...names: string[]): string => {
        for (const name of names) {
            const idx = header.findIndex(h => h.includes(name));
            if (idx >= 0) return (row[idx] || '').trim();
        }
        return '';
    };

    const entries: { url: string; overrides: Partial<AuditForceData> }[] = [];

    for (let i = 1; i < lines.length && entries.length < MAX_URLS; i++) {
        const row = lines[i].split(/[,;|\t]/);
        const url = colMatch(row, 'url', 'site', 'lien', 'domai', 'web');
        if (!url || !isValidUrl(url)) continue;

        const note = parseFloat(colMatch(row, 'note', 'google'));
        const nb = parseInt(colMatch(row, 'avis', 'review'));
        const equipe = parseInt(colMatch(row, 'equip', 'taille', 'team'));
        const annee = parseInt(colMatch(row, 'annee', 'creat', 'found'));

        entries.push({
            url,
            overrides: {
                Nom_Classement: colMatch(row, 'class', 'rank', 'legal500') || undefined,
                Note_Google: isNaN(note) ? undefined : note,
                Nb_Avis_Google: isNaN(nb) ? undefined : nb,
                Taille_Equipe: isNaN(equipe) ? undefined : equipe,
                Annee_Creation: isNaN(annee) ? undefined : annee,
                Specialite_1: colMatch(row, 'specia') || undefined,
                Ville: colMatch(row, 'ville', 'city') || undefined,
            },
        });
    }

    return entries;
}

export async function POST(request: NextRequest) {
    try {
        // Rate limiting: 3 req/min
        const ip = getClientIP(request);
        if (isRateLimited(ip, 'scrape-audit', 3, 60_000)) {
            return rateLimitedResponse();
        }

        const contentType = request.headers.get('content-type') || '';
        let entries: { url: string; overrides?: Partial<AuditForceData> }[] = [];
        let lang: 'fr' | 'en' = 'fr';

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const file = formData.get('file') as File | null;

            if (!file) {
                return errorResponse('Fichier CSV requis', 400);
            }

            // Limit file size (5 MB max)
            if (file.size > 5 * 1024 * 1024) {
                return errorResponse('Fichier trop volumineux (max 5 MB)', 400);
            }

            const csvText = await file.text();
            entries = parseCSV(csvText);
            lang = (formData.get('lang') as string) === 'en' ? 'en' : 'fr';

            if (!entries.length) {
                return errorResponse('Aucune URL valide trouvée dans le fichier. Vérifiez le format CSV.', 400);
            }
        } else {
            const body = await request.json();

            if (body.entries && Array.isArray(body.entries)) {
                entries = (body.entries as { url?: string; overrides?: Partial<AuditForceData> }[])
                    .filter(e => e?.url && isValidUrl(e.url))
                    .slice(0, MAX_URLS)
                    .map(e => ({ url: e.url!, overrides: e.overrides }));
                if (body.lang === 'en') lang = 'en';
            } else {
                const urls: string[] = body.urls ?? (body.url ? [body.url] : []);
                // Validate all URLs
                const validUrls = urls.filter(u => isValidUrl(u)).slice(0, MAX_URLS);
                if (!validUrls.length) {
                    return errorResponse('Fournir au moins une URL valide (http/https)', 400);
                }
                entries = validUrls.map(url => ({ url }));
            }

            if (!entries.length) {
                return errorResponse('Fournir au moins une URL valide', 400);
            }
        }

        // Scrape all sites
        const scrapedDataArray = await scrapeMultipleSites(entries);

        // Generate one PDF per site
        const pdfs: { filename: string; buffer: Buffer }[] = [];
        for (const data of scrapedDataArray) {
            const pdfBuffer = await generateAuditPDF({ ...data, lang });
            const safe = sanitizeFilename(data.Nom_Cabinet, 40);
            pdfs.push({ filename: `Audit_${safe}.pdf`, buffer: pdfBuffer });
        }

        if (pdfs.length === 1) {
            return new NextResponse(new Uint8Array(pdfs[0].buffer), {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename="${pdfs[0].filename}"`,
                    'Cache-Control': 'no-store',
                },
            });
        }

        const zipBuffer = await createZipFromPDFs(pdfs);
        const timestamp = new Date().toISOString().slice(0, 10);

        return new NextResponse(new Uint8Array(zipBuffer), {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="Audits_Orsayn_${timestamp}.zip"`,
                'Cache-Control': 'no-store',
            },
        });
    } catch (error) {
        console.error('Erreur scrape-audit:', (error as Error).message);
        return errorResponse('Erreur lors du scraping ou de la génération du PDF');
    }
}

// Block all other HTTP methods
export async function GET() { return methodNotAllowed(); }
export async function PUT() { return methodNotAllowed(); }
export async function DELETE() { return methodNotAllowed(); }
export async function PATCH() { return methodNotAllowed(); }
