import './globals.css';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // The actual <html> and <body> are rendered by app/[locale]/layout.tsx
    // This root layout is required by Next.js App Router but delegates to the locale layout.
    return (
        <html>
            <body>{children}</body>
        </html>
    );
}
