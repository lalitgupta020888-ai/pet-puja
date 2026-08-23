/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{js,jsx,ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Petrol — deep teal, the ground everything sits on. 800 is the
        // reference panel colour; 950 is the darker frame behind it.
        petrol: {
          950: '#072935',
          900: '#0B3444',
          800: '#0E3D4F',
          700: '#145066',
          600: '#1B6480',
          500: '#237E9E',
        },
        // Saffron — the warm yellow that carries every rule, eyebrow and price.
        // 400 is the reference yellow; the rest are its tints and shades.
        saffron: {
          100: '#FEF3D8',
          200: '#FCE3A6',
          300: '#FACB6A',
          400: '#F8B739',
          500: '#E09C1F',
          600: '#B27714',
        },
        // Terracotta — the second accent: filled call-to-action buttons and the
        // italic display words. 500 is the reference terracotta.
        terracotta: {
          200: '#F0B99E',
          300: '#E08A63',
          400: '#D06A40',
          500: '#C1552F',
          600: '#9A4123',
        },
        // Vermilion — heat pips and form errors. Kept pink-red so it reads as a
        // warning rather than as the terracotta accent.
        vermilion: {
          300: '#FF9A8A',
          400: '#F4674F',
          500: '#D6452C',
          600: '#A93318',
        },
        // Pista — the veg mark and pistachio garnish.
        pista: {
          400: '#A8D65C',
          500: '#86B93F',
        },
        // Cream — warm off-whites for type on the dark ground and printed paper.
        cream: {
          50: '#FFF8E8',
          100: '#FAEFDA',
          200: '#EADCC4',
          300: '#D9CBAA',
          400: '#A2957A',
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
          "radial-gradient(circle at 50% 50%, transparent 0 28%, rgba(248,183,57,0.07) 28% 28.4%, transparent 28.4% 44%, rgba(248,183,57,0.05) 44% 44.3%, transparent 44.3%)",
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
