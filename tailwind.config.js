/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,jsx,ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Deep green-blacks — bay leaf and cardamom, never grey. The ground
        // everything sits on, and a quiet nod to a kitchen that is all veg.
        forest: {
          950: '#06120E',
          900: '#0A1B14',
          800: '#102A20',
          700: '#17392B',
          600: '#204A38',
          500: '#2C5F49',
        },
        // Antique gold — brass thali, not neon. Primary accent.
        gold: {
          100: '#FCF6E4',
          200: '#F3E5B8',
          300: '#E5CE8A',
          400: '#D4B563',
          500: '#B8973F',
          600: '#8E7128',
        },
        // Vermilion — tilak red. Used for heat and emphasis, never for large areas.
        vermilion: {
          300: '#F3A183',
          400: '#E4724A',
          500: '#C4552F',
          600: '#9A401F',
        },
        // Pista — the veg mark and pistachio garnish. Kept bright so it still
        // reads as a distinct green against the forest ground.
        pista: {
          400: '#B6D95F',
          500: '#94BC42',
        },
        // Ivory — warm white for type on the dark ground and for printed paper.
        cream: {
          50: '#FAF8F1',
          100: '#F4F1E6',
          200: '#E7E2D2',
          300: '#CFC9B6',
          400: '#9E9884',
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
          "radial-gradient(circle at 50% 50%, transparent 0 28%, rgba(212,181,99,0.07) 28% 28.4%, transparent 28.4% 44%, rgba(212,181,99,0.05) 44% 44.3%, transparent 44.3%)",
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
