import React from 'react';
import { motion } from 'framer-motion';
import { ServiceProps } from '../types';

const ServiceColumn: React.FC<ServiceProps & { index: number }> = ({ title, subtitle, price, timeline, description, features, index, isPrimary }) => {
  
  // Custom CTA text based on benefit
  const ctaText = index === 0 ? "Matérialiser votre rang" 
                : index === 1 ? "Imposer votre autorité" 
                : "Occuper les esprits";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      // Optimization: Trigger animation when 10% of element is visible, not wait for center
      viewport={{ once: true, amount: 0.1 }} 
      transition={{ 
        duration: 0.7, // Slightly faster duration for snappier feel
        delay: index * 0.1, // Reduced delay between columns (was 0.2)
        ease: [0.21, 0.47, 0.32, 0.98] 
      }}
      className={`flex flex-col h-full p-8 md:p-12 lg:p-16 relative group transition-all duration-700 ${
        isPrimary 
          ? 'z-10' 
          : 'z-0 hover:z-10 hover:-translate-y-1' 
      }`}
    >
      {/* Background Hover Effect */}
      <div className={`absolute inset-0 transition-all duration-700 ease-out pointer-events-none 
        ${isPrimary 
          ? 'bg-ink/[0.03] group-hover:bg-paper group-hover:shadow-[0_30px_60px_rgba(26,26,26,0.08)]' 
          : 'bg-transparent group-hover:bg-ink/[0.02] group-hover:shadow-[0_15px_30px_rgba(26,26,26,0.03)]'}`} 
      />
      
      {/* Primary Highlight Border (Invisible by default, reveals on hover for Primary) */}
      {isPrimary && (
        <div className="absolute inset-0 border border-transparent group-hover:border-brass/30 transition-colors duration-700 pointer-events-none"></div>
      )}

      {/* Header */}
      <div className="mb-8 md:mb-12 relative z-10">
        <div className="flex justify-between items-start mb-4">
            <p className={`text-[9px] md:text-[10px] uppercase tracking-[0.2em] transition-colors duration-500 ${isPrimary ? 'text-brass' : 'text-ink/40 group-hover:text-ink/60'}`}>
              {subtitle}
            </p>
            {/* Price */}
            <div className="text-right">
              <span className="block font-sans text-base md:text-lg text-ink/60 font-medium group-hover:text-ink transition-colors duration-500">{price}</span>
              <span className="block text-[8px] md:text-[9px] uppercase tracking-widest text-ink/30 mt-1">{timeline || "Unique"}</span>
            </div>
        </div>
        <h3 className={`font-serif text-3xl md:text-4xl text-ink transition-transform duration-700 origin-left ${
            isPrimary 
                ? 'group-hover:scale-105' 
                : 'group-hover:translate-x-2' // Slide effect for standard offers
        }`}>
          {title}
        </h3>
      </div>

      {/* Description */}
      {/* Fix: Added max-w-lg to prevent long lines on tablet (single column) and scoped min-height to lg (desktop) only */}
      <div className="font-light leading-relaxed mb-8 md:mb-12 text-sm text-ink/70 min-h-0 lg:min-h-[80px] relative z-10 group-hover:text-ink/90 transition-colors duration-500 max-w-lg">
          {description}
      </div>

      {/* Features List */}
      <ul className="space-y-4 md:space-y-6 mb-10 md:mb-16 flex-grow relative z-10">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start text-sm font-light text-ink/80 group-hover:text-ink transition-colors duration-500">
            <span className={`mr-4 text-[9px] mt-1 font-mono transition-colors duration-500 ${isPrimary ? 'text-brass' : 'text-ink/20 group-hover:text-ink/40'}`}>
              0{idx + 1}
            </span>
            {feature}
          </li>
        ))}
      </ul>
      
      {/* CTA Button */}
      <div className="mt-auto relative z-10">
          <button className={`w-full text-center text-[9px] md:text-[10px] uppercase tracking-[0.25em] py-4 md:py-5 border transition-all duration-500 
            ${isPrimary 
              ? 'bg-ink text-paper border-ink group-hover:bg-brass group-hover:border-brass group-hover:text-ink' 
              : 'border-ink/20 text-ink hover:bg-ink hover:text-paper hover:border-ink'}`}
          >
            {ctaText}
          </button>
      </div>
    </motion.div>
  );
};

const Services: React.FC = () => {
  const services: ServiceProps[] = [
    {
      title: "La Fondation",
      subtitle: "Infrastructure",
      price: "12k€",
      timeline: "6 semaines",
      description: "Votre présence en ligne ne doit pas seulement être esthétique. Elle doit être souveraine. Nous concevons votre plateforme numérique pour qu'elle convertisse instantanément la visite d'un décideur en marque de confiance.",
      features: [
        "Audit de positionnement",
        "Identité visuelle & UI",
        "Développement propriétaire",
        "Rhétorique de marque",
        "Autonomie technique"
      ]
    },
    {
      title: "L'Autorité",
      subtitle: "SYSTÈME COMPLET",
      price: "15k€",
      timeline: "Hybride",
      description: "L'approche globale. Nous déployons l'infrastructure en priorité absolue, puis activons immédiatement le moteur d'influence. C'est la voie rapide pour préempter votre marché avant la concurrence.",
      features: [
        "Inclus : Offre Fondation",
        "Déploiement prioritaire",
        "Inclus : Offre Résonance (1 mois)",
        "Direction stratégique",
        "Accès fondateur"
      ],
      isPrimary: true
    },
    {
      title: "La Résonance",
      subtitle: "Editorial",
      price: "3.5k€",
      timeline: "Mensuel",
      description: "L'expertise technique ne suffit plus si elle reste invisible. Nous la transformons en leadership d'opinion. Une présence constante et chirurgicale sur les réseaux, gérée intégralement pour vous.",
      features: [
        "Cadence éditoriale stratégique",
        "Formats longs & analyses",
        "Gestion & optimisation",
        "Veille d'opportunités",
        "Mesure d'impact"
      ]
    }
  ];

  return (
    <section id="approche" className="py-0 relative bg-paper border-b border-ink/10">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Header Section with Borders */}
        <div className="border-l border-r border-ink/10">
            {/* Centered Header */}
            <div className="py-20 md:py-32 px-6 md:px-12 border-b border-ink/10 text-center flex flex-col items-center">
                <motion.span 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 1 }}
                  className="block text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-ink/40 mb-6 flex items-center gap-4"
                >
                  <span className="w-6 md:w-8 h-px bg-ink/10"></span>
                  L'Approche
                  <span className="w-6 md:w-8 h-px bg-ink/10"></span>
                </motion.span>
                
                <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                  className="font-serif text-4xl md:text-7xl text-ink leading-[0.9]"
                >
                  Modes d'intervention.
                </motion.h2>
            </div>

            {/* Editorial Grid - Stacks on tablet (md) and mobile, Grid on large screens (lg) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-ink/10">
            {services.map((service, index) => (
                <ServiceColumn key={index} {...service} index={index} />
            ))}
            </div>

            {/* Disclaimer Footer */}
            <motion.div 
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: true, amount: 0.5 }}
               transition={{ delay: 0.4, duration: 1 }}
               className="py-6 md:py-8 border-t border-ink/10 text-center"
            >
                <p className="text-[8px] md:text-[9px] text-ink/30 font-mono tracking-wide uppercase px-4">
                * Tarification HT indicative soumise à audit préalable.
                </p>
            </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Services;