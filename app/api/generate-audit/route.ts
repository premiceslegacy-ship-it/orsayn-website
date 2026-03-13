import { NextRequest, NextResponse } from 'next/server';
import { generateAuditPDF } from '@/lib/pdf-generator';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Validation basique
        if (!data.Nom_Cabinet || !data.Screenshot_Base64) {
            return NextResponse.json(
                { error: 'Nom_Cabinet et Screenshot_Base64 requis' },
                { status: 400 }
            );
        }

        // Générer le PDF
        const pdfBuffer = await generateAuditPDF(data);

        // Retourner le PDF
        return new NextResponse(new Uint8Array(pdfBuffer), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Audit_${data.Nom_Cabinet.replace(/\s+/g, '_')}.pdf"`,
            },
        });
    } catch (error) {
        console.error('Erreur génération PDF:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la génération du PDF' },
            { status: 500 }
        );
    }
}
