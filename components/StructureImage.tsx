import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const StructureImage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 1. SCROLL TRACKER (For Parallax)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // 2. SCROLL TRACKER FOR REVEAL (The Opening Mechanism)
  const { scrollYProgress: revealProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "center center"]
  });

  const smoothReveal = useSpring(revealProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001
  });

  // Map scroll progress (0 to 1) to Inset Percentage (50% to 0%)
  const insetProgress = useTransform(smoothReveal, [0, 1], [50, 0]);
  const clipPathStyle = useTransform(insetProgress, (val) => `inset(0% ${val}% 0% ${val}%)`);

  // Parallax Y value
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section className="pb-20 md:pb-32 pt-8 md:pt-24 lg:pt-32 relative">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24">
        
        {/* Updated Image Block - Matching Hero Animation & Structure */}
        <div ref={containerRef} className="w-full max-w-7xl mx-auto relative z-10 px-0">
          <div className="w-full relative">
             {/* Architectural Frame - ART GALLERY STYLE */}
             <div className="relative w-full overflow-hidden border border-ink/20 p-4 md:p-6 lg:p-8 bg-paper shadow-[0_30px_100px_rgba(26,26,26,0.15)]">
               
               {/* Inner Image Container */}
               {/* Height adjustment: h-[220px] on mobile for true landscape, h-[450px] on tablet */}
               <div className="relative w-full overflow-hidden bg-ink/5 group h-[220px] md:h-[450px] lg:h-[600px] border border-ink/10">
                 
                 {/* MASKING CONTAINER - The "Column" that opens via SCROLL */}
                 <motion.div 
                    className="w-full h-full relative"
                    style={{ clipPath: clipPathStyle }}
                 >
                     {/* Image scaling wrapper */}
                     <div className="w-full h-full relative overflow-hidden">
                       <motion.img 
                         style={{ y }}
                         src="https://drive.google.com/thumbnail?id=1VjKd9HanEGwTlZtTKlgpgElbcT134AzH&sz=w2560"
                         alt="Structure abstraite" 
                         className="absolute inset-0 w-full h-[120%] -top-[10%] object-cover mix-blend-multiply opacity-90 origin-center will-change-transform" 
                       />
                       
                       {/* Gradient overlay */}
                       <div className="absolute bottom-0 left-0 w-full h-24 md:h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none opacity-60"></div>
                     </div>
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
                      repeatDelay: 10 
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 pointer-events-none mix-blend-overlay z-10"
                 />
                 
                 {/* DA Caption - CENTERED */}
                 <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="absolute bottom-4 left-0 w-full flex justify-center z-20 md:bottom-8 pointer-events-none"
                 >
                    <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-paper/90 block font-medium flex items-center gap-2 md:gap-3 shadow-sm">
                      <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-paper"></span>
                      Fig. 02 — Structure
                    </span>
                 </motion.div>
               </div>

             </div>
             
             {/* Decorative Grid Lines extension */}
             <div className="absolute -left-px top-0 bottom-0 w-px bg-ink/10 h-full hidden md:block"></div>
             <div className="absolute -right-px top-0 bottom-0 w-px bg-ink/10 h-full hidden md:block"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StructureImage;