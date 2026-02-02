import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { Client } from '@notionhq/client';
import validator from 'validator';

const resend = new Resend(process.env.RESEND_API_KEY);
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// ===== PROTECTION 1 : RATE LIMITING =====
// Map pour stocker les timestamps des dernières requêtes par IP
const rateLimitMap = new Map<string, number[]>();

const isRateLimited = (ip: string): boolean => {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 3; // Max 3 requêtes par minute

    const requests = rateLimitMap.get(ip) || [];

    // Filtrer les requêtes dans la fenêtre de temps
    const recentRequests = requests.filter(time => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
        return true; // Rate limited
    }

    // Ajouter la nouvelle requête
    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);

    // Nettoyer les vieilles entrées (éviter fuite mémoire)
    if (rateLimitMap.size > 1000) {
        const oldestKey = rateLimitMap.keys().next().value;
        if (oldestKey) rateLimitMap.delete(oldestKey);
    }

    return false;
};

// ===== PROTECTION 2 : SANITIZATION =====
const sanitizeString = (str: string, maxLength: number = 500): string => {
    if (!str) return '';
    return str
        .trim()
        .slice(0, maxLength)
        .replace(/[<>]/g, '') // Supprimer < et > (anti-XSS basique)
        .replace(/\n{3,}/g, '\n\n'); // Limiter les sauts de ligne
};

// ===== PROTECTION 3 : VALIDATION =====
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

    // Vérifier honeypot
    if (data.website) {
        return { valid: false, error: 'Spam détecté' };
    }

    return { valid: true };
};


// ===== API ROUTE =====
export async function POST(request: NextRequest) {
    try {
        // Protection 1: Rate Limiting
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
            request.headers.get('x-real-ip') ||
            'unknown';

        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: 'Too many requests. Please wait 1 minute.' },
                { status: 429 }
            );
        }

        // Parsing du body
        const body = await request.json();

        // Protection 3: Validation
        const validation = validateData(body);
        if (!validation.valid) {
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            );
        }

        // Protection 2: Sanitization
        const cleanData = {
            name: sanitizeString(body.name, 100),
            company: sanitizeString(body.company, 150),
            email: sanitizeString(body.email, 100),
            ambition: sanitizeString(body.ambition, 200),
            context: sanitizeString(body.context, 1000)
        };

        // Vérification finale de l'email
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
              <p style="font-size: 11px; color: #999;">IP: ${ip}</p>
            </div>
          </div>
        `
            });
        } catch (emailError: unknown) {
            console.error('Erreur Resend:', emailError);
            // On continue même si l'email échoue (Notion reste prioritaire)
        }

        // ===== 2. ENREGISTREMENT NOTION =====
        try {
            console.log('===== DÉBUT NOTION =====');
            console.log('[DEBUG] NOTION_API_KEY présente:', !!process.env.NOTION_API_KEY);
            console.log('[DEBUG] NOTION_DATABASE_ID:', process.env.NOTION_DATABASE_ID?.substring(0, 8) + '...');
            console.log('[DEBUG] cleanData:', JSON.stringify(cleanData, null, 2));

            if (!process.env.NOTION_API_KEY) {
                throw new Error('NOTION_API_KEY manquante dans les variables d\'environnement');
            }
            if (!process.env.NOTION_DATABASE_ID) {
                throw new Error('NOTION_DATABASE_ID manquante dans les variables d\'environnement');
            }

            const notionPayload = {
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
            };

            console.log('Payload Notion:', JSON.stringify(notionPayload, null, 2));

            const notionResult = await notion.pages.create(notionPayload);

            console.log('✅ Notion succès! Page ID:', notionResult.id);
            console.log('===== FIN NOTION =====');
        } catch (notionError: unknown) {
            const err = notionError as { message?: string; code?: string; status?: number; body?: unknown };
            console.error('[DEBUG] ❌ ERREUR NOTION COMPLÈTE:', {
                message: err.message,
                code: err.code,
                status: err.status,
                body: JSON.stringify(err.body)
            });

            // Si Notion échoue, on retourne quand même succès (l'email est envoyé)
            return NextResponse.json({
                success: true,
                message: 'Candidature envoyée (CRM temporairement indisponible)'
            });
        }

        // ===== SUCCÈS COMPLET =====
        return NextResponse.json({
            success: true,
            message: 'Candidature envoyée avec succès'
        });

    } catch (error: unknown) {
        console.error('Erreur générale:', error);

        // Ne JAMAIS exposer les détails de l'erreur au client
        return NextResponse.json(
            {
                error: 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement.',
            },
            { status: 500 }
        );
    }
}

// Bloquer les autres méthodes HTTP
export async function GET() {
    return NextResponse.json(
        { error: 'Méthode non autorisée' },
        { status: 405 }
    );
}
