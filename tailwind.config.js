/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Dark Theme Colors
                background: {
                    DEFAULT: '#0F1117', // Charcoal black
                    card: '#1C1F26',    // Card background
                },
                primary: {
                    DEFAULT: '#7C7CFF', // Soft neon purple
                    50: '#F0F0FF',
                    100: '#E5E5FF',
                    200: '#CCCCFF',
                    300: '#B3B3FF',
                    400: '#9999FF',
                    500: '#7C7CFF',
                    600: '#6363E6',
                    700: '#4A4ACC',
                    800: '#3131B3',
                    900: '#181899',
                },
                secondary: {
                    DEFAULT: '#4ADEDE', // Mint cyan
                    50: '#E5F9F9',
                    100: '#CCF3F3',
                    200: '#99E7E7',
                    300: '#66DBDB',
                    400: '#4ADEDE',
                    500: '#33D1D1',
                    600: '#2AB8B8',
                    700: '#219F9F',
                    800: '#188686',
                    900: '#0F6D6D',
                },
                text: {
                    DEFAULT: '#EDEDED', // Main text
                    muted: '#9CA3AF',   // Muted text
                    dark: '#6B7280',    // Darker muted text
                },
                error: '#FF6B6B',       // Error/Overdue
                success: '#4ADE80',     // Success
                warning: '#FBBF24',     // Warning
                // Keep neutral for borders and subtle elements
                neutral: {
                    50: '#fafafa',
                    100: '#f5f5f5',
                    200: '#e5e5e5',
                    300: '#d4d4d4',
                    400: '#a3a3a3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                },
            },
            boxShadow: {
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
                'card-hover': '0 10px 15px -3px rgba(124, 124, 255, 0.3), 0 4px 6px -2px rgba(124, 124, 255, 0.2)',
                'glow-primary': '0 0 20px rgba(124, 124, 255, 0.5)',
                'glow-secondary': '0 0 20px rgba(74, 222, 222, 0.5)',
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'slide-down': {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'scale-in': {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.3s ease-out',
                'slide-up': 'slide-up 0.3s ease-out',
                'slide-down': 'slide-down 0.3s ease-out',
                'scale-in': 'scale-in 0.2s ease-out',
            },
        },
    },
    plugins: [],
}
