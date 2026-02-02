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
      {/* Background Texture - REMOVED FOR PERFORMANCE */}
      {/* <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-multiply" style={{ backgroundImage: '...' }}></div> */}

      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24">

        {/* THE COVER - A Dark (#1A1A1A), Distinct Rectangle Block */}
        <div className="bg-[#1A1A1A] w-full relative overflow-hidden border border-ink/5 shadow-2xl shadow-ink/10">
          {/* Background Texture - REMOVED FOR PERFORMANCE */}
          {/* <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: '...' }}></div> */}

          <div className="p-8 md:p-12 lg:p-16 flex flex-col relative z-10">

            {/* COVER HEADER: Title & Logo - Centered on Mobile */}
            <div className="flex flex-col md:flex-row justify-between items-center md:items-center mb-16 border-b border-paper/10 pb-8 text-center md:text-left">
              <div>
                <h2 className="font-serif text-3xl md:text-5xl text-paper uppercase leading-none">
                  {locale === 'fr' ? 'Revue Stratégique' : 'Strategic Review'}
                </h2>
              </div>
              {/* Secondary Logo #FFFAF1 */}
              <div className="mt-8 md:mt-0 w-16 h-16 md:w-20 md:h-20 relative mx-auto md:mx-0">
                <img
                  src="/logo/SECONDARY LOGO.svg"
                  alt="OS Sigil"
                  className="w-full h-full object-contain opacity-90"
                // Note: Use standard SECONDARY LOGO.svg which is likely the light version or #FFFAF1. 
                // If it's effectively #FFFAF1, it will look correct on #1A1A1A.
                />
              </div>
            </div>

            {/* COVER CONTENT: 3 Articles - REDESIGNED PREMIUM */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
              <AnimatePresence>
                {recentArticles.map((article, index) => (
                  <motion.button
                    key={article.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedArticle(article)}
                    className="group relative w-full aspect-[4/3] lg:aspect-[3/4] xl:aspect-[4/5] overflow-hidden border border-paper/10 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                    aria-label={`Lire l'article: ${article.title}`}
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0 w-full h-full bg-ink">
                      <img
                        src={article.coverImage}
                        alt=""
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-luxury grayscale group-hover:grayscale-0"
                      />
                    </div>

                    {/* Gradient Overlay - Sophisticated Bottom-up */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/40 to-transparent opacity-90 transition-opacity duration-700" />

                    {/* Hover Overlay - Brass Tint */}
                    <div className="absolute inset-0 bg-brass/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-overlay" />

                    {/* Content Container */}
                    <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end items-start z-20">

                      {/* Top Elements (Absolute) */}
                      <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                        {/* Tag */}
                        <span className="text-[8px] uppercase tracking-widest text-[#D4B35D] border border-[#D4B35D]/40 px-3 py-1 bg-[#1A1A1A]/80 backdrop-blur-sm">
                          {article.tag}
                        </span>

                        {/* Logo Mark - Subtle */}
                        <img src="/logo/SIMPLIFIED LOGO FINAL.svg" alt="" className="w-6 h-auto opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>

                      {/* Bottom Text */}
                      <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-700 ease-luxury">
                        <span className="block text-[9px] font-mono text-paper/40 mb-3 uppercase tracking-wider">
                          {formatDate(article.publishDate)}
                        </span>

                        <h3 className="font-serif text-xl md:text-2xl text-paper leading-tight mb-4 group-hover:text-[#D4B35D] transition-colors duration-500 line-clamp-3">
                          {article.title}
                        </h3>

                        {/* Description - Fade In on Hover */}
                        <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-700">
                          <p className="text-xs text-paper/70 font-light leading-relaxed mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 line-clamp-2">
                            {article.description}
                          </p>
                          <span className="inline-block mt-4 text-[9px] uppercase tracking-[0.2em] text-[#D4B35D] border-b border-[#D4B35D]/30 pb-1">
                            {t('readArticle', { defaultValue: 'Lire l\'article' })}
                          </span>
                        </div>
                      </div>

                    </div>
                  </motion.button>
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