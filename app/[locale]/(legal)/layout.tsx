import Navigation from '@/components/Navigation';
import BackButton from '@/components/BackButton';

export default function LegalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navigation />
            <main className="relative z-10 min-h-screen bg-[#FFFAF1]">
                {children}
            </main>
            <BackButton />
        </>
    );
}
