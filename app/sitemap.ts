import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    // Directive 2: All URLs use www canonical base — no redirects from sitemap entries
    const baseUrl = 'https://www.orsayn.com';
    const locales = ['fr', 'en'];

    const routes: MetadataRoute.Sitemap = [];

    // 1.0 (Max): Home - Both locales
    locales.forEach(locale => {
        routes.push({
            url: `${baseUrl}/${locale}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1
        });
    });

    // 0.9 (Haute): Journal Index - Both locales
    locales.forEach(locale => {
        routes.push({
            url: `${baseUrl}/${locale}/journal`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9
        });
    });

    // 0.7: Journal Annales - Both locales
    locales.forEach(locale => {
        routes.push({
            url: `${baseUrl}/${locale}/journal/annales`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7
        });
    });

    // 0.8 (Forte): LES 6 DOCTRINES (SLUGS OFFICIELS) - Both locales
    const articles = [
        { slug: 'cabinet-comme-media', date: '2025-09-11' },
        { slug: 'marque-personnelle-vs-institution', date: '2025-10-15' },
        { slug: 'marque-transfrontaliere', date: '2025-11-12' },
        { slug: 'guerre-des-talents', date: '2025-12-08' },
        { slug: 'influence-deal-flow', date: '2026-01-05' },
        { slug: 'luxe-du-silence', date: '2026-01-20' },
        { slug: 'plateforme-digitale-top-1-pourcent', date: '2026-02-25' }
    ];

    articles.forEach(article => {
        locales.forEach(locale => {
            routes.push({
                url: `${baseUrl}/${locale}/journal/${article.slug}`,
                lastModified: new Date(article.date),
                changeFrequency: 'monthly',
                priority: 0.8
            });
        });
    });

    // 0.3 (Faible): Pages Légales - Both locales
    const legalPages = ['mentions-legales', 'confidentialite', 'cgv', 'plan-du-site'];
    legalPages.forEach(page => {
        locales.forEach(locale => {
            routes.push({
                url: `${baseUrl}/${locale}/${page}`,
                lastModified: new Date(),
                changeFrequency: 'yearly',
                priority: 0.3
            });
        });
    });

    return routes;
}
