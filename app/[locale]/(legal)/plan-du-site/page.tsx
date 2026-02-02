'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function SitemapPage() {
    const t = useTranslations('legal.sitemap');

    return (
        <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-serif mb-12 text-[#1A1A1A] text-center">{t('title')}</h1>

            <div className="grid md:grid-cols-2 gap-12 text-sm">
                <div>
                    <h2 className="font-bold uppercase tracking-widest mb-6 border-b border-[#1A1A1A] pb-2">{t('mainNav')}</h2>
                    <ul className="space-y-4">
                        <li><Link href="/" className="hover:opacity-60 transition-opacity">{t('nav.home')}</Link></li>
                        <li><Link href="/#preambule" className="hover:opacity-60 transition-opacity">{t('nav.preamble')}</Link></li>
                        <li><Link href="/#approche" className="hover:opacity-60 transition-opacity">{t('nav.approach')}</Link></li>
                        <li><Link href="/journal" className="hover:opacity-60 transition-opacity">{t('nav.review')}</Link></li>
                        <li className="pl-4"><Link href="/journal/cabinet-comme-media" className="hover:opacity-60 transition-opacity text-gray-500">{t('articles.media')}</Link></li>
                        <li className="pl-4"><Link href="/journal/marque-personnelle-vs-institution" className="hover:opacity-60 transition-opacity text-gray-500">{t('articles.personal')}</Link></li>
                        <li className="pl-4"><Link href="/journal/marque-transfrontaliere" className="hover:opacity-60 transition-opacity text-gray-500">{t('articles.sovereign')}</Link></li>
                        <li className="pl-4"><Link href="/journal/guerre-des-talents" className="hover:opacity-60 transition-opacity text-gray-500">{t('articles.talent')}</Link></li>
                        <li className="pl-4"><Link href="/journal/influence-deal-flow" className="hover:opacity-60 transition-opacity text-gray-500">{t('articles.roi')}</Link></li>
                        <li className="pl-4"><Link href="/journal/luxe-du-silence" className="hover:opacity-60 transition-opacity text-gray-500">{t('articles.rarity')}</Link></li>
                        <li><Link href="/#contact" className="hover:opacity-60 transition-opacity">{t('nav.contact')}</Link></li>
                    </ul>
                </div>

                <div>
                    <h2 className="font-bold uppercase tracking-widest mb-6 border-b border-[#1A1A1A] pb-2">{t('legalInfo')}</h2>
                    <ul className="space-y-4">
                        <li><Link href="/mentions-legales" className="hover:opacity-60 transition-opacity">{t('nav.mentions')}</Link></li>
                        <li><Link href="/cgv" className="hover:opacity-60 transition-opacity">{t('nav.cgv')}</Link></li>
                        <li><Link href="/confidentialite" className="hover:opacity-60 transition-opacity">{t('nav.privacy')}</Link></li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
