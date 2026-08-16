'use client';

import { useState } from 'react';
import { site } from '@/data/site';
import SectionHeading from './SectionHeading';

const EMPTY = { name: '', phone: '', email: '', date: '', time: '19:30', guests: '2', note: '' };

/** Mirrors the original Yup rules, minus the dependency. */
function validate(values) {
  const errors = {};

  if (values.name.trim().length < 2) errors.name = 'Please give us a name of at least 2 characters.';

  if (!/^[0-9]{10}$/.test(values.phone.replace(/\s+/g, '')))
    errors.phone = 'Enter a 10-digit phone number.';

  if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = 'That email address does not look right.';

  if (!values.date) errors.date = 'Choose a date.';
  else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(`${values.date}T00:00:00`) < today) errors.date = 'Pick today or a later date.';
  }

  if (!values.time) errors.time = 'Choose a time.';

  const guests = Number(values.guests);
  if (!Number.isInteger(guests) || guests < 1 || guests > 20)
    errors.guests = 'We can seat 1 to 20 guests per booking.';

  return errors;
}

function Field({ label, name, error, touched, children }) {
  const show = touched && error;
  return (
    <label className="block">
      <span className="mb-2 block text-[0.65rem] uppercase tracking-widest text-cream-400">
        {label}
      </span>
      {children}
      {show && <span className="mt-1.5 block text-xs text-vermilion-400">{error}</span>}
    </label>
  );
}

const inputClass =
  'w-full rounded-xl border border-white/10 bg-masala-950/60 px-4 py-3.5 text-cream-100 placeholder:text-cream-400/40 transition-colors focus:border-marigold-400 focus:outline-none';

export default function Reserve() {
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [sent, setSent] = useState(false);

  const errors = validate(values);
  const set = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };
  const blur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  const onSubmit = (e) => {
    e.preventDefault();
    setTouched(Object.fromEntries(Object.keys(EMPTY).map((k) => [k, true])));
    if (Object.keys(errors).length) return;

    // No booking backend yet, so hand the request to a channel the kitchen
    // actually watches instead of pretending it was saved.
    const body = [
      `Name: ${values.name}`,
      `Phone: ${values.phone}`,
      values.email && `Email: ${values.email}`,
      `Date: ${values.date} at ${values.time}`,
      `Guests: ${values.guests}`,
      values.note && `Note: ${values.note}`,
    ]
      .filter(Boolean)
      .join('\n');

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      `Table request — ${values.name}, ${values.guests} guests`
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
  };

  return (
    <section id="visit" className="scroll-mt-24 py-28 lg:py-40">
      <div className="shell">
        <div className="grid gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24">
          {/* Visit details */}
          <div>
            <SectionHeading
              hi="आइए"
              eyebrow="Visit Us"
              title="Come hungry,"
              accent="stay a while"
              lead="Walk-ins are always welcome. For a table of six or more, or a quiet corner on a weekend, it is worth calling ahead."
            />

            <dl className="mt-14 space-y-8">
              {[
                { term: 'Address', desc: site.addressLine, href: site.mapsHref },
                { term: 'Phone', desc: site.phone, href: site.phoneHref },
                { term: 'Email', desc: site.email, href: `mailto:${site.email}` },
                { term: 'Hours', desc: site.hours },
              ].map((row, i) => (
                <div
                  key={row.term}
                  className="reveal border-t border-white/[0.07] pt-6"
                  style={{ '--reveal-delay': `${i * 90}ms` }}
                >
                  <dt className="text-[0.65rem] uppercase tracking-brand text-marigold-400">
                    {row.term}
                  </dt>
                  <dd className="mt-2 font-display text-2xl font-light text-cream-100">
                    {row.href ? (
                      <a
                        href={row.href}
                        className="transition-colors hover:text-marigold-300"
                        {...(row.href.startsWith('http')
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {row.desc}
                      </a>
                    ) : (
                      row.desc
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Booking request */}
          <div className="reveal surface p-8 sm:p-10">
            <h3 className="font-display text-3xl font-light text-cream-50">Request a table</h3>
            <p className="mt-3 text-sm leading-relaxed text-cream-300/70">
              Send us the details and we will confirm by phone. In a hurry?{' '}
              <a href={site.phoneHref} className="text-marigold-300 underline underline-offset-4">
                Just call us
              </a>
              .
            </p>

            {sent ? (
              <div className="mt-10 rounded-2xl border border-marigold-400/30 bg-marigold-400/[0.07] p-8 text-center">
                <p className="font-display text-2xl text-marigold-200">Your email is ready to send</p>
                <p className="mt-3 text-sm leading-relaxed text-cream-300/75">
                  We have opened your mail app with the request filled in. Send it and we will call
                  you back to confirm — or reach us directly on {site.phone}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setValues(EMPTY);
                    setTouched({});
                    setSent(false);
                  }}
                  className="btn-ghost mt-7"
                >
                  Make another request
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="mt-9 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Name" name="name" error={errors.name} touched={touched.name}>
                    <input
                      className={inputClass}
                      name="name"
                      value={values.name}
                      onChange={set}
                      onBlur={blur}
                      placeholder="Your name"
                      autoComplete="name"
                    />
                  </Field>

                  <Field label="Phone" name="phone" error={errors.phone} touched={touched.phone}>
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
                  </Field>
                </div>

                <Field
                  label="Email (optional)"
                  name="email"
                  error={errors.email}
                  touched={touched.email}
                >
                  <input
                    className={inputClass}
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={set}
                    onBlur={blur}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </Field>

                <div className="grid gap-5 sm:grid-cols-3">
                  <Field label="Date" name="date" error={errors.date} touched={touched.date}>
                    <input
                      className={inputClass}
                      name="date"
                      type="date"
                      value={values.date}
                      onChange={set}
                      onBlur={blur}
                    />
                  </Field>

                  <Field label="Time" name="time" error={errors.time} touched={touched.time}>
                    <input
                      className={inputClass}
                      name="time"
                      type="time"
                      value={values.time}
                      onChange={set}
                      onBlur={blur}
                    />
                  </Field>

                  <Field label="Guests" name="guests" error={errors.guests} touched={touched.guests}>
                    <input
                      className={inputClass}
                      name="guests"
                      type="number"
                      min="1"
                      max="20"
                      value={values.guests}
                      onChange={set}
                      onBlur={blur}
                    />
                  </Field>
                </div>

                <Field label="Anything we should know?" name="note">
                  <textarea
                    className={`${inputClass} resize-none`}
                    name="note"
                    rows={3}
                    value={values.note}
                    onChange={set}
                    placeholder="Allergies, a birthday, a seat away from the speakers…"
                  />
                </Field>

                <button type="submit" className="btn-primary w-full">
                  Send request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
