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
    // This ensures orsayn.com/* → www.orsayn.com/* (no crawl loop)
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

    return intlMiddleware(request)
}

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).)']
}
