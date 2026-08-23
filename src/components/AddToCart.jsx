'use client';

import { useCart } from '@/context/CartContext';

/**
 * One control with two states: an "Add" button until the line exists, then an
 * inline stepper. Keeping it in place means the row never jumps under the thumb.
 */
export default function AddToCart({ item, variant = 'compact', label = 'Add' }) {
  const { add, setQty, qtyOf } = useCart();
  const qty = qtyOf(item.kind, item.id);

  const full = variant === 'full';

  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={() => add(item)}
        aria-label={`Add ${item.name} to order`}
        className={
          full
            ? 'btn-primary w-full'
            : 'inline-flex items-center gap-1.5 rounded-full border border-saffron-400/45 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-widest text-saffron-300 transition-all duration-300 hover:border-saffron-400 hover:bg-saffron-400 hover:text-petrol-950'
        }
      >
        <span aria-hidden className="text-sm leading-none">
          +
        </span>
        {label}
      </button>
    );
  }

  const key = `${item.kind}-${item.id}`;

  return (
    <div
      className={`inline-flex items-center justify-between gap-1 rounded-full bg-terracotta-500 text-cream-50 ${
        full ? 'w-full px-3 py-2' : 'px-1.5 py-1.5'
      }`}
    >
      <button
        type="button"
        onClick={() => setQty(key, qty - 1)}
        aria-label={qty === 1 ? `Remove ${item.name} from order` : `One less ${item.name}`}
        className="flex h-7 w-7 items-center justify-center rounded-full text-lg leading-none transition-colors hover:bg-petrol-950/15"
      >
        −
      </button>
      <span
        aria-live="polite"
        className="min-w-6 text-center text-sm font-semibold tabular-nums"
      >
        {qty}
      </span>
      <button
        type="button"
        onClick={() => setQty(key, qty + 1)}
        aria-label={`One more ${item.name}`}
        className="flex h-7 w-7 items-center justify-center rounded-full text-lg leading-none transition-colors hover:bg-petrol-950/15"
      >
        +
      </button>
    </div>
  );
}
