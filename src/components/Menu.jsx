'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { categories, menuItems } from '@/data/menu';
import { img } from '@/lib/images';
import SectionHeading from './SectionHeading';
import AddToCart from './AddToCart';
import { DietMark, Heat } from './DishMarks';

export default function Menu() {
  const [active, setActive] = useState('all');

  const items = useMemo(
    () => (active === 'all' ? menuItems : menuItems.filter((i) => i.category === active)),
    [active]
  );

  return (
    <section id="menu" className="relative scroll-mt-24 py-28 lg:py-40">
      {/* Warm wash behind the menu so it reads as its own room. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(192,88,0,0.10),transparent_55%)]" />

      <div className="shell relative">
        <SectionHeading
          hi="व्यंजन"
          eyebrow="The Menu"
          title="Everything is cooked"
          accent="to order"
          lead="Prices in rupees. Breads leave the tandoor only once you have ordered them, so give the kitchen a moment."
          align="center"
        />

        {/* Category filter */}
        <div className="reveal mt-14 flex flex-wrap justify-center gap-2 sm:gap-3">
          {categories.map((cat) => {
            const on = active === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActive(cat.id)}
                aria-pressed={on}
                className={`group rounded-full border px-5 py-3 text-[0.7rem] uppercase tracking-widest transition-all duration-300 ${
                  on
                    ? 'border-ember-500 bg-ember-500 text-cream-50'
                    : 'border-white/10 text-cream-300 hover:border-ember-400/50 hover:text-ember-200'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Two-column bill of fare with dotted leaders. */}
        <div className="mt-16 grid gap-x-16 gap-y-2 lg:grid-cols-2">
          {items.map((item, i) => (
            <article
              key={item.id}
              className="reveal group flex items-center gap-5 rounded-2xl px-4 py-5 transition-colors duration-300 hover:bg-white/[0.035]"
              style={{ '--reveal-delay': `${Math.min(i, 8) * 55}ms` }}
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/[0.08]">
                <Image
                  src={img(item.photo, { w: 200, h: 200, q: 65 })}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-3">
                  <h3 className="flex items-center gap-2 font-display text-xl font-normal text-cream-50">
                    <DietMark veg={item.veg} />
                    {item.name}
                    <Heat level={item.heat} />
                  </h3>

                  {/* The leader line that makes a menu read like a menu. */}
                  <span
                    aria-hidden
                    className="min-w-6 flex-1 translate-y-[-0.15rem] border-b border-dotted border-cream-400/25"
                  />

                  <span className="shrink-0 font-display text-xl text-ember-300">
                    ₹{item.price}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-cream-300/65">
                  {item.description}
                </p>

                <div className="mt-3">
                  <AddToCart
                    item={{
                      kind: 'dish',
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      photo: item.photo,
                      veg: item.veg,
                    }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="reveal mt-16 text-center text-sm text-cream-400">
          Allergies or a dietary need? Tell us when you order — most dishes can be adjusted.
        </p>
      </div>
    </section>
  );
}
