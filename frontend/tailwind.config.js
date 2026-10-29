/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        stone: {
          950: '#0c0a09',
          900: '#1c1917',
          850: '#242120',
          800: '#292524',
          700: '#44403c',
          600: '#57534e',
          500: '#78716c',
          400: '#a8a29e',
          300: '#d6d3d1',
          200: '#e7e5e4',
          100: '#f5f5f4',
          50: '#fafaf9',
        },
        accent: {
          DEFAULT: '#e85d4a',
          hover: '#d44b38',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'hero-light':
          'linear-gradient(180deg, #fafaf9 0%, #f5f5f4 40%, #fde0d8 100%)',
        'hero-dark':
          'linear-gradient(180deg, #0c0a09 0%, #1c1917 45%, #44403c 100%)',
      },
    },
  },
  plugins: [],
};
