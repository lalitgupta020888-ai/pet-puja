import { marqueeWords } from '@/data/content';

// Devanagari entries get the Hindi face; latin entries stay on the display serif.
const isDevanagari = (word) => /[ऀ-ॿ]/.test(word);

export default function Marquee() {
  const run = [...marqueeWords, ...marqueeWords];

  return (
    <div className="border-y border-white/[0.06] bg-bark-900/60 py-6">
      <div className="mask-fade-x overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
          {run.map((word, i) => (
            <span key={i} className="flex items-center gap-10">
              <span
                className={
                  isDevanagari(word)
                    ? 'devanagari text-xl text-ember-300/85'
                    : 'font-display text-xl font-light italic text-cream-200/70'
                }
              >
                {word}
              </span>
              <span aria-hidden className="text-ember-400/60">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
