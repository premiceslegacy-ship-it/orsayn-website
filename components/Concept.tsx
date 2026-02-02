'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const Concept: React.FC = () => {
    const t = useTranslations('concept');
    return (
        <section id="preambule" className="py-16 md:py-28 lg:py-32 relative bg-paper overflow-hidden">
            <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24">

                {/* MAIN STRUCTURE: The "Diagnosis Report" Look */}
                <div className="border-t border-l border-r border-ink/10 bg-paper relative">

                    {/* 1. LABEL ROW - Header of the Report */}
                    <div className="flex items-center justify-between p-6 md:p-8 border-b border-ink/10">
                        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-ink/40 font-medium flex items-center gap-3">
                            {t('label')}
                        </span>
                        <span className="text-[9px] uppercase tracking-[0.2em] text-ink/20 font-mono hidden md:block">
                            {t('ref')}
                        </span>
                    </div>

                    {/* 2. THE CONFRONTATION (Split Grid 70/30) */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 min-h-[auto] md:min-h-[500px]">

                        {/* LEFT: THE TITLE (The Symptom) - 7 cols */}
                        <div className="xl:col-span-7 border-b xl:border-b-0 xl:border-r border-ink/10 p-6 md:p-12 lg:p-16 flex flex-col justify-center relative group overflow-hidden py-16 md:py-16">
                            {/* Background Hover Effect - Subtle noise/grain or slight darken */}
                            <div className="absolute inset-0 bg-ink/[0.02] scale-y-0 group-hover:scale-y-100 transition-transform duration-1000 origin-bottom ease-[0.22,1,0.36,1]"></div>

                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                className="relative z-10 text-center xl:text-left"
                            >
                                <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl text-ink leading-[0.9] md:leading-[0.85] tracking-tight">
                                    <span className="block xl:-ml-1">{t('titleLine1')}</span>
                                    <span className="block italic text-ink/80 mt-2 md:mt-4 xl:ml-16 whitespace-nowrap">{t('titleLine2')}</span>
                                </h2>
                            </motion.div>
                        </div>

                        {/* RIGHT: THE PAIN (The Analysis) - 5 cols */}
                        <div className="xl:col-span-5 border-b xl:border-b-0 border-ink/10 p-6 md:p-12 lg:p-16 flex flex-col justify-end bg-paper relative text-center md:text-center xl:text-left py-12 md:py-12">
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                className="space-y-6 md:space-y-10"
                            >
                                {/* The Pain Paragraphs */}
                                <div className="font-sans text-base md:text-xl text-ink/70 font-light leading-relaxed">
                                    <p className="mb-4 md:mb-8">
                                        {t('pain1')}
                                    </p>
                                    <p className="mb-4 md:mb-8">
                                        {t('pain2Line1')}<br />
                                        {t('pain2Line2')}
                                    </p>
                                </div>

                                {/* The Conclusion / Promise */}
                                <div className="pt-2 md:pt-4">
                                    <p className="font-serif text-xl md:text-3xl text-ink leading-tight">
                                        {t('promiseLine1')} <br /> <span className="italic border-b border-ink/20 pb-1">{t('promiseLine2')}</span>
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* 3. THE CURE (The Pillars) - Interactive Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 border-b border-ink/10">

                        {/* Pillar 1: DENSITÉ */}
                        <div className="group relative border-b md:border-b-0 md:border-r border-ink/10 p-6 md:p-12 lg:p-16 transition-colors duration-700 ease-[0.22,1,0.36,1] hover:bg-ink">
                            <div className="relative z-10 flex flex-col h-full justify-between min-h-[260px] md:min-h-[300px]">
                                <div className="flex justify-between items-start mb-8 md:mb-12">
                                    <div></div>
                                    <span className="font-serif text-3xl md:text-4xl text-ink/10 group-hover:text-brass/40 transition-colors duration-500 ease-luxury">{t('pillar1.number')}</span>
                                </div>

                                <div>
                                    <h3 className="font-serif text-2xl md:text-4xl lg:text-5xl mb-4 md:mb-6 text-ink group-hover:text-paper transition-colors duration-500 ease-luxury">{t('pillar1.title')}</h3>
                                    <div className="w-8 h-px bg-ink/20 mb-4 md:mb-6 group-hover:bg-brass transition-colors duration-500 ease-luxury"></div>
                                    <p className="text-sm md:text-base font-light text-ink/60 leading-relaxed max-w-sm group-hover:text-paper/80 transition-colors duration-500 ease-luxury">
                                        {t('pillar1.line1')}<br />
                                        {t('pillar1.line2')}<br />
                                        {t('pillar1.line3')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Pillar 2: ÉPURE */}
                        <div className="group relative p-6 md:p-12 lg:p-16 transition-colors duration-700 ease-[0.22,1,0.36,1] hover:bg-ink">
                            <div className="relative z-10 flex flex-col h-full justify-between min-h-[260px] md:min-h-[300px]">
                                <div className="flex justify-between items-start mb-8 md:mb-12">
                                    <div></div>
                                    <span className="font-serif text-3xl md:text-4xl text-ink/10 group-hover:text-brass/40 transition-colors duration-500 ease-luxury">{t('pillar2.number')}</span>
                                </div>

                                <div>
                                    <h3 className="font-serif text-2xl md:text-4xl lg:text-5xl mb-4 md:mb-6 text-ink group-hover:text-paper transition-colors duration-500 ease-luxury">{t('pillar2.title')}</h3>
                                    <div className="w-8 h-px bg-ink/20 mb-4 md:mb-6 group-hover:bg-brass transition-colors duration-500 ease-luxury"></div>
                                    <p className="text-sm md:text-base font-light text-ink/60 leading-relaxed max-w-sm group-hover:text-paper/80 transition-colors duration-500 ease-luxury">
                                        {t('pillar2.line1')}<br />
                                        {t('pillar2.line2')}<br />
                                        {t('pillar2.line3')}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </section>
    );
};

export default Concept;