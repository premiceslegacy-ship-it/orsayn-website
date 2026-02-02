'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

import { useLocale } from 'next-intl';

export default function BackButton() {
    const router = useRouter();
    const locale = useLocale();

    const handleBack = () => {
        // Naviguer vers l'accueil puis scroller au footer en bas de page
        router.push('/');
        // Attendre que la navigation soit complète pour scroller tout en bas
        setTimeout(() => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
        }, 100);
    };

    return (
        <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBack}
            className="group fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-3 bg-[#1A1A1A] text-[#FFFAF1] hover:bg-brass hover:text-ink transition-colors duration-300 shadow-2xl shadow-ink/20"
        >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium">
                {locale === 'fr' ? 'Retour' : 'Back'}
            </span>
        </motion.button>
    );
}
