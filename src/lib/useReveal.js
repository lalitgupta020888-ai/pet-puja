'use client';

import { useEffect } from 'react';

/**
 * Adds `is-visible` to every `.reveal` element once it scrolls into view.
 *
 * One observer for the whole page rather than one per component. A
 * MutationObserver re-scans on DOM changes, because sections like the menu
 * filter and the thali switcher mount fresh `.reveal` nodes after first paint —
 * without this they would keep their starting opacity of 0 forever.
 */
export function useReveal() {
  useEffect(() => {
    const showAll = () =>
      document
        .querySelectorAll('.reveal:not(.is-visible)')
        .forEach((n) => n.classList.add('is-visible'));

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // No IntersectionObserver, or the viewer asked for no motion: just show it.
    if (reduced || typeof IntersectionObserver === 'undefined') {
      showAll();
      const mo = new MutationObserver(showAll);
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    );

    // Re-observing an element already being observed is a no-op, so this is
    // safe to call as often as the DOM changes.
    const observeAll = () =>
      document.querySelectorAll('.reveal:not(.is-visible)').forEach((n) => io.observe(n));

    observeAll();

    let queued = 0;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = requestAnimationFrame(() => {
        queued = 0;
        observeAll();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (queued) cancelAnimationFrame(queued);
      mo.disconnect();
      io.disconnect();
    };
  }, []);
}
