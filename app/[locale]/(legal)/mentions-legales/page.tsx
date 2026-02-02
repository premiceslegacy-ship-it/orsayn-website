'use client';

import { useTranslations } from 'next-intl';

export default function MentionsPage() {
    const t = useTranslations('legal.mentions');

    return (
        <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-serif mb-12 text-[#1A1A1A]">{t('title')}</h1>

            <div className="space-y-12 text-sm leading-relaxed text-[#1A1A1A]">
                <div>
                    <h2 className="font-bold uppercase tracking-widest mb-4">{t('editor.title')}</h2>
                    <p dangerouslySetInnerHTML={{ __html: t.raw('editor.text') }} />
                </div>

                <div>
                    <h2 className="font-bold uppercase tracking-widest mb-4">{t('hosting.title')}</h2>
                    <p dangerouslySetInnerHTML={{ __html: t.raw('hosting.text') }} />
                </div>

                <div>
                    <h2 className="font-bold uppercase tracking-widest mb-4">{t('ip.title')}</h2>
                    <p>{t('ip.text')}</p>
                </div>
            </div>
        </main>
    );
}
