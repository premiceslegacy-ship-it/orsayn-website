import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import JournalClient from './JournalClient';

export async function generateMetadata({
    params: { locale }
}: {
    params: { locale: string }
}): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: 'metadata' });
    const canonicalUrl = `https://www.orsayn.com/${locale}/journal`;
    const altLocale = locale === 'fr' ? 'en' : 'fr';

    return {
        title: locale === 'fr' ? 'Journal — Doctrines & Perspectives | Orsayn' : 'Journal — Doctrines & Perspectives | Orsayn',
        description: locale === 'fr'
            ? 'Doctrines stratégiques, analyses de fond et perspectives pour les acteurs du transactionnel. M&A, Private Equity, Droit des affaires.'
            : 'Strategic doctrines, in-depth analysis and perspectives for transactional players. M&A, Private Equity, Business Law.',
        alternates: {
            canonical: canonicalUrl,
            languages: {
                [locale]: canonicalUrl,
                [altLocale]: `https://www.orsayn.com/${altLocale}/journal`,
                'x-default': 'https://www.orsayn.com/fr/journal',
            }
        }
    };
}

export default function JournalPage() {
    return <JournalClient />;
}
