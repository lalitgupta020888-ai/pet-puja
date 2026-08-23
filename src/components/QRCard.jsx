import { site } from '@/data/site';
import QRCode from './QRCode';
import Wordmark from './Wordmark';

/**
 * The printed table card. Designed to be read at arm's length on a table, so
 * everything above the code is identity and everything below it is instruction.
 *
 * Kept purely presentational — the section around it owns the table number and
 * the print/download controls.
 */
export default function QRCard({ url, table = '', className = '' }) {
  return (
    <figure
      className={`qr-print-card relative isolate mx-auto w-full max-w-[28rem] overflow-hidden rounded-[2rem] bg-cream-50 px-7 pb-9 pt-10 text-center shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)] sm:px-9 ${className}`}
      style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}
    >
      {/* Gold foil edge: a heavy rule with a hairline shadowing it inside. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[0.55rem] rounded-[1.6rem] border border-saffron-500/45"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[0.95rem] rounded-[1.35rem] border border-saffron-500/20"
      />
      {/* A warm bloom behind the code so the cream does not read as flat paper. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(248,183,57,0.16),transparent_62%)]"
      />

      <div className="relative">
        {/* ------------------------------------------------------- identity */}
        <p className="devanagari text-sm tracking-wide text-saffron-600/80">
          {site.nameDevanagari}
        </p>
        <Wordmark size="xl" tone="print" align="center" className="mt-2" />
        <p className="mt-3 text-[0.58rem] font-medium uppercase tracking-brand text-petrol-600">
          Est. {site.established}
        </p>

        {/* ----------------------------------------------------------- code */}
        <div className="mt-6 inline-block rounded-3xl border border-saffron-500/25 bg-white p-3 shadow-[0_18px_40px_-24px_rgba(7,41,53,0.55)]">
          <QRCode
            value={url}
            size={352}
            quiet={2}
            dark="#0E3D4F"
            accent="#C1552F"
            background="#FFFFFF"
            logoBackground="#FFFFFF"
            title={`Scan to open the Madhurima Food Park menu${table ? ` — table ${table}` : ''}`}
            className="block h-auto w-full max-w-[22rem]"
          />
        </div>

        {/* --------------------------------------------------- instruction */}
        <p className="mt-6 font-display text-2xl font-light leading-tight text-petrol-900">
          Scan for the menu
        </p>
        <p className="devanagari mt-1.5 text-base text-saffron-600/85">
          मेन्यू के लिए स्कैन कीजिए
        </p>
        <p className="mx-auto mt-3 max-w-[17rem] text-[0.82rem] leading-relaxed text-petrol-600">
          Point your camera at the code. The whole kitchen opens on your phone — order
          without waiting for anyone.
        </p>

        {table && (
          <p className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-saffron-500/40 bg-saffron-400/15 px-5 py-2">
            <span className="devanagari text-sm text-saffron-600">मेज़</span>
            <span className="text-[0.62rem] font-semibold uppercase tracking-widest text-petrol-700">
              Table
            </span>
            <span className="font-display text-lg font-semibold leading-none text-petrol-900">
              {table}
            </span>
          </p>
        )}

        {/* -------------------------------------------------------- footer */}
        <div aria-hidden className="mt-7 h-px w-full bg-saffron-500/20" />
        <p className="mt-4 font-display text-sm italic text-petrol-600">{site.tagline}</p>
        <p className="mt-2.5 text-[0.6rem] uppercase tracking-widest text-petrol-500">
          {site.phone} · {site.hours.replace('Every day · ', '')}
        </p>
        <p className="mt-1.5 text-[0.6rem] uppercase tracking-brand text-saffron-600">
          {site.url.replace('https://', '')}
        </p>
      </div>
    </figure>
  );
}
