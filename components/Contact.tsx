import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

const InputField = ({ label, number, placeholder, type = "text", isSelect = false }: { label: string, number: string, placeholder?: string, type?: string, isSelect?: boolean }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group pt-6 pb-2 border-b border-ink/10 transition-colors duration-500 hover:border-ink/30">
        
      {/* Label & Number */}
      <div className="flex justify-between items-center mb-2">
        <label className={`text-[9px] uppercase tracking-[0.2em] transition-colors duration-300 ${isFocused ? 'text-brass' : 'text-ink/40'}`}>
          {label}
        </label>
        <span className="font-mono text-[9px] text-ink/20">{number}</span>
      </div>

      {/* Input / Select */}
      {isSelect ? (
        <div className="relative">
             <select 
                className="w-full bg-transparent font-serif text-xl md:text-2xl text-ink outline-none appearance-none cursor-pointer py-2"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
             >
                <option value="" disabled selected className="text-ink/20">Sélectionner une option</option>
                <option value="foundation">Incarner mon rang (Fondation)</option>
                <option value="authority">Dominer ma niche (Autorité)</option>
                <option value="resonance">Occuper l'espace (Résonance)</option>
                <option value="other">Autre demande stratégique</option>
            </select>
            {/* Custom Arrow */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-ink opacity-30">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4L6 8L10 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
        </div>
      ) : (
        <input 
          type={type} 
          className="w-full bg-transparent font-serif text-xl md:text-2xl text-ink placeholder:text-ink/10 outline-none py-2"
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      )}

      {/* Focus Line Animation */}
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
  const [agreementChecked, setAgreementChecked] = useState(false);
  
  // Logic for dynamic current year (Année N)
  const currentYear = new Date().getFullYear();

  return (
    <section id="contact" className="py-24 md:py-48 relative overflow-hidden bg-paper">
      
      {/* Background Texture/Grid hint */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-ink/[0.01] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          
          {/* LEFT COLUMN: THE MANIFESTO */}
          <div className="lg:col-span-5 flex flex-col justify-between pl-4 md:pl-8 lg:pl-0 pr-4 md:pr-0">
            <div>
              <motion.div
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 viewport={{ once: true }}
                 className="flex items-center gap-4 mb-8"
              >
                  {/* Decorative line removed here */}
                  <span className="text-[9px] uppercase tracking-[0.3em] text-ink/40">Candidature</span>
              </motion.div>

              <motion.h2 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.8 }}
                 className="font-serif text-5xl md:text-7xl lg:text-8xl text-ink leading-[0.9] mb-8 md:mb-12"
              >
                Admission <br/>sur dossier.
              </motion.h2>
              
              <div className="space-y-6 md:space-y-8 max-w-md">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-sm md:text-base font-light text-ink/70 leading-relaxed"
                >
                    Nous ne collaborons qu'avec des structures prêtes à assumer leur ambition. Le processus d'admission vise à garantir un alignement total de vision.
                </motion.p>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-sm md:text-base font-light text-ink/70 leading-relaxed"
                >
                    Portefeuille limité volontairement pour une disponibilité absolue.
                </motion.p>
              </div>
            </div>
            
            <div className="mt-16 lg:mt-0">
               <p className="text-[9px] uppercase tracking-widest text-ink/30 mb-4">Correspondance directe</p>
               <a href="mailto:contact@orsayn.fr" className="group flex items-center gap-4 text-ink hover:text-brass transition-colors duration-500">
                  <span className="font-serif text-2xl">contact@orsayn.fr</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-500" />
               </a>
            </div>
          </div>

          {/* RIGHT COLUMN: THE PROTOCOL (FORM) */}
          <motion.div
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="lg:col-span-7 pl-4 md:pl-0 pr-4 md:pr-12 lg:pr-0"
          >
             <form className="space-y-4">
               {/* Header of the Form */}
               <div className="flex justify-between items-end pb-8 border-b border-ink text-ink">
                    <span className="text-xs uppercase tracking-[0.2em] font-medium">Formulaire {currentYear}-A</span>
                    <span className="text-[9px] uppercase tracking-widest text-ink/40">Confidentiel</span>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  <InputField label="Identité" number="01" placeholder="Prénom & Nom du décideur" />
                  <InputField label="Structure" number="02" placeholder="Nom du Cabinet - Société" />
               </div>

               <InputField label="Point de Contact" number="03" placeholder="E-mail professionnel" type="email" />
               
               <InputField label="Ambition" number="04" isSelect />

               <InputField label="Contexte" number="05" placeholder="Définissez votre objectif prioritaire." />

               {/* Submit Area - Updated to items-center for mobile centering */}
               <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
                  
                  {/* Agreement Checkbox */}
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
                        En déposant ce dossier, je confirme représenter l'entité citée. Orsayn s'engage à une confidentialité absolue sur les données transmises (Accord NDA implicite).
                    </p>
                  </div>

                  <button type="submit" className="group relative overflow-hidden bg-ink text-paper px-10 py-6 min-w-[240px] transition-all duration-500 hover:shadow-2xl hover:shadow-ink/20">
                      <span className="relative z-10 text-[10px] uppercase tracking-[0.3em] group-hover:text-ink transition-colors duration-500">
                          DÉPOSER LA CANDIDATURE
                      </span>
                      {/* Button Hover Effect */}
                      <div className="absolute inset-0 bg-brass transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-in-out z-0"></div>
                  </button>
               </div>
             </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;