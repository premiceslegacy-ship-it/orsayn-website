import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-paper z-20">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24">
        
        {/* CONTAINER WITH BORDERS */}
        <div className="border-l border-r border-ink/10 border-t border-ink/10 bg-paper">
            
            {/* TOP SECTION: GRID LAYOUT - 1 col Mobile, 2 cols Tablet, 4 cols XL */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-ink/10">
                
                {/* 1. BRAND IDENTITY */}
                <div className="p-8 md:p-10 lg:p-12 xl:p-12 flex flex-col justify-start items-center md:items-center xl:items-start text-center md:text-center xl:text-left gap-6 min-h-[200px] border-b md:border-b-0 border-ink/10 xl:border-b-0">
                    <div className="h-8 flex items-center">
                        <img 
                           src="https://placehold.co/400x100/FFFAF1/1A1A1A?text=ORSAYN&font=playfair" 
                           alt="ORSAYN" 
                           className="h-8 w-auto object-contain -ml-1 mix-blend-multiply opacity-90" 
                        />
                    </div>
                    <div>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-ink/40 leading-relaxed">
                            L'infrastructure stratégique<br/>des cabinets souverains.
                        </p>
                    </div>
                </div>

                {/* 2. PARIS (Time Zone) */}
                <div className="p-8 md:p-10 lg:p-12 xl:p-12 flex flex-col justify-start items-center md:items-center xl:items-start text-center md:text-center xl:text-left gap-6 min-h-[200px] border-b md:border-b-0 border-ink/10 xl:border-b-0">
                    <div className="h-8 flex items-center">
                        <span className="text-[9px] uppercase tracking-widest text-ink/30 block">FUSEAU HORAIRE</span>
                    </div>
                    <div className="font-serif text-xl text-ink leading-relaxed">
                        <p>Europe - Paris, CET</p>
                    </div>
                </div>

                {/* 3. CONTACT (Digital Anchor) */}
                <div className="p-8 md:p-10 lg:p-12 xl:p-12 flex flex-col justify-start items-center md:items-center xl:items-start text-center md:text-center xl:text-left gap-6 min-h-[200px] border-b md:border-b-0 border-ink/10 xl:border-b-0">
                    <div className="h-8 flex items-center">
                         <span className="text-[9px] uppercase tracking-widest text-ink/30 block">Liaison</span>
                    </div>
                    <div className="flex flex-col items-center xl:items-start">
                        <a href="#" className="group flex items-center gap-2 text-[10px] uppercase tracking-widest text-ink/60 hover:text-ink transition-colors">
                            LinkedIn
                            <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </a>
                    </div>
                </div>

                {/* 4. LEGALS (Compliance) */}
                <div className="p-8 md:p-10 lg:p-12 xl:p-12 flex flex-col justify-start items-center md:items-center xl:items-start text-center md:text-center xl:text-left gap-6 min-h-[200px]">
                    <div className="h-8 flex items-center">
                         <span className="text-[9px] uppercase tracking-widest text-ink/30 block">Légal</span>
                    </div>
                    <div className="flex flex-col gap-3 items-center xl:items-start">
                        <a href="#" className="text-[10px] uppercase tracking-widest text-ink/60 hover:text-ink transition-colors pb-1 border-b border-transparent hover:border-ink/10 w-fit">
                            Mentions Légales
                        </a>
                        <a href="#" className="text-[10px] uppercase tracking-widest text-ink/60 hover:text-ink transition-colors pb-1 border-b border-transparent hover:border-ink/10 w-fit">
                            CGV & Confidentialité
                        </a>
                        <a href="#" className="text-[10px] uppercase tracking-widest text-ink/60 hover:text-ink transition-colors pb-1 border-b border-transparent hover:border-ink/10 w-fit">
                            Plan du site
                        </a>
                    </div>
                </div>

            </div>

            {/* BOTTOM BAR: COPYRIGHT */}
            <div className="border-t border-ink/10 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] uppercase tracking-widest text-ink/30 text-center md:text-left">
                <span>© {currentYear} Orsayn.</span>
                <span>Tous droits réservés.</span>
            </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;