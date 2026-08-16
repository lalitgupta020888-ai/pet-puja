/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,jsx,ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Warm near-blacks — roasted, never blue. The ground everything sits on.
        masala: {
          950: '#0C0806',
          900: '#140E0A',
          800: '#1E1511',
          700: '#2A1E17',
          600: '#3A2A20',
          500: '#4D392C',
        },
        // Marigold — the flower on every threshold. Primary accent.
        marigold: {
          100: '#FDF1D6',
          200: '#F9DFA6',
          300: '#F2C14E',
          400: '#E9A13B',
          500: '#D2842A',
          600: '#A9651F',
        },
        // Vermilion — tilak red. Used for heat and emphasis, never for large areas.
        vermilion: {
          300: '#F08A62',
          400: '#E4572E',
          500: '#C3401C',
          600: '#992F14',
        },
        // Pista — the green of the veg mark and pistachio garnish.
        pista: {
          400: '#9CBF43',
          500: '#7D9E31',
        },
        cream: {
          50: '#FDFAF4',
          100: '#F8F1E4',
          200: '#EFE3CE',
          300: '#DACAAF',
          400: '#B0997C',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
        hindi: ['var(--font-hindi)', 'serif'],
      },
      letterSpacing: {
        brand: '0.42em',
      },
      maxWidth: {
        content: '78rem',
      },
      backgroundImage: {
        grain:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        // Faint concentric rings — a rangoli/thali echo behind key sections.
        rings:
          "radial-gradient(circle at 50% 50%, transparent 0 28%, rgba(233,161,59,0.07) 28% 28.4%, transparent 28.4% 44%, rgba(233,161,59,0.05) 44% 44.3%, transparent 44.3%)",
      },
      animation: {
        'ken-burns': 'kenBurns 26s ease-in-out infinite alternate',
        marquee: 'marquee 40s linear infinite',
        shimmer: 'shimmer 2.6s ease-in-out infinite',
        'spin-slow': 'spin 44s linear infinite',
        steam: 'steam 5s ease-in-out infinite',
      },
      keyframes: {
        kenBurns: {
          '0%': { transform: 'scale(1) translate3d(0,0,0)' },
          '100%': { transform: 'scale(1.13) translate3d(-1.5%,-2%,0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        steam: {
          '0%': { opacity: '0', transform: 'translateY(6px) scaleX(0.9)' },
          '40%': { opacity: '0.5' },
          '100%': { opacity: '0', transform: 'translateY(-22px) scaleX(1.25)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
