import React from 'react';
import { motion } from 'framer-motion';

const Concept: React.FC = () => {
  return (
    <section id="esprit" className="py-0 relative bg-paper border-b border-ink/10">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
        
        {/* 1. HEADER SECTION - Full Width with Borders */}
        <div className="border-l border-r border-ink/10">
            <div className="grid grid-cols-1 md:grid-cols-12 border-b border-ink/10">
                
                {/* Meta Label Area */}
                <div className="md:col-span-4 p-8 md:p-12 flex items-start md:items-end border-b md:border-b-0 md:border-r border-ink/10">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3"
                    >
                        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-ink/50 font-medium">
                            NOTRE DOCTRINE
                        </span>
                    </motion.div>
                </div>

                {/* Main Title Area */}
                <div className="md:col-span-8 p-8 md:p-12 md:pl-24">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="font-serif text-5xl md:text-8xl text-ink leading-[0.9]"
                    >
                        L'exigence.
                    </motion.h2>
                </div>
            </div>
        </div>

        {/* 2. THE PILLARS - Two Columns Grid */}
        <div className="border-l border-r border-ink/10">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                
                {/* PILLAR 01: DENSITÉ */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="group relative p-8 md:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-ink/10 min-h-[400px] md:min-h-[500px] flex flex-col justify-between hover:bg-ink/[0.02] transition-colors duration-500"
                >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8 md:mb-12">
                        <h3 className="font-serif text-3xl md:text-5xl text-ink">Densité</h3>
                        <span className="font-serif text-5xl md:text-8xl text-ink/5 italic opacity-50 group-hover:opacity-100 group-hover:text-brass/20 transition-all duration-700">01</span>
                    </div>

                    {/* Content - Centered */}
                    <div className="relative z-10 text-center">
                        <div className="w-8 md:w-12 h-px bg-ink mb-6 md:mb-8 mx-auto group-hover:w-16 md:group-hover:w-24 group-hover:bg-brass transition-all duration-500"></div>
                        <div className="text-ink/80 font-light text-base md:text-xl leading-relaxed space-y-2">
                            <p className="block group-hover:text-ink transition-colors">Nous rejetons le bruit.</p>
                            <p className="block group-hover:text-ink transition-colors">Chaque mot publié doit peser.</p>
                            <p className="block text-ink font-medium">Pas de marketing.</p>
                            <p className="block italic text-ink/60">Du leadership de pensée.</p>
                        </div>
                    </div>

                    {/* Background Interaction */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-ink/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                </motion.div>


                {/* PILLAR 02: ÉPURE */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="group relative p-8 md:p-12 lg:p-16 min-h-[400px] md:min-h-[500px] flex flex-col justify-between hover:bg-ink/[0.02] transition-colors duration-500"
                >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8 md:mb-12">
                        <h3 className="font-serif text-3xl md:text-5xl text-ink">Épure</h3>
                        <span className="font-serif text-5xl md:text-8xl text-ink/5 italic opacity-50 group-hover:opacity-100 group-hover:text-brass/20 transition-all duration-700">02</span>
                    </div>

                    {/* Content - Centered */}
                    <div className="relative z-10 text-center">
                        <div className="w-8 md:w-12 h-px bg-ink mb-6 md:mb-8 mx-auto group-hover:w-16 md:group-hover:w-24 group-hover:bg-brass transition-all duration-500"></div>
                        <div className="text-ink/80 font-light text-base md:text-xl leading-relaxed space-y-2">
                            <p className="block group-hover:text-ink transition-colors">Le luxe, c'est le refus.</p>
                            <p className="block group-hover:text-ink transition-colors">L'espace structure l'autorité.</p>
                            <p className="block text-ink font-medium">Une fluidité absolue.</p>
                            <p className="block italic text-ink/60">Digne d'un rang.</p>
                        </div>
                    </div>

                    {/* Background Interaction */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-ink/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                </motion.div>

            </div>
        </div>

      </div>
    </section>
  );
};

export default Concept;