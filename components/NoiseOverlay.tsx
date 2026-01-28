import React from 'react';

const NoiseOverlay: React.FC = () => {
  return (
    <>
      <style>
        {`
          @keyframes noiseAnimation {
            0% { transform: translate(0, 0); }
            10% { transform: translate(-5%, -5%); }
            20% { transform: translate(-10%, 5%); }
            30% { transform: translate(5%, -10%); }
            40% { transform: translate(-5%, 15%); }
            50% { transform: translate(-10%, 5%); }
            60% { transform: translate(15%, 0); }
            70% { transform: translate(0, 10%); }
            80% { transform: translate(-15%, 0); }
            90% { transform: translate(10%, 5%); }
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
            background: transparent url('http://assets.iceable.com/img/noise-transparent.png') repeat 0 0;
            background-repeat: repeat;
            animation: noiseAnimation .2s infinite;
            opacity: 0.45; 
            visibility: visible;
            pointer-events: none;
            z-index: 9998;
          }
        `}
      </style>
      <div className="fixed inset-0 w-full h-full pointer-events-none z-[50] mix-blend-overlay opacity-[0.035] overflow-hidden">
         <div className="noise-bg"></div>
      </div>
    </>
  );
};

export default NoiseOverlay;