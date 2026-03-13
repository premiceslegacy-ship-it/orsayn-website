import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createMiddleware({
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    localePrefix: 'always'
})

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
        return NextResponse.redirect(url, { status: 308 })
    }

    const response = intlMiddleware(request)

    // Convert 307 (temporary) → 308 (permanent) for locale redirects
    // Critical for SEO: tells Google these are permanent canonical URLs
    if (response.status === 307) {
        const location = response.headers.get('location')
        if (location) {
            return NextResponse.redirect(location, { status: 308 })
        }
    }

    return response
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
