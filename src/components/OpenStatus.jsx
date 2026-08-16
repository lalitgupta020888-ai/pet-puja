'use client';

import { useEffect, useState } from 'react';
import { site } from '@/data/site';

/**
 * Live "open now" chip. Rendered only after mount — the answer depends on the
 * viewer's clock, so server and client markup would otherwise disagree.
 */
export default function OpenStatus({ className = '' }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    const read = () => {
      const now = new Date();
      const hour = now.getHours() + now.getMinutes() / 60;
      const open = hour >= site.opensAt && hour < site.closesAt;
      setState({
        open,
        label: open
          ? `Open now · till ${site.closesAt - 12}pm`
          : `Closed · opens ${site.opensAt}am`,
      });
    };
    read();
    const id = setInterval(read, 60_000);
    return () => clearInterval(id);
  }, []);

  if (!state) return null;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.62rem] uppercase tracking-widest ${
        state.open
          ? 'border-pista-400/40 text-pista-400'
          : 'border-cream-400/30 text-cream-400'
      } ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {state.open && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pista-400 opacity-70" />
        )}
        <span
          className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
            state.open ? 'bg-pista-400' : 'bg-cream-400'
          }`}
        />
      </span>
      {state.label}
    </span>
  );
}
