import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';

// --- DATA TYPES ---
interface Article {
  id: number;
  type: string;
  date: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode; 
  summary: string;
  image?: string;
  readTime: string;
}

// --- ARTICLE VIEW COMPONENT (THE READER) ---
const ArticleReader: React.FC<{ article: Article; onClose: () => void }> = ({ article, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 bg-paper overflow-y-auto"
    >
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-ink origin-left z-50" 
        initial={{ scaleX: 0 }} 
        animate={{ scaleX: 1 }} 
        transition={{ duration: 1, delay: 0.5 }} 
      />

      <div className="max-w-[1920px] mx-auto relative min-h-screen flex flex-col">
        
        {/* Navigation / Close */}
        <div className="sticky top-0 w-full flex justify-between items-center p-6 md:p-12 bg-paper/95 backdrop-blur-sm z-40 border-b border-ink/10">
           <div className="flex items-center gap-4">
              <span className="w-2 h-2 bg-brass rounded-full"></span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-ink/60">Lecture en cours</span>
           </div>
           <button 
             onClick={onClose}
             className="group flex items-center gap-3 text-ink hover:text-brass transition-colors"
           >
             <span className="text-[10px] uppercase tracking-[0.2em] hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">Fermer la lecture</span>
             <div className="w-10 h-10 border border-ink/10 flex items-center justify-center rounded-full group-hover:border-brass transition-colors">
               <X className="w-4 h-4" />
             </div>
           </button>
        </div>

        {/* Article Content */}
        <div className="flex-grow flex flex-col items-center pt-12 md:pt-24 pb-32 px-6">
           
           <article className="w-full max-w-2xl">
              {/* Header */}
              <div className="text-center mb-20 md:mb-32">
                  <span className="block text-[9px] uppercase tracking-[0.3em] text-ink/40 mb-6">{article.type} — {article.date}</span>
                  <h1 className="font-serif text-5xl md:text-7xl text-ink leading-[0.95] mb-10">{article.title}</h1>
                  {article.subtitle && (
                    <p className="font-serif text-xl md:text-2xl text-ink/60 italic leading-relaxed max-w-lg mx-auto">
                      {article.subtitle}
                    </p>
                  )}
              </div>

              {/* Featured Image - Improved Visibility */}
              {article.image && (
                <div className="mb-20 md:mb-32 relative aspect-[16/9] w-full overflow-hidden">
                   <img src={article.image} alt={article.title} className="absolute inset-0 w-full h-full object-cover grayscale opacity-90" />
                   <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-paper to-transparent">
                      <span className="text-[8px] uppercase tracking-widest text-ink/50 bg-paper/80 px-2 py-1 inline-block backdrop-blur-sm">Fig A. — Concept Visuel</span>
                   </div>
                </div>
              )}

              {/* Body Text - The "Paper" Feel */}
              {/* 
                  Updates:
                  - prose-h3:mt-20 (80px) -> Space between Intro/Parts and Parts/Parts.
                  - prose-h3:mb-8 (32px) -> Space between Title and Text.
                  - prose-p:mb-6 (24px) -> Standard comfortable paragraph spacing.
              */}
              <div className="prose prose-lg 
                  prose-headings:font-serif prose-headings:font-normal prose-headings:text-3xl prose-headings:text-ink 
                  prose-h3:mt-20 prose-h3:mb-8 
                  prose-p:font-serif prose-p:text-ink/80 prose-p:font-light prose-p:leading-[1.8] prose-p:mb-6
                  prose-blockquote:border-l-2 prose-blockquote:border-brass prose-blockquote:pl-8 prose-blockquote:py-2 prose-blockquote:my-16 prose-blockquote:italic prose-blockquote:text-2xl prose-blockquote:font-serif prose-blockquote:text-ink
                  prose-img:grayscale">
                  {article.content}
              </div>

              {/* Footer Signature */}
              <div className="mt-32 pt-12 border-t border-ink/10 flex justify-between items-end">
                 <div>
                    <img 
                        src="https://placehold.co/100x50/FFFAF1/1A1A1A?text=ORSAYN&font=playfair" 
                        alt="Signature" 
                        className="h-6 w-auto opacity-30 mb-4 mix-blend-multiply" 
                    />
                    <p className="text-[9px] uppercase tracking-widest text-ink/40">Fin de transmission.</p>
                 </div>
                 <button onClick={onClose} className="text-[10px] uppercase tracking-[0.2em] text-ink border-b border-ink/20 pb-1 hover:border-ink hover:text-brass transition-all">
                    Retour au sommaire
                 </button>
              </div>
           </article>

        </div>
      </div>
    </motion.div>
  );
};


// --- MAIN COMPONENT ---
const Perspectives: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // REAL CONTENT DATA
  const articles: Article[] = [
    {
      id: 1,
      type: "Rapport Stratégique",
      date: "Q1 2024",
      title: "L'Architecture de l'Invisible.",
      subtitle: "Pourquoi le silence est devenu le luxe ultime des cabinets d'élite.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop",
      readTime: "12 min",
      summary: "Dans un marché saturé par le bruit médiatique, l'absence maîtrisée devient l'ultime luxe. Analyse de la corrélation entre rareté digitale et valorisation des honoraires.",
      content: (
        <>
          {/* Introduction */}
          <p className="first-letter:text-7xl first-letter:font-serif first-letter:text-ink first-letter:float-left first-letter:mr-3 first-letter:mt-[-6px] first-letter:leading-[0.8]">
            C'est une erreur fondamentale de croire que la visibilité équivaut à l'autorité. Dans les cercles de la haute finance, du M&A et du droit international, c'est souvent l'inverse qui prévaut. Le bruit est l'apanage de ceux qui cherchent à vendre ; le silence est le privilège de ceux que l'on vient acheter.
          </p>
          <p>
            Depuis deux décennies, la "transformation digitale" a poussé les cabinets d'avocats et les banques d'affaires à adopter les codes du e-commerce de masse : volume, fréquence, omniprésence. C'est une stratégie suicidaire pour une marque de luxe. En cherchant à être partout, vous signalez inconsciemment votre disponibilité. Or, la disponibilité est l'ennemie du désir.
          </p>
          
          {/* Part I - mt-20 applied via prose-h3 class */}
          <h3>I. La rareté comme levier de valeur</h3>
          <p>
            Considérez les maisons de haute couture ou les banques privées suisses. Elles ne crient pas. Elles chuchotent, et le monde se penche pour écouter. Votre présence numérique doit suivre cette même dynamique physique : créer une force gravitationnelle plutôt qu'une force de projection.
          </p>
          <p>
            L'objectif n'est pas d'être invisible, mais d'être *sélectivement visible*. Une architecture digitale bien conçue agit comme un filtre : elle repousse les prospects non qualifiés par sa sophistication et attire les décideurs par sa pertinence.
          </p>
          
          <blockquote>
            "L'autorité ne se réclame pas par le volume de la voix, mais par la précision du propos."
          </blockquote>
          
          {/* Part II - mt-20 applied via prose-h3 class */}
          <h3>II. La métrique du silence</h3>
          <p>
            Nous avons audité 50 cabinets du Magic Circle et du Big Law américain. La corrélation est statistique : les cabinets dont le contenu public est le plus rare — mais le plus dense intellectuellement — commandent les taux horaires les plus élevés.
          </p>
          <p>
            Pourquoi ? Parce que le client HNW (High-Net-Worth) ou le C-Level n'achète pas une prestation technique. Il achète une certitude. Un site web qui ressemble à un journal d'actualité frénétique transmet de l'anxiété. Une plateforme épurée, stable et docte transmet de la maîtrise.
          </p>

          {/* Implicit Conclusion Separator - Balanced spacing (my-16) */}
          <div className="w-16 h-px bg-ink/20 mx-auto my-16"></div>

          {/* Implicit Conclusion */}
          <p>
            Faire de son nom une institution demande de renoncer à la vanité des "likes" pour embrasser la puissance de la réputation. Votre infrastructure digitale doit être le temple de votre savoir, pas le marché de vos services.
          </p>
        </>
      )
    },
    {
      id: 2,
      type: "Note de Perspective",
      date: "JAN. 12",
      title: "Le Signal et le Bruit.",
      summary: "Pourquoi 90% du marketing juridique échoue à convertir les C-Levels.",
      readTime: "4 min",
      content: (
        <>
            <p className="first-letter:text-7xl first-letter:font-serif first-letter:text-ink first-letter:float-left first-letter:mr-3 first-letter:mt-[-6px] first-letter:leading-[0.8]">
                L'attention d'un dirigeant du CAC40 est la ressource la plus rare du marché. Pourtant, la majorité des cabinets tentent de la capturer avec des outils inadaptés : newsletters génériques, articles LinkedIn simplistes et sites web "vitrines".
            </p>
            
            <h3>Le coût de la médiocrité sémantique</h3>
            <p>
                Un décideur détecte l'amateurisme en trois secondes. Si votre première phrase est une généralité, vous avez perdu. Le marketing juridique traditionnel échoue parce qu'il tente d'éduquer le client au lieu de l'élever.
            </p>
            <p>
                Pour convertir un C-Level, il ne faut pas lui expliquer le droit. Il faut lui expliquer comment le droit va impacter son P&L (Profit & Loss) ou sa responsabilité pénale personnelle. Le changement de paradigme est total : on passe de l'information juridique à l'intelligence stratégique.
            </p>

            {/* Implicit Conclusion Separator */}
            <div className="w-16 h-px bg-ink/20 mx-auto my-16"></div>

            <p>
                Réduisez votre fréquence de publication par dix. Augmentez la profondeur de vos analyses par dix. C'est la seule mathématique qui fonctionne pour l'élite.
            </p>
        </>
      )
    },
    {
      id: 3,
      type: "Étude de Cas",
      date: "DEC. 08",
      title: "Dissonance de Prestige.",
      summary: "L'audit silencieux que vos clients réalisent avant même de vous contacter.",
      readTime: "6 min",
      content: (
        <>
            <p className="first-letter:text-7xl first-letter:font-serif first-letter:text-ink first-letter:float-left first-letter:mr-3 first-letter:mt-[-6px] first-letter:leading-[0.8]">
                Vouz recevez vos clients dans des bureaux place Vendôme ou avenue Montaigne. Le marbre est impeccable, l'art est choisi, le café est servi dans de la porcelaine. Tout crie "Excellence".
            </p>
            <p>
                Puis, ce même client tape votre nom sur Google. Il tombe sur un site lent, non sécurisé, avec des photos d'équipe datant de 2015 et une typographie par défaut.
            </p>
            
            <h3>La rupture de confiance</h3>
            <p>
                C'est ce que nous appelons la "Dissonance de Prestige". Ce décalage crée un doute subconscient immédiat. "Sont-ils vraiment aussi modernes qu'ils le prétendent ?"
            </p>
            <p>
                Dans un monde post-digital, votre site web est votre premier bureau. S'il est poussiéreux, on assume que vos dossiers le sont aussi. L'alignement entre votre réalité physique et votre projection digitale n'est pas une question d'esthétique, c'est une question de crédibilité financière.
            </p>
        </>
      )
    }
  ];

  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1);

  return (
    <section id="journal" className="py-24 md:py-40 relative bg-paper border-b border-ink/10">
      
      {/* ARTICLE READER OVERLAY */}
      <AnimatePresence>
        {selectedArticle && (
          <ArticleReader article={selectedArticle} onClose={() => setSelectedArticle(null)} />
        )}
      </AnimatePresence>

      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
        
        {/* CONTAINER - SINGLE COLUMN CENTERED (Newspaper Layout) */}
        <div className="max-w-4xl mx-auto border-l border-r border-ink/10 bg-paper p-8 md:p-16 lg:p-24 relative shadow-[0_0_50px_rgba(0,0,0,0.02)]">
            
            {/* Header Title */}
            <div className="text-center mb-16 md:mb-24 border-b border-ink/10 pb-12">
                <span className="block text-[9px] uppercase tracking-[0.4em] text-ink/40 mb-4">Revue Stratégique</span>
                <h2 className="font-serif text-4xl md:text-6xl text-ink">Orsayn.</h2>
                <p className="mt-4 font-serif italic text-ink/50 text-lg">Vol. 01 — Perspectives & Doctrines</p>
            </div>

            {/* FEATURED ARTICLE (THE HEADLINE) */}
            <div 
                onClick={() => setSelectedArticle(featuredArticle)}
                className="group cursor-pointer mb-20 md:mb-28"
            >
                {/* Meta */}
                <div className="flex justify-between items-center mb-6 border-t border-ink/20 pt-2">
                    <span className="text-[9px] uppercase tracking-widest text-ink font-medium">{featuredArticle.type}</span>
                    <span className="text-[9px] font-mono text-ink/40">{featuredArticle.date}</span>
                </div>

                {/* The Headline - CENTERED AS REQUESTED */}
                <h3 className="text-center font-serif text-5xl md:text-7xl text-ink leading-[0.9] mb-10 group-hover:text-ink/80 transition-colors px-4">
                    {featuredArticle.title}
                </h3>

                {/* The Image (Inline with text flow style) */}
                <div className="relative w-full aspect-[21/9] md:aspect-[2/1] bg-ink/5 mb-10 overflow-hidden grayscale contrast-110">
                    {featuredArticle.image && (
                        <motion.img 
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            src={featuredArticle.image} 
                            alt={featuredArticle.title} 
                            className="w-full h-full object-cover opacity-90"
                        />
                    )}
                </div>

                {/* The Summary / Lead */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-8 md:col-start-3 text-center md:text-left">
                        <p className="font-serif text-lg md:text-xl text-ink/70 leading-relaxed mb-6">
                            {featuredArticle.summary}
                        </p>
                        <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-ink border-b border-ink/20 pb-1 group-hover:border-brass group-hover:text-brass transition-all">
                            Lire le rapport complet
                        </span>
                    </div>
                </div>
            </div>


            {/* SECONDARY ARTICLES (THE LIST) */}
            <div className="space-y-12">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-ink/10 flex-grow"></div>
                    <span className="text-[9px] uppercase tracking-widest text-ink/30">Dernières parutions</span>
                    <div className="h-px bg-ink/10 flex-grow"></div>
                </div>

                {otherArticles.map((item) => (
                    <motion.div 
                        key={item.id}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        onClick={() => setSelectedArticle(item)}
                        className="group cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline border-b border-ink/5 pb-8"
                    >
                        <div className="md:col-span-3">
                            <span className="text-[9px] font-mono text-ink/40">{item.date}</span>
                        </div>
                        <div className="md:col-span-9">
                             <div className="flex justify-between items-start">
                                <h4 className="font-serif text-2xl md:text-3xl text-ink mb-2 group-hover:translate-x-2 transition-transform duration-500">
                                    {item.title}
                                </h4>
                                <ArrowRight className="w-4 h-4 text-ink/20 group-hover:text-brass transition-colors -translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" />
                             </div>
                             <p className="text-xs md:text-sm font-light text-ink/50 line-clamp-2 max-w-md">
                                {item.summary}
                             </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer of the Journal Section */}
            <div className="mt-24 text-center">
                 <a href="#" className="inline-block text-[9px] uppercase tracking-[0.2em] text-ink/40 hover:text-ink transition-colors border border-ink/10 px-8 py-4 hover:bg-ink hover:text-paper hover:border-ink">
                    Consulter les Annales
                 </a>
            </div>

        </div>

      </div>
    </section>
  );
};

export default Perspectives;