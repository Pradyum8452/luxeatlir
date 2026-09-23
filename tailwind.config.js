/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#E5C158',
          500: '#D4AF37',
          600: '#C5A059',
          700: '#A37E36',
          900: '#3D2E12',
        },
        obsidian: {
          950: '#070709',
          900: '#0B0B0E',
          850: '#121218',
          800: '#191922',
          700: '#272733',
          600: '#3B3B4D',
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
