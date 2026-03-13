import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import Concept from '@/components/Concept';
import StructureImage from '@/components/StructureImage';
import Protocol from '@/components/Protocol';
import Services from '@/components/Services';
import Perspectives from '@/components/Perspectives';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';

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
        <>
            <Hero />
            <Concept />
            <StructureImage />
            <Protocol />
            <Services />
            <Perspectives />
            <FAQ />
            <Contact />
        </>
    );
}
