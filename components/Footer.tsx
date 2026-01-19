import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-ink/10">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 py-24 md:py-40 flex flex-col md:flex-row justify-between items-center md:items-end">
        {/* Added pl-4 md:pl-12 to clear left grid line */}
        <div className="text-center md:text-left mb-12 md:mb-0 pl-4 md:pl-12">
          <h2 className="font-serif text-2xl text-ink mb-2">ORSAYN</h2>
          <p className="text-[10px] uppercase tracking-widest text-ink/40">L'INFRASTRUCTURE STRATÉGIQUE</p>
        </div>
        
        {/* Added pr-4 md:pr-12 to clear right grid line */}
        <div className="flex space-x-12 text-xs text-ink/60 uppercase tracking-widest pr-4 md:pr-12">
          <a href="#" className="hover:text-ink transition-colors pb-1 border-b border-transparent hover:border-ink/20">Mentions Légales</a>
          <a href="#" className="hover:text-ink transition-colors pb-1 border-b border-transparent hover:border-ink/20">CGV</a>
          <a href="#" className="hover:text-ink transition-colors pb-1 border-b border-transparent hover:border-ink/20">LinkedIn</a>
        </div>
        
        <div className="md:hidden mt-12 text-[10px] text-ink/20">
          © {new Date().getFullYear()} Orsayn.
        </div>
      </div>
    </footer>
  );
};

export default Footer;