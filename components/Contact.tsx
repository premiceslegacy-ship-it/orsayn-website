'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

const InputField = ({
  label,
  number,
  placeholder,
  type = "text",
  isSelect = false,
  options = [],
  value,
  onChange,
  required = false
}: {
  label: string;
  number: string;
  placeholder?: string;
  type?: string;
  isSelect?: boolean;
  options?: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group pt-4 pb-4 border-b border-paper/10 transition-colors duration-500 hover:border-paper/30">
      <div className="flex justify-between items-center mb-1">
        <label htmlFor={number} className={`text-[9px] uppercase tracking-[0.2em] font-medium transition-colors duration-300 cursor-pointer ${isFocused ? 'text-brass' : 'text-paper/50 group-hover:text-paper/80'}`}>
          {label} {required && '*'}
        </label>
        <span className="font-mono text-[9px] text-paper/20">{number}</span>
      </div>

      {isSelect ? (
        <div className="relative mt-2">
          <select
            id={number}
            className="w-full bg-transparent font-serif text-lg md:text-2xl lg:text-3xl text-paper outline-none appearance-none cursor-pointer py-1"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
          >
            <option value="" disabled className="text-ink">{placeholder}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-ink">{opt.label}</option>
            ))}
          </select>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-paper opacity-40">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      ) : type === "textarea" ? (
        <textarea
          id={number}
          className="w-full bg-transparent font-serif text-lg md:text-2xl lg:text-3xl text-paper placeholder:text-paper/20 outline-none py-1 resize-none h-20"
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          rows={1}
        />
      ) : (
        <input
          id={number}
          type={type}
          className="w-full bg-transparent font-serif text-lg md:text-2xl lg:text-3xl text-paper placeholder:text-paper/20 outline-none py-1"
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
      )}

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isFocused ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "circOut" }}
        className="absolute bottom-0 left-0 w-full h-[1px] bg-brass origin-left"
      />
    </div>
  );
};

const steps = [
  { id: 1, title: 'Identité' },
  { id: 2, title: 'Coordonnées' },
  { id: 3, title: 'Projet' },
  { id: 4, title: 'Validation' }
];

const Contact: React.FC = () => {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    ambition: '',
    context: '',
    website: '' // HONEYPOT
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isBackNav, setIsBackNav] = useState(false);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const navEntries = window.performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navEntries.length > 0 && navEntries[0].type === 'back_forward') {
      setIsBackNav(true);
    }

    const updateAmbitionFromIndex = (index: number | string) => {
      const idx = typeof index === 'string' ? parseInt(index, 10) : index;
      if (!idx) return;

      let label = '';
      if (idx === 1) label = t('form.ambitionOption1');
      else if (idx === 2) label = t('form.ambitionOption2');
      else if (idx === 3) label = t('form.ambitionOption3');

      if (label) setFormData(prev => ({ ...prev, ambition: label }));
    };

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ambitionParam = params.get('ambition');
      if (ambitionParam) updateAmbitionFromIndex(ambitionParam);
    }

    const handleAmbitionUpdate = (e: CustomEvent) => {
      if (e.detail?.ambition) updateAmbitionFromIndex(e.detail.ambition);
    };

    window.addEventListener('ambition-update', handleAmbitionUpdate as EventListener);
    return () => window.removeEventListener('ambition-update', handleAmbitionUpdate as EventListener);
  }, [t]);

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreementChecked) {
      setErrorMessage(t('error.agreement'));
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, agreement: agreementChecked })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setCurrentStep(1); // Reset dossier view
        setFormData({ name: '', company: '', email: '', ambition: '', context: '', website: '' });
        setAgreementChecked(false);
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || t('error.default'));
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage(t('error.connection'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if current step fields are valid to allow 'Next'
  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.name.trim() !== '' && formData.company.trim() !== '';
      case 2: return formData.email.trim() !== '' && formData.email.includes('@');
      case 3: return formData.ambition.trim() !== ''; // Context is optional
      case 4: return agreementChecked;
      default: return false;
    }
  };

  // Animation variants for page turn
  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    animate: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exit: { opacity: 0, x: -20, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as any } }
  };

  return (
    <section id="contact" className="py-20 md:py-32 lg:py-48 relative overflow-hidden bg-paper">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-ink/[0.01] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 md:gap-20 lg:gap-24">

          {/* LEFT COLUMN */}
          <div className="xl:col-span-5 flex flex-col justify-between items-center xl:items-start text-center xl:text-left">
            <div>
              <motion.div
                initial={isBackNav ? { opacity: 1 } : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: isBackNav ? 0 : 0.5 }}
                className="flex items-center gap-4 mb-6 md:mb-8 justify-center xl:justify-start"
              >
                <span className="text-[9px] uppercase tracking-[0.3em] text-ink/60">{t('sectionLabel')}</span>
              </motion.div>

              <motion.h2
                initial={isBackNav ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: isBackNav ? 0 : 0.8 }}
                className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-ink leading-[0.9] mb-8 md:mb-14 lg:mb-16 tracking-tight"
              >
                {t('titleLine1')} <br />{t('titleLine2')}
              </motion.h2>

              <div className="space-y-6 md:space-y-8 max-w-md mx-auto xl:mx-0">
                <motion.p
                  initial={isBackNav ? { opacity: 1 } : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: isBackNav ? 0 : 0.5, delay: 0.2 }}
                  className="text-sm md:text-base font-light text-ink/80 leading-relaxed"
                >
                  {t('description1')}
                </motion.p>
                <motion.p
                  initial={isBackNav ? { opacity: 1 } : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: isBackNav ? 0 : 0.5, delay: 0.3 }}
                  className="text-sm md:text-base font-light text-ink/80 leading-relaxed"
                >
                  {t('description2')}
                </motion.p>
              </div>
            </div>

            <div className="mt-12 xl:mt-0">
              <p className="text-[9px] uppercase tracking-widest text-ink/40 mb-4">{t('directMailLabel')}</p>
              <a href="mailto:contact@orsayn.fr" className="group flex items-center gap-4 text-ink hover:text-brass transition-colors duration-500 justify-center xl:justify-start">
                <span className="font-serif text-xl md:text-2xl">contact@orsayn.fr</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-500" />
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN - PREMIUM DOSSIER FORM */}
          <motion.div
            initial={isBackNav ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: isBackNav ? 0 : 0.8, delay: 0.2 }}
            className="xl:col-span-7 mt-8 xl:mt-0"
          >
            {/* Dossier Container */}
            <div className="bg-ink border border-ink/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] p-6 sm:p-10 md:p-14 lg:p-16 relative overflow-hidden">

              {/* Dossier Header */}
              <div className="flex justify-between items-end pb-6 md:pb-8 border-b border-paper/20 mb-8 relative z-10">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-paper">
                    {t('formTitle')} {currentYear}-A
                  </span>
                  {/* Progress Indicator */}
                  <div className="flex items-center gap-2 mt-2">
                    {steps.map((step) => (
                      <div key={step.id} className="flex items-center">
                        <div className={`h-1 transition-all duration-500 ${step.id === currentStep ? 'w-8 bg-brass' : step.id < currentStep ? 'w-4 bg-paper/80' : 'w-2 bg-paper/10'}`}></div>
                        {step.id < steps.length && <div className="w-1"></div>}
                      </div>
                    ))}
                    <span className="text-[8px] font-mono tracking-widest text-paper/40 ml-4">
                      {currentStep} / {steps.length}
                    </span>
                  </div>
                </div>
                <span className="text-[9px] uppercase tracking-widest text-paper/40 hidden sm:block">
                  {t('formConfidential')}
                </span>
              </div>

              {/* Form Content */}
              <div className="min-h-[380px] md:min-h-[420px] flex flex-col pt-4">
                {submitStatus === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex-1 flex flex-col justify-center items-center text-center p-8 bg-ink"
                  >
                    <div className="w-12 h-12 rounded-full border border-brass flex items-center justify-center mb-6">
                      <Check className="w-5 h-5 text-brass" />
                    </div>
                    <p className="font-serif text-2xl text-paper mb-4">{t('success.title')}</p>
                    <p className="text-sm font-light text-paper/70 leading-relaxed max-w-sm mb-6">{t('success.message')}</p>
                    <p className="text-[9px] uppercase tracking-widest text-brass">{t('success.signature')}</p>
                    <button onClick={() => setSubmitStatus('idle')} className="mt-8 text-[9px] uppercase tracking-widest text-paper/50 hover:text-paper pb-1 border-b border-paper/20 hover:border-paper transition-all">Nouveau dossier</button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                    {/* Honeypot */}
                    <input type="text" name="website" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} style={{ position: 'absolute', left: '-9999px' }} tabIndex={-1} aria-hidden="true" />

                    {/* Animated Pages Container */}
                    <div className="flex-1 relative">
                      <AnimatePresence mode="wait">

                        {/* STEP 1 */}
                        {currentStep === 1 && (
                          <motion.div key="step1" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full space-y-8">
                            <InputField label={t('form.identity')} number="01" placeholder={t('form.identityPlaceholder')} value={formData.name} onChange={(val) => setFormData({ ...formData, name: val })} required />
                            <InputField label={t('form.structure')} number="02" placeholder={t('form.structurePlaceholder')} value={formData.company} onChange={(val) => setFormData({ ...formData, company: val })} required />
                          </motion.div>
                        )}

                        {/* STEP 2 */}
                        {currentStep === 2 && (
                          <motion.div key="step2" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full space-y-8">
                            <InputField label={t('form.contact')} number="03" placeholder={t('form.contactPlaceholder')} type="email" value={formData.email} onChange={(val) => setFormData({ ...formData, email: val })} required />
                            <p className="mt-8 text-[10px] font-light text-paper/40 leading-relaxed italic max-w-sm pl-4 border-l border-paper/10">Cet email servira de canal de communication principal pour la transmission du dossier d&#39;évaluation.</p>
                          </motion.div>
                        )}

                        {/* STEP 3 */}
                        {currentStep === 3 && (
                          <motion.div key="step3" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full space-y-8">
                            <InputField label={t('form.ambition')} number="04" placeholder={t('form.ambitionPlaceholder')} isSelect options={[{ value: t('form.ambitionOption1'), label: t('form.ambitionOption1') }, { value: t('form.ambitionOption2'), label: t('form.ambitionOption2') }, { value: t('form.ambitionOption3'), label: t('form.ambitionOption3') }, { value: t('form.ambitionOption4'), label: t('form.ambitionOption4') }]} value={formData.ambition} onChange={(val) => setFormData({ ...formData, ambition: val })} required />
                            <InputField label={t('form.context')} number="05" placeholder={t('form.contextPlaceholder')} type="textarea" value={formData.context} onChange={(val) => setFormData({ ...formData, context: val })} />
                          </motion.div>
                        )}

                        {/* STEP 4 */}
                        {currentStep === 4 && (
                          <motion.div key="step4" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="w-full flex-1 flex flex-col justify-center py-6">
                            <div className="bg-paper/[0.03] border border-paper/10 p-6 md:p-8 mb-8 relative">
                              <div className="absolute top-0 left-0 w-1 h-full bg-brass/40"></div>
                              <div className="flex items-start gap-5 cursor-pointer group" onClick={() => setAgreementChecked(!agreementChecked)}>
                                <div className={`w-5 h-5 border transition-all duration-300 mt-0.5 flex-shrink-0 flex items-center justify-center ${agreementChecked ? 'bg-paper border-paper' : 'border-paper/20 bg-transparent group-hover:border-brass'}`}>
                                  <AnimatePresence>
                                    {agreementChecked && (
                                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                        <Check className="w-3.5 h-3.5 text-ink stroke-[3]" />
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                                <div className="flex-1">
                                  <p className={`text-[10px] md:text-sm leading-relaxed tracking-wide transition-colors duration-300 select-none ${agreementChecked ? 'text-paper font-medium' : 'text-paper/40 group-hover:text-paper/60'}`}>
                                    {t('form.agreement')}
                                  </p>
                                  <p className="text-[9px] text-paper/20 uppercase tracking-widest mt-4 pt-4 border-t border-paper/10">Signature requise pour transmission</p>
                                </div>
                              </div>
                            </div>

                            {submitStatus === 'error' && (
                              <div className="mb-6 p-4 border border-red-600/30 bg-red-500/10 text-xs text-red-500">
                                {errorMessage || t('error.default')}
                              </div>
                            )}
                          </motion.div>
                        )}

                      </AnimatePresence>
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex justify-between items-center mt-auto pt-6">
                      <button
                        type="button"
                        onClick={handlePrev}
                        disabled={currentStep === 1 || isSubmitting}
                        className={`text-[9px] uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 text-paper/40 hover:text-paper hover:translate-x-[-4px]'}`}
                      >
                        <ArrowRight className="w-3 h-3 rotate-180" /> {t('form.prev')}
                      </button>

                      {currentStep < 4 ? (
                        <button
                          type="button"
                          onClick={handleNext}
                          disabled={!isStepValid()}
                          className="group ml-auto relative bg-[#FFFAF1] text-ink px-10 py-5 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-black/20"
                        >
                          <span className="relative z-10 text-[10px] uppercase tracking-[0.3em] font-bold">{t('form.next')}</span>
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={!agreementChecked || isSubmitting}
                          className="group ml-auto relative overflow-hidden bg-brass text-ink px-10 py-5 transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl hover:shadow-brass/20 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed"
                        >
                          <span className="relative z-10 text-[10px] uppercase tracking-[0.3em] font-bold">
                            {isSubmitting ? t('form.submitting') : t('form.submit')}
                          </span>
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;