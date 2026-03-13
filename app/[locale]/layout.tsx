import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import NoiseOverlay from '@/components/NoiseOverlay';
import '../globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

const locales = ['fr', 'en'] as const;

// 1. CONFIGURATION VIEWPORT
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: '#FFFAF1',
};

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

// 2. METADATA SEO (Dynamic based on locale)
export async function generateMetadata({
    params: { locale }
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'metadata' });

    return {
        metadataBase: new URL('https://www.orsayn.com'),
        title: {
            default: t('title'),
            template: `%s | Orsayn`
        },
        description: t('description'),
        keywords: [
            "transactionnel M&A private equity",
            "plateforme digitale cabinet d'avocats",
            "refonte site cabinet d'affaires",
            "site web private equity",
            "création site M&A fusion acquisition",
            "haut de bilan banques d'affaires",
            "plateforme digitale souveraine juridique",
            "refonte site cabinet international",
            "cybersécurité données stratégiques",
            "développement web haute performance",
            "SEO AEO référencement IA"
        ],
        authors: [{ name: 'Orsayn' }],
        creator: 'Orsayn',
        publisher: 'Orsayn',
        // No alternates/languages here — each page defines its own hreflang
        // to avoid conflicts between layout-level and page-level hreflang tags
        icons: {
            icon: '/logo/SECONDARY LOGO ANTH.svg',
            apple: '/logo/SECONDARY LOGO ANTH.svg',
        },
        openGraph: {
            type: 'website',
            locale: locale === 'fr' ? 'fr_FR' : 'en_US',
            url: `https://www.orsayn.com/${locale}`,
            siteName: 'Orsayn',
            title: t('title'),
            description: t('description'),
            images: [
                {
                    url: '/images/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'Orsayn - Plateforme souveraine pour le transactionnel'
                }
            ]
        },

        robots: {
            index: true,
            follow: true,
        }
    };
}

export default async function LocaleLayout({
    children,
    params: { locale }
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    if (!locales.includes(locale as typeof locales[number])) {
        notFound();
    }

    const messages = await getMessages({ locale });

    return (
        <html lang={locale}>
            <head>
                {/* Manual Local Font Preloading for LCP */}
                <link rel="preload" href="/fonts/Boska-300.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
                <link rel="preload" href="/fonts/Boska-500.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
                <link rel="preload" href="/fonts/GeneralSans-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
            </head>
            <body className="min-h-screen bg-[#FFFAF1] text-[#1A1A1A] overflow-x-hidden antialiased selection:bg-[#1A1A1A] selection:text-[#FFFAF1]">

                {/* SCHEMA.ORG : Carte d'identité pour Google (JSON-LD) */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Organization',
                            name: 'Orsayn',
                            url: 'https://www.orsayn.com',
                            logo: 'https://www.orsayn.com/logo/SECONDARY%20LOGO%20ANTH.svg',
                            description: "Plateformes digitales souveraines pour acteurs du transactionnel (M&A, Private Equity, Droit des affaires, Banques d'affaires)",
                            address: {
                                '@type': 'PostalAddress',
                                addressLocality: 'Saint-Avertin',
                                addressCountry: 'FR'
                            },
                            sameAs: [
                                'https://www.linkedin.com/company/orsayn',
                                'https://www.instagram.com/orsaynpartners'
                            ],
                            contactPoint: {
                                '@type': 'ContactPoint',
                                email: 'contact@orsayn.fr',
                                contactType: 'Customer Service'
                            }
                        })
                    }}
                />

                <NextIntlClientProvider locale={locale} messages={messages}>
                    <NoiseOverlay />
                    {children}
                    <SpeedInsights />
                    <Analytics />
                </NextIntlClientProvider>

            </body>
        </html>
    );
}
