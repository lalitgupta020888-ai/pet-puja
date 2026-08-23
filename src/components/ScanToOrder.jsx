'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { site } from '@/data/site';
import { menuItems, thalis } from '@/data/menu';
import { downloadCardPNG } from '@/lib/qrCanvas';
import SectionHeading from './SectionHeading';
import QRCard from './QRCard';

const STEPS = [
  {
    hi: 'कैमरा उठाइए',
    title: 'Point your camera',
    body: 'No app to install, nothing to type. The card opens the menu straight in your browser.',
  },
  {
    hi: 'थाली सजाइए',
    title: 'Build your thali',
    body: `All ${menuItems.length} dishes and ${thalis.length} set thalis — photographed, priced, filtered by veg and by course.`,
  },
  {
    hi: 'रसोई तक',
    title: 'Send it to the kitchen',
    body: 'Your order arrives on our WhatsApp with your table number. We call back to confirm, then it goes on the fire.',
  },
];

export default function ScanToOrder() {
  const [table, setTable] = useState('');
  // The card is printed from a real deployment, but during development the code
  // should point at whatever host you are actually browsing.
  const [origin, setOrigin] = useState(site.url);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
    setMounted(true);
  }, []);

  const url = useMemo(() => {
    const clean = table.replace(/[^0-9a-zA-Z-]/g, '').slice(0, 8);
    // `t` rather than `table`: four characters shorter keeps the code at a lower
    // version, which means fatter modules and an easier scan.
    return `${origin}/order${clean ? `?t=${encodeURIComponent(clean)}` : ''}`;
  }, [origin, table]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Clipboard is blocked on insecure origins — the link is on screen anyway.
    }
  };

  const download = async () => {
    setBusy(true);
    try {
      await downloadCardPNG({ url, table });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="scan" className="relative scroll-mt-24 overflow-hidden py-28 lg:py-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(217,184,106,0.12),transparent_58%)]" />
      <div className="pointer-events-none absolute inset-0 bg-rings opacity-70" />

      <div className="shell relative grid items-start gap-14 lg:grid-cols-[1fr_28rem] lg:gap-20">
        {/* ------------------------------------------------------------ copy */}
        <div>
          <SectionHeading
            hi="स्कैन कीजिए"
            eyebrow="Scan & Order"
            title="One code,"
            accent="the whole kitchen"
            lead="Every table carries this card. Scan it and the full menu opens on your phone — order from your seat, or from the queue outside, without waiting for anyone to come to you."
          />

          <ol className="mt-12 space-y-7">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="reveal flex gap-5"
                style={{ '--reveal-delay': `${i * 90}ms` }}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-400/35 font-display text-lg text-gold-300">
                  {i + 1}
                </span>
                <div>
                  <p className="devanagari text-sm text-gold-400/80">{step.hi}</p>
                  <h3 className="mt-1.5 font-display text-2xl font-light text-cream-50">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-md leading-relaxed text-cream-300/70">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="reveal mt-12 flex flex-wrap items-center gap-4">
            <a href={url} className="btn-primary">
              Open the menu
            </a>
            <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-ghost">
              Order on WhatsApp
            </a>
          </div>

          {/* --------------------------------------------------- controls */}
          <div className="surface mt-12 p-6">
            <p className="text-[0.62rem] uppercase tracking-brand text-gold-400">
              Print a card
            </p>

            <label className="mt-5 block">
              <span className="mb-2 block text-[0.65rem] uppercase tracking-widest text-cream-400">
                Table number <span className="normal-case tracking-normal">(optional)</span>
              </span>
              <div className="flex gap-2">
                <input
                  value={table}
                  onChange={(e) => setTable(e.target.value.replace(/[^0-9a-zA-Z-]/g, '').slice(0, 8))}
                  inputMode="numeric"
                  placeholder="e.g. 7"
                  aria-describedby="table-help"
                  className="w-full rounded-xl border border-white/10 bg-wine-950/60 px-4 py-3 text-cream-100 placeholder:text-cream-400/40 transition-colors focus:border-gold-400 focus:outline-none"
                />
                {table && (
                  <button
                    type="button"
                    onClick={() => setTable('')}
                    className="shrink-0 rounded-xl border border-white/10 px-4 text-[0.65rem] uppercase tracking-widest text-cream-300 transition-colors hover:border-gold-400/60 hover:text-gold-300"
                  >
                    Clear
                  </button>
                )}
              </div>
              <span id="table-help" className="mt-2 block text-xs leading-relaxed text-cream-400">
                Give each table its own card and the order reaches us already knowing where
                to bring the tray.
              </span>
            </label>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => window.print()} className="btn-ghost w-full">
                Print card
              </button>
              <button
                type="button"
                onClick={download}
                disabled={busy}
                className="btn-primary w-full disabled:cursor-wait disabled:opacity-60"
              >
                {busy ? 'Rendering…' : 'Download PNG'}
              </button>
            </div>

            <button
              type="button"
              onClick={copy}
              className="mt-4 flex w-full items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-wine-950/50 px-4 py-3 text-left transition-colors hover:border-gold-400/40"
            >
              <span className="min-w-0 truncate font-mono text-xs text-cream-300/80">{url}</span>
              <span className="shrink-0 text-[0.6rem] uppercase tracking-widest text-gold-300">
                {copied ? 'Copied' : 'Copy'}
              </span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------ card */}
        {/* On a phone the card leads; on desktop it holds the right column. */}
        <div className="order-first w-full lg:order-none lg:sticky lg:top-28">
          <QRCard url={url} table={table} />
        </div>
      </div>

      {/* The copy that actually goes on paper — see the print rules in globals.css. */}
      {mounted &&
        createPortal(
          <div className="qr-print-portal" aria-hidden>
            <QRCard url={url} table={table} />
          </div>,
          document.body
        )}
    </section>
  );
}
