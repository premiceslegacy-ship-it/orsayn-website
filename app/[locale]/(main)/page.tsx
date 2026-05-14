import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';

export async function generateMetadata({
    params: { locale }
}: {
    params: { locale: string }
}): Promise<Metadata> {
    const canonicalUrl = `https://www.orsayn.com/${locale}`;
    const altLocale = locale === 'fr' ? 'en' : 'fr';
    return {
        alternates: {
            canonical: canonicalUrl,
            languages: {
                [locale]: canonicalUrl,
                [altLocale]: `https://www.orsayn.com/${altLocale}`,
                'x-default': 'https://www.orsayn.com/fr',
            }
        }
    };
}

export default function HomePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-paper text-ink p-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-ink/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-brass/[0.05] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>
            
            <div className="max-w-2xl text-center relative z-10">
                <span className="text-[10px] uppercase tracking-[0.3em] text-ink/60 mb-6 block">Mise à jour en cours</span>
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-8 tracking-tight text-ink">
                    Évolution du <br className="hidden sm:block" />positionnement
                </h1>
                <p className="text-lg md:text-xl font-light text-ink/80 leading-relaxed mb-12 max-w-xl mx-auto">
                    Notre site est temporairement indisponible. Nous affinons actuellement notre nouvelle offre pour mieux vous accompagner.
                    <br /><br />
                    Si vous avez une demande de projet en cours ou à venir, nous restons à votre entière disposition.
                </p>
                <a 
                    href="https://wa.me/33651664068" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-4 bg-ink text-paper px-8 py-5 transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl group mx-auto"
                >
                    <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Nous contacter sur WhatsApp</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                </a>
            </div>
        </div>
    );
}
