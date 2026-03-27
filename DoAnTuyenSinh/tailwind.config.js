/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                'glass-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
                'glow': '0 0 20px rgba(59, 130, 246, 0.3)',
                'glow-lg': '0 0 40px rgba(59, 130, 246, 0.4)',
                'glow-accent': '0 0 20px rgba(14, 165, 233, 0.3)',
                'glow-success': '0 0 20px rgba(16, 185, 129, 0.3)',
                'glow-warning': '0 0 20px rgba(245, 158, 11, 0.3)',
                'glow-error': '0 0 20px rgba(239, 68, 68, 0.3)',
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
                'soft-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
                'dark-soft': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'shimmer': 'shimmer 2s linear infinite',
                'shimmer-cta': 'shimmerCta 2.5s ease-in-out infinite',
                'spin-slow': 'spin 3s linear infinite',
                'spin-slower': 'spin 8s linear infinite',
                'float': 'float 6s ease-in-out infinite',
                'particle-rise': 'particleRise 4s ease-out infinite',
                'pulse-ring': 'pulseRing 2.5s ease-in-out infinite',
                'star-pulse': 'starPulse 2.5s ease-in-out infinite',
                'pulse-soft': 'pulseSoft 0.5s ease-in-out infinite',
                'wiggle': 'wiggle 0.5s ease-in-out',
            },
            keyframes: {
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
                shimmerCta: {
                    '0%': { transform: 'translateX(-100%) skewX(-20deg)' },
                    '50%': { transform: 'translateX(200%) skewX(-20deg)' },
                    '100%': { transform: 'translateX(-100%) skewX(-20deg)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0) translateX(0) rotate(0deg) scale(1)' },
                    '33%': { transform: 'translateY(-40px) translateX(25px) rotate(120deg) scale(1.2)' },
                    '66%': { transform: 'translateY(-20px) translateX(12px) rotate(240deg) scale(1.1)' },
                },
                particleRise: {
                    '0%': { transform: 'translateY(0) rotate(0deg) scale(0.5)', opacity: '0' },
                    '20%': { opacity: '1' },
                    '80%': { opacity: '1' },
                    '100%': { transform: 'translateY(-100px) rotate(360deg) scale(0.5)', opacity: '0' },
                },
                pulseRing: {
                    '0%, 100%': { transform: 'scale(1)', opacity: '0.2' },
                    '50%': { transform: 'scale(1.3)', opacity: '0.1' },
                },
                starPulse: {
                    '0%, 100%': { transform: 'translateY(0) rotate(0deg) scale(0.8)' },
                    '50%': { transform: 'translateY(-8px) rotate(180deg) scale(1.2)' },
                },
                pulseSoft: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.2)' },
                },
                wiggle: {
                    '0%, 100%': { transform: 'rotate(0deg)' },
                    '25%': { transform: 'rotate(-10deg)' },
                    '75%': { transform: 'rotate(10deg)' },
                },
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                'gradient-secondary': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                'gradient-accent': 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                'gradient-success': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                'gradient-warning': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                'gradient-error': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                'grid-pattern': 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
    ],
}
