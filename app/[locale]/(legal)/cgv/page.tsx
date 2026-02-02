'use client';

import { useTranslations } from 'next-intl';

export default function CGVPage() {
    const t = useTranslations('legal.cgv');

    return (
        <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-justify">
            <h1 className="text-3xl font-serif mb-12 text-[#1A1A1A]">{t('title')}</h1>

            <div className="prose prose-stone max-w-none text-sm leading-relaxed space-y-8 text-[#1A1A1A]">

                <section>
                    <h2 className="text-base font-bold uppercase tracking-widest mb-4 border-b border-[#1A1A1A] pb-2">{t('preamble.title')}</h2>
                    <p dangerouslySetInnerHTML={{ __html: t.raw('preamble.text1') }} />
                    <p dangerouslySetInnerHTML={{ __html: t.raw('preamble.text2') }} />
                </section>

                <section>
                    <h2 className="text-base font-bold uppercase tracking-widest mb-4 border-b border-[#1A1A1A] pb-2">{t('article1.title')}</h2>
                    <p>{t('article1.text')}</p>
                </section>

                <section>
                    <h2 className="text-base font-bold uppercase tracking-widest mb-4 border-b border-[#1A1A1A] pb-2">{t('article2.title')}</h2>
                    <p>{t('article2.text1')}</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li dangerouslySetInnerHTML={{ __html: t.raw('article2.list1') }} />
                        <li dangerouslySetInnerHTML={{ __html: t.raw('article2.list2') }} />
                    </ul>
                    <p className="mt-2" dangerouslySetInnerHTML={{ __html: t.raw('article2.text2') }} />
                </section>

                <section>
                    <h2 className="text-base font-bold uppercase tracking-widest mb-4 border-b border-[#1A1A1A] pb-2">{t('article3.title')}</h2>
                    <p dangerouslySetInnerHTML={{ __html: t.raw('article3.text1') }} />
                    <p className="mt-2" dangerouslySetInnerHTML={{ __html: t.raw('article3.text2') }} />
                </section>

                <section>
                    <h2 className="text-base font-bold uppercase tracking-widest mb-4 border-b border-[#1A1A1A] pb-2">{t('article4.title')}</h2>
                    <p>{t('article4.text1')}</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li dangerouslySetInnerHTML={{ __html: t.raw('article4.list1') }} />
                        <li dangerouslySetInnerHTML={{ __html: t.raw('article4.list2') }} />
                    </ul>
                </section>

                <section>
                    <h2 className="text-base font-bold uppercase tracking-widest mb-4 border-b border-[#1A1A1A] pb-2">{t('article5.title')}</h2>
                    <p dangerouslySetInnerHTML={{ __html: t.raw('article5.text') }} />
                </section>

                <section>
                    <h2 className="text-base font-bold uppercase tracking-widest mb-4 border-b border-[#1A1A1A] pb-2">{t('article6.title')}</h2>
                    <p>{t('article6.text')}</p>
                </section>

                <section>
                    <h2 className="text-base font-bold uppercase tracking-widest mb-4 border-b border-[#1A1A1A] pb-2">{t('article7.title')}</h2>
                    <p>{t('article7.text')}</p>
                </section>

            </div>
        </main>
    );
}
