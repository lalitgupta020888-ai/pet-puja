/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,jsx,ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Roasted browns — the tandoor wall after a long service. The ground
        // everything sits on. 800 is the palette's #38240D.
        bark: {
          950: '#1A1006',
          900: '#241608',
          800: '#38240D',
          700: '#4A3113',
          600: '#5D3E19',
          500: '#714C20',
        },
        // Ember — burnt orange, the colour of coals. 500 is the palette's
        // #C05800 and 600 its #713600; the lighter steps are tints of the same
        // hue, because #C05800 as small type on a dark ground does not carry
        // enough contrast to read.
        ember: {
          100: '#FFEFD6',
          200: '#FBD5A4',
          300: '#F0A857',
          400: '#E08A2E',
          500: '#C05800',
          600: '#713600',
        },
        // Vermilion — heat pips and form errors. Kept pink-red so it never gets
        // mistaken for the burnt-orange accent.
        vermilion: {
          300: '#FF9A8A',
          400: '#F4674F',
          500: '#D6452C',
          600: '#A93318',
        },
        // Pista — the veg mark and pistachio garnish. The one cool note.
        pista: {
          400: '#A8D65C',
          500: '#86B93F',
        },
        // Cream — the palette's #FDFBD4, a pale butter. Display type on the dark
        // ground, and the stock the printed card is laid on.
        cream: {
          50: '#FDFBD4',
          100: '#F7F3C6',
          200: '#E6E1B0',
          300: '#CFC6A4',
          400: '#9B9070',
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
          "radial-gradient(circle at 50% 50%, transparent 0 28%, rgba(192,88,0,0.07) 28% 28.4%, transparent 28.4% 44%, rgba(192,88,0,0.05) 44% 44.3%, transparent 44.3%)",
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
