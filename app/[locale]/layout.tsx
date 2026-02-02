import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import NoiseOverlay from '@/components/NoiseOverlay';
import '../globals.css';

const locales = ['fr', 'en'] as const;

// 1. CONFIGURATION VIEWPORT (Séparée pour Next.js 14+)
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
        metadataBase: new URL('https://orsayn.com'),
        title: {
            default: t('title'),
            template: t('titleTemplate')
        },
        description: t('description'),
        keywords: [
            "plateforme digitale cabinet d'avocats",
            "refonte site cabinet d'affaires",
            "site web private equity",
            "création site M&A fusion acquisition",
            "plateforme digitale souveraine juridique",
            "refonte site cabinet international",
            "cybersécurité données stratégiques",
            "développement web haute performance",
            "SEO, AEO et référencement IA"
        ],
        authors: [{ name: 'Orsayn' }],
        creator: 'Orsayn',
        publisher: 'Orsayn',
        alternates: {
            canonical: `https://orsayn.com/${locale}`,
            languages: {
                'fr': 'https://orsayn.com/fr',
                'en': 'https://orsayn.com/en',
                'x-default': 'https://orsayn.com/fr'
            }
        },
        icons: {
            icon: '/logo/SECONDARY LOGO ANTH.svg',
            apple: '/logo/SECONDARY LOGO ANTH.svg',
        },
        openGraph: {
            type: 'website',
            locale: locale === 'fr' ? 'fr_FR' : 'en_US',
            url: `https://orsayn.com/${locale}`,
            siteName: 'Orsayn',
            title: t('title'),
            description: t('description'),
            images: [
                {
                    url: '/images/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: 'Orsayn - Plateforme digitale souveraine'
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
                {/* Précharger les polices critiques pour éviter le FOUC */}
                <link
                    rel="preload"
                    href="https://api.fontshare.com/v2/css?f[]=boska@200,300,400,500,700,900&f[]=general-sans@200,300,400,500,600,700&display=swap"
                    as="style"
                />
                <link
                    href="https://api.fontshare.com/v2/css?f[]=boska@200,300,400,500,700,900&f[]=general-sans@200,300,400,500,600,700&display=swap"
                    rel="stylesheet"
                />
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
                            url: 'https://orsayn.com',
                            logo: 'https://orsayn.com/logo/SECONDARY%20LOGO%20ANTH.svg',
                            description: "Plateforme digitale souveraine pour cabinets d'avocats",
                            address: {
                                '@type': 'PostalAddress',
                                addressLocality: 'Saint-Avertin',
                                addressCountry: 'FR'
                            },
                            sameAs: [
                                'http://www.linkedin.com/in/samuel-mbeboura-b28796293',
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
                </NextIntlClientProvider>

            </body>
        </html>
    );
}
