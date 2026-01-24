/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./services/**/*.{js,ts,jsx,tsx}",
        "./utils/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                'ken-burns': {
                    '0%': { transform: 'scale(1) translate(0, 0)' },
                    '100%': { transform: 'scale(1.15) translate(-2%, -1%)' },
                },
                'reveal-blur': {
                    '0%': { opacity: '0', filter: 'blur(10px)', transform: 'scale(0.98)' },
                    '100%': { opacity: '1', filter: 'blur(0)', transform: 'scale(1)' },
                },
                'shimmer': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                }
            },
            animation: {
                'ken-burns': 'ken-burns 40s ease-out infinite alternate',
                'reveal-blur': 'reveal-blur 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                'shimmer': 'shimmer 2s infinite',
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['"Inter"', 'sans-serif'],
            },
            colors: {
                primary: '#1a1a1a',
                accent: '#D4AF37', // Gold-ish
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
    ],
}
