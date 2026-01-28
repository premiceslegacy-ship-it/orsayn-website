import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, MotionValue } from 'framer-motion';

interface Step {
  id: string;
  phase: string;
  duration: string;
  title: string;
  description: string;
}

interface ProtocolStepProps {
  step: Step;
  index: number;
  progress: MotionValue<number>; 
}

const ProtocolStep: React.FC<ProtocolStepProps> = ({ step, index, progress }) => {
  const stepRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress: mobileProgress } = useScroll({
    target: stepRef,
    offset: ["start 90%", "end 60%"]
  });

  const scaleY = useSpring(mobileProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Desktop Light Logic
  const startThreshold = index * 0.25; 
  const endThreshold = startThreshold + 0.15; 

  const numberColor = useTransform(
    progress,
    [startThreshold, endThreshold],
    ["rgba(26, 26, 26, 0.1)", "#D4B35D"]
  );

  return (
    <div 
        ref={stepRef}
        className={`
            relative p-6 md:p-10 lg:p-12 xl:px-10 border-ink/10 group md:border-l
            ${index === 0 ? 'md:border-l-0 md:pl-0' : ''}
            ${index === 2 ? 'md:border-l-0 xl:border-l' : ''} 
            ${index === 3 ? 'xl:border-r-0' : ''}
        `}
    >
        {/* Mobile Step Line */}
        <div className="md:hidden absolute left-0 top-0 bottom-0 w-px bg-ink/10">
            <motion.div 
                style={{ scaleY }}
                className="absolute top-0 left-0 w-full h-full bg-ink origin-top"
            />
        </div>

        {/* Step Marker (Dot) - Desktop/Tablet */}
        <motion.div 
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + (index * 0.1) }}
            className="hidden md:block absolute -top-[5px] left-0 w-[9px] h-[9px] bg-paper border border-ink z-20"
            style={index === 0 ? { left: '-4px' } : { left: '-5px' }}
        />

        {/* Content */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="flex flex-col h-full justify-between min-h-[220px] md:min-h-[300px] lg:min-h-[320px]"
        >
            <div>
                <div className="flex justify-between items-baseline mb-6 md:mb-8 lg:mb-10">
                    <motion.span 
                        style={{ color: numberColor }}
                        className="font-serif text-2xl md:text-4xl transition-colors duration-500"
                    >
                        {step.id}
                    </motion.span>
                    
                    <span className="text-[9px] uppercase tracking-widest text-ink/40 font-mono border border-ink/10 px-2 py-1 rounded-full bg-ink/[0.02]">
                        {step.duration}
                    </span>
                </div>
                
                <h3 className="font-serif text-lg md:text-2xl lg:text-2xl text-ink mb-3 md:mb-4 group-hover:translate-x-1 transition-transform duration-500 uppercase tracking-tight">
                    {step.title}
                </h3>
                
                <p className="text-xs md:text-sm font-light text-ink/60 leading-relaxed mb-6 md:mb-8">
                    {step.description}
                </p>
            </div>

            {/* Phase Label at bottom */}
            <div className="mt-auto">
                <span className="text-[9px] uppercase tracking-[0.25em] text-ink font-medium">
                    {step.phase}
                </span>
            </div>
        </motion.div>
    </div>
  );
};

const Protocol: React.FC = () => {
  
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "center center"]
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const steps = [
    {
      id: "I",
      phase: "DIAGNOSTIC",
      duration: "SEMAINE 1",
      title: "L'AUDIT DE VÉRITÉ",
      description: "Nous isolons votre valeur unique. Confrontation de votre expertise réelle face à votre image perçue. Nous définissons l'angle d'attaque précis pour cristalliser votre singularité."
    },
    {
      id: "II",
      phase: "PRODUCTION",
      duration: "SEMAINES 2-4",
      title: "LA MATÉRIALISATION",
      description: "Traduction de votre rang en actifs numériques. Création de l'identité visuelle, développement de la plateforme sur-mesure et rédaction de la rhétorique. Nous fabriquons votre instrument de pouvoir."
    },
    {
      id: "III",
      phase: "DÉPLOIEMENT",
      duration: "SEMAINES 5-6",
      title: "LA BASCULE",
      description: "Mise en ligne de votre infrastructure souveraine. Transfert technique sécurisé et activation immédiate. C'est l'officialisation de votre nouveau standard."
    },
    {
      id: "IV",
      phase: "RÉSONANCE",
      duration: "M+1 (CONTINU)",
      title: "LE MAINTIEN DU RANG",
      description: "L'autorité est une discipline de répétition. Production mensuelle de doctrines et veille tactique pour transformer une visibilité ponctuelle en statut institutionnel."
    }
  ];

  return (
    <section className="py-20 md:py-32 lg:py-40 bg-paper relative overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24">
        
        {/* HEADER */}
        <div className="mb-12 md:mb-24 lg:mb-32 grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-12">
            <div className="xl:col-span-5 flex flex-col justify-end text-center md:text-center xl:text-left">
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 mb-6 justify-center xl:justify-start"
                >
                    <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-ink/50 font-medium">
                        MÉTHODOLOGIE
                    </span>
                </motion.div>
                <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-ink leading-[1]">
                    LE PROTOCOLE<br/>
                    <span className="italic text-ink/40">D'EXÉCUTION.</span>
                </h2>
            </div>
            <div className="xl:col-span-7 flex items-end justify-center xl:justify-start text-center xl:text-left">
                <p className="text-sm md:text-base font-light text-ink/70 leading-relaxed max-w-2xl">
                    Ériger votre expertise en actif souverain.<br/>
                    Une séquence millimétrée.
                </p>
            </div>
        </div>

        {/* TIMELINE GRID */}
        <div ref={containerRef} className="relative border-t border-ink/10 md:border-t-0">
            {/* The Moving Line */}
            <motion.div 
                style={{ scaleX }}
                className="absolute top-0 left-0 h-[2px] bg-ink origin-left z-10 w-full hidden md:block"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                {steps.map((step, index) => (
                    <ProtocolStep key={index} step={step} index={index} progress={scrollYProgress} />
                ))}
            </div>
        </div>

      </div>
    </section>
  );
};

export default Protocol;