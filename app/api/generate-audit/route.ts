import { NextRequest, NextResponse } from 'next/server';
import { generateAuditPDF } from '@/lib/pdf-generator';
import { isRateLimited, getClientIP, sanitizeFilename, sanitizeString, errorResponse, methodNotAllowed, rateLimitedResponse } from '@/lib/api-security';

const MAX_BASE64_SIZE = 10 * 1024 * 1024; // 10 MB
const BASE64_REGEX = /^[A-Za-z0-9+/=]+$/;

export async function POST(request: NextRequest) {
    try {
        // Rate limiting: 5 req/min
        const ip = getClientIP(request);
        if (isRateLimited(ip, 'generate-audit', 5, 60_000)) {
            return rateLimitedResponse();
        }

        const data = await request.json();

        // Validate required fields
        if (!data.Nom_Cabinet || typeof data.Nom_Cabinet !== 'string' || data.Nom_Cabinet.length < 1) {
            return errorResponse('Nom_Cabinet requis', 400);
        }
        if (!data.Screenshot_Base64 || typeof data.Screenshot_Base64 !== 'string') {
            return errorResponse('Screenshot_Base64 requis', 400);
        }

        // Validate Nom_Cabinet length
        if (data.Nom_Cabinet.length > 200) {
            return errorResponse('Nom_Cabinet trop long (max 200 caractères)', 400);
        }

        // Validate Screenshot_Base64 (size + format)
        if (data.Screenshot_Base64.length > MAX_BASE64_SIZE) {
            return errorResponse('Image trop volumineuse (max 10 MB)', 400);
        }
        if (!BASE64_REGEX.test(data.Screenshot_Base64)) {
            return errorResponse('Format d\'image invalide', 400);
        }

        // Sanitize cabinet name
        data.Nom_Cabinet = sanitizeString(data.Nom_Cabinet, 200);

        // Generate PDF
        const pdfBuffer = await generateAuditPDF(data);

        // Sanitize filename to prevent Content-Disposition header injection
        const safeFilename = sanitizeFilename(data.Nom_Cabinet);

        return new NextResponse(new Uint8Array(pdfBuffer), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Audit_${safeFilename}.pdf"`,
                'Cache-Control': 'no-store',
            },
        });
    } catch (error) {
        console.error('Erreur génération PDF:', (error as Error).message);
        return errorResponse('Erreur lors de la génération du PDF');
    }
}

// Block all other HTTP methods
export async function GET() { return methodNotAllowed(); }
export async function PUT() { return methodNotAllowed(); }
export async function DELETE() { return methodNotAllowed(); }
export async function PATCH() { return methodNotAllowed(); }
