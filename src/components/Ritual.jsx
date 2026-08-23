import { ritual } from '@/data/content';
import SectionHeading from './SectionHeading';

export default function Ritual() {
  return (
    <section className="relative py-28 lg:py-36">
      <div className="shell">
        <SectionHeading
          hi="विधि"
          eyebrow="How it is done"
          title="Four steps we have never"
          accent="found a way around"
          align="center"
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.05] sm:grid-cols-2 lg:grid-cols-4">
          {ritual.map((step, i) => (
            <div
              key={step.title}
              className="reveal group relative bg-forest-950 px-7 py-10 transition-colors duration-500 hover:bg-forest-900"
              style={{ '--reveal-delay': `${i * 90}ms` }}
            >
              <span className="font-display text-sm text-gold-400/50">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="devanagari mt-5 text-2xl text-gold-300">{step.hi}</p>
              <h3 className="mt-3 font-display text-xl font-normal text-cream-50">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-cream-300/65">{step.text}</p>

              <span className="absolute inset-x-7 bottom-0 h-px w-0 bg-gold-400/60 transition-all duration-500 group-hover:w-[calc(100%-3.5rem)]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
