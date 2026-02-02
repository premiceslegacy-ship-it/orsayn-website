'use client';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const showFooter = !pathname.includes('/journal');

    return (
        <>
            <Navigation />
            <main className="relative z-10 min-h-screen">
                {children}
            </main>
            {showFooter && (
                <div className="relative z-10">
                    <Footer />
                </div>
            )}
        </>
    );
}
