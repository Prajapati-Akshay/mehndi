import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.25rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        forest: {
          50: '#f2f7f3',
          100: '#dfede2',
          200: '#bfdcc5',
          300: '#94c29d',
          400: '#64a271',
          500: '#428450',
          600: '#32693e',
          700: '#285333',
          800: '#0f2a17',
          900: '#0a1d10',
          950: '#051009',
        },
        gold: {
          50: '#fdfbf4',
          100: '#f8f2de',
          200: '#f0e3b6',
          300: '#e5cf85',
          400: '#d7b752',
          500: '#c59d2f',
          600: '#a77f24',
          700: '#846020',
          800: '#6d4d20',
          900: '#5c4020',
          950: '#36230e',
        },
        henna: {
          50: '#fdf4f3',
          100: '#fbe8e4',
          200: '#f8d4cd',
          300: '#f1b3a7',
          400: '#e48675',
          500: '#d15b47',
          600: '#b84230',
          700: '#9b3425',
          800: '#7c2d22',
          900: '#662920',
        },
        rose: {
          50: '#fdf3f4',
          100: '#fbe4e7',
          200: '#f6cdd3',
          300: '#eea7b1',
          400: '#e37788',
          500: '#d24f66',
          600: '#b8354f',
          700: '#992941',
          800: '#7f253a',
          900: '#6d2235',
        },
        ivory: '#faf7f2',
        cream: '#f4ede0',
        sand: '#ede3cf',
      },
      fontFamily: {
        serif: ['var(--font-heading)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(15, 42, 23, 0.12)',
        card: '0 8px 30px -8px rgba(15, 42, 23, 0.08)',
        luxury: '0 20px 50px -15px rgba(167, 127, 36, 0.25)',
        gold: '0 4px 20px -2px rgba(197, 157, 47, 0.35)',
        'gold-glow': '0 0 25px rgba(215, 183, 82, 0.4)',
        'forest-glow': '0 12px 35px -8px rgba(10, 29, 16, 0.45)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'pulse-subtle': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.5s ease-out both',
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
