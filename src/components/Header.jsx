'use client';

import { useEffect, useState } from 'react';
import { navLinks, site } from '@/data/site';
import OpenStatus from './OpenStatus';
import Wordmark from './Wordmark';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? 'border-b border-white/[0.07] bg-forest-950/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="shell">
        <div
          className={`flex items-center justify-between transition-all duration-500 ${
            scrolled ? 'h-[4.5rem]' : 'h-24'
          }`}
        >
          {/* Wordmark: Devanagari sits above the latin, as on a shopfront board. */}
          <a href="#top" className="group flex items-center gap-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-400/40 text-gold-300 transition-colors duration-500 group-hover:border-gold-300 group-hover:bg-gold-400/10">
              <span className="devanagari text-lg">म</span>
            </span>
            <span className="flex flex-col leading-none">
              <span className="devanagari text-[0.68rem] text-gold-400/85">
                {site.nameDevanagari}
              </span>
              <Wordmark size="md" className="mt-1.5" />
            </span>
          </a>

          <nav className="hidden items-center gap-9 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative flex flex-col items-center gap-0.5"
              >
                <span className="devanagari text-[0.6rem] text-gold-400/0 transition-colors duration-300 group-hover:text-gold-400/80">
                  {link.hi}
                </span>
                <span className="text-[0.72rem] font-medium uppercase tracking-widest text-cream-300 transition-colors group-hover:text-gold-200">
                  {link.label}
                </span>
                <span className="absolute -bottom-1.5 h-px w-0 bg-gold-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <OpenStatus />
            <a href={site.phoneHref} className="btn-primary">
              Book a table
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/30 text-cream-100 lg:hidden"
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 block h-px w-5 bg-current transition-all duration-300 ${
                  open ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 top-3 block h-px w-5 bg-current transition-all duration-300 ${
                  open ? '-translate-y-1.5 -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-white/[0.06] transition-[max-height,opacity] duration-500 lg:hidden ${
          open ? 'max-h-[85vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="shell flex flex-col py-8">
          <OpenStatus className="mb-6 self-start" />
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex items-baseline justify-between border-b border-white/[0.05] py-4 transition-colors hover:text-gold-200"
            >
              <span className="font-display text-3xl font-light text-cream-100">{link.label}</span>
              <span className="devanagari text-sm text-gold-400/70">{link.hi}</span>
            </a>
          ))}
          <a href={site.phoneHref} className="btn-primary mt-8 w-full">
            Call {site.phone}
          </a>
        </nav>
      </div>
    </header>
  );
}
