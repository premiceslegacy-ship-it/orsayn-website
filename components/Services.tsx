'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { ServiceProps } from '../types';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

const ServiceColumn: React.FC<ServiceProps & { index: number; investmentLabel: string; htLabel: string }> = ({ title, subtitle, price, timeline, description, features, index, isPrimary, ctaText, investmentLabel, htLabel }) => {

  const entryDelay = index * 0.12;

  const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII"];

  const LUXURY_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.9, ease: LUXURY_EASE, delay: entryDelay }
    },
    hover: { y: -8, transition: { duration: 0.8, ease: LUXURY_EASE } }
  };

  const borderDrawVariants: Variants = {
    hidden: { scaleX: 0, scaleY: 0, opacity: 0 },
    hover: { scaleX: 1, scaleY: 1, opacity: 1, transition: { duration: 0.8, ease: LUXURY_EASE } }
  };

  const contentContainerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
  };

  const titleReveal: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1.2, ease: LUXURY_EASE } }
  };

  const lineDraw: Variants = {
    hidden: { scaleX: 0, originX: 0 },
    visible: { scaleX: 1, transition: { duration: 0.8, ease: "easeInOut" } }
  };

  const simpleFade: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const ctaSlide: Variants = {
    hover: { x: 6, transition: { duration: 0.8, ease: LUXURY_EASE } }
  };

  const handleCtaClick = () => {
    // 1. Dispatch Event for Contact Form (Fast sync task)
    window.dispatchEvent(new CustomEvent('ambition-update', { detail: { ambition: index + 1 } }));

    // 2. No manual scroll - CSS 'scroll-behavior: smooth' handles the href="#contact"
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, amount: 0.15 }}
      className={`relative flex flex-col h-full group transition-shadow duration-500 w-full
        ${isPrimary
          ? 'z-20 bg-ink border border-brass/40 shadow-xl'
          : 'z-10 bg-paper/[0.01] border border-paper/10 hover:shadow-2xl hover:shadow-ink/5'
        }
      `}
    >


      <motion.div variants={borderDrawVariants} className={`absolute top-0 left-0 w-full h-[1px] origin-left ${isPrimary ? 'bg-brass' : 'bg-paper/40'}`} />
      <motion.div variants={borderDrawVariants} className={`absolute top-0 right-0 w-[1px] h-full origin-top ${isPrimary ? 'bg-brass' : 'bg-paper/40'}`} />
      <motion.div variants={borderDrawVariants} className={`absolute bottom-0 right-0 w-full h-[1px] origin-right ${isPrimary ? 'bg-brass' : 'bg-paper/40'}`} />
      <motion.div variants={borderDrawVariants} className={`absolute top-0 left-0 w-[1px] h-full origin-bottom ${isPrimary ? 'bg-brass' : 'bg-paper/40'}`} />

      <motion.div
        variants={contentContainerVariants}
        className={`flex-grow p-6 md:p-10 lg:p-12 xl:p-12 flex flex-col relative z-10 ${isPrimary ? 'py-10 xl:py-16' : ''}`}
      >

        {/* Header Section */}
        <div className="mb-6 xl:mb-8">
          <div className="flex justify-between items-start mb-4 xl:mb-6 overflow-hidden">
            <motion.span
              variants={simpleFade}
              className={`text-[9px] uppercase font-medium border-b pb-2 ${isPrimary ? 'text-brass border-brass/30' : 'text-paper/40 border-paper/10'}`}
            >
              {subtitle}
            </motion.span>
            <motion.div variants={simpleFade} className="relative overflow-hidden">
              <span className={`text-[9px] uppercase tracking-widest font-medium relative z-10 ${isPrimary ? 'text-brass' : 'text-paper/40'}`}>
                {timeline || "Unique"}
              </span>
            </motion.div>
          </div>

          <div className="overflow-hidden mb-4 xl:mb-6">
            <motion.h3
              variants={titleReveal}
              className={`font-serif text-2xl md:text-3xl lg:text-4xl transition-colors duration-500
                    ${isPrimary
                  ? 'text-paper group-hover:text-brass'
                  : 'text-paper/70 group-hover:text-paper'
                }
                  `}
            >
              {title}
            </motion.h3>
          </div>

          <motion.div
            variants={lineDraw}
            className={`w-full h-px mb-6 xl:mb-8 ${isPrimary ? 'bg-brass/20' : 'bg-paper/10'}`}
          ></motion.div>

          <motion.p
            variants={simpleFade}
            className={`font-light text-sm leading-relaxed min-h-[50px] md:min-h-[60px] whitespace-pre-line ${isPrimary ? 'text-paper/70' : 'text-paper/60'}`}
          >
            {description}
          </motion.p>
        </div>

        {/* Features List */}
        <ul className="space-y-3 xl:space-y-4 mb-8 xl:mb-10 flex-grow">
          {features.map((feature, idx) => (
            <motion.li
              key={idx}
              variants={simpleFade}
              className="flex items-baseline text-sm group-hover:translate-x-1 transition-transform duration-300"
            >
              <span className={`mr-4 font-serif text-[10px] w-4 text-right flex-shrink-0 transition-colors duration-300 ${isPrimary ? 'text-brass' : 'text-paper/30 group-hover:text-paper/60'}`}>
                {romanNumerals[idx]}.
              </span>
              <span className={`${isPrimary ? 'text-paper/80' : 'text-paper/70'} font-light`}>{feature}</span>
            </motion.li>
          ))}
        </ul>

        {/* Footer Section */}
        <motion.div variants={simpleFade} className="mt-auto">
          <div className="flex justify-between items-end mb-6 pt-6 border-t border-paper/[0.05]">
            <span className="text-[9px] uppercase tracking-widest text-paper/30 pb-1">{investmentLabel}</span>
            <div className="flex items-baseline gap-2">
              <span className={`font-serif text-2xl md:text-3xl ${isPrimary ? 'text-brass' : 'text-paper/80'}`}>
                {price}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-paper/30">{htLabel}</span>
            </div>
          </div>

          {isPrimary ? (
            <a
              href={`?ambition=${index + 1}#contact`}
              onClick={handleCtaClick}
              className="relative w-full py-4 xl:py-5 text-[10px] uppercase tracking-[0.25em] bg-brass text-ink border border-brass group transition-all duration-500 hover:bg-ink hover:text-brass flex items-center justify-center no-underline cursor-pointer"
            >
              <span className="relative z-20 font-medium">{ctaText}</span>
            </a>
          ) : (
            <motion.a
              href={`?ambition=${index + 1}#contact`}
              onClick={handleCtaClick}
              className="w-full py-4 xl:py-5 text-[10px] uppercase tracking-[0.25em] transition-all duration-500 border relative overflow-hidden flex items-center justify-center bg-transparent text-paper border-paper/20 hover:bg-brass hover:text-ink hover:border-brass no-underline cursor-pointer"
            >
              <motion.span variants={ctaSlide} className="relative z-10 flex items-center gap-2">
                {ctaText}
              </motion.span>
            </motion.a>
          )}
        </motion.div>

      </motion.div>
    </motion.div>
  );
};

const Services: React.FC = () => {
  const t = useTranslations('services');
  const services: ServiceProps[] = [
    {
      title: t('offer1.title'),
      subtitle: t('offer1.subtitle'),
      price: t('offer1.price'),
      timeline: t('offer1.timeline'),
      description: t('offer1.description'),
      ctaText: t('offer1.cta'),
      features: [
        t('offer1.features.f1'),
        t('offer1.features.f2'),
        t('offer1.features.f3'),
        t('offer1.features.f4'),
        t('offer1.features.f5')
      ]
    },
    {
      title: t('offer2.title'),
      subtitle: t('offer2.subtitle'),
      price: t('offer2.price'),
      timeline: t('offer2.timeline'),
      description: t('offer2.description'),
      ctaText: t('offer2.cta'),
      features: [
        t('offer2.features.f1'),
        t('offer2.features.f2'),
        t('offer2.features.f3'),
        t('offer2.features.f4'),
        t('offer2.features.f5')
      ],
      isPrimary: true
    },
    {
      title: t('offer3.title'),
      subtitle: t('offer3.subtitle'),
      price: t('offer3.price'),
      timeline: t('offer3.timeline'),
      description: t('offer3.description'),
      ctaText: t('offer3.cta'),
      features: [
        t('offer3.features.f1'),
        t('offer3.features.f2'),
        t('offer3.features.f3'),
        t('offer3.features.f4'),
        t('offer3.features.f5')
      ]
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      if (clientWidth === 0) return;
      const index = Math.round(scrollLeft / clientWidth);
      setActiveIndex(index);
    }
  };

  const slideTo = (index: number) => {
    if (scrollRef.current) {
      const targetIndex = Math.max(0, Math.min(index, services.length - 1));
      scrollRef.current.scrollTo({
        left: targetIndex * scrollRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
  };

  const nextSlide = () => slideTo(activeIndex + 1);
  const prevSlide = () => slideTo(activeIndex - 1);

  return (
    <section id="offres" className="py-20 md:py-32 lg:py-48 relative bg-ink border-b border-paper/10 overflow-hidden">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-paper/[0.02] blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24 relative z-10">

        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 md:mb-20 lg:mb-24 xl:mb-32 flex flex-col items-center">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-paper/40 mb-6 px-4 py-2 border border-paper/10 rounded-full bg-paper/[0.02]"
            >
              {t('sectionLabel')}
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-3xl md:text-5xl lg:text-7xl text-paper leading-[0.9]"
            >
              {t('sectionTitleLine1')}<br /><span className="italic text-paper/50">{t('sectionTitleLine2')}</span>
            </motion.h2>
          </div>

          {/* SLIDER CONTAINER */}
          <div className="relative">

            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="
                        flex xl:grid xl:grid-cols-3 
                        xl:gap-8 items-start 
                        overflow-x-auto xl:overflow-visible 
                        snap-x snap-mandatory xl:snap-none 
                        scrollbar-none
                        scroll-smooth
                        w-full
                        py-8 xl:py-0
                    "
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {services.map((service, index) => (
                <div
                  key={index}
                  className="w-full min-w-full xl:min-w-0 xl:w-auto flex-shrink-0 snap-center xl:snap-align-none px-1 xl:px-0"
                >
                  <ServiceColumn
                    {...service}
                    index={index}
                    investmentLabel={t('investment')}
                    htLabel={t('ht')}
                  />
                </div>
              ))}
            </div>

            {/* CONTROLS (Mobile/Tablet Only) */}
            <div className="xl:hidden flex items-center justify-between border-t border-paper/10 pt-6 mt-4">
              <button
                onClick={prevSlide}
                disabled={activeIndex === 0}
                aria-label={t('controls.prev')}
                className={`group flex items-center gap-2 text-[10px] uppercase tracking-widest py-3 px-6 border border-paper/10 transition-all duration-300
                            ${activeIndex === 0
                    ? 'opacity-30 cursor-not-allowed text-paper'
                    : 'text-paper hover:bg-paper hover:text-ink cursor-pointer'}
                        `}
              >
                <ArrowLeft className="w-3 h-3" />
                <span>{t('controls.prev')}</span>
              </button>

              <div className="flex items-center gap-2 tabular-nums">
                <span className="text-xl font-serif text-paper min-w-[1.5em] text-center">{`0${activeIndex + 1}`}</span>
                <span className="text-[10px] text-paper/30">/</span>
                <span className="text-[10px] text-paper/30">{`0${services.length}`}</span>
              </div>

              <button
                onClick={nextSlide}
                disabled={activeIndex === services.length - 1}
                aria-label={t('controls.next')}
                className={`group flex items-center gap-2 text-[10px] uppercase tracking-widest py-3 px-6 border border-paper/10 transition-all duration-300
                            ${activeIndex === services.length - 1
                    ? 'opacity-30 cursor-not-allowed text-paper'
                    : 'text-paper hover:bg-paper hover:text-ink cursor-pointer'}
                        `}
              >
                <span>{t('controls.next')}</span>
                <ArrowRight className="w-3 h-3" />
              </button>

            </div>

          </div>

          <div className="mt-16 xl:mt-24 text-center">
            <p className="text-[8px] md:text-[9px] text-paper/30 font-mono tracking-wide uppercase">
              {t('disclaimer')}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Services;