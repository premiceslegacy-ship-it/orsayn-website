'use client';

import { usePathname } from 'next/navigation';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <main className="relative z-10 min-h-screen">
                {children}
            </main>
        </>
    );
}
