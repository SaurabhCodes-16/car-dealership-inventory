/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#FBFBF9',
          100: '#F6F5F2',
          200: '#EBE9E2',
          300: '#DBD8CE',
          400: '#B6B1A2',
          500: '#8C8573',
          600: '#645E4F',
          700: '#464237',
          800: '#2A2822',
          900: '#151412',
          950: '#0C0B0A',
        },
        stone: {
          850: '#1F1E1B',
          925: '#121210',
        },
        champagne: {
          100: '#F5EFE6',
          200: '#E8DCB8',
          300: '#D6C088',
          400: '#C2A355',
        }
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(28, 25, 23, 0.05)',
        'soft-lg': '0 12px 32px -4px rgba(28, 25, 23, 0.08)',
        'soft-inner': 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
      },
      transitionTimingFunction: {
        'soft': 'cubic-bezier(0.16, 1, 0.3, 1)',
      }
    },
  },
  plugins: [],
}
