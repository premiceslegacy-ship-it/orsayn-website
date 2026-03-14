'use client';

import React, { useEffect } from 'react';

const NoiseOverlay: React.FC = () => {
  useEffect(() => {
    const styleId = 'noise-overlay-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes noiseAnimation {
        0%   { transform: translate(0, 0); }
        10%  { transform: translate(-5%, -5%); }
        20%  { transform: translate(-10%, 5%); }
        30%  { transform: translate(5%, -10%); }
        40%  { transform: translate(-5%, 15%); }
        50%  { transform: translate(-10%, 5%); }
        60%  { transform: translate(15%, 0); }
        70%  { transform: translate(0, 10%); }
        80%  { transform: translate(-15%, 0); }
        90%  { transform: translate(10%, 5%); }
        100% { transform: translate(5%, 0); }
      }

      .noise-bg {
        position: fixed;
        top: -50%;
        left: -50%;
        right: -50%;
        bottom: -50%;
        width: 200%;
        height: 200vh;
        animation: noiseAnimation .2s infinite;
        opacity: 0.45;
        visibility: visible;
        pointer-events: none;
        z-index: 9998;
      }

      .noise-bg svg {
        width: 100%;
        height: 100%;
        display: block;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none z-[50] mix-blend-overlay opacity-[0.035] overflow-hidden"
      aria-hidden="true"
    >
      <div className="noise-bg">
        {/* Inline SVG noise — no external dependency, CSP-safe */}
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="orsayn-noise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#orsayn-noise)" />
        </svg>
      </div>
    </div>
  );
};

export default NoiseOverlay;
