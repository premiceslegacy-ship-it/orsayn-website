import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
    params: { locale }
}: {
    params: { locale: string }
}): Promise<Metadata> {
    if (locale === 'en') {
        return {
            title: 'Privacy Policy | Orsayn',
            robots: { index: false, follow: false },
            alternates: { canonical: 'https://www.orsayn.com/fr/confidentialite' }
        };
    }
    return {
        title: 'Politique de Confidentialité | Orsayn',
        description: 'Politique de confidentialité et traitement des données personnelles de la plateforme Orsayn.',
        alternates: {
            canonical: 'https://www.orsayn.com/fr/confidentialite',
            languages: {
                'fr': 'https://www.orsayn.com/fr/confidentialite',
                'x-default': 'https://www.orsayn.com/fr/confidentialite',
            }
        }
    };
}

export default async function PrivacyPage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    const t = await getTranslations({ locale, namespace: 'legal.privacy' });

    return (
        <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto text-justify">
            <h1 className="text-3xl font-serif mb-12 text-[#1A1A1A]">{t('title')}</h1>

            <div className="prose prose-stone max-w-none text-sm leading-relaxed space-y-6 text-[#1A1A1A]">
                <p>{t('intro')}</p>

                <h3 className="text-base font-bold uppercase mt-8">{t('section1.title')}</h3>
                <p>{t('section1.text')}</p>

                <h3 className="text-base font-bold uppercase mt-8">{t('section2.title')}</h3>
                <p dangerouslySetInnerHTML={{ __html: t.raw('section2.text') }} />

                <h3 className="text-base font-bold uppercase mt-8">{t('section3.title')}</h3>
                <p>{t('section3.text')}</p>
            </div>
        </main>
    );
}
