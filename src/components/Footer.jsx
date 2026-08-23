import { navLinks, site } from '@/data/site';
import Wordmark from './Wordmark';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.07] bg-forest-950 pt-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />

      <div className="shell">
        <div className="grid gap-12 pb-16 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="devanagari text-2xl text-gold-300/85">{site.nameDevanagari}</p>
            <Wordmark size="lg" className="mt-3" />
            <p className="mt-5 max-w-sm leading-relaxed text-cream-300/65">
              {site.tagline} A roadside kitchen that never learned to cut corners — feeding
              this town since {site.established}.
            </p>
            <a href={site.phoneHref} className="btn-primary mt-8">
              Book a table
            </a>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-[0.65rem] uppercase tracking-brand text-gold-400">Explore</h2>
            <ul className="mt-6 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-cream-300/75 transition-colors hover:text-gold-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[0.65rem] uppercase tracking-brand text-gold-400">Find us</h2>
            <address className="mt-6 space-y-3 not-italic text-cream-300/75">
              <p>{site.addressLine}</p>
              <p>
                <a href={site.phoneHref} className="transition-colors hover:text-gold-300">
                  {site.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${site.email}`}
                  className="transition-colors hover:text-gold-300"
                >
                  {site.email}
                </a>
              </p>
              <p className="text-cream-400">{site.hours}</p>
            </address>

            <ul className="mt-7 flex gap-3">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 items-center rounded-full border border-white/10 px-4 text-[0.62rem] uppercase tracking-widest text-cream-300 transition-colors hover:border-gold-400/60 hover:text-gold-300"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rule" />

        <div className="flex flex-col items-center justify-between gap-4 py-8 text-xs text-cream-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p className="uppercase tracking-widest">
            Est. {site.established} · Open every day
          </p>
        </div>
      </div>
    </footer>
  );
}
