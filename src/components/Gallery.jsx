'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { gallery } from '@/data/content';
import { img } from '@/lib/images';
import SectionHeading from './SectionHeading';

const spanClass = {
  tall: 'row-span-2 aspect-[3/4] sm:aspect-auto',
  wide: 'sm:col-span-2 aspect-[4/3] sm:aspect-[16/9]',
};

export default function Gallery() {
  const [index, setIndex] = useState(null);
  const isOpen = index !== null;

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (delta) => setIndex((i) => (i === null ? i : (i + delta + gallery.length) % gallery.length)),
    []
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, close, step]);

  const current = isOpen ? gallery[index] : null;

  return (
    <section id="gallery" className="scroll-mt-24 py-28 lg:py-40">
      <div className="shell">
        <SectionHeading
          hi="झलक"
          eyebrow="The Room & The Fire"
          title="A look inside"
          accent="the kitchen"
          align="center"
        />

        <div className="mt-16 grid auto-rows-[220px] grid-cols-2 gap-4 sm:auto-rows-[240px] lg:grid-cols-4">
          {gallery.map((shot, i) => (
            <button
              key={shot.photo}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`View: ${shot.alt}`}
              className={`reveal group relative overflow-hidden rounded-2xl border border-white/[0.07] ${
                spanClass[shot.span] ?? ''
              }`}
              style={{ '--reveal-delay': `${i * 70}ms` }}
            >
              <Image
                src={img(shot.photo, { w: 800, q: 68 })}
                alt={shot.alt}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-wine-950/25 transition-colors duration-500 group-hover:bg-wine-950/0" />
              <div className="absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-wine-950/90 to-transparent p-4 text-left opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="text-xs uppercase tracking-widest text-cream-200">{shot.alt}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-wine-950/95 p-4 backdrop-blur-md sm:p-8"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-2xl leading-none text-cream-100 transition-colors hover:border-gold-400 hover:text-gold-300"
          >
            ×
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Previous image"
            className="absolute left-3 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-cream-100 transition-colors hover:border-gold-400 hover:text-gold-300 sm:left-8"
          >
            ‹
          </button>

          <figure
            className="relative max-h-[86vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl">
              <Image
                src={img(current.photo, { w: 1600, q: 80 })}
                alt={current.alt}
                fill
                sizes="90vw"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-4 text-center text-sm uppercase tracking-widest text-cream-400">
              {current.alt} — {index + 1} / {gallery.length}
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Next image"
            className="absolute right-3 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-cream-100 transition-colors hover:border-gold-400 hover:text-gold-300 sm:right-8"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
