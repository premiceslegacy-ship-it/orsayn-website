'use client';

import { useTranslations } from 'next-intl';

export default function PrivacyPage() {
    const t = useTranslations('legal.privacy');

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
