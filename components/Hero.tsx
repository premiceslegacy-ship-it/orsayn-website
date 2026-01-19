import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import ShimmerButton from './ShimmerButton';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 1. SCROLL TRACKER (Framer Motion - Internal Parallax)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // 2. PARALLAX TRANSFORMATION (Framer Motion)
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  // Updated List: Legal Practice Areas
  const baseList = [
    { name: "M&A" },
    { name: "PRIVATE EQUITY" },
    { name: "RESTRUCTURING" },
    { name: "FISCALITÉ" },
    { name: "PROPRIÉTÉ INTELLECTUELLE" },
    { name: "DROIT PÉNAL DES AFFAIRES" }
  ];

  const marqueeList = [...baseList, ...baseList, ...baseList, ...baseList];

  return (
    <section className="relative pt-32 md:pt-40 pb-24 md:pb-48 overflow-hidden bg-paper w-full">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 w-full flex flex-col items-center">
        
        {/* 1. Centered Text Content */}
        {/* Updated padding: px-4 on mobile, md:px-8 on tablet/desktop to enforce gutter from grid lines */}
        <div className="text-center max-w-full md:max-w-5xl mx-auto z-20 mb-20 md:mb-40 px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10 opacity-60">
               <div className="w-6 md:w-8 h-px bg-ink"></div>
               <span className="text-[9px] md:text-[10px] tracking-[0.25em] md:tracking-[0.3em] uppercase whitespace-nowrap">
                  L'INFRASTRUCTURE STRATÉGIQUE
               </span>
               <div className="w-6 md:w-8 h-px bg-ink"></div>
            </div>
            
            <h1 className="font-serif text-[2.5rem] md:text-7xl lg:text-8xl leading-[1.05] md:leading-[0.95] text-ink mb-8 md:mb-10 tracking-tight">
              Faites de votre nom <br />
              une <span className="italic font-bold">Institution.</span>
            </h1>

            <p className="text-base md:text-xl text-ink/80 leading-relaxed font-light max-w-sm md:max-w-2xl mx-auto mb-12 md:mb-14">
              {/* Mobile Text */}
              <span className="md:hidden">
                Nous supprimons la <span className="font-medium">Dissonance de Prestige™</span>. L'écart entre votre excellence technique et votre invisibilité.
              </span>
              {/* Desktop Text */}
              <span className="hidden md:inline">
                Nous supprimons la <span className="font-medium">Dissonance de Prestige™</span>. <br className="hidden md:block"/>
                L'écart critique entre votre excellence technique et votre invisibilité digitale.
              </span>
            </p>

            <ShimmerButton 
              href="#contact" 
              background="#1A1A1A" 
              shimmerColor="#D4B35D"
              borderRadius="0px"
              className="shadow-2xl shadow-ink/20 w-auto max-w-xs mx-auto"
            >
              REVENDIQUER VOTRE PLACE
            </ShimmerButton>
            
          </motion.div>
        </div>

        {/* 2. Expertise Marquee */}
        <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] md:tracking-[0.3em] text-ink/40 mb-6"
        >
            EXPERTISE SECTORIELLE
        </motion.span>

        {/* Added mx-auto to center the marquee container itself */}
        <div className="w-full max-w-6xl mx-auto border-t border-b border-ink/10 py-8 md:py-12 mb-20 md:mb-24 relative z-20 bg-paper overflow-hidden flex items-center">
           <div className="absolute left-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-r from-paper to-transparent z-10 pointer-events-none"></div>
           <div className="absolute right-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-l from-paper to-transparent z-10 pointer-events-none"></div>

           <motion.div 
             className="flex items-center gap-12 md:gap-24 whitespace-nowrap pl-0"
             animate={{ x: ["0%", "-50%"] }} 
             transition={{ repeat: Infinity, ease: "linear", duration: 60 }} 
           >
              {marqueeList.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 opacity-100"
                >
                  <span className="font-serif text-lg md:text-2xl tracking-tight text-ink/80">
                    {item.name}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-ink/20 ml-12 md:ml-24"></span>
                </div>
              ))}
           </motion.div>
        </div>

        {/* 3. Image - Architectural Mask Reveal + Parallax */}
        <div ref={containerRef} className="w-full max-w-7xl relative z-10 px-0 md:px-0">
          <div className="w-full relative">
             {/* Architectural Frame */}
             <div 
                className="relative w-full overflow-hidden border border-ink/10 p-1 bg-paper shadow-2xl shadow-ink/5"
             >
               
               {/* Inner Image Container */}
               {/* Mobile: Forced Landscape Height h-[240px] | Tablet: h-[500px] | Desktop: h-[700px] */}
               <div className="relative w-full overflow-hidden bg-ink/5 group h-[240px] md:h-[500px] lg:h-[700px]">
                 
                 {/* Image scaling wrapper with Parallax */}
                 <div className="w-full h-full relative overflow-hidden">
                   <motion.img 
                     style={{ y }} 
                     src="https://drive.google.com/thumbnail?id=17k2O4UCwQRGeWkrSxN32yJFV1OcHuqw7&sz=w2560"
                     alt="Salon privé de direction" 
                     className="absolute inset-0 w-full h-[120%] -top-[10%] object-cover mix-blend-multiply opacity-90 origin-center will-change-transform" 
                   />
                   
                   {/* Gradient overlay */}
                   <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none opacity-60"></div>
                 </div>

                 {/* THE ARCHITECTURAL MASK (Le Volet) */}
                 <motion.div
                    initial={{ height: "100%" }}
                    whileInView={{ height: "0%" }}
                    viewport={{ once: true, amount: 0.25 }} // Reduced from 0.5 to 0.25 to start sooner
                    transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }} 
                    className="absolute inset-0 bg-paper z-30 bottom-0"
                 />

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
                    transition={{ delay: 0.4, duration: 0.8 }} // Reduced delay
                    className="absolute bottom-4 left-0 w-full flex justify-center z-20 md:bottom-8 pointer-events-none"
                 >
                    <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-paper/90 block font-medium flex items-center gap-2 md:gap-3 shadow-sm">
                      <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-paper"></span>
                      Fig. 01 — Le Salon Privé
                    </span>
                 </motion.div>
               </div>

             </div>
             
             {/* Decorative Grid Lines extension - Hidden on mobile to avoid clutter */}
             <div className="absolute -left-px top-0 bottom-0 w-px bg-ink/10 h-full hidden md:block"></div>
             <div className="absolute -right-px top-0 bottom-0 w-px bg-ink/10 h-full hidden md:block"></div>
          </div>
        </div>

      </div>
    </section>
  );
}