import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                paper: '#FFFAF1',
                ink: '#1A1A1A',
                brass: '#D4B35D',
            },
            fontFamily: {
                serif: ['"Boska"', 'Georgia', '"Times New Roman"', 'serif'],
                sans: ['"General Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
            },
            transitionTimingFunction: {
                'luxury': 'cubic-bezier(0.22, 1, 0.36, 1)',
            },
            transitionDuration: {
                DEFAULT: '500ms',
                '700': '700ms',
                '1000': '1000ms',
            },
            animation: {
                "shimmer": "shimmer 2s linear infinite",
                "spin-around": "spin-around calc(var(--speed, 3s) * 2) infinite linear",
                "shimmer-slide": "shimmer-slide var(--speed, 3s) linear infinite",
            },
            keyframes: {
                shimmer: {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(100%)" },
                },
                "spin-around": {
                    "0%": { transform: "translateZ(0) rotate(0)" },
                    "15%, 35%": { transform: "translateZ(0) rotate(90deg)" },
                    "65%, 85%": { transform: "translateZ(0) rotate(270deg)" },
                    "100%": { transform: "translateZ(0) rotate(360deg)" },
                },
                "shimmer-slide": {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(100%)" },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
export default config;
