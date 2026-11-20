/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        midnight: {
          950: '#07090E',
          900: '#0B0F19',
          850: '#111726',
          800: '#161F33',
          700: '#23304C',
          600: '#334155',
        },
        coral: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E',
          600: '#E11D48',
        },
        champagne: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        rosegold: {
          300: '#F4A261',
          400: '#E76F51',
          500: '#E07A5F',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-coral': '0 0 25px -5px rgba(244, 63, 94, 0.3)',
        'glow-champagne': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
        'glow-midnight': '0 0 35px -5px rgba(15, 23, 42, 0.5)',
      }
    },
  },
  plugins: [],
}

