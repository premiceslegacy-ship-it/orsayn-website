import { NextRequest, NextResponse } from 'next/server';
import { scrapeMultipleSites } from '@/lib/site-scraper';
import { generateAuditPDF } from '@/lib/pdf-generator';
import { createZipFromPDFs } from '@/lib/zip-generator';
import type { AuditForceData } from '@/lib/forces-selector';

// ─── CSV Parser ───────────────────────────────────────────────────────────────
// Expected columns (flexible): url, note_google, nb_avis, classement, taille_equipe, annee_creation, specialite_1, specialite_2, ville
function parseCSV(csv: string): { url: string; overrides: Partial<AuditForceData> }[] {
    const lines = csv.trim().split(/\r\n|\n|\r/);
    if (lines.length < 2) return [];

    // Parse header
    const header = lines[0].split(/[,;|\t]/).map(h => h.trim().toLowerCase().replace(/[^a-z0-9_]/g, ''));

    const colMatch = (row: string[], ...names: string[]): string => {
        for (const name of names) {
            const idx = header.findIndex(h => h.includes(name));
            if (idx >= 0) return (row[idx] || '').trim();
        }
        return '';
    };

    const entries: { url: string; overrides: Partial<AuditForceData> }[] = [];

    for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(/[,;|\t]/);
        const url = colMatch(row, 'url', 'site', 'lien', 'domai', 'web');
        if (!url) continue;

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
        const contentType = request.headers.get('content-type') || '';
        let entries: { url: string; overrides?: Partial<AuditForceData> }[] = [];
        let lang: 'fr' | 'en' = 'fr';

        if (contentType.includes('multipart/form-data')) {
            // CSV file upload
            const formData = await request.formData();
            const file = formData.get('file') as File | null;

            if (!file) {
                return NextResponse.json({ error: 'Fichier CSV requis' }, { status: 400 });
            }

            const csvText = await file.text();
            entries = parseCSV(csvText);
            lang = (formData.get('lang') as string) === 'en' ? 'en' : 'fr';

            if (!entries.length) {
                return NextResponse.json(
                    { error: 'Aucune URL valide trouvée dans le fichier. Vérifiez le format CSV.' },
                    { status: 400 }
                );
            }
        } else {
            // JSON body: { entries:[{url,overrides}] } or { urls: [...] } or { url: "..." }
            const body = await request.json();

            if (body.entries && Array.isArray(body.entries)) {
                // New format: per-URL overrides from the URL tab
                entries = (body.entries as { url?: string; overrides?: Partial<AuditForceData> }[])
                    .filter(e => e?.url)
                    .map(e => ({ url: e.url!, overrides: e.overrides }));
                if (body.lang === 'en') lang = 'en';
            } else {
                const urls: string[] = body.urls ?? (body.url ? [body.url] : []);
                if (!urls.length) {
                    return NextResponse.json(
                        { error: 'Fournir au moins une URL dans le champ "urls"' },
                        { status: 400 }
                    );
                }
                entries = urls.map(url => ({ url }));
            }

            if (!entries.length) {
                return NextResponse.json(
                    { error: 'Fournir au moins une URL valide' },
                    { status: 400 }
                );
            }
        }

        // Scrape all sites
        const scrapedDataArray = await scrapeMultipleSites(entries);

        // Generate one PDF per site
        const pdfs: { filename: string; buffer: Buffer }[] = [];
        for (const data of scrapedDataArray) {
            const pdfBuffer = await generateAuditPDF({ ...data, lang });
            const safe = data.Nom_Cabinet.replace(/[^a-zA-Z0-9À-ÿ\s]/g, '').trim().replace(/\s+/g, '_').slice(0, 40);
            pdfs.push({ filename: `Audit_${safe}.pdf`, buffer: pdfBuffer });
        }

        if (pdfs.length === 1) {
            return new NextResponse(new Uint8Array(pdfs[0].buffer), {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': `attachment; filename="${pdfs[0].filename}"`,
                },
            });
        }

        const zipBuffer = await createZipFromPDFs(pdfs);
        const timestamp = new Date().toISOString().slice(0, 10);

        return new NextResponse(new Uint8Array(zipBuffer), {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename="Audits_Orsayn_${timestamp}.zip"`,
            },
        });
    } catch (error) {
        console.error('Erreur scrape-audit:', error);
        return NextResponse.json(
            { error: 'Erreur lors du scraping ou de la génération du PDF' },
            { status: 500 }
        );
    }
}
