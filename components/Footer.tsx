'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';

const Footer: React.FC = () => {
    const t = useTranslations('footer');
    const locale = useLocale();
    const currentYear = new Date().getFullYear();
    const [isBackNav, setIsBackNav] = useState(false);

    useEffect(() => {
        // Détecte si la navigation est de type "back_forward"
        const navEntries = window.performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (navEntries.length > 0 && navEntries[0].type === 'back_forward') {
            setIsBackNav(true);
        }
    }, []);

    return (
        <footer className="relative bg-paper z-20">
            <motion.div
                initial={isBackNav ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{
                    duration: isBackNav ? 0 : 0.8,
                    ease: [0.22, 1, 0.36, 1]
                }}
                className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24"
            >

                {/* CONTAINER WITH BORDERS */}
                <div className="border-l border-r border-ink/10 border-t border-ink/10 bg-paper">

                    {/* TOP SECTION: GRID LAYOUT - 1 col Mobile, 2 cols Tablet, 4 cols XL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-ink/10">

                        {/* 1. BRAND IDENTITY */}
                        <div className="p-8 md:p-10 lg:p-12 xl:p-12 flex flex-col justify-start items-center md:items-center xl:items-start text-center md:text-center xl:text-left gap-6 min-h-[200px] border-b md:border-b-0 border-ink/10 xl:border-b-0">
                            <div className="h-8 flex items-center mb-2">
                                <img
                                    src="/logo/SIMPLIFIED LOGO FINAL.svg"
                                    alt="ORSAYN"
                                    className="h-8 w-auto opacity-90"
                                />
                            </div>
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.2em] text-ink/40 leading-relaxed">
                                    {t('tagline1')}<br />{t('tagline2')}
                                </p>
                            </div>
                        </div>

                        {/* 2. PARIS (Time Zone) */}
                        <div className="p-8 md:p-10 lg:p-12 xl:p-12 flex flex-col justify-start items-center md:items-center xl:items-start text-center md:text-center xl:text-left gap-6 min-h-[200px] border-b md:border-b-0 border-ink/10 xl:border-b-0">
                            <div className="h-8 flex items-center">
                                <span className="text-[9px] uppercase tracking-widest text-ink/30 block">{t('timezone')}</span>
                            </div>
                            <div className="font-serif text-xl text-ink leading-relaxed">
                                <p>Europe - Paris, CET</p>
                            </div>
                        </div>

                        {/* 3. CONTACT (Digital Anchor) */}
                        <div className="p-8 md:p-10 lg:p-12 xl:p-12 flex flex-col justify-start items-center md:items-center xl:items-start text-center md:text-center xl:text-left gap-6 min-h-[200px] border-b md:border-b-0 border-ink/10 xl:border-b-0">
                            <div className="h-8 flex items-center">
                                <span className="text-[9px] uppercase tracking-widest text-ink/30 block">{t('liaison')}</span>
                            </div>
                            <div className="flex flex-col items-center xl:items-start gap-3">
                                <a
                                    href="http://www.linkedin.com/in/samuel-mbeboura-b28796293"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Suivre Samuel Mbeboura sur LinkedIn"
                                    className="group flex items-center gap-2 text-[10px] uppercase tracking-widest text-ink/60 hover:text-ink transition-colors duration-500 ease-luxury"
                                >
                                    LinkedIn
                                    <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-500 ease-luxury" />
                                </a>
                                <a
                                    href="https://www.instagram.com/orsaynpartners"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Suivre Orsayn sur Instagram"
                                    className="group flex items-center gap-2 text-[10px] uppercase tracking-widest text-ink/60 hover:text-ink transition-colors duration-500 ease-luxury"
                                >
                                    Instagram
                                    <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-500 ease-luxury" />
                                </a>
                            </div>
                        </div>

                        {/* 4. LEGALS (Compliance) */}
                        <div className="p-8 md:p-10 lg:p-12 xl:p-12 flex flex-col justify-start items-center md:items-center xl:items-start text-center md:text-center xl:text-left gap-6 min-h-[200px]">
                            <div className="h-8 flex items-center">
                                <span className="text-[9px] uppercase tracking-widest text-ink/30 block">{t('legal')}</span>
                            </div>
                            <div className="flex flex-col gap-3 items-center xl:items-start">
                                <Link href={`/${locale}/mentions-legales`} className="text-[10px] uppercase tracking-widest text-ink/60 hover:text-ink transition-all duration-500 ease-luxury pb-1 border-b border-transparent hover:border-ink/20 w-fit">
                                    {t('mentionsLegales')}
                                </Link>
                                <Link href={`/${locale}/cgv`} className="text-[10px] uppercase tracking-widest text-ink/60 hover:text-ink transition-all duration-500 ease-luxury pb-1 border-b border-transparent hover:border-ink/20 w-fit">
                                    {t('cgv')}
                                </Link>
                                <Link href={`/${locale}/confidentialite`} className="text-[10px] uppercase tracking-widest text-ink/60 hover:text-ink transition-all duration-500 ease-luxury pb-1 border-b border-transparent hover:border-ink/20 w-fit">
                                    {t('confidentialite')}
                                </Link>
                                <Link href={`/${locale}/plan-du-site`} className="text-[10px] uppercase tracking-widest text-ink/60 hover:text-ink transition-all duration-500 ease-luxury pb-1 border-b border-transparent hover:border-ink/20 w-fit">
                                    {t('planDuSite')}
                                </Link>
                            </div>
                        </div>

                    </div>

                    {/* BOTTOM BAR: COPYRIGHT */}
                    <div className="border-t border-ink/10 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] uppercase tracking-widest text-ink/30 text-center md:text-left">
                        <span>© {currentYear} Orsayn.</span>
                        <span>{t('allRightsReserved')}</span>
                    </div>

                </div>
            </motion.div>
        </footer>
    );
};

export default Footer;