import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Wording update: Plus institutionnel, moins "marketing"
  const links = [
    { label: 'PRÉAMBULE', href: '#esprit' },
    { label: 'L\'APPROCHE', href: '#approche' },
    { label: 'REVUE', href: '#journal' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
          isScrolled ? 'py-4 bg-paper/95 backdrop-blur-md border-b border-ink/5' : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24 flex justify-between items-center">
          
          {/* 1. LOGO - Left aligned */}
          <a href="#" className="z-50 flex items-center gap-4 pl-0 xl:pl-8 group">
             <span className="font-serif text-3xl md:text-4xl tracking-tight text-ink uppercase scale-y-90 group-hover:text-ink/70 transition-colors">ORSAYN</span>
          </a>

          {/* 2. CENTER NAVIGATION - Desktop Only */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex space-x-12 items-center">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[10px] tracking-[0.25em] text-ink/60 hover:text-ink velours-transition uppercase font-medium relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-2 left-1/2 w-0 h-px bg-ink transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
                </a>
              ))}
            </div>
          </div>

          {/* 3. CTA BUTTON - Right aligned (Desktop) */}
          <div className="hidden lg:block pr-0 xl:pr-8">
            <a 
                href="#contact"
                className="group relative overflow-hidden px-6 py-3 border border-ink/10 hover:border-brass transition-colors duration-700 inline-flex items-center gap-3"
            >
                <span className="text-[9px] uppercase tracking-[0.2em] font-medium text-ink relative z-10 transition-colors duration-500">
                    PRENDRE ATTACHE
                </span>
                
                {/* Arrow - Single elegant slide */}
                <ArrowRight className="relative z-10 w-3 h-3 text-ink transform group-hover:translate-x-1 transition-transform duration-500 ease-out" />
                
                {/* Fill Effect - Brass (Laiton) */}
                <div className="absolute inset-0 bg-brass transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-700 ease-[0.19,1,0.22,1] z-0"></div>
            </a>
          </div>

          {/* Mobile/Tablet Toggle */}
          <button 
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden text-ink z-50 p-2 hover:bg-ink/5 rounded-full transition-colors"
          >
            {isMobileOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-10%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ opacity: 0, y: "-10%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 bg-paper z-40 flex flex-col items-center justify-center"
          >
            {/* Background Texture for Mobile Menu */}
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            <div className="flex flex-col items-center space-y-8 relative z-10">
                {links.map((link, i) => (
                  <motion.a
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (i * 0.1) }}
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileOpen(false)}
                    className="font-serif text-4xl md:text-5xl text-ink hover:text-brass transition-colors duration-500"
                  >
                    {link.label}
                  </motion.a>
                ))}

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="pt-8"
                >
                    <a 
                        href="#contact"
                        onClick={() => setIsMobileOpen(false)}
                        className="px-8 py-4 bg-ink text-paper text-xs uppercase tracking-[0.25em] hover:bg-brass hover:text-ink transition-colors duration-500"
                    >
                        PRENDRE ATTACHE
                    </a>
                </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;