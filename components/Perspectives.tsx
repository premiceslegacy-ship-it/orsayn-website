import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ArrowLeft } from 'lucide-react';

// --- DATA TYPES ---
interface Article {
  id: number;
  category: string;
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
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 bg-paper overflow-y-auto"
    >
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 h-1 bg-brass origin-left z-50" 
        initial={{ scaleX: 0 }} 
        animate={{ scaleX: 1 }} 
        transition={{ duration: 1, delay: 0.5 }} 
      />

      <div className="max-w-[1920px] mx-auto relative min-h-screen flex flex-col">
        
        {/* Article Content */}
        <div className="flex-grow flex flex-col items-center pt-28 md:pt-48 pb-20 md:pb-32 px-6">
           
           <article className="w-full max-w-2xl">
              {/* Header */}
              <div className="text-center mb-16 md:mb-24">
                  <span className="inline-block py-1 px-3 border border-ink/10 rounded-full text-[9px] uppercase tracking-[0.2em] text-ink/60 mb-6 md:mb-8 bg-ink/[0.03]">
                    {article.category} — {article.readTime}
                  </span>
                  <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl text-ink leading-[0.95] mb-8 md:mb-10 uppercase">{article.title}</h1>
                  {article.subtitle && (
                    <p className="font-serif text-lg md:text-xl lg:text-2xl text-ink/60 italic leading-relaxed max-w-lg mx-auto">
                      {article.subtitle}
                    </p>
                  )}
              </div>

              {/* Body Text */}
              <div className="prose prose-lg 
                  prose-headings:font-serif prose-headings:font-normal prose-headings:text-2xl md:prose-headings:text-3xl prose-headings:text-ink 
                  prose-h3:mt-16 prose-h3:mb-6 md:prose-h3:mt-20 md:prose-h3:mb-8 
                  prose-p:font-serif prose-p:text-base md:prose-p:text-lg prose-p:text-ink/80 prose-p:font-light prose-p:leading-[1.7] md:prose-p:leading-[1.8] prose-p:mb-6
                  prose-blockquote:border-l-2 prose-blockquote:border-brass prose-blockquote:pl-6 md:prose-blockquote:pl-8 prose-blockquote:py-2 prose-blockquote:my-12 md:prose-blockquote:my-16 prose-blockquote:italic prose-blockquote:text-xl md:prose-blockquote:text-2xl prose-blockquote:font-serif prose-blockquote:text-ink
                  prose-img:grayscale">
                  {article.content}
              </div>

              {/* Footer Signature & Back Navigation - Updated layout to xl for consistency */}
              <div className="mt-20 md:mt-32 pt-12 border-t border-ink/10 flex flex-col xl:flex-row justify-between items-center xl:items-end gap-12 text-center xl:text-left">
                 <div>
                    <img 
                        src="https://placehold.co/100x50/FFFAF1/1A1A1A?text=ORSAYN&font=playfair" 
                        alt="Signature" 
                        className="h-6 w-auto opacity-30 mb-4 mix-blend-multiply mx-auto xl:mx-0" 
                    />
                    <p className="text-[9px] uppercase tracking-widest text-ink/40">Fin de transmission.</p>
                 </div>

                 {/* BACK BUTTON */}
                 <button 
                    onClick={onClose}
                    className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-ink hover:text-brass transition-colors duration-300"
                 >
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span>Retour à la revue</span>
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
  const [activeCategory, setActiveCategory] = useState("TOUS");

  // REAL CONTENT DATA - UPDATED: UPPERCASE TITLES & 2026 DATES
  const articles: Article[] = [
    {
      id: 1,
      category: "STRATÉGIE",
      type: "Rapport Stratégique",
      date: "Q1 2026",
      title: "L'ARCHITECTURE DE L'INVISIBLE",
      subtitle: "Pourquoi le silence est devenu le luxe ultime des cabinets d'élite.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop",
      readTime: "12 min",
      summary: "Dans un marché saturé par le bruit médiatique, l'absence maîtrisée devient l'ultime luxe. Analyse de la corrélation entre rareté digitale et valorisation des honoraires.",
      content: (
        <>
          <p className="first-letter:text-7xl first-letter:font-serif first-letter:text-ink first-letter:float-left first-letter:mr-3 first-letter:mt-[-6px] first-letter:leading-[0.8]">
            C'est une erreur fondamentale de croire que la visibilité équivaut à l'autorité. Dans les cercles de la haute finance, du M&A et du droit international, c'est souvent l'inverse qui prévaut. Le bruit est l'apanage de ceux qui cherchent à vendre ; le silence est le privilège de ceux que l'on vient acheter.
          </p>
          <h3>I. La rareté comme levier de valeur</h3>
          <p>
            Considérez les maisons de haute couture ou les banques privées suisses. Elles ne crient pas. Elles chuchotent, et le monde se penche pour écouter. Votre présence numérique doit suivre cette même dynamique physique : créer une force gravitationnelle plutôt qu'une force de projection.
          </p>
        </>
      )
    },
    {
      id: 2,
      category: "INFLUENCE",
      type: "Note de Perspective",
      date: "12 JAN. 2026",
      title: "LE SIGNAL ET LE BRUIT",
      subtitle: "Pourquoi 90% du marketing juridique échoue.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop",
      summary: "Pourquoi 90% du marketing juridique échoue à convertir les C-Levels.",
      readTime: "4 min",
      content: (
        <>
            <p>L'attention d'un dirigeant du CAC40 est la ressource la plus rare du marché.</p>
        </>
      )
    },
    {
      id: 3,
      category: "IDENTITÉ",
      type: "Étude de Cas",
      date: "08 DEC. 2026",
      title: "DISSONANCE DE PRESTIGE",
      subtitle: "L'audit silencieux que vos clients réalisent.",
      image: "https://images.unsplash.com/photo-1505567745926-ba89000d255a?q=80&w=2000&auto=format&fit=crop",
      summary: "L'audit silencieux que vos clients réalisent avant même de vous contacter.",
      readTime: "6 min",
      content: (
        <>
            <p>Vouz recevez vos clients dans des bureaux place Vendôme ou avenue Montaigne...</p>
        </>
      )
    }
  ];

  const categories = ["TOUS", "STRATÉGIE", "INFLUENCE", "IDENTITÉ"];

  const filteredArticles = useMemo(() => {
    if (activeCategory === "TOUS") return articles;
    return articles.filter(a => a.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="journal" className="py-20 md:py-32 lg:py-48 relative bg-paper border-b border-ink/10">
      
      <AnimatePresence>
        {selectedArticle && (
          <ArticleReader article={selectedArticle} onClose={() => setSelectedArticle(null)} />
        )}
      </AnimatePresence>

      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24">
        
        {/* THE MONOLITH CONTAINER */}
        <div className="max-w-5xl mx-auto border-l border-r border-paper/10 bg-ink p-6 md:p-16 lg:p-24 relative shadow-[0_30px_60px_rgba(0,0,0,0.15)] overflow-hidden">
            
            {/* 1. NOISE TEXTURE OVERLAY */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-overlay" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            {/* HEADER & FILTERS - Shifted layout to xl */}
            <div className="relative z-10 mb-12 md:mb-16 lg:mb-24">
                <div className="flex flex-col xl:flex-row justify-between items-center xl:items-end gap-8 pb-8 border-b border-paper/10 text-center xl:text-left">
                    <div className="flex flex-col items-center xl:items-start">
                        <span className="block text-[9px] uppercase tracking-[0.4em] text-paper/40 mb-4">Revue Stratégique</span>
                        {/* OS Sigil Logo */}
                        <div className="w-16 h-16 md:w-24 md:h-24 relative">
                            <img 
                                src="https://placehold.co/200x200/1A1A1A/FFFAF1?text=OS&font=playfair" 
                                alt="OS Sigil" 
                                className="w-full h-full object-contain mix-blend-screen opacity-90"
                            />
                        </div>
                    </div>
                    
                    {/* Filter Pills */}
                    <div className="flex flex-wrap gap-2 justify-center xl:justify-end">
                        {categories.map((cat) => (
                            <button 
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`text-[9px] uppercase tracking-widest px-3 py-2 md:px-4 border rounded-full transition-all duration-500 
                                    ${activeCategory === cat 
                                        ? 'bg-paper text-ink border-paper shadow-md shadow-paper/10' // Active: #FFFAF1 (Paper)
                                        : 'bg-transparent text-paper/50 border-paper/20 hover:border-paper/60 hover:text-paper hover:bg-paper/5' // Inactive: Improved contrast & interaction
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* CONTENT GRID - ANIMATED */}
            <motion.div 
                layout
                className="relative z-10 grid grid-cols-1 gap-12"
            >
                <AnimatePresence mode='popLayout'>
                    {filteredArticles.map((article, index) => (
                        <motion.div
                            layout
                            key={article.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            onClick={() => setSelectedArticle(article)}
                            className="group cursor-pointer"
                        >
                            {/* Card Container */}
                            <div className="relative overflow-hidden border border-paper/5 bg-paper/[0.02] hover:bg-paper/[0.04] transition-colors duration-500">
                                
                                {/* Grid Shifted to xl */}
                                <div className="grid grid-cols-1 xl:grid-cols-12 gap-0">
                                    
                                    {/* Image Section (4 Cols on XL Desktop, Full Width on Tablet/Mobile) */}
                                    <div className="xl:col-span-5 relative h-56 md:h-80 xl:h-auto overflow-hidden">
                                        {article.image && (
                                            <>
                                                <motion.img 
                                                    src={article.image} 
                                                    alt={article.title}
                                                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 transition-opacity duration-700 will-change-transform"
                                                    style={{ transformOrigin: "center center" }}
                                                    whileHover={{ scale: 1.05 }}
                                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                                />
                                                {/* Gradient Overlay on Hover */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-500"></div>
                                                
                                                {/* Floating Tag */}
                                                <div className="absolute top-4 left-4">
                                                    <span className="text-[8px] uppercase tracking-widest text-paper/80 bg-ink/50 backdrop-blur-sm px-2 py-1 rounded border border-paper/10 transition-colors">
                                                        {article.category}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Content Section (8 Cols on XL Desktop) */}
                                    <div className="xl:col-span-7 p-6 md:p-12 lg:p-16 xl:p-10 flex flex-col justify-between relative">
                                        
                                        <div>
                                            <div className="flex justify-between items-center mb-4 md:mb-6">
                                                <span className="text-[9px] font-mono text-paper/30">{article.date}</span>
                                                <span className="text-[9px] uppercase tracking-widest text-brass opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0 hidden md:block">
                                                    CONSULTER LA DOCTRINE
                                                </span>
                                            </div>

                                            {/* TITLE */}
                                            <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl text-paper mb-3 md:mb-4 transition-colors duration-500 leading-tight">
                                                {article.title}
                                            </h3>
                                            
                                            <p className="text-sm font-light text-paper/60 leading-relaxed line-clamp-3">
                                                {article.summary}
                                            </p>
                                        </div>

                                        {/* Bottom Action Line */}
                                        <div className="mt-6 md:mt-8 pt-6 border-t border-paper/5 flex justify-between items-center">
                                            <span className="text-[9px] text-paper/20">{article.readTime} de lecture</span>
                                            <div className="w-8 h-8 rounded-full border border-paper/10 flex items-center justify-center group-hover:bg-brass group-hover:border-brass transition-all duration-500">
                                                <ArrowUpRight className="w-3 h-3 text-paper/40 group-hover:text-ink transition-colors" />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Footer of the Journal Section */}
            <div className="mt-12 md:mt-16 text-center relative z-10">
                 <a href="#" className="inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-paper/30 hover:text-brass transition-colors duration-500 group">
                    <span>CONSULTER LES ANNALES</span>
                    <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                 </a>
            </div>

        </div>

      </div>
    </section>
  );
};

export default Perspectives;