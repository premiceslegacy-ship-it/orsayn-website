'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { articles as journalArticles, getArticles } from '@/lib/journal-data';
import JournalBackButton from '@/components/JournalBackButton';

import ArticleReader from '@/components/ArticleReader';


// --- MAIN COMPONENT ---
const Perspectives: React.FC = () => {
  const t = useTranslations('journal');
  const locale = useLocale();
  // Get articles based on current locale
  const currentArticles = getArticles(locale);

  // We only need the 3 most recent articles for the cover
  const recentArticles = useMemo(() => {
    return [...currentArticles]
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, 3);
  }, [currentArticles, locale]);

  const [selectedArticle, setSelectedArticle] = useState<typeof journalArticles[0] | null>(null);

  // Helper to format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
  };

  return (
    <section id="revue" className="py-24 md:py-32 bg-paper relative overflow-hidden" data-scroll-section>
      {/* Background Texture - Subtle Grain (Dark on Light) */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-multiply" style={{ backgroundImage: 'url("/noise.png")' }}></div>

      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24">

        {/* THE COVER - A Dark (#1A1A1A), Distinct Rectangle Block */}
        <div className="bg-[#1A1A1A] w-full relative overflow-hidden border border-ink/5 shadow-2xl shadow-ink/10">
          {/* Background Texture - Subtle */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/noise.png")' }}></div>

          <div className="p-8 md:p-12 lg:p-16 flex flex-col relative z-10">

            {/* COVER HEADER: Title & Logo */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 border-b border-paper/10 pb-8">
              <div>
                <h2 className="font-serif text-3xl md:text-5xl text-paper uppercase leading-none">
                  {locale === 'fr' ? 'Revue Stratégique' : 'Strategic Review'}
                </h2>
              </div>
              {/* Secondary Logo #FFFAF1 */}
              <div className="mt-8 md:mt-0 w-16 h-16 md:w-20 md:h-20 relative">
                <img
                  src="/logo/SECONDARY LOGO.svg"
                  alt="OS Sigil"
                  className="w-full h-full object-contain opacity-90"
                // Note: Use standard SECONDARY LOGO.svg which is likely the light version or #FFFAF1. 
                // If it's effectively #FFFAF1, it will look correct on #1A1A1A.
                />
              </div>
            </div>

            {/* COVER CONTENT: 3 Articles */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              <AnimatePresence>
                {recentArticles.map((article, index) => (
                  <motion.div
                    key={article.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedArticle(article)}
                    className="group cursor-pointer"
                  >
                    {/* Image Aspect */}
                    <div className="relative aspect-[4/3] mb-6 overflow-hidden bg-paper/5 border border-paper/10 group-hover:border-paper/30 transition-colors">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
                      />
                      {/* Tag */}
                      <div className="absolute top-4 left-4">
                        <span className="text-[8px] uppercase tracking-widest text-paper/90 bg-ink/80 backdrop-blur-sm px-2 py-1 rounded border border-paper/10">
                          {article.tag}
                        </span>
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="pr-4">
                      <span className="block text-[9px] font-mono text-paper/30 mb-2">{formatDate(article.publishDate)}</span>
                      <h3 className="font-serif text-xl md:text-2xl text-paper mb-3 group-hover:text-brass transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-paper/50 line-clamp-3 leading-relaxed font-light">
                        {article.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* COVER FOOTER: CTA */}
            <div className="pt-8 border-t border-paper/10 flex justify-center md:justify-end">
              <Link
                href="/journal/annales" // "Consulter les annales" -> Goes to full archive
                className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-paper/60 hover:text-brass transition-colors duration-500 group border border-paper/10 px-6 py-3 rounded-full hover:border-brass/30 hover:bg-paper/5"
              >
                <span>{t('consultArchives')}</span>
                <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

          </div>
        </div>

      </div>

      {/* ARTICLE READER MODAL */}
      <AnimatePresence>
        {selectedArticle && (
          <ArticleReader article={selectedArticle} onClose={() => setSelectedArticle(null)} />
        )}
      </AnimatePresence>

    </section>
  );
};

export default Perspectives;