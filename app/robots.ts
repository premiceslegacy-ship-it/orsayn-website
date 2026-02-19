import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://www.orsayn.com';
    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/', '/_next/static/', '/_next/image', '/images/'],
                disallow: ['/api/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
