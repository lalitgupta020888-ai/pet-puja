'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { img } from '@/lib/images';
import { site } from '@/data/site';
import {
  ORDER_MODES,
  buildOrderMessage,
  computeTotals,
  formatINR,
  makeOrderRef,
  orderBlocker,
  whatsappHref,
} from '@/lib/order';

const EMPTY = { name: '', phone: '', address: '', people: '2', when: '', note: '' };

function validate(values, mode) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'Please tell us a name.';
  if (!/^[0-9]{10}$/.test(values.phone.replace(/\s+/g, '')))
    errors.phone = 'Enter a 10-digit phone number.';
  if (mode === 'delivery' && values.address.trim().length < 10)
    errors.address = 'We need a full address to find you.';
  return errors;
}

const inputClass =
  'w-full rounded-xl border border-white/10 bg-bark-950/60 px-4 py-3 text-cream-100 placeholder:text-cream-400/40 transition-colors focus:border-ember-400 focus:outline-none';

export default function CartDrawer() {
  const { items, count, open, closeCart, setQty, remove, clear, table } = useCart();

  const [step, setStep] = useState('cart');
  // A guest who scanned a table card is already sitting down.
  const [mode, setMode] = useState('takeaway');
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [placed, setPlaced] = useState(null);

  const totals = computeTotals(items, mode);
  const blocker = orderBlocker(items, mode);
  const errors = validate(values, mode);

  useEffect(() => {
    if (table) setMode('dine-in');
  }, [table]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && closeCart();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeCart]);

  // Coming back to an empty cart should not strand us on the checkout step.
  useEffect(() => {
    if (!count && step === 'details') setStep('cart');
  }, [count, step]);

  if (!open) return null;

  const set = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  const blur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const placeOrder = (e) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, address: true });
    if (Object.keys(errors).length || blocker) return;

    const ref = makeOrderRef();
    const snapshot = { ref, items, mode, totals, details: { ...values, table } };
    const message = buildOrderMessage(snapshot);

    // No order backend — the order goes to the kitchen's WhatsApp.
    window.open(whatsappHref(message), '_blank', 'noopener,noreferrer');

    setPlaced(snapshot);
    clear();
    setStep('done');
  };

  const restart = () => {
    setPlaced(null);
    setValues(EMPTY);
    setTouched({});
    setStep('cart');
    closeCart();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex justify-end bg-bark-950/80 backdrop-blur-sm"
      onClick={closeCart}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-lg flex-col border-l border-white/[0.08] bg-bark-900 shadow-2xl"
      >
        {/* Head */}
        <header className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
          <div>
            <p className="devanagari text-lg text-ember-300/85">आपका ऑर्डर</p>
            <h2 className="mt-1 font-display text-2xl font-light text-cream-50">
              {step === 'done' ? 'Order placed' : 'Your order'}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close order"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-xl leading-none text-cream-100 transition-colors hover:border-ember-400 hover:text-ember-300"
          >
            ×
          </button>
        </header>

        {/* ---------------------------------------------------------- done */}
        {step === 'done' && placed && (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-ember-400/40 text-3xl text-ember-300">
              ✦
            </div>
            <p className="mt-7 text-[0.65rem] uppercase tracking-brand text-ember-400">
              Reference {placed.ref}
            </p>
            <h3 className="mt-4 font-display text-3xl font-light text-cream-50">
              Sent to the kitchen
            </h3>
            <p className="mt-4 max-w-sm leading-relaxed text-cream-300/70">
              We have opened WhatsApp with your order. Send that message and we will call to
              confirm on {site.phone}. Nothing is cooking until you do.
            </p>
            <p className="mt-6 font-display text-2xl text-ember-300">
              {formatINR(placed.totals.total)}
            </p>
            <button type="button" onClick={restart} className="btn-ghost mt-9">
              Done
            </button>
          </div>
        )}

        {/* ---------------------------------------------------------- empty */}
        {step !== 'done' && !count && (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <p className="devanagari text-4xl text-ember-400/25">थाली</p>
            <h3 className="mt-6 font-display text-2xl font-light text-cream-50">
              Your thali is empty
            </h3>
            <p className="mt-3 max-w-xs leading-relaxed text-cream-300/65">
              Add something from the menu and it will show up here.
            </p>
            <button type="button" onClick={closeCart} className="btn-primary mt-8">
              Browse the menu
            </button>
          </div>
        )}

        {/* ---------------------------------------------------------- cart */}
        {step === 'cart' && count > 0 && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <ul className="space-y-3">
                {items.map((line) => (
                  <li
                    key={line.key}
                    className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-bark-950/50 p-3"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={img(line.photo, { w: 160, h: 160, q: 65 })}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-display text-lg leading-tight text-cream-50">
                        {line.name}
                      </p>
                      <p className="mt-0.5 text-sm text-cream-400">
                        {formatINR(line.price)} each
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="font-display text-lg text-ember-300">
                        {formatINR(line.price * line.qty)}
                      </span>
                      <div className="inline-flex items-center gap-1 rounded-full border border-white/10">
                        <button
                          type="button"
                          onClick={() => setQty(line.key, line.qty - 1)}
                          aria-label={`One less ${line.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-lg leading-none text-cream-200 hover:bg-white/10"
                        >
                          −
                        </button>
                        <span className="min-w-5 text-center text-sm tabular-nums text-cream-100">
                          {line.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(line.key, line.qty + 1)}
                          aria-label={`One more ${line.name}`}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-lg leading-none text-cream-200 hover:bg-white/10"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(line.key)}
                      aria-label={`Remove ${line.name}`}
                      className="self-start text-cream-400 transition-colors hover:text-vermilion-300"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="border-t border-white/[0.07] px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm uppercase tracking-widest text-cream-400">
                  Subtotal
                </span>
                <span className="font-display text-3xl text-cream-50">
                  {formatINR(totals.subtotal)}
                </span>
              </div>
              <p className="mt-2 text-xs text-cream-400">
                Taxes as applicable. Delivery charged at the next step.
              </p>
              <button
                type="button"
                onClick={() => setStep('details')}
                className="btn-primary mt-5 w-full"
              >
                Continue
              </button>
            </footer>
          </>
        )}

        {/* ------------------------------------------------------- details */}
        {step === 'details' && count > 0 && (
          <form onSubmit={placeOrder} noValidate className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
              {table && (
                <p className="rounded-xl border border-ember-400/25 bg-ember-400/[0.07] px-4 py-3 text-sm leading-relaxed text-cream-200">
                  <span className="devanagari mr-2 text-ember-300">मेज़</span>
                  You scanned the card on{' '}
                  <strong className="font-semibold text-ember-300">table {table}</strong> — we
                  will bring it to you there.
                </p>
              )}

              {/* Mode */}
              <fieldset>
                <legend className="mb-3 text-[0.65rem] uppercase tracking-widest text-cream-400">
                  How would you like it?
                </legend>
                <div className="grid grid-cols-3 gap-2">
                  {ORDER_MODES.map((m) => {
                    const on = m.id === mode;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMode(m.id)}
                        aria-pressed={on}
                        className={`rounded-xl border px-3 py-3 text-center transition-all duration-300 ${
                          on
                            ? 'border-ember-500 bg-ember-500 text-cream-50'
                            : 'border-white/10 text-cream-300 hover:border-ember-400/50'
                        }`}
                      >
                        <span className="block text-[0.65rem] font-semibold uppercase tracking-widest">
                          {m.label}
                        </span>
                        <span
                          className={`devanagari mt-1 block text-[0.7rem] ${
                            on ? 'text-bark-900/70' : 'text-ember-400/70'
                          }`}
                        >
                          {m.hi}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-cream-400">
                  {ORDER_MODES.find((m) => m.id === mode)?.note}
                </p>
              </fieldset>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[0.65rem] uppercase tracking-widest text-cream-400">
                    Name
                  </span>
                  <input
                    className={inputClass}
                    name="name"
                    value={values.name}
                    onChange={set}
                    onBlur={blur}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                  {touched.name && errors.name && (
                    <span className="mt-1.5 block text-xs text-vermilion-300">{errors.name}</span>
                  )}
                </label>

                <label className="block">
                  <span className="mb-2 block text-[0.65rem] uppercase tracking-widest text-cream-400">
                    Phone
                  </span>
                  <input
                    className={inputClass}
                    name="phone"
                    value={values.phone}
                    onChange={set}
                    onBlur={blur}
                    placeholder="10-digit number"
                    inputMode="numeric"
                    autoComplete="tel"
                  />
                  {touched.phone && errors.phone && (
                    <span className="mt-1.5 block text-xs text-vermilion-300">{errors.phone}</span>
                  )}
                </label>
              </div>

              {mode === 'delivery' && (
                <label className="block">
                  <span className="mb-2 block text-[0.65rem] uppercase tracking-widest text-cream-400">
                    Delivery address
                  </span>
                  <textarea
                    className={`${inputClass} resize-none`}
                    name="address"
                    rows={3}
                    value={values.address}
                    onChange={set}
                    onBlur={blur}
                    placeholder="Flat, street, landmark"
                    autoComplete="street-address"
                  />
                  {touched.address && errors.address && (
                    <span className="mt-1.5 block text-xs text-vermilion-300">
                      {errors.address}
                    </span>
                  )}
                </label>
              )}

              {mode === 'dine-in' && (
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="mb-2 block text-[0.65rem] uppercase tracking-widest text-cream-400">
                      Guests
                    </span>
                    <input
                      className={inputClass}
                      name="people"
                      type="number"
                      min="1"
                      max="20"
                      value={values.people}
                      onChange={set}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[0.65rem] uppercase tracking-widest text-cream-400">
                      Arriving at
                    </span>
                    <input
                      className={inputClass}
                      name="when"
                      type="time"
                      value={values.when}
                      onChange={set}
                    />
                  </label>
                </div>
              )}

              <label className="block">
                <span className="mb-2 block text-[0.65rem] uppercase tracking-widest text-cream-400">
                  Anything we should know?
                </span>
                <textarea
                  className={`${inputClass} resize-none`}
                  name="note"
                  rows={2}
                  value={values.note}
                  onChange={set}
                  placeholder="Less chilli, extra gravy, a birthday…"
                />
              </label>
            </div>

            <footer className="border-t border-white/[0.07] px-6 py-5">
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between text-cream-300/75">
                  <dt>Subtotal</dt>
                  <dd>{formatINR(totals.subtotal)}</dd>
                </div>
                {mode === 'delivery' && (
                  <div className="flex justify-between text-cream-300/75">
                    <dt>Delivery</dt>
                    <dd>
                      {totals.delivery ? (
                        formatINR(totals.delivery)
                      ) : (
                        <span className="text-pista-400">Free</span>
                      )}
                    </dd>
                  </div>
                )}
                <div className="flex items-baseline justify-between pt-2">
                  <dt className="text-[0.65rem] uppercase tracking-widest text-cream-400">
                    Total
                  </dt>
                  <dd className="font-display text-3xl text-cream-50">
                    {formatINR(totals.total)}
                  </dd>
                </div>
              </dl>

              {blocker && (
                <p className="mt-3 rounded-xl border border-vermilion-400/30 bg-vermilion-400/10 px-4 py-3 text-xs text-vermilion-300">
                  {blocker}
                </p>
              )}

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="btn-ghost flex-1"
                >
                  Back
                </button>
                <button type="submit" disabled={!!blocker} className="btn-primary flex-[2] disabled:cursor-not-allowed disabled:opacity-40">
                  Place order
                </button>
              </div>
            </footer>
          </form>
        )}
      </aside>
    </div>
  );
}
