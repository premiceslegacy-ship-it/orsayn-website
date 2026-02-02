'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const questions = [
    {
      question: t('q1.question'),
      answer: t('q1.answer')
    },
    {
      question: t('q2.question'),
      answer: t('q2.answer')
    },
    {
      question: t('q3.question'),
      answer: t('q3.answer')
    },
    {
      question: t('q4.question'),
      answer: t('q4.answer')
    },
    {
      question: t('q5.question'),
      answer: t('q5.answer')
    },
    {
      question: t('q6.question'),
      answer: t('q6.answer')
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
                {t('sectionLabel')}
              </span>
              <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-ink leading-[1] mb-6 md:mb-8">
                {t('sectionTitleLine1')} <br /><span className="italic text-ink/40">{t('sectionTitleLine2')}</span>
              </h2>
              <p className="text-sm font-light text-ink/60 leading-relaxed max-w-xs mx-auto xl:mx-0 mb-8">
                {t('sectionDescription')}
              </p>
              <a href="#contact" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-ink hover:text-brass transition-colors duration-300 pb-1 border-b border-ink/10 hover:border-brass">
                {t('ctaText')}
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