'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { getArticles, Article } from '@/lib/journal-data';
import { motion, AnimatePresence } from 'framer-motion';

const FILTERS = ['TOUS', 'STRATÉGIE', 'INFLUENCE', 'IDENTITÉ'] as const;

export default function JournalIndex() {
    const [activeFilter, setActiveFilter] = useState<string>('TOUS');
    const locale = useLocale();

    const currentArticles = getArticles(locale);

    const filteredArticles = currentArticles.filter((article) =>
        activeFilter === 'TOUS' ? true : article.tag === activeFilter
    );

    return (
        <section className="bg-paper min-h-screen pt-32 pb-24">
            <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 border-b border-ink/10 pb-8">
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.25em] text-ink/40 block mb-4">
                            PUBLICATION STRATÉGIQUE
                        </span>
                        <h1 className="font-serif text-5xl md:text-7xl text-ink">
                            Journal
                        </h1>
                    </div>

                    {/* FILTERS */}
                    <div className="flex gap-4 md:gap-8 mt-8 md:mt-0 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                        {FILTERS.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`text-[10px] uppercase tracking-[0.2em] transition-colors whitespace-nowrap ${activeFilter === filter
                                    ? 'text-ink font-medium border-b border-ink'
                                    : 'text-ink/40 hover:text-ink/70'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ARTICLES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    <AnimatePresence mode='popLayout'>
                        {filteredArticles.map((article) => (
                            <motion.article
                                key={article.slug}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className="group cursor-pointer"
                            >
                                <Link href={`/${locale}/journal/${article.slug}`} className="block">
                                    {/* META */}
                                    <div className="flex justify-between items-center mb-6 border-t border-ink/10 pt-4">
                                        <span className="text-[9px] uppercase tracking-[0.2em] text-ink/40 group-hover:text-brass transition-colors">
                                            {article.tag}
                                        </span>
                                        <span className="text-[9px] uppercase tracking-[0.2em] text-ink/40">
                                            {article.publishDate}
                                        </span>
                                    </div>

                                    {/* CONTENT */}
                                    <h2 className="font-serif text-2xl md:text-3xl text-ink mb-4 leading-tight group-hover:text-ink/70 transition-colors">
                                        {article.title}
                                    </h2>
                                    <p className="text-sm text-ink/60 leading-relaxed line-clamp-3 mb-6 font-light">
                                        {article.description}
                                    </p>

                                    {/* CTA */}
                                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-ink font-medium group-hover:gap-4 transition-all duration-300">
                                        Lire l'article
                                        <span className="block w-4 h-px bg-ink group-hover:bg-brass transition-colors"></span>
                                    </div>
                                </Link>
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </div>

            </div>
        </section>
    );
}
