import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { label: 'L\'ESPRIT', href: '#esprit' },
    { label: 'L\'APPROCHE', href: '#approche' },
    { label: 'JOURNAL', href: '#journal' },
    { label: 'CONTACT', href: '#contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
          isScrolled ? 'py-4 bg-paper/95 backdrop-blur-sm border-b border-ink/5' : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 flex justify-between items-center">
          {/* Logo - Wordmark - Added padding left to avoid touching grid line */}
          <a href="#" className="z-50 flex items-center gap-4 pl-4 md:pl-8">
             {/* Replace src with your actual file path e.g., /assets/logo-orsayn.png */}
             <img 
               src="https://placehold.co/400x100/FFFAF1/1A1A1A?text=ORSAYN&font=playfair" 
               alt="ORSAYN" 
               className="h-8 md:h-10 w-auto object-contain hidden" 
               // Note: hidden is temporary until you add the real image, showing text fallback below for now
             /> 
             <span className="font-serif text-4xl tracking-tight text-ink uppercase scale-y-90">ORSAYN</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-12 items-center">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[10px] tracking-[0.25em] text-ink/70 hover:text-ink velours-transition uppercase font-medium border-b border-transparent hover:border-ink/20 pb-1"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden text-ink z-50 p-2"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-paper z-40 flex flex-col items-center justify-center space-y-8"
          >
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="font-serif text-3xl text-ink hover:text-brass transition-colors duration-500"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;