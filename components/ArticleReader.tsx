'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { articles as journalArticles } from '@/lib/journal-data';
import JournalBackButton from '@/components/JournalBackButton';

interface ArticleReaderProps {
    article: typeof journalArticles[0];
    onClose: () => void;
}

const ArticleReader: React.FC<ArticleReaderProps> = ({ article, onClose }) => {
    const t = useTranslations('journal');

    // Close modal when clicking on navbar links
    React.useEffect(() => {
        const handleNavClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if click is on a navigation link (href starts with /#)
            const link = target.closest('a[href^="/#"]');
            if (link) {
                onClose();
            }
        };

        document.addEventListener('click', handleNavClick);
        return () => document.removeEventListener('click', handleNavClick);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-paper overflow-y-auto"
        >
            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 h-1 bg-brass origin-left z-[110]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
            />

            <div className="max-w-[1920px] mx-auto relative min-h-screen flex flex-col">

                {/* Article Content */}
                <div className="flex-grow flex flex-col items-center pt-28 md:pt-48 pb-20 md:pb-32 px-6">

                    <article className="w-full max-w-3xl">
                        {/* BACK LINK */}
                        <div className="mb-16">
                            <JournalBackButton onClick={onClose} label={t('back')} />
                        </div>

                        {/* Header */}
                        <div className="text-center mb-16 md:mb-24">
                            <span className="inline-block py-1 px-3 border border-ink/10 rounded-full text-[9px] uppercase tracking-[0.2em] text-ink/60 mb-6 md:mb-8 bg-ink/[0.03]">
                                {article.tag} — {article.readTime} {t('readTime')}
                            </span>
                            <div className="mb-8 md:mb-10 text-center">
                                <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl text-ink leading-[0.95] mb-4 uppercase">{article.title}</h1>
                                <div className="flex items-center justify-center gap-3">
                                    <span className="h-px w-6 bg-ink/10"></span>
                                    <span className="font-serif italic text-ink text-lg md:text-xl">{t('writtenBy')} Samuel Mbeboura</span>
                                    <span className="h-px w-6 bg-ink/10"></span>
                                </div>
                            </div>
                        </div>

                        {/* AEO SNIPPET BLOCK */}
                        <section className="bg-ink/[0.03] border-l-2 border-brass p-8 md:p-10 mb-16 rounded-r-lg">
                            <div
                                className="text-base md:text-lg font-light italic text-ink/90 leading-relaxed font-sans [&_strong]:font-medium [&_strong]:not-italic"
                                dangerouslySetInnerHTML={{ __html: article.aeoSnippet }}
                            />
                        </section>

                        {/* Body Text */}
                        <div
                            className="prose prose-lg 
                    prose-headings:font-serif prose-headings:font-normal prose-headings:text-2xl md:prose-headings:text-3xl prose-headings:text-ink 
                    prose-h3:mt-16 prose-h3:mb-6 md:prose-h3:mt-20 md:prose-h3:mb-8 
                    prose-p:font-sans prose-p:text-base md:prose-p:text-lg prose-p:text-ink prose-p:font-normal prose-p:leading-[1.7] md:prose-p:leading-[1.8] prose-p:mb-6
                    prose-blockquote:border-l-2 prose-blockquote:border-brass prose-blockquote:pl-6 md:prose-blockquote:pl-8 prose-blockquote:py-2 prose-blockquote:my-10 md:prose-blockquote:my-12 prose-blockquote:text-ink
                    prose-img:grayscale max-w-none"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* Footer with CTA */}
                        <div className="mt-16 pt-16 border-t border-ink/5 text-center flex flex-col items-center">

                            {/* Anthracite Logo */}
                            <img
                                src="/logo/SECONDARY LOGO ANTH.svg"
                                alt="Orsayn"
                                className="h-4 w-auto opacity-80 mb-8"
                            />

                            <Link
                                href="/#contact"
                                onClick={onClose}
                                className="group inline-flex items-center gap-3 text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-ink hover:text-brass transition-colors duration-300 border border-ink/10 px-8 py-4 rounded-full hover:border-brass/30 bg-paper hover:bg-ink/[0.02]"
                            >
                                <span>{article.ctaBenefit.toUpperCase()}</span>
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </article>

                </div>
            </div>
        </motion.div>
    );
};

export default ArticleReader;
