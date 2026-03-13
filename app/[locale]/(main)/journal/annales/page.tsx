import type { Metadata } from 'next';
import AnnalesClient from './AnnalesClient';

export async function generateMetadata({
    params: { locale }
}: {
    params: { locale: string }
}): Promise<Metadata> {
    const canonicalUrl = `https://www.orsayn.com/${locale}/journal/annales`;
    const altLocale = locale === 'fr' ? 'en' : 'fr';

    return {
        title: locale === 'fr' ? 'Annales — Archives du Journal | Orsayn' : 'Archives — Journal Archives | Orsayn',
        description: locale === 'fr'
            ? 'Retrouvez l\'intégralité des doctrines stratégiques publiées par Orsayn. Stratégie, influence et identité pour les acteurs du transactionnel.'
            : 'Browse the complete archive of strategic doctrines published by Orsayn. Strategy, influence and identity for transactional players.',
        alternates: {
            canonical: canonicalUrl,
            languages: {
                [locale]: canonicalUrl,
                [altLocale]: `https://www.orsayn.com/${altLocale}/journal/annales`,
                'x-default': 'https://www.orsayn.com/fr/journal/annales',
            }
        }
    };
}

export default function AnnalesPage() {
    return <AnnalesClient />;
}
