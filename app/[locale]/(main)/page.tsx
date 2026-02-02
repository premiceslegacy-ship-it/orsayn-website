import Hero from '@/components/Hero';
import Concept from '@/components/Concept';
import StructureImage from '@/components/StructureImage';
import Protocol from '@/components/Protocol';
import Services from '@/components/Services';
import Perspectives from '@/components/Perspectives';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';

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
