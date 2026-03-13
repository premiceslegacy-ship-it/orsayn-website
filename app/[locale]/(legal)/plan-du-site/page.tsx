import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export async function generateMetadata({
    params: { locale }
}: {
    params: { locale: string }
}): Promise<Metadata> {
    if (locale === 'en') {
        return {
            title: 'Site Map | Orsayn',
            robots: { index: false, follow: false },
            alternates: { canonical: 'https://www.orsayn.com/fr/plan-du-site' }
        };
    }
    return {
        title: 'Plan du Site | Orsayn',
        description: 'Plan du site Orsayn — navigation complète vers toutes les pages et rubriques.',
        alternates: {
            canonical: 'https://www.orsayn.com/fr/plan-du-site',
            languages: {
                'fr': 'https://www.orsayn.com/fr/plan-du-site',
                'x-default': 'https://www.orsayn.com/fr/plan-du-site',
            }
        }
    };
}

export default async function SitemapPage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    const t = await getTranslations({ locale, namespace: 'legal.sitemap' });

    return (
        <main className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
            <h1 className="text-3xl font-serif mb-12 text-[#1A1A1A] text-center">{t('title')}</h1>

            <div className="grid md:grid-cols-2 gap-12 text-sm">
                <div>
                    <h2 className="font-bold uppercase tracking-widest mb-6 border-b border-[#1A1A1A] pb-2">{t('mainNav')}</h2>
                    <ul className="space-y-4">
                        <li><Link href={`/${locale}`} className="hover:opacity-60 transition-opacity">{t('nav.home')}</Link></li>
                        <li><Link href={`/${locale}/#preambule`} className="hover:opacity-60 transition-opacity">{t('nav.preamble')}</Link></li>
                        <li><Link href={`/${locale}/#approche`} className="hover:opacity-60 transition-opacity">{t('nav.approach')}</Link></li>
                        <li><Link href={`/${locale}/journal`} className="hover:opacity-60 transition-opacity">{t('nav.review')}</Link></li>
                        <li className="pl-4"><Link href={`/${locale}/journal/cabinet-comme-media`} className="hover:opacity-60 transition-opacity text-gray-500">{t('articles.media')}</Link></li>
                        <li className="pl-4"><Link href={`/${locale}/journal/marque-personnelle-vs-institution`} className="hover:opacity-60 transition-opacity text-gray-500">{t('articles.personal')}</Link></li>
                        <li className="pl-4"><Link href={`/${locale}/journal/marque-transfrontaliere`} className="hover:opacity-60 transition-opacity text-gray-500">{t('articles.sovereign')}</Link></li>
                        <li className="pl-4"><Link href={`/${locale}/journal/guerre-des-talents`} className="hover:opacity-60 transition-opacity text-gray-500">{t('articles.talent')}</Link></li>
                        <li className="pl-4"><Link href={`/${locale}/journal/influence-deal-flow`} className="hover:opacity-60 transition-opacity text-gray-500">{t('articles.roi')}</Link></li>
                        <li className="pl-4"><Link href={`/${locale}/journal/luxe-du-silence`} className="hover:opacity-60 transition-opacity text-gray-500">{t('articles.rarity')}</Link></li>
                        <li className="pl-4"><Link href={`/${locale}/journal/plateforme-digitale-top-1-pourcent`} className="hover:opacity-60 transition-opacity text-gray-500">{t('articles.platform')}</Link></li>
                        <li><Link href={`/${locale}/#contact`} className="hover:opacity-60 transition-opacity">{t('nav.contact')}</Link></li>
                    </ul>
                </div>

                <div>
                    <h2 className="font-bold uppercase tracking-widest mb-6 border-b border-[#1A1A1A] pb-2">{t('legalInfo')}</h2>
                    <ul className="space-y-4">
                        <li><Link href={`/${locale}/mentions-legales`} className="hover:opacity-60 transition-opacity">{t('nav.mentions')}</Link></li>
                        <li><Link href={`/${locale}/cgv`} className="hover:opacity-60 transition-opacity">{t('nav.cgv')}</Link></li>
                        <li><Link href={`/${locale}/confidentialite`} className="hover:opacity-60 transition-opacity">{t('nav.privacy')}</Link></li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
