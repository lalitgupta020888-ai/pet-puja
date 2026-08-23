import Image from 'next/image';
import { story } from '@/data/content';
import { img } from '@/lib/images';
import SectionHeading from './SectionHeading';

export default function Story() {
  return (
    <section id="story" className="relative scroll-mt-24 border-y border-white/[0.06] bg-bark-900/40 py-28 lg:py-40">
      <div className="shell">
        <div className="grid items-start gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          {/* Stacked photographs */}
          <div className="reveal relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/[0.07]">
              <Image
                src={img('photo-1509358271058-acd22cc93898', { w: 900, h: 1125 })}
                alt="Spices measured out before the morning grind"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bark-950/60 to-transparent" />
            </div>

            <div className="absolute -bottom-10 -right-6 hidden aspect-square w-48 overflow-hidden rounded-2xl border border-ember-400/25 shadow-2xl sm:block lg:-right-12 lg:w-60">
              <Image
                src={img('photo-1697155406014-04dc649b0953', { w: 500, h: 500 })}
                alt="Naan lifted from the tandoor wall"
                fill
                sizes="240px"
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <SectionHeading
              hi="कहानी"
              eyebrow="Our Story"
              title="One tandoor, lit in 1978,"
              accent="never let to go cold"
              lead="Three things have never changed here: we grind our own spices, we cook to order, and we do not rush a pot that needs the night."
            />

            <ol className="mt-14 space-y-10">
              {story.map((chapter, i) => (
                <li
                  key={chapter.year}
                  className="reveal relative border-l border-ember-400/20 pl-8"
                  style={{ '--reveal-delay': `${i * 120}ms` }}
                >
                  <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-ember-400" />
                  <div className="flex items-baseline gap-3">
                    <p className="text-[0.68rem] uppercase tracking-brand text-ember-400">
                      {chapter.year}
                    </p>
                    <span className="devanagari text-sm text-cream-400">{chapter.hi}</span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-light text-cream-50">
                    {chapter.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-cream-300/70">{chapter.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
