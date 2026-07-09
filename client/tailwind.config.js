/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // "Enterprise Orange" — the actual brand primary pulled from the Uniad
        // Enterprise Figma's named design tokens (Primary/100 and Primary/500).
        primary: {
          50: '#fff3f0',
          100: '#ffede8',
          200: '#ffd0c2',
          300: '#ffaa8f',
          400: '#ff835c',
          500: '#ff6636',
          600: '#ff450a',
          700: '#db3400',
          800: '#a92c04',
          900: '#7d2408',
          950: '#491808',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
