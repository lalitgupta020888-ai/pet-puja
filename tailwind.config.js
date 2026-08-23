/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,jsx,ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Wine-blacks — deep burgundy, the lacquer of a haveli door. The ground
        // everything sits on.
        wine: {
          950: '#150609',
          900: '#1D080C',
          800: '#2A0C13',
          700: '#3A1019',
          600: '#4C1620',
          500: '#631E2A',
        },
        // Old gold — worn temple leaf, not neon. Primary accent.
        gold: {
          100: '#FDF6E3',
          200: '#F6E3B4',
          300: '#E8CE8E',
          400: '#D9B86A',
          500: '#BE9B49',
          600: '#A88338',
        },
        // Vermilion — heat pips and form errors. Pushed towards coral because a
        // true red would sink into the burgundy ground and stop reading as a
        // warning.
        vermilion: {
          300: '#FFB08A',
          400: '#FF8A5B',
          500: '#E0663A',
          600: '#B84B26',
        },
        // Pista — the veg mark and pistachio garnish. The one cool note, and it
        // carries plenty of contrast against the wine.
        pista: {
          400: '#A8D65C',
          500: '#86B93F',
        },
        // Ivory — warm white for type on the dark ground and for printed paper.
        cream: {
          50: '#FBF4EC',
          100: '#F6EDE3',
          200: '#E9DCCF',
          300: '#D3BFB6',
          400: '#A08A82',
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
          "radial-gradient(circle at 50% 50%, transparent 0 28%, rgba(217,184,106,0.07) 28% 28.4%, transparent 28.4% 44%, rgba(217,184,106,0.05) 44% 44.3%, transparent 44.3%)",
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
