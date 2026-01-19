import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const StructureImage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 1. SCROLL TRACKER (For Parallax)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // 2. PARALLAX TRANSFORMATION
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section className="pb-24 md:pb-48 pt-20 md:pt-32 relative">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Updated Image Block - Matching Hero Animation & Structure */}
        <div ref={containerRef} className="w-full max-w-7xl mx-auto relative z-10 px-0">
          <div className="w-full relative">
             {/* Architectural Frame */}
             <div className="relative w-full overflow-hidden border border-ink/10 p-1 bg-paper shadow-2xl shadow-ink/5">
               
               {/* Inner Image Container */}
               {/* Height adjustment: h-[220px] on mobile for true landscape, h-[450px] on tablet */}
               <div className="relative w-full overflow-hidden bg-ink/5 group h-[220px] md:h-[450px] lg:h-[600px]">
                 
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

                 {/* THE ARCHITECTURAL MASK (Le Volet) */}
                 <motion.div
                    initial={{ height: "100%" }}
                    whileInView={{ height: "0%" }}
                    viewport={{ once: true, amount: 0.25 }} // Optimized for faster scroll (was 0.5)
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