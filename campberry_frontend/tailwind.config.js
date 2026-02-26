/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#ddfff7',  // Mint for light blue backgrounds
          100: '#caeee3',
          200: '#a8dbcc',
          300: '#e0aeb9',
          400: '#c4697d',
          500: '#a3394c',
          600: '#892233', // Crimson! -> Replace standard blue
          700: '#780000', // Dark Crimson -> hover states
          800: '#5c0000',
          900: '#011936', // Navy
          950: '#001229',
        },
        yellow: {
          400: '#fade41',
          500: '#fade41',
        },
        orange: {
          400: '#ff751f',
          500: '#ff751f',
          600: '#e66517',
        }
      }
    },
  },
  plugins: [],
}

