/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deepteal: {
          DEFAULT: '#013A40',
          hover: '#012E33',
          light: '#024D55',
        },
        teal: {
          50: '#F0F8FA',
          100: '#DCF0F3',
          200: '#BDE2E8',
          500: '#028090',
          600: '#026E7C',
          700: '#015763',
        },
        seafoam: {
          50: '#F0FAF8',
          100: '#DCF5F1',
          200: '#BCEBE4',
          500: '#00A896',
          600: '#008F80',
          700: '#007468',
        },
        offwhite: '#F7FAF9',
        tomato: {
          50: '#FEF2F0',
          100: '#FEE5E2',
          500: '#F04C2D',
          600: '#D8381A',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(1, 58, 64, 0.06), 0 2px 6px -1px rgba(1, 58, 64, 0.04)',
        'soft-hover': '0 10px 25px -3px rgba(1, 58, 64, 0.1), 0 4px 10px -2px rgba(1, 58, 64, 0.04)',
      }
    },
  },
  plugins: [],
}
