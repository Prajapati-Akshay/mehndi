import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        forest: {
          50: '#f0f5f1',
          100: '#dbe9dd',
          200: '#b6d3bb',
          300: '#8bb894',
          400: '#5e9a6b',
          500: '#3f7d4d',
          600: '#2f633b',
          700: '#264f30',
          800: '#0f2a17',
          900: '#0a1d10',
          950: '#06130a',
        },
        gold: {
          50: '#fbf7ec',
          100: '#f4ead0',
          200: '#e9d4a1',
          300: '#dcb968',
          400: '#cda13d',
          500: '#b6862a',
          600: '#946a21',
          700: '#75531d',
          800: '#5c421c',
          900: '#4c371b',
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
        ivory: '#fbf8f1',
        cream: '#f4ecdd',
      },
      fontFamily: {
        serif: ['var(--font-heading)', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(15, 42, 23, 0.18)',
        card: '0 4px 24px -6px rgba(15, 42, 23, 0.12)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
