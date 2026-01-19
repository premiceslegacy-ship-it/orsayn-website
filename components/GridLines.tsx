import React from 'react';

const GridLines: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 flex justify-between px-6 md:px-12 lg:px-24 w-full h-full max-w-[1920px] mx-auto">
      {/* Left Line */}
      <div className="w-px h-full bg-ink opacity-[0.08]"></div>
      
      {/* Center Line (only desktop) */}
      <div className="hidden md:block w-px h-full bg-ink opacity-[0.08]"></div>
      
      {/* Right Line */}
      <div className="w-px h-full bg-ink opacity-[0.08]"></div>
    </div>
  );
};

export default GridLines;