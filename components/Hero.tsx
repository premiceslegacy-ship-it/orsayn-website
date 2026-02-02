'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useSpring, Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import ShimmerButton from './ShimmerButton';

export default function Hero() {
  const t = useTranslations('hero');
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. SCROLL TRACKER (Framer Motion - Internal Parallax)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  // 2. SCROLL TRACKER FOR REVEAL
  const { scrollYProgress: revealProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "center center"]
  });

  const smoothReveal = useSpring(revealProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001
  });

  const insetProgress = useTransform(smoothReveal, [0, 1], [50, 0]);
  const clipPathStyle = useTransform(insetProgress, (val) => `inset(0% ${val}% 0% ${val}%)`);


  // Updated List: Legal Practice Areas
  const baseList = [
    { name: t('expertise.ma') },
    { name: t('expertise.pe') },
    { name: t('expertise.restructuring') },
    { name: t('expertise.fiscalite') },
    { name: t('expertise.ip') },
    { name: t('expertise.penal') }
  ];

  const marqueeList = [...baseList, ...baseList, ...baseList, ...baseList];

  // ENTRANCE ANIMATIONS
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    // MOBILE OPTIMIZATION: Instant appear
    visibleMobile: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0 }
    }
  };

  return (
    <section id="hero" className="relative pt-28 md:pt-40 lg:pt-48 pb-16 md:pb-32 lg:pb-40 overflow-hidden w-full bg-paper">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24 w-full flex flex-col items-center">

        {/* 1. Centered Text Content */}
        <div className="text-center max-w-full md:max-w-3xl lg:max-w-5xl mx-auto z-20 mb-12 md:mb-24 lg:mb-32 px-2 md:px-0 w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center w-full"
          >
            <motion.div variants={itemVariants} className="flex items-center gap-3 md:gap-4 mb-6 md:mb-10 lg:mb-12 opacity-60">
              <div className="w-6 md:w-8 lg:w-12 h-px bg-ink"></div>
              <span className="text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.25em] lg:tracking-[0.3em] uppercase whitespace-nowrap">
                {t('tagline')}
              </span>
              <div className="w-6 md:w-8 lg:w-12 h-px bg-ink"></div>
            </motion.div>

            {/* Typography refined for mobile/tablet symmetry */}
            {/* Typography refined for mobile/tablet symmetry - LCP OPTIMIZED: No start hidden */}
            <motion.h1
              variants={itemVariants}
              initial="visible"
              animate="visible"
              // LCP FIX: Force immediate render (no opacity transition) for the largest paint
              transition={{ duration: 0 }}
              className="font-serif font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] md:leading-[1.1] text-ink mb-6 md:mb-10 lg:mb-12 tracking-tight"
            >
              {t('titleLine1')} <br />
              {t('titleLine2')} <span className="italic font-bold">{t('titleHighlight')}</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              initial="visible"
              animate="visible"
              transition={{ duration: 0 }}
              className="text-sm sm:text-base md:text-lg text-ink/80 leading-relaxed font-light max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto mb-10 md:mb-14 lg:mb-16"
            >
              {t('description')}
            </motion.p>

            <motion.div variants={itemVariants}>
              <ShimmerButton
                href="#contact"
                background="#1A1A1A"
                shimmerColor="#D4B35D"
                borderRadius="0px"
                className="shadow-2xl shadow-ink/20 w-fit mx-auto"
              >
                {t('cta')}
              </ShimmerButton>
            </motion.div>

          </motion.div>
        </div>

        {/* 2. Expertise Marquee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1, ease: "easeOut" }}
          className="w-full flex flex-col items-center"
        >
          <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.25em] text-ink/40 mb-6 md:mb-8">
            {t('expertiseLabel')}
          </span>

          {/* Added mx-auto to center the marquee container itself */}
          <div className="w-full max-w-6xl mx-auto border-t border-b border-ink/10 py-6 md:py-8 lg:py-10 mb-16 md:mb-24 lg:mb-32 relative z-20 overflow-hidden flex items-center bg-paper">
            <div className="absolute left-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-r from-paper to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-l from-paper to-transparent z-10 pointer-events-none"></div>

            <motion.div
              className="flex items-center gap-12 md:gap-24 whitespace-nowrap pl-0"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 60 }}
            >
              {marqueeList.map((item, index) => (
                <span
                  key={index}
                  className="font-serif text-lg md:text-xl lg:text-2xl tracking-tight text-ink/80"
                >
                  {item.name}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* 3. Image - Architectural Mask Reveal (COLUMN EFFECT) + Parallax */}
        <div ref={containerRef} className="w-full max-w-7xl relative z-10 px-0">
          <div className="w-full relative">
            {/* Architectural Frame - ART GALLERY STYLE */}
            <div
              className="relative w-full overflow-hidden border border-ink/20 p-4 md:p-6 lg:p-8 bg-paper shadow-[0_20px_60px_rgba(26,26,26,0.1)] md:shadow-[0_30px_100px_rgba(26,26,26,0.15)]"
            >

              {/* Inner Image Container */}
              {/* Height scaling: h-[240px] (sm) -> h-[400px] (md) -> h-[500px] (lg) -> h-[700px] (xl) */}
              <div className="relative w-full overflow-hidden bg-ink/5 group h-[240px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[700px] border border-ink/10">

                {/* MASKING CONTAINER - The "Column" that opens via SCROLL */}
                <motion.div
                  className="w-full h-full relative"
                  style={{ clipPath: clipPathStyle }}
                >
                  {/* Image with Parallax */}
                  <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
                    <Image
                      src="/images/hero-section-image.webp"
                      alt={t('imageAlt')}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1400px"
                      className="object-cover mix-blend-multiply opacity-90"
                      priority
                      fetchPriority="high"
                      quality={90}
                    />
                  </motion.div>

                  {/* Gradient overlay */}
                  <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none opacity-60"></div>
                </motion.div>

                {/* Subtle Light Sweep */}
                <motion.div
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={{ x: "200%", opacity: [0, 1, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    delay: 2,
                    ease: "easeInOut",
                    repeatDelay: 15
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none mix-blend-overlay z-10"
                />

                {/* DA Caption - CENTERED */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute bottom-4 left-0 w-full flex justify-center z-20 md:bottom-8 pointer-events-none"
                >
                  <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-paper/90 block font-medium flex items-center gap-2 md:gap-3 shadow-sm">
                    <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-paper"></span>
                    {t('imageCaption')}
                  </span>
                </motion.div>
              </div>

            </div>

            {/* Decorative Grid Lines extension - Hidden on mobile, visible on tablet */}
            <div className="absolute -left-px top-0 bottom-0 w-px bg-ink/10 h-full hidden md:block"></div>
            <div className="absolute -right-px top-0 bottom-0 w-px bg-ink/10 h-full hidden md:block"></div>
          </div>
        </div>

      </div>
    </section>
  );
}