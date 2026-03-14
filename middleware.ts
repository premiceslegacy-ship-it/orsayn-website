import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createMiddleware({
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    localePrefix: 'always'
})

// ── Security headers applied to every middleware response ──────────────────
const SECURITY_HEADERS: Record<string, string> = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-DNS-Prefetch-Control': 'on',
};

function applySecurityHeaders(response: NextResponse): NextResponse {
    for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
        response.headers.set(key, value);
    }
    // Remove X-Powered-By if present
    response.headers.delete('X-Powered-By');
    return response;
}

export default function middleware(request: NextRequest) {
    const host = request.headers.get('host') || ''

    // Directive 2: Permanent 308 redirect non-www → www
    if (
        host === 'orsayn.com' ||
        host === 'http://orsayn.com' ||
        host.startsWith('orsayn.com:')
    ) {
        const url = request.nextUrl.clone()
        url.host = 'www.orsayn.com'
        url.protocol = 'https:'
        const redirectResponse = NextResponse.redirect(url, { status: 308 });
        return applySecurityHeaders(redirectResponse);
    }

    const response = intlMiddleware(request)

    // Convert 307 (temporary) → 308 (permanent) for locale redirects
    // Critical for SEO: tells Google these are permanent canonical URLs
    if (response.status === 307) {
        const location = response.headers.get('location')
        if (location) {
            const permanentRedirect = NextResponse.redirect(location, { status: 308 });
            return applySecurityHeaders(permanentRedirect);
        }
    }

    return applySecurityHeaders(response as NextResponse);
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
