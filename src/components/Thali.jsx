'use client';

import { useState } from 'react';
import Image from 'next/image';
import { thalis } from '@/data/menu';
import { img } from '@/lib/images';
import SectionHeading from './SectionHeading';
import AddToCart from './AddToCart';

export default function Thali() {
  const [active, setActive] = useState(thalis[0].id);
  const thali = thalis.find((t) => t.id === active);
  const saving = thali.fullPrice - thali.price;

  return (
    <section
      id="thali"
      className="relative scroll-mt-24 border-y border-white/[0.06] bg-petrol-900/40 py-28 lg:py-40"
    >
      <div className="shell">
        <SectionHeading
          hi="थाली"
          eyebrow="The Thali"
          title="One tray,"
          accent="the whole ritual"
          lead="A thali is not a discount — it is how we would feed you if you sat at our own table. Pick a plate and see exactly what lands on it."
          align="center"
        />

        {/* Plate selector */}
        <div className="reveal mt-14 flex flex-wrap justify-center gap-2 sm:gap-3">
          {thalis.map((t) => {
            const on = t.id === active;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActive(t.id)}
                aria-pressed={on}
                className={`flex items-center gap-3 rounded-full border px-6 py-3 transition-all duration-300 ${
                  on
                    ? 'border-terracotta-500 bg-terracotta-500 text-cream-50'
                    : 'border-white/10 text-cream-300 hover:border-saffron-400/50 hover:text-saffron-200'
                }`}
              >
                <span className="text-[0.7rem] uppercase tracking-widest">{t.name}</span>
                <span
                  className={`devanagari text-xs ${on ? 'text-petrol-900/70' : 'text-saffron-400/70'}`}
                >
                  {t.hi}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* The plate */}
          <div className="reveal relative mx-auto w-full max-w-md">
            <div className="relative aspect-square overflow-hidden rounded-full border border-saffron-400/25 shadow-[0_40px_120px_-40px_rgba(248,183,57,0.5)]">
              <Image
                key={thali.photo}
                src={img(thali.photo, { w: 900, h: 900 })}
                alt={thali.name}
                fill
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-petrol-950/70 via-transparent to-transparent" />
            </div>

            {/* Steam */}
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-2 flex justify-center gap-6">
              {[0, 1, 2].map((n) => (
                <span
                  key={n}
                  className="h-10 w-px animate-steam bg-gradient-to-t from-cream-100/50 to-transparent"
                  style={{ animationDelay: `${n * 1.1}s` }}
                />
              ))}
            </div>

            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-saffron-400/30 bg-petrol-950/90 px-7 py-3 backdrop-blur">
              <span className="font-display text-3xl text-saffron-300">₹{thali.price}</span>
            </div>
          </div>

          {/* What is on it */}
          <div className="reveal">
            <div className="flex items-baseline gap-4">
              <h3 className="font-display text-4xl font-light text-cream-50">{thali.name}</h3>
              <span
                className={`rounded-full border px-3 py-1 text-[0.6rem] uppercase tracking-widest ${
                  thali.veg
                    ? 'border-pista-400/40 text-pista-400'
                    : 'border-vermilion-400/40 text-vermilion-300'
                }`}
              >
                {thali.veg ? 'Veg' : 'Non-veg'}
              </span>
            </div>

            <p className="mt-4 leading-relaxed text-cream-300/70">{thali.note}</p>

            <ul className="mt-9 space-y-px overflow-hidden rounded-2xl border border-white/[0.07]">
              {thali.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-baseline gap-3 bg-petrol-950/60 px-5 py-4"
                >
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                      item.veg ? 'bg-pista-400' : 'bg-vermilion-400'
                    }`}
                  />
                  <span className="font-display text-lg text-cream-100">{item.name}</span>
                  <span
                    aria-hidden
                    className="min-w-6 flex-1 translate-y-[-0.15rem] border-b border-dotted border-cream-400/20"
                  />
                  <span className="text-sm text-cream-400">₹{item.price}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <span className="text-cream-400">
                À la carte{' '}
                <span className="text-cream-300/70 line-through">₹{thali.fullPrice}</span>
              </span>
              <span className="text-saffron-300">You save ₹{saving} on the set</span>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="sm:w-56">
                <AddToCart
                  variant="full"
                  label={`Add thali · ₹${thali.price}`}
                  item={{
                    kind: 'thali',
                    id: thali.id,
                    name: `${thali.name} (set)`,
                    price: thali.price,
                    photo: thali.photo,
                    veg: thali.veg,
                  }}
                />
              </div>
              <a href="#visit" className="btn-ghost">
                Book a table instead
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
