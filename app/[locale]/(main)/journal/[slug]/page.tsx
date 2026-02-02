import type { Metadata } from 'next';
import { getArticles } from '@/lib/journal-data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import JournalBackButton from '@/components/JournalBackButton';

interface Props {
    params: { slug: string; locale: string };
}

// 1. GENERATE METADATA DYNAMICALLY
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const articles = getArticles(params.locale);
    const article = articles.find((a) => a.slug === params.slug);

    if (!article) return { title: params.locale === 'en' ? 'Article Not Found | Orsayn' : 'Article Non Trouvé | Orsayn' };

    return {
        title: article.title,
        description: article.description,
        openGraph: {
            title: article.title,
            description: article.description,
            type: 'article',
            publishedTime: article.publishDate,
            authors: ['Orsayn'],
        },
    };
}

// 2. GENERATE STATIC PARAMS (Optional for SSG, good for performance)
export async function generateStaticParams() {
    const locales = ['fr', 'en'];
    return locales.flatMap((locale) =>
        getArticles(locale).map((article) => ({
            locale,
            slug: article.slug,
        }))
    );
}

import { getTranslations } from 'next-intl/server';

export default async function ArticlePage({ params }: Props) {
    const t = await getTranslations({ locale: params.locale, namespace: 'journal' });
    const articles = getArticles(params.locale);
    const article = articles.find((a) => a.slug === params.slug);

    if (!article) {
        notFound();
    }

    // SCHEMA.ORG ARTICLE
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.description,
        author: {
            '@type': 'Organization',
            name: 'Orsayn'
        },
        datePublished: article.publishDate,
        publisher: {
            '@type': 'Organization',
            name: 'Orsayn',
            logo: {
                '@type': 'ImageObject',
                url: 'https://orsayn.com/logo/SECONDARY%20LOGO%20ANTH.svg'
            }
        }
    };

    return (
        <article className="bg-paper min-h-screen pt-32 pb-16">

            {/* SCHEMA INJECTION */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="max-w-3xl mx-auto px-6 md:px-12">

                {/* BACK LINK */}
                <JournalBackButton label={t('back')} />

                {/* HEADER */}
                <header className="mb-16 text-center">
                    <div className="inline-block py-1 px-3 border border-ink/10 rounded-full text-[9px] uppercase tracking-[0.2em] text-ink/60 mb-8 bg-ink/[0.03]">
                        {article.tag} — {article.readTime} {t('readTime')}
                    </div>
                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink leading-[1.1] mb-8 uppercase">
                        {article.title}
                    </h1>

                    {/* AUTHOR SIGNATURE */}
                    <div className="flex items-center justify-center gap-3 mb-12">
                        <span className="h-px w-8 bg-ink/10"></span>
                        <span className="font-serif italic text-ink text-lg">{t('writtenBy')} Samuel Mbeboura</span>
                        <span className="h-px w-8 bg-ink/10"></span>
                    </div>
                </header>

                {/* AEO SNIPPET BLOCK (MODIFIED) */}
                <section className="bg-ink/[0.03] border-l-2 border-brass p-8 md:p-10 mb-16 rounded-r-lg">
                    {/* Label removed as requested */}
                    <div
                        className="text-base md:text-lg font-light italic text-ink/90 leading-relaxed font-sans [&_strong]:font-medium [&_strong]:not-italic"
                        dangerouslySetInnerHTML={{ __html: article.aeoSnippet }}
                    />
                </section>

                {/* MAIN CONTENT */}
                <div
                    className="prose prose-p:font-light prose-headings:font-serif prose-headings:font-normal prose-a:text-brass prose-blockquote:border-l-brass prose-blockquote:bg-ink/[0.02] prose-blockquote:py-2 prose-blockquote:px-6 max-w-none text-ink selection:bg-ink selection:text-paper"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* SUBTLE CTA (REPLACES FOOTER) */}
                <div className="mt-16 pt-16 border-t border-ink/5 text-center flex flex-col items-center">

                    {/* Anthracite Logo */}
                    <img
                        src="/logo/SECONDARY LOGO ANTH.svg"
                        alt="Orsayn"
                        className="h-4 w-auto opacity-80 mb-8"
                    />

                    <Link
                        href="/#contact"
                        className="group inline-flex items-center gap-3 text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-ink hover:text-brass transition-colors duration-300 border border-ink/10 px-8 py-4 rounded-full hover:border-brass/30 bg-paper hover:bg-ink/[0.02]"
                    >
                        <span>{article.ctaBenefit.toUpperCase()}</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </article>
    );
}
