'use client';

import { useEffect, useState } from 'react';
import { testimonials } from '@/data/content';
import SectionHeading from './SectionHeading';

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6500);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section
      id="guests"
      className="relative scroll-mt-24 border-y border-white/[0.06] bg-masala-900/40 py-28 lg:py-40"
    >
      <div className="shell">
        <SectionHeading hi="मेहमान" eyebrow="Our Guests" title="In their" accent="own words" align="center" />

        <div
          className="relative mx-auto mt-16 max-w-3xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 font-display text-[9rem] leading-none text-marigold-400/12"
          >
            &ldquo;
          </span>

          <div className="reveal relative min-h-[19rem] sm:min-h-[16rem]">
            {testimonials.map((t, i) => (
              <figure
                key={t.id}
                aria-hidden={i !== index}
                className={`absolute inset-0 flex flex-col items-center text-center transition-all duration-700 ease-out ${
                  i === index
                    ? 'translate-y-0 opacity-100'
                    : 'pointer-events-none translate-y-4 opacity-0'
                }`}
              >
                <div className="flex gap-1 text-marigold-400" aria-label={`${t.rating} out of 5`}>
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <span key={s}>★</span>
                  ))}
                </div>

                <blockquote className="mt-7 font-display text-2xl font-light italic leading-relaxed text-cream-100 sm:text-3xl">
                  {t.text}
                </blockquote>

                <figcaption className="mt-8">
                  <div className="font-display text-lg text-marigold-300">{t.name}</div>
                  <div className="mt-1 text-[0.65rem] uppercase tracking-brand text-cream-400">
                    {t.role}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-10 flex justify-center gap-3">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Read review from ${t.name}`}
                aria-current={i === index}
                className={`h-px transition-all duration-500 ${
                  i === index ? 'w-12 bg-marigold-400' : 'w-6 bg-cream-400/35 hover:bg-cream-400/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
