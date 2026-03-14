import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { Client } from '@notionhq/client';
import validator from 'validator';
import { isRateLimited, getClientIP, sanitizeString, errorResponse, methodNotAllowed, rateLimitedResponse } from '@/lib/api-security';

const resend = new Resend(process.env.RESEND_API_KEY);
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// ===== VALIDATION =====
const validateEmail = (email: string): boolean => {
    return validator.isEmail(email) && email.length <= 100;
};

// Liste des domaines jetables courants
const DISPOSABLE_DOMAINS = [
    'guerrillamail.com',
    'temp-mail.org',
    'throwaway.email',
    '10minutemail.com',
    'mailinator.com',
    'tempmail.com',
    'yopmail.com',
    'maildrop.cc',
    'trashmail.com',
    'sharklasers.com'
];

const isDisposableEmail = (email: string): boolean => {
    const domain = email.split('@')[1]?.toLowerCase();
    return DISPOSABLE_DOMAINS.includes(domain);
};

const validateData = (data: Record<string, unknown>): { valid: boolean; error?: string } => {
    if (!data.name || typeof data.name !== 'string' || data.name.length < 2) {
        return { valid: false, error: 'Nom invalide (minimum 2 caractères)' };
    }

    if (!data.company || typeof data.company !== 'string' || data.company.length < 2) {
        return { valid: false, error: 'Structure requise (minimum 2 caractères)' };
    }

    if (!data.email || typeof data.email !== 'string' || !validateEmail(data.email)) {
        return { valid: false, error: 'Email invalide' };
    }

    if (isDisposableEmail(data.email as string)) {
        return { valid: false, error: 'Veuillez utiliser une adresse email professionnelle' };
    }

    if (!data.ambition || data.ambition === '') {
        return { valid: false, error: 'Veuillez sélectionner une ambition' };
    }

    if (!data.agreement) {
        return { valid: false, error: 'Vous devez accepter les conditions' };
    }

    // Honeypot check
    if (data.website) {
        return { valid: false, error: 'Spam détecté' };
    }

    return { valid: true };
};


// ===== API ROUTE =====
export async function POST(request: NextRequest) {
    try {
        // Protection: Rate Limiting (3 req/min)
        const ip = getClientIP(request);

        if (isRateLimited(ip, 'contact', 3, 60_000)) {
            return rateLimitedResponse();
        }

        // Parse body
        const body = await request.json();

        // Validation
        const validation = validateData(body);
        if (!validation.valid) {
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            );
        }

        // Sanitization
        const cleanData = {
            name: sanitizeString(body.name, 100),
            company: sanitizeString(body.company, 150),
            email: sanitizeString(body.email, 100),
            ambition: sanitizeString(body.ambition, 200),
            context: sanitizeString(body.context, 1000)
        };

        // Final email validation after sanitization
        if (!validateEmail(cleanData.email)) {
            return NextResponse.json(
                { error: 'Format d\'email invalide' },
                { status: 400 }
            );
        }

        // ===== 1. ENVOI EMAIL (RESEND) =====
        try {
            await resend.emails.send({
                from: 'Orsayn <contact@orsayn.fr>',
                to: 'contact@orsayn.fr',
                replyTo: cleanData.email,
                subject: `Nouvelle candidature : ${cleanData.name}${cleanData.company ? ` (${cleanData.company})` : ''}`,
                html: `
          <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FFFAF1; color: #1A1A1A;">
            <h2 style="color: #1A1A1A; border-bottom: 2px solid #D4B35D; padding-bottom: 10px;">Nouvelle candidature Orsayn</h2>
            
            <div style="margin: 20px 0;">
              <p style="margin: 10px 0;"><strong>Identité :</strong> ${cleanData.name}</p>
              ${cleanData.company ? `<p style="margin: 10px 0;"><strong>Structure :</strong> ${cleanData.company}</p>` : ''}
              <p style="margin: 10px 0;"><strong>Email :</strong> <a href="mailto:${cleanData.email}" style="color: #D4B35D;">${cleanData.email}</a></p>
              ${cleanData.ambition ? `<p style="margin: 10px 0;"><strong>Ambition :</strong> ${cleanData.ambition}</p>` : ''}
              ${cleanData.context ? `
                <p style="margin: 10px 0;"><strong>Contexte :</strong></p>
                <div style="margin: 10px 0; padding: 15px; background-color: white; border-left: 3px solid #D4B35D; white-space: pre-wrap;">${cleanData.context}</div>
              ` : ''}
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #D4B35D;">
              <p style="font-size: 12px; color: #666;">Candidature reçue depuis orsayn.com</p>
            </div>
          </div>
        `
            });
        } catch (emailError: unknown) {
            console.error('Erreur envoi email:', (emailError as Error).message);
            // Continue even if email fails (Notion is priority)
        }

        // ===== 2. ENREGISTREMENT NOTION =====
        try {
            if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
                throw new Error('Configuration CRM manquante');
            }

            await notion.pages.create({
                parent: {
                    database_id: process.env.NOTION_DATABASE_ID!
                },
                properties: {
                    'Identité': {
                        title: [{
                            text: { content: cleanData.name }
                        }]
                    },
                    'Structure': {
                        rich_text: [{
                            text: { content: cleanData.company || '-' }
                        }]
                    },
                    'Email': {
                        email: cleanData.email
                    },
                    'Ambition': {
                        select: {
                            name: cleanData.ambition || 'Autre'
                        }
                    },
                    'Contexte': {
                        rich_text: [{
                            text: { content: cleanData.context || '-' }
                        }]
                    },
                    'Date': {
                        date: {
                            start: new Date().toISOString()
                        }
                    },
                    'Statut': {
                        select: {
                            name: 'Nouveau'
                        }
                    }
                }
            });
        } catch (notionError: unknown) {
            console.error('Erreur CRM:', (notionError as Error).message);
            // If Notion fails, still return success (email was sent)
            return NextResponse.json({
                success: true,
                message: 'Candidature envoyée (CRM temporairement indisponible)'
            });
        }

        // ===== SUCCESS =====
        return NextResponse.json({
            success: true,
            message: 'Candidature envoyée avec succès'
        });

    } catch (error: unknown) {
        console.error('Erreur contact:', (error as Error).message);
        return errorResponse('Une erreur est survenue. Veuillez réessayer ou nous contacter directement.');
    }
}

// Block all other HTTP methods
export async function GET() { return methodNotAllowed(); }
export async function PUT() { return methodNotAllowed(); }
export async function DELETE() { return methodNotAllowed(); }
export async function PATCH() { return methodNotAllowed(); }
