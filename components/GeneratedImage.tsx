import React from 'react';

// Generative AI functionality has been removed.
// This component now renders a static placeholder if used.
interface GeneratedImageProps {
  prompt: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

const GeneratedImage: React.FC<GeneratedImageProps> = ({ alt, className }) => {
  return (
    <div className={`bg-ink/5 flex items-center justify-center ${className}`}>
        <span className="text-[10px] text-ink/20 uppercase tracking-widest">{alt}</span>
    </div>
  );
};

export default GeneratedImage;