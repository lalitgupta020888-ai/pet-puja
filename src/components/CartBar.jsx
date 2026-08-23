'use client';

import { useCart } from '@/context/CartContext';
import { computeTotals, formatINR } from '@/lib/order';

export default function CartBar() {
  const { items, count, openCart, open } = useCart();

  // Nothing to show until there is something to order.
  if (!count || open) return null;

  const { subtotal } = computeTotals(items, 'takeaway');

  return (
    <>
      {/* Mobile: full-width bar within thumb reach. */}
      <div className="fixed inset-x-0 bottom-0 z-40 p-4 sm:hidden">
        <button
          type="button"
          onClick={openCart}
          className="flex w-full items-center justify-between gap-4 rounded-2xl bg-ember-500 px-5 py-4 text-cream-50 shadow-[0_18px_50px_-12px_rgba(192,88,0,0.7)]"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-bark-950/15 text-xs font-bold tabular-nums">
              {count}
            </span>
            <span className="text-[0.7rem] font-semibold uppercase tracking-widest">
              View order
            </span>
          </span>
          <span className="font-display text-xl font-semibold">{formatINR(subtotal)}</span>
        </button>
      </div>

      {/* Desktop: a pill that sits above the back-to-top control. */}
      <button
        type="button"
        onClick={openCart}
        className="fixed bottom-24 right-7 z-40 hidden items-center gap-3 rounded-full bg-ember-500 py-3.5 pl-4 pr-6 text-cream-50 shadow-[0_18px_50px_-12px_rgba(192,88,0,0.7)] transition-transform duration-300 hover:scale-105 sm:flex"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bark-950/15 text-xs font-bold tabular-nums">
          {count}
        </span>
        <span className="flex flex-col items-start leading-tight">
          <span className="text-[0.6rem] font-semibold uppercase tracking-widest">
            Your order
          </span>
          <span className="font-display text-lg font-semibold">{formatINR(subtotal)}</span>
        </span>
      </button>
    </>
  );
}
