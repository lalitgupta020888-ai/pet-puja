'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { categories, menuItems, thalis } from '@/data/menu';
import { site } from '@/data/site';
import { img } from '@/lib/images';
import { formatINR } from '@/lib/order';
import { useCart } from '@/context/CartContext';
import AddToCart from './AddToCart';
import OpenStatus from './OpenStatus';
import { DietMark, Heat } from './DishMarks';
import Wordmark from './Wordmark';

/** Categories minus the "all" pseudo-entry, in menu order. */
const COURSES = categories.filter((c) => c.id !== 'all');

function normalise(s) {
  return s.toLowerCase().normalize('NFKD');
}

/* ------------------------------------------------------------------- cards */

function ThaliCard({ thali }) {
  return (
    <article className="group flex w-[19rem] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-white/[0.07] bg-petrol-800/60">
      <div className="relative h-40 overflow-hidden">
        <Image
          src={img(thali.photo, { w: 640, h: 360, q: 70 })}
          alt={thali.name}
          fill
          sizes="304px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-petrol-950 via-petrol-950/25 to-transparent" />
        <p className="devanagari absolute bottom-3 left-4 text-lg text-saffron-200">{thali.hi}</p>
        <span className="absolute right-3 top-3 rounded-full bg-petrol-950/75 px-3 py-1 text-[0.55rem] uppercase tracking-widest text-saffron-300 backdrop-blur">
          Set of {thali.items.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="flex items-center gap-2 font-display text-xl text-cream-50">
          <DietMark veg={thali.veg} />
          {thali.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-cream-300/65">{thali.note}</p>

        <p className="mt-4 text-xs text-cream-400">
          {thali.items.map((i) => i.name).join(' · ')}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="flex items-baseline gap-2">
            <span className="font-display text-2xl text-saffron-300">
              {formatINR(thali.price)}
            </span>
            <s className="text-xs text-cream-400/70">{formatINR(thali.fullPrice)}</s>
          </span>
          <AddToCart
            item={{
              kind: 'thali',
              id: thali.id,
              name: thali.name,
              price: thali.price,
              photo: thali.photo,
              veg: thali.veg,
            }}
          />
        </div>
      </div>
    </article>
  );
}

function DishCard({ item }) {
  return (
    // min-w-0: without it the grid track stretches to the card's min-content
    // width and the whole page gains a horizontal scroll on narrow phones.
    <article className="group flex min-w-0 gap-4 rounded-2xl border border-white/[0.06] bg-petrol-900/50 p-3 transition-colors duration-300 hover:border-saffron-400/25 sm:flex-col sm:gap-0 sm:p-0">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl sm:h-44 sm:w-full sm:rounded-b-none sm:rounded-t-2xl">
        <Image
          src={img(item.photo, { w: 560, h: 420, q: 68 })}
          alt={item.name}
          fill
          sizes="(min-width: 640px) 340px, 96px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {item.signature && (
          <span className="absolute left-2 top-2 rounded-full bg-petrol-950/75 px-2.5 py-1 text-[0.5rem] uppercase tracking-widest text-saffron-300 backdrop-blur sm:left-3 sm:top-3">
            Signature
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="flex min-w-0 items-center gap-2 font-display text-lg leading-tight text-cream-50 sm:text-xl">
            <DietMark veg={item.veg} />
            <span className="truncate sm:whitespace-normal">{item.name}</span>
            <Heat level={item.heat} />
          </h3>
          <span className="shrink-0 font-display text-lg text-saffron-300 sm:text-xl">
            ₹{item.price}
          </span>
        </div>

        <p className="mt-1.5 line-clamp-2 flex-1 text-[0.82rem] leading-relaxed text-cream-300/60 sm:line-clamp-3">
          {item.description}
        </p>

        <div className="mt-3 sm:mt-4">
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
  );
}

/* -------------------------------------------------------------------- page */

export default function OrderClient() {
  const { table, setTable, count } = useCart();
  const [query, setQuery] = useState('');
  const [course, setCourse] = useState('all');

  // The table number rides in on the QR link. Reading it from the URL directly
  // (rather than useSearchParams) keeps this page statically rendered.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('t') ?? params.get('table');
    if (t) setTable(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const matches = useMemo(() => {
    const q = normalise(query.trim());
    return menuItems.filter((item) => {
      if (course !== 'all' && item.category !== course) return false;
      if (!q) return true;
      return normalise(`${item.name} ${item.description}`).includes(q);
    });
  }, [query, course]);

  const grouped = useMemo(
    () =>
      COURSES.map((c) => ({ ...c, items: matches.filter((i) => i.category === c.id) })).filter(
        (c) => c.items.length
      ),
    [matches]
  );

  const searching = query.trim().length > 0;
  const showThalis = !searching && course === 'all';

  return (
    <div className="min-h-screen pb-32">
      {/* ---------------------------------------------------------- header */}
      <header className="sticky top-0 z-40 border-b border-terracotta-500/25 bg-saffron-400">
        <div className="shell flex h-16 items-center justify-between gap-4">
          <a href="/" className="group flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-petrol-900/35 text-petrol-900 transition-colors group-hover:bg-petrol-900/10">
              <span className="devanagari text-sm">म</span>
            </span>
            <span className="flex flex-col leading-none">
              <span className="devanagari text-[0.6rem] text-petrol-800/80">
                {site.nameDevanagari}
              </span>
              <Wordmark size="sm" tone="band" className="mt-1" />
            </span>
          </a>

          <div className="flex items-center gap-3">
            {table && (
              <span className="inline-flex items-center gap-2 rounded-full border border-petrol-900/35 bg-petrol-900/10 px-3.5 py-1.5 text-[0.6rem] uppercase tracking-widest text-petrol-900">
                Table {table}
              </span>
            )}
            <OpenStatus tone="band" className="hidden sm:inline-flex" />
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------ hero */}
      <section className="relative overflow-hidden border-b border-white/[0.05] py-12 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(248,183,57,0.14),transparent_60%)]" />

        <div className="shell relative">
          <p className="devanagari text-2xl text-saffron-300/85">पूरा मेन्यू</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-light leading-[1.05] tracking-tight text-cream-50 sm:text-5xl">
            The whole kitchen, <span className="italic text-terracotta-300">on your table</span>
          </h1>
          <p className="mt-5 max-w-xl leading-relaxed text-cream-300/70">
            {menuItems.length} dishes and {thalis.length} set thalis. Add what you want, send it
            through, and we start cooking — {site.ordering.prepTime} for most of it.
          </p>

          {/* Search */}
          <div className="relative mt-8 max-w-md">
            <span
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cream-400"
            >
              ⌕
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes — paneer, dosa, biryani, naan…"
              aria-label="Search the menu"
              className="w-full rounded-full border border-white/10 bg-petrol-900/70 py-3.5 pl-10 pr-4 text-cream-100 placeholder:text-cream-400/50 transition-colors focus:border-saffron-400 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- filters */}
      <div className="sticky top-16 z-30 border-b border-white/[0.05] bg-petrol-950/90 py-3 backdrop-blur-xl">
        <div className="shell flex items-center gap-3">
          <div className="no-scrollbar -mx-1 flex min-w-0 flex-1 gap-2 overflow-x-auto px-1">
            {categories.map((cat) => {
              const on = course === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCourse(cat.id)}
                  aria-pressed={on}
                  className={`shrink-0 rounded-full border px-4 py-2 text-[0.65rem] uppercase tracking-widest transition-all duration-300 ${
                    on
                      ? 'border-terracotta-500 bg-terracotta-500 text-cream-50'
                      : 'border-white/10 text-cream-300 hover:border-saffron-400/50 hover:text-saffron-200'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* The kitchen is pure veg, so this states a fact rather than filtering. */}
          <span className="flex shrink-0 items-center gap-2 rounded-full border border-pista-400/60 bg-pista-400/10 px-4 py-2 text-[0.65rem] uppercase tracking-widest text-pista-400">
            <DietMark veg />
            Pure veg
          </span>
        </div>
      </div>

      {/* id matches the layout's skip link. */}
      <main id="menu" className="shell pt-10">
        {/* ---------------------------------------------------------- sets */}
        {showThalis && (
          <section className="mb-14">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="devanagari text-lg text-saffron-300/85">थाली</p>
                <h2 className="mt-1 font-display text-2xl font-light text-cream-50">
                  Set thalis
                </h2>
              </div>
              <p className="text-xs uppercase tracking-widest text-cream-400">
                Cheaper than à la carte
              </p>
            </div>

            <div className="no-scrollbar -mx-6 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
              {thalis.map((t) => (
                <ThaliCard key={t.id} thali={t} />
              ))}
            </div>
          </section>
        )}

        {/* -------------------------------------------------------- dishes */}
        {grouped.length === 0 ? (
          <div className="py-24 text-center">
            <p className="devanagari text-4xl text-saffron-400/25">कुछ नहीं</p>
            <h2 className="mt-6 font-display text-2xl font-light text-cream-50">
              Nothing matches that
            </h2>
            <p className="mx-auto mt-3 max-w-xs leading-relaxed text-cream-300/65">
              Try a shorter word, or clear the filters and browse the whole board.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setCourse('all');
              }}
              className="btn-ghost mt-8"
            >
              Clear filters
            </button>
          </div>
        ) : (
          grouped.map((group) => (
            <section key={group.id} className="mb-14 scroll-mt-32" id={`course-${group.id}`}>
              <div className="flex items-baseline gap-4">
                <h2 className="font-display text-2xl font-light text-cream-50">{group.name}</h2>
                <span aria-hidden className="h-px flex-1 bg-white/[0.07]" />
                <span className="text-[0.62rem] uppercase tracking-widest text-cream-400">
                  {group.note}
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <DishCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))
        )}

        {/* --------------------------------------------------------- notes */}
        <section className="surface mt-4 p-7">
          <p className="text-[0.62rem] uppercase tracking-brand text-saffron-400">
            Before you order
          </p>
          <ul className="mt-5 space-y-3 text-sm leading-relaxed text-cream-300/70">
            <li>
              Breads leave the tandoor only once you have ordered them — give the kitchen a
              moment.
            </li>
            <li>
              Allergies or a dietary need? Put it in the note at checkout; most dishes can be
              adjusted.
            </li>
            <li>
              Delivery starts at {formatINR(site.ordering.minDelivery)} and runs{' '}
              {site.ordering.deliveryRadius} from the kitchen. Free above{' '}
              {formatINR(site.ordering.freeDeliveryAbove)}.
            </li>
            <li>Prices in rupees. Taxes as applicable.</li>
          </ul>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href={site.phoneHref} className="btn-ghost">
              Call {site.phone}
            </a>
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              WhatsApp
            </a>
            <a href="/" className="btn-ghost">
              Back to the site
            </a>
          </div>
        </section>

        <p className="mt-10 text-center text-xs text-cream-400">
          {site.addressLine} · {site.hours}
          {count > 0 && ' · your order is held on this device'}
        </p>
      </main>
    </div>
  );
}
