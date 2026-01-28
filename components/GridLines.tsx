import React from 'react';

const GridLines: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 flex justify-between px-6 md:px-12 lg:px-16 xl:px-24 w-full h-full mx-auto max-w-[1920px]">
      {/* Left Line */}
      <div className="w-px h-full bg-ink opacity-[0.06]"></div>
      
      {/* Center Line (only desktop) */}
      <div className="hidden md:block w-px h-full bg-ink opacity-[0.06]"></div>
      
      {/* Right Line */}
      <div className="w-px h-full bg-ink opacity-[0.06]"></div>
    </div>
  );
};

export default GridLines;