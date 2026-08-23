import Image from 'next/image';
import { img } from '@/lib/images';
import { site, accolades } from '@/data/site';
import OpenStatus from './OpenStatus';

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={img('photo-1627366422957-3efa9c6df0fc', { w: 2000, q: 70 })}
          alt=""
          fill
          priority
          sizes="100vw"
          className="animate-ken-burns object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/70 to-wine-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,184,106,0.20),transparent_62%)]" />
      </div>

      {/* Slow-turning rangoli rings behind the wordmark. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[130vmin] w-[130vmin] -translate-x-1/2 -translate-y-1/2 animate-spin-slow bg-rings opacity-70"
      />
      <div className="grain absolute inset-0" />

      <div className="shell relative flex min-h-[100svh] flex-col justify-center pb-16 pt-36">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-4">
            <p className="eyebrow">Since {site.established} · Pure Veg · North Indian</p>
            <OpenStatus />
          </div>

          <p className="devanagari mt-9 text-3xl text-gold-300/90 sm:text-4xl">
            {site.nameDevanagari}
          </p>

          <h1 className="mt-4 font-display text-[3.25rem] font-light leading-[0.95] tracking-tight text-cream-50 sm:text-7xl lg:text-[5.5rem]">
            Every meal,
            <br />
            a small <span className="italic text-gold-300">ceremony</span>.
          </h1>

          <p className="mt-9 max-w-xl text-lg leading-relaxed text-cream-300/85">
            {site.description}
          </p>

          <div className="mt-11 flex flex-col gap-4 sm:flex-row">
            <a href="#menu" className="btn-primary">
              Order now
            </a>
            <a href="#thali" className="btn-ghost">
              See the thalis
            </a>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.05] lg:grid-cols-4">
          {accolades.map((a) => (
            <div key={a.label} className="bg-wine-950/60 px-6 py-7 backdrop-blur-sm">
              <div className="font-display text-4xl font-light text-gold-300">{a.value}</div>
              <div className="mt-2 text-[0.68rem] uppercase tracking-widest text-cream-400">
                {a.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block">
        <div className="h-14 w-px animate-shimmer bg-gradient-to-b from-transparent via-gold-400/60 to-transparent" />
      </div>
    </section>
  );
}
