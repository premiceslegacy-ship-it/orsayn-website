import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
    // ── Security: remove X-Powered-By header ──────────────────────────────────
    poweredByHeader: false,

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'placehold.co',
            },
        ],
    },

    // ── Security Headers ──────────────────────────────────────────────────────
    // Headers applied in production only — in dev, upgrade-insecure-requests
    // and other directives break CSS/JS loading on http://localhost
    async headers() {
        if (process.env.NODE_ENV !== 'production') return [];
        return [
            {
                // ── HTML pages & API routes only (NOT _next/static assets) ───
                // COEP, COOP, CORP are document-level headers — applying them
                // to CSS/JS static files confuses browsers and blocks rendering.
                source: '/((?!_next/static|_next/image|favicon).*)',
                headers: [
                    // HIGH/CRITICAL
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            // Scripts: self + Vercel tooling (analytics, speed insights, live preview)
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel-scripts.com https://*.vercel-insights.com",
                            // Styles: self + inline (Tailwind, Framer Motion). Fonts are self-hosted.
                            "style-src 'self' 'unsafe-inline'",
                            // Fonts: self only — Boska & General Sans from /public/fonts/
                            "font-src 'self'",
                            // Images: self + data URIs (SVG noise inline) + blob + CDN partners
                            "img-src 'self' data: blob: https://images.unsplash.com https://placehold.co https://www.orsayn.com",
                            // Connections: self (RSC payloads, API routes, HMR WebSocket) + Vercel vitals
                            "connect-src 'self' https://*.vercel-insights.com https://*.vercel-analytics.com https://*.vercel-scripts.com",
                            "frame-ancestors 'none'",
                            "base-uri 'self'",
                            "form-action 'self'",
                            "object-src 'none'",
                            "upgrade-insecure-requests",
                        ].join('; '),
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    // MEDIUM
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
                    },
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                    // LOW — cross-origin isolation (document-level only)
                    // COEP removed: 'credentialless' not supported in Safari, not needed for a marketing site
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin',
                    },
                    {
                        key: 'Cross-Origin-Resource-Policy',
                        value: 'same-origin',
                    },
                ],
            },
            {
                // ── Minimal headers for static assets (_next/static, images) ─
                // Only headers that make sense on static resources.
                source: '/_next/static/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Cross-Origin-Resource-Policy',
                        value: 'same-origin',
                    },
                ],
            },
        ];
    },
};

export default withNextIntl(nextConfig);
