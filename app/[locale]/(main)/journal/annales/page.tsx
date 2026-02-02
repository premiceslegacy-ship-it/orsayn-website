'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { getArticles, articles as allArticles } from '@/lib/journal-data';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArticleReader from '@/components/ArticleReader';

export default function AnnalesPage() {
    const t = useTranslations('journal.annales');
    const tCommon = useTranslations('journal');
    const locale = useLocale();

    // Get correct articles for locale
    const articles = getArticles(locale);

    const [selectedArticle, setSelectedArticle] = useState<typeof allArticles[0] | null>(null);

    // Fixed category mapping for stability
    const CATEGORY_KEYS = ['ALL', 'STRATEGY', 'INFLUENCE', 'IDENTITY'];

    const [activeFilter, setActiveFilter] = useState<string>('ALL');

    // Helper to get effective tag
    const getEffectiveTag = (key: string, loc: string) => {
        if (key === 'ALL') return 'ALL';
        if (loc === 'fr') {
            if (key === 'STRATEGY') return 'STRATÉGIE';
            if (key === 'INFLUENCE') return 'INFLUENCE';
            if (key === 'IDENTITY') return 'IDENTITÉ';
        }
        return key;
    };

    const filteredArticles = useMemo(() => {
        if (activeFilter === 'ALL') {
            return articles;
        }
        const effectiveTag = getEffectiveTag(activeFilter, locale);
        return articles.filter(a => a.tag === effectiveTag);
    }, [activeFilter, articles, locale]);

    // Grouping by Tag for Sections (iterating over keys ensures order)
    const sectionKeys = CATEGORY_KEYS.filter(k => k !== 'ALL');

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const renderArticleSection = (tag: string) => {
        const sectionArticles = articles.filter(a => a.tag === tag);

        // Calculate effective filter tag to compare with section tag
        const effectiveFilter = activeFilter === 'ALL' ? 'ALL' : getEffectiveTag(activeFilter, locale);

        // If filtering, only show relevant section
        if (effectiveFilter !== 'ALL' && effectiveFilter !== tag) return null;
        if (sectionArticles.length === 0) return null;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="mb-24" key={tag}
            >
                <div className="flex items-center gap-4 mb-10">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-brass font-medium">{tag}</span>
                    <span className="flex-1 h-px bg-paper/10"></span>
                    <span className="text-[10px] text-paper/30">{sectionArticles.length} article{sectionArticles.length > 1 ? 's' : ''}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sectionArticles.map((article, index) => (
                        <motion.div
                            key={article.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            onClick={() => setSelectedArticle(article)}
                            className="group block border border-paper/5 p-8 hover:border-paper/20 hover:bg-paper/[0.02] transition-colors duration-500 cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <span className="text-[9px] text-paper/40">{formatDate(article.publishDate)}</span>
                                <div className="w-6 h-6 flex items-center justify-center rounded-full border border-paper/10 group-hover:bg-brass group-hover:border-brass transition-all duration-300">
                                    <ArrowUpRight className="w-3 h-3 text-paper/40 group-hover:text-ink transition-colors" />
                                </div>
                            </div>
                            <h3 className="font-serif text-xl text-paper mb-4 leading-tight group-hover:text-paper/80 transition-colors duration-300">
                                {article.title}
                            </h3>
                            <p className="text-sm text-paper/50 line-clamp-2 mb-6 font-light">
                                {article.description}
                            </p>
                            <span className="text-[9px] text-paper/30">{article.readTime} {tCommon('readTime')}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        );
    };

    // Helper for filter label
    const getFilterLabel = (cat: string) => {
        if (cat === 'ALL') return tCommon('filters.all');
        if (cat === 'STRATEGY') return tCommon('filters.strategy');
        if (cat === 'INFLUENCE') return tCommon('filters.influence');
        if (cat === 'IDENTITY') return tCommon('filters.identity');
        return cat;
    };

    return (
        <section className="bg-ink min-h-screen pt-32 pb-24 relative overflow-hidden">

            {/* NOISE TEXTURE */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24 relative z-10">

                {/* BACK LINK */}
                <Link
                    href={`/${locale}/#revue`}
                    className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-paper/40 hover:text-paper mb-16 transition-colors group"
                >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    {t('backToReview')}
                </Link>

                {/* HEADER */}
                <div className="mb-20 md:mb-24 border-b border-paper/10 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-2xl"
                    >
                        <span className="text-[10px] uppercase tracking-[0.25em] text-paper/40 block mb-4">
                            {t('subtitle')}
                        </span>
                        <h1 className="font-serif text-5xl md:text-7xl text-paper mb-6">
                            {t('title')}
                        </h1>
                        <p className="text-paper/60 font-light leading-relaxed whitespace-pre-line">
                            {t('description')}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-wrap gap-2 justify-start md:justify-end pb-1"
                    >
                        {CATEGORY_KEYS.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`text-[9px] uppercase tracking-widest px-3 py-2 md:px-4 border rounded-full transition-all duration-500 
                                    ${activeFilter === cat
                                        ? 'bg-paper text-ink border-paper shadow-md shadow-paper/10'
                                        : 'bg-transparent text-paper/50 border-paper/20 hover:border-paper/60 hover:text-paper hover:bg-paper/5'
                                    }`}
                            >
                                {getFilterLabel(cat)}
                            </button>
                        ))}
                    </motion.div>
                </div>

                {/* DYNAMIC SECTIONS */}
                {sectionKeys.map(key => renderArticleSection(getEffectiveTag(key, locale)))}

                {/* VISUAL FOOTER (Internal to page, not Global Footer) */}
                <div className="text-center pt-16 border-t border-paper/10">
                    <img
                        src="/logo/SECONDARY LOGO.svg"
                        alt="Orsayn"
                        className="h-8 w-8 opacity-60 mx-auto mb-4"
                    />
                    <p className="text-[9px] uppercase tracking-widest text-paper/30">
                        {t('footer')}
                    </p>
                </div>

            </div>

            {/* MODAL READER */}
            <AnimatePresence>
                {selectedArticle && (
                    <ArticleReader article={selectedArticle} onClose={() => setSelectedArticle(null)} />
                )}
            </AnimatePresence>
        </section>
    );
}
