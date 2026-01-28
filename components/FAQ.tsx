import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  index: number;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick, index }) => {
  return (
    <div className="border-t border-ink/10 first:border-t-0">
      <button 
        onClick={onClick}
        className="w-full py-6 md:py-8 flex justify-between items-start text-left group transition-colors duration-500"
      >
        <span className="flex items-baseline gap-4 md:gap-8 pr-4 md:pr-8">
            <span className="text-[9px] font-mono text-ink/30 pt-1">{`0${index + 1}`}</span>
            <span className={`font-serif text-lg md:text-2xl lg:text-3xl transition-colors duration-300 ${isOpen ? 'text-ink' : 'text-ink/70 group-hover:text-ink'}`}>
                {question}
            </span>
        </span>
        
        <div className={`relative flex-shrink-0 w-6 h-6 md:w-8 md:h-8 flex items-center justify-center transition-transform duration-500 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
            <Plus className={`w-4 h-4 md:w-6 md:h-6 transition-colors duration-300 ${isOpen ? 'text-brass' : 'text-ink/30 group-hover:text-ink'}`} />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pl-6 md:pl-14 pb-8 md:pb-10 pr-4 md:pr-12 max-w-3xl">
              <p className="text-sm md:text-base font-light text-ink/70 leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const questions = [
    {
      question: "Pourquoi une admission sur dossier uniquement ?",
      answer: "Orsayn n'est pas une agence de volume. Nous construisons des infrastructures sur-mesure pour une clientèle restreinte. Cette sélection garantit notre disponibilité absolue et assure que nous ne travaillons qu'avec des structures prêtes à assumer une ambition de leadership."
    },
    {
      question: "Quelle différence avec une agence de communication ?",
      answer: "L'agence vend de la visibilité (bruit). Orsayn construit de l'autorité (signal). Nous ne faisons pas de 'posts' réseaux sociaux, nous créons une doctrine. Notre approche fusionne l'ingénierie technique (plateforme propriétaire), la stratégie de marque (branding) et la diplomatie d'influence."
    },
    {
      question: "Quelle est la durée d'engagement minimale ?",
      answer: "Pour l'offre 'Fondation', la mission dure 6 semaines. Pour l'accompagnement 'Résonance' (influence continue), nous travaillons sur des cycles trimestriels renouvelables. L'autorité ne se construit pas en un jour, mais elle se perd en une seconde sans une vigilance constante."
    },
    {
      question: "Garantissez-vous la confidentialité des échanges ?",
      answer: "C'est la pierre angulaire de notre pratique. Tous nos échanges sont couverts par un accord de non-divulgation (NDA) implicite dès la prise de contact. Nous ne citons nos clients en référence qu'avec leur accord explicite et écrit."
    },
    {
      question: "Intervenez-vous hors de Paris ?",
      answer: "L'influence digitale ignore les frontières. Bien que basés à Paris, nous accompagnons des cabinets et des dirigeants basés à Londres, Genève, Bruxelles et Luxembourg. Notre infrastructure est conçue pour être déployée à distance avec la même rigueur."
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-paper border-b border-ink/10 relative z-10">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24">
        
        {/* Layout Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 md:gap-12 xl:gap-24">
            
            {/* Header Column */}
            <div className="xl:col-span-4 text-center xl:text-left">
                <div className="sticky top-32">
                    <span className="inline-block text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-ink/40 mb-6 md:mb-8">
                        Précisions
                    </span>
                    <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-ink leading-[1] mb-6 md:mb-8">
                        Questions <br/><span className="italic text-ink/40">Fréquentes.</span>
                    </h2>
                    <p className="text-sm font-light text-ink/60 leading-relaxed max-w-xs mx-auto xl:mx-0 mb-8">
                        Lever les doutes pour avancer avec certitude. Si votre interrogation persiste, la voie directe reste ouverte.
                    </p>
                    <a href="#contact" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-ink hover:text-brass transition-colors duration-300 pb-1 border-b border-ink/10 hover:border-brass">
                        Contact Direct
                    </a>
                </div>
            </div>

            {/* Accordion Column */}
            <div className="xl:col-span-8 border-t border-ink/10 xl:border-t-0 mt-8 xl:mt-0">
                {questions.map((item, index) => (
                    <FAQItem 
                        key={index}
                        index={index}
                        question={item.question}
                        answer={item.answer}
                        isOpen={openIndex === index}
                        onClick={() => toggleIndex(index)}
                    />
                ))}
            </div>

        </div>
      </div>
    </section>
  );
};

export default FAQ;