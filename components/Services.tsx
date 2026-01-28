import React, { useState, useRef, useEffect } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { ServiceProps } from '../types';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const ServiceColumn: React.FC<ServiceProps & { index: number }> = ({ title, subtitle, price, timeline, description, features, index, isPrimary }) => {
  
  const entryDelay = index === 1 ? 0.24 : index === 2 ? 0.12 : 0;
  
  const ctaText = index === 0 ? "Matérialiser votre rang" 
                : index === 1 ? "Imposer votre autorité" 
                : "Occuper les esprits";
  
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
    hover: { y: -6, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const borderDrawVariants: Variants = {
    hidden: { scaleX: 0, scaleY: 0, opacity: 0 },
    hover: { scaleX: 1, scaleY: 1, opacity: 1, transition: { duration: 0.6, ease: LUXURY_EASE } }
  };

  const contentContainerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: entryDelay + 0.3 } }
  };

  const titleReveal: Variants = {
    hidden: { y: "100%", opacity: 0, filter: "blur(5px)" },
    visible: { y: "0%", opacity: 1, filter: "blur(0px)", transition: { duration: 0.8, ease: LUXURY_EASE } }
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
    hover: { x: 6, transition: { duration: 0.3, ease: "easeOut" } }
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
          ? 'xl:-mt-8 xl:-mb-8 z-20 bg-ink border border-brass/30 shadow-[0_30px_90px_rgba(0,0,0,0.5)]' 
          : 'z-10 bg-paper/[0.01] border border-paper/10 hover:shadow-2xl hover:shadow-ink/5' 
        }
      `}
    >
      {isPrimary && (
        <>
            <div className="absolute inset-0 bg-gradient-to-b from-brass/[0.05] via-transparent to-transparent opacity-50 animate-[pulse_15s_ease-in-out_infinite] pointer-events-none"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-brass/[0.05] blur-[80px] rounded-full pointer-events-none"></div>
        </>
      )}

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
                  className={`font-serif text-3xl md:text-4xl lg:text-5xl transition-colors duration-500 
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
                className={`font-light text-sm leading-relaxed min-h-[50px] md:min-h-[60px] ${isPrimary ? 'text-paper/70' : 'text-paper/60'}`}
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
                <span className="text-[9px] uppercase tracking-widest text-paper/30 pb-1">INVESTISSEMENT</span>
                <div className="flex items-baseline gap-2">
                    <span className={`font-serif text-2xl md:text-3xl ${isPrimary ? 'text-brass' : 'text-paper/80'}`}>
                       {price}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-paper/30">HT</span>
                </div>
            </div>

            <motion.button 
              className={`w-full py-4 xl:py-5 text-[10px] uppercase tracking-[0.25em] transition-all duration-500 border relative overflow-hidden flex items-center justify-center
              ${isPrimary 
                ? 'bg-brass text-ink border-brass hover:bg-ink hover:text-brass hover:border-brass' 
                : 'bg-transparent text-paper border-paper/20 hover:bg-brass hover:text-ink hover:border-brass'
              }
            `}
            >
              <motion.span variants={ctaSlide} className="relative z-10 flex items-center gap-2">
                  {ctaText}
              </motion.span>
            </motion.button>
        </motion.div>

      </motion.div>
    </motion.div>
  );
};

const Services: React.FC = () => {
  const services: ServiceProps[] = [
    {
      title: "La Fondation",
      subtitle: "Infrastructure",
      price: "12k€",
      timeline: "6 SEMAINES",
      description: <>La première pierre de votre institution.<br/>Une plateforme propriétaire, taillée sur mesure pour inspirer une confiance immédiate aux partenaires institutionnels.</>,
      features: [
        "Audit de positionnement & benchmark",
        "Direction artistique & identité de marque",
        "Ingénierie de plateforme propriétaire",
        "Rhétorique & sémantique",
        "Souveraineté technique totale"
      ]
    },
    {
      title: "L'Autorité",
      subtitle: "Système Complet",
      price: "15k€",
      timeline: "SIGNATURE",
      description: <>Le levier de puissance.<br/>Nous édifions l'infrastructure et activons simultanément les canaux d'influence pour préempter votre territoire.</>,
      features: [
        "Inclus : Offre Fondation complète",
        "Inclus : Offre Résonance (1 mois)",
        "Déploiement prioritaire (accéléré)",
        "Brief de gouvernance hebdomadaire",
        "Accès fondateur (ligne directe)"
      ],
      isPrimary: true
    },
    {
      title: "La Résonance",
      subtitle: "Editorial",
      price: "3.5k€",
      timeline: "RÉCURRENCE",
      description: <>Le maintien du rang.<br/>Une présence constante et lettrée sur les réseaux pour transformer votre expertise en leadership d'opinion.</>,
      features: [
        "Cadence éditoriale stratégique",
        "Production de doctrines & analyses",
        "Pilotage du canal LinkedIn",
        "Veille tactique",
        "Mesure d'influence & reporting"
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
    <section id="approche" className="py-20 md:py-32 lg:py-48 relative bg-ink border-b border-paper/10 overflow-hidden">
      
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
                  Stratégie de Rayonnement
                </motion.span>
                
                <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="font-serif text-3xl md:text-5xl lg:text-7xl text-paper leading-[0.9]"
                >
                  Diplomatie d'influence<br/><span className="italic text-paper/50">Digitale.</span>
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
                            <ServiceColumn {...service} index={index} />
                        </div>
                    ))}
                </div>

                {/* CONTROLS (Mobile/Tablet Only) */}
                <div className="xl:hidden flex items-center justify-between border-t border-paper/10 pt-6 mt-4">
                    <button 
                        onClick={prevSlide}
                        disabled={activeIndex === 0}
                        className={`group flex items-center gap-2 text-[10px] uppercase tracking-widest py-3 px-6 border border-paper/10 transition-all duration-300
                            ${activeIndex === 0 
                                ? 'opacity-30 cursor-not-allowed text-paper' 
                                : 'text-paper hover:bg-paper hover:text-ink cursor-pointer'}
                        `}
                    >
                        <ArrowLeft className="w-3 h-3" />
                        <span>Précédent</span>
                    </button>

                    <div className="flex items-center gap-2 tabular-nums">
                        <span className="text-xl font-serif text-paper min-w-[1.5em] text-center">{`0${activeIndex + 1}`}</span>
                        <span className="text-[10px] text-paper/30">/</span>
                        <span className="text-[10px] text-paper/30">{`0${services.length}`}</span>
                    </div>

                    <button 
                        onClick={nextSlide}
                        disabled={activeIndex === services.length - 1}
                        className={`group flex items-center gap-2 text-[10px] uppercase tracking-widest py-3 px-6 border border-paper/10 transition-all duration-300
                            ${activeIndex === services.length - 1 
                                ? 'opacity-30 cursor-not-allowed text-paper' 
                                : 'text-paper hover:bg-paper hover:text-ink cursor-pointer'}
                        `}
                    >
                        <span>Suivant</span>
                        <ArrowRight className="w-3 h-3" />
                    </button>

                </div>

            </div>

            <div className="mt-16 xl:mt-24 text-center">
                <p className="text-[8px] md:text-[9px] text-paper/30 font-mono tracking-wide uppercase">
                * Tarification HT indicative. Engagement de confidentialité signé dès le premier contact.
                </p>
            </div>
        </div>

      </div>
    </section>
  );
};

export default Services;