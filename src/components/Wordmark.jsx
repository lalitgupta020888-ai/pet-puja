import { site } from '@/data/site';

/**
 * The house wordmark, defined once so the header, footer, order page and the
 * printed QR card all lock up identically.
 *
 * The name carries the weight; everything after the first word drops to a
 * tracked-out sub-line under a gold hairline, the way a shopfront board sets a
 * house name above its trade. Both halves come from `site.name`, so renaming the
 * restaurant there renames it everywhere.
 */
const [HOUSE, ...REST] = site.name.split(' ');
const TRADE = REST.join(' ');

const SIZES = {
  sm: { name: 'text-lg', sub: 'text-[0.4rem]', gap: 'mt-1', rule: 'w-3' },
  md: { name: 'text-2xl', sub: 'text-[0.46rem]', gap: 'mt-1.5', rule: 'w-4' },
  lg: { name: 'text-3xl', sub: 'text-[0.55rem]', gap: 'mt-2', rule: 'w-5' },
  xl: { name: 'text-[2.6rem]', sub: 'text-[0.62rem]', gap: 'mt-2.5', rule: 'w-8' },
};

const TONES = {
  // On the dark room-lit pages.
  dark: {
    name: 'text-cream-50',
    sub: 'text-marigold-300',
    flank: 'via-marigold-300/55',
    trail: 'from-marigold-300/55',
  },
  // On the cream paper of the printed card.
  print: {
    name: 'text-masala-900',
    sub: 'text-marigold-600',
    flank: 'via-marigold-500/60',
    trail: 'from-marigold-500/60',
  },
};

export default function Wordmark({ size = 'md', tone = 'dark', align = 'left', className = '' }) {
  const s = SIZES[size] ?? SIZES.md;
  const t = TONES[tone] ?? TONES.dark;
  const centred = align === 'center';
  // Centred, the hairline fades in from both ends; left-aligned, a single rule
  // leaves the text solid and runs out to the width the name sets.
  const flank = `h-px ${s.rule} shrink-0 bg-gradient-to-r from-transparent ${t.flank} to-transparent`;
  const trail = `h-px flex-1 bg-gradient-to-r ${t.trail} to-transparent`;

  return (
    <span
      className={`flex flex-col leading-none ${centred ? 'items-center' : 'items-start'} ${className}`}
    >
      <span className={`font-display ${s.name} font-semibold tracking-tight ${t.name}`}>
        {HOUSE}
      </span>

      {TRADE && (
        <span
          className={`${s.gap} flex w-full items-center gap-2 ${centred ? 'justify-center' : ''}`}
        >
          {centred && <span aria-hidden className={flank} />}
          <span className={`${s.sub} whitespace-nowrap font-medium uppercase tracking-brand ${t.sub}`}>
            {TRADE}
          </span>
          <span aria-hidden className={centred ? flank : trail} />
        </span>
      )}
    </span>
  );
}
