'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface JournalBackButtonProps {
    onClick?: () => void;
    label?: string;
}

export default function JournalBackButton({ onClick, label }: JournalBackButtonProps) {
    const router = useRouter();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            router.back();
        }
    };

    return (
        <button
            onClick={handleClick}
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-ink/40 hover:text-ink mb-16 transition-colors group"
        >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            {label}
        </button>
    );
}
