import type { Metadata } from 'next';

/**
 * Base SEO configuration for Orsayn
 */
export const siteConfig = {
    name: 'Orsayn',
    description:
        'Cabinet de conseil en stratégie accompagnant les dirigeants et organisations dans leur transformation.',
    url: 'https://orsayn.com',
    ogImage: '/og-image.jpg',
    locale: 'fr_FR',
    themeColor: '#FFFAF1',
} as const;

/**
 * Generate metadata for a page
 */
export function generatePageMetadata({
    title,
    description,
    image,
    noIndex = false,
}: {
    title: string;
    description?: string;
    image?: string;
    noIndex?: boolean;
}): Metadata {
    const pageDescription = description ?? siteConfig.description;
    const pageImage = image ?? siteConfig.ogImage;

    return {
        title,
        description: pageDescription,
        openGraph: {
            title,
            description: pageDescription,
            images: [{ url: pageImage }],
            locale: siteConfig.locale,
            siteName: siteConfig.name,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: pageDescription,
            images: [pageImage],
        },
        robots: noIndex
            ? { index: false, follow: false }
            : { index: true, follow: true },
    };
}

/**
 * Generate JSON-LD structured data for organization
 */
export function generateOrganizationJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        description: siteConfig.description,
        sameAs: [
            // Add social media URLs here
        ],
    };
}

/**
 * Generate JSON-LD structured data for a webpage
 */
export function generateWebPageJsonLd({
    title,
    description,
    url,
}: {
    title: string;
    description: string;
    url: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: title,
        description,
        url,
        isPartOf: {
            '@type': 'WebSite',
            name: siteConfig.name,
            url: siteConfig.url,
        },
    };
}
