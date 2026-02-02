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
    <div className="relative group pt-6 pb-2 border-b border-ink/10 transition-colors duration-500 hover:border-ink/30">
      <div className="flex justify-between items-center mb-2">
        <label htmlFor={number} className={`text-[9px] uppercase tracking-[0.2em] transition-colors duration-300 cursor-pointer ${isFocused ? 'text-brass' : 'text-ink/40'}`}>
          {label} {required && '*'}
        </label>
        <span className="font-mono text-[9px] text-ink/20">{number}</span>
      </div>

      {isSelect ? (
        <div className="relative">
          <select
            id={number}
            className="w-full bg-transparent font-serif text-lg md:text-2xl lg:text-2xl text-ink outline-none appearance-none cursor-pointer py-2"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
          >
            <option value="" disabled>{placeholder}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-ink opacity-30">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4L6 8L10 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      ) : type === "textarea" ? (
        <textarea
          id={number}
          className="w-full bg-transparent font-serif text-lg md:text-2xl lg:text-2xl text-ink placeholder:text-ink/10 outline-none py-2 resize-none"
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          rows={2}
        />
      ) : (
        <input
          id={number}
          type={type}
          className="w-full bg-transparent font-serif text-lg md:text-2xl lg:text-2xl text-ink placeholder:text-ink/10 outline-none py-2"
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

const Contact: React.FC = () => {
  const t = useTranslations('contact');
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    ambition: '',
    context: '',
    website: '' // HONEYPOT (caché)
  });

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

    // --- LOGIC FOR PRE-SELECTING AMBITION ---
    const updateAmbitionFromIndex = (index: number | string) => {
      const idx = typeof index === 'string' ? parseInt(index, 10) : index;
      if (!idx) return;

      let label = '';
      if (idx === 1) label = t('form.ambitionOption1'); // Fondation
      else if (idx === 2) label = t('form.ambitionOption2'); // Autorité
      else if (idx === 3) label = t('form.ambitionOption3'); // Résonance

      if (label) {
        setFormData(prev => ({ ...prev, ambition: label }));
      }
    };

    // 1. Check URL on mount (for direct links)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const ambitionParam = params.get('ambition');
      if (ambitionParam) updateAmbitionFromIndex(ambitionParam);
    }

    // 2. Listen for internal navigation events (from Services.tsx)
    const handleAmbitionUpdate = (e: CustomEvent) => {
      if (e.detail?.ambition) {
        updateAmbitionFromIndex(e.detail.ambition);
      }
    };

    window.addEventListener('ambition-update', handleAmbitionUpdate as EventListener);

    return () => {
      window.removeEventListener('ambition-update', handleAmbitionUpdate as EventListener);
    };
  }, [t]);

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
        body: JSON.stringify({
          ...formData,
          agreement: agreementChecked
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          company: '',
          email: '',
          ambition: '',
          context: '',
          website: ''
        });
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

  return (
    <section id="contact" className="py-20 md:py-32 lg:py-48 relative overflow-hidden bg-paper">

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-ink/[0.01] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24 relative z-10">

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 md:gap-20 lg:gap-24">

          {/* LEFT COLUMN */}
          <div className="xl:col-span-5 flex flex-col justify-between items-center xl:items-start text-center xl:text-left pl-0 pr-0">
            <div>
              <motion.div
                initial={isBackNav ? { opacity: 1 } : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: false }}
                transition={{ duration: isBackNav ? 0 : 0.5 }}
                className="flex items-center gap-4 mb-6 md:mb-8 justify-center xl:justify-start"
              >
                <span className="text-[9px] uppercase tracking-[0.3em] text-ink/40">{t('sectionLabel')}</span>
              </motion.div>

              <motion.h2
                initial={isBackNav ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: isBackNav ? 0 : 0.8 }}
                className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-ink leading-[0.9] mb-8 md:mb-14 lg:mb-16"
              >
                {t('titleLine1')} <br />{t('titleLine2')}
              </motion.h2>

              <div className="space-y-6 md:space-y-8 max-w-md mx-auto xl:mx-0">
                <motion.p
                  initial={isBackNav ? { opacity: 1 } : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: isBackNav ? 0 : 0.5, delay: isBackNav ? 0 : 0.2 }}
                  className="text-sm md:text-base font-light text-ink/70 leading-relaxed"
                >
                  {t('description1')}
                </motion.p>
                <motion.p
                  initial={isBackNav ? { opacity: 1 } : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: isBackNav ? 0 : 0.5, delay: isBackNav ? 0 : 0.3 }}
                  className="text-sm md:text-base font-light text-ink/70 leading-relaxed"
                >
                  {t('description2')}
                </motion.p>
              </div>
            </div>

            <div className="mt-12 xl:mt-0">
              <p className="text-[9px] uppercase tracking-widest text-ink/30 mb-4">{t('directMailLabel')}</p>
              <a href="mailto:contact@orsayn.fr" className="group flex items-center gap-4 text-ink hover:text-brass transition-colors duration-500 justify-center xl:justify-start">
                <span className="font-serif text-xl md:text-2xl">contact@orsayn.fr</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-500" />
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN - FORM */}
          <motion.div
            initial={isBackNav ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: isBackNav ? 0 : 0.8, delay: isBackNav ? 0 : 0.2 }}
            className="xl:col-span-7 pl-0 pr-0 mt-8 xl:mt-0"
          >
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-8 lg:space-y-10 xl:space-y-4">
              {/* Header */}
              <div className="flex justify-between items-end pb-6 md:pb-8 border-b border-ink text-ink">
                <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium">{t('formTitle')} {currentYear}-A</span>
                <span className="text-[9px] uppercase tracking-widest text-ink/40">{t('formConfidential')}</span>
              </div>

              {/* HONEYPOT (caché, anti-bot) */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                style={{ position: 'absolute', left: '-9999px' }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 md:gap-y-8 lg:gap-y-10 xl:gap-y-4">
                <InputField
                  label={t('form.identity')}
                  number="01"
                  placeholder={t('form.identityPlaceholder')}
                  value={formData.name}
                  onChange={(value) => setFormData({ ...formData, name: value })}
                  required
                />
                <InputField
                  label={t('form.structure')}
                  number="02"
                  placeholder={t('form.structurePlaceholder')}
                  value={formData.company}
                  onChange={(value) => setFormData({ ...formData, company: value })}
                  required
                />
              </div>

              <InputField
                label={t('form.contact')}
                number="03"
                placeholder={t('form.contactPlaceholder')}
                type="email"
                value={formData.email}
                onChange={(value) => setFormData({ ...formData, email: value })}
                required
              />

              <InputField
                label={t('form.ambition')}
                number="04"
                placeholder={t('form.ambitionPlaceholder')}
                isSelect
                options={[
                  { value: t('form.ambitionOption1'), label: t('form.ambitionOption1') },
                  { value: t('form.ambitionOption2'), label: t('form.ambitionOption2') },
                  { value: t('form.ambitionOption3'), label: t('form.ambitionOption3') },
                  { value: t('form.ambitionOption4'), label: t('form.ambitionOption4') }
                ]}
                value={formData.ambition}
                onChange={(value) => setFormData({ ...formData, ambition: value })}
                required
              />

              <InputField
                label={t('form.context')}
                number="05"
                placeholder={t('form.contextPlaceholder')}
                type="textarea"
                value={formData.context}
                onChange={(value) => setFormData({ ...formData, context: value })}
              />

              {/* Submit Area */}
              <div className="pt-8 md:pt-12 flex flex-col lg:flex-row justify-between items-center gap-8">

                <div
                  className="flex items-start gap-4 max-w-xs cursor-pointer group"
                  onClick={() => setAgreementChecked(!agreementChecked)}
                >
                  <div className={`w-3.5 h-3.5 border transition-all duration-300 mt-1 flex-shrink-0 flex items-center justify-center ${agreementChecked ? 'bg-ink border-ink' : 'border-ink/20 group-hover:border-brass'}`}>
                    <AnimatePresence>
                      {agreementChecked && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "backOut" }}
                        >
                          <Check className="w-2.5 h-2.5 text-paper stroke-[3]" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <p className={`text-[9px] leading-relaxed uppercase tracking-wide transition-colors duration-300 select-none ${agreementChecked ? 'text-ink' : 'text-ink/40 group-hover:text-ink/60'}`}>
                    {t('form.agreement')}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !agreementChecked}
                  className="group relative overflow-hidden bg-ink text-paper px-8 md:px-10 py-5 md:py-6 min-w-full md:min-w-[240px] transition-all duration-500 hover:shadow-2xl hover:shadow-ink/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 text-[9px] md:text-[10px] uppercase tracking-[0.3em] group-hover:text-ink transition-colors duration-500">
                    {isSubmitting ? t('form.submitting') : t('form.submit')}
                  </span>
                  <div className="absolute inset-0 bg-brass transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-in-out z-0"></div>
                </button>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-6 md:p-8 border border-brass/20 bg-gradient-to-b from-brass/[0.03] to-transparent"
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-1 h-1 bg-brass rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-serif text-lg md:text-xl text-ink mb-2">
                          {t('success.title')}
                        </p>
                        <p className="text-sm text-ink/70 leading-relaxed mb-3">
                          {t('success.message')}
                        </p>
                        <p className="text-[9px] uppercase tracking-widest text-brass/80">
                          {t('success.signature')}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 border border-red-600/30 bg-red-50"
                >
                  <p className="text-sm text-red-600">
                    {errorMessage || t('error.default')}
                  </p>
                </motion.div>
              )}
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;