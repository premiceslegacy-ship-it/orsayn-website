import React from 'react';
import { motion } from 'framer-motion';

const Clients: React.FC = () => {
  const clients = [
    "HAUSSMANN & PARTNERS",
    "VENDÔME ASSOCIÉS",
    "RIVE GAUCHE"
  ];

  return (
    <section className="py-24 border-b border-ink/5 bg-paper relative overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          {/* Label Section */}
          <div className="lg:w-1/4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <span className="block text-[10px] uppercase tracking-[0.3em] text-ink/40 mb-4">
              Cercle de Confiance
            </span>
            <div className="w-12 h-px bg-ink/20"></div>
          </div>

          {/* Logos / Names - Constrained width container for better visual cohesion */}
          <div className="lg:w-3/4 w-full flex justify-center lg:justify-end">
             <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center gap-12 md:gap-0">
                {clients.map((client, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15, duration: 1 }}
                    className="flex-1 flex justify-center text-center"
                  >
                    <span className="font-serif text-xl md:text-2xl text-ink/90 hover:text-brass velours-transition cursor-default whitespace-nowrap tracking-tight">
                      {client}
                    </span>
                  </motion.div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Clients;