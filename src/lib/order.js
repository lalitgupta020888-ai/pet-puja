import { site } from '@/data/site';

export const formatINR = (n) => `₹${n.toLocaleString('en-IN')}`;

/** How the order reaches the customer. Drives which fields checkout asks for. */
export const ORDER_MODES = [
  {
    id: 'dine-in',
    label: 'Dine in',
    hi: 'यहीं बैठकर',
    note: 'We hold your table and start cooking when you arrive.',
  },
  {
    id: 'takeaway',
    label: 'Takeaway',
    hi: 'ले जाइए',
    note: `Packed and ready in about ${site.ordering.prepTime}.`,
  },
  {
    id: 'delivery',
    label: 'Delivery',
    hi: 'घर पर',
    note: `Within ${site.ordering.deliveryRadius} of the kitchen.`,
  },
];

/** Stable cart key — dishes and thalis share one cart but not one id space. */
export const lineKey = (kind, id) => `${kind}-${id}`;

export function computeTotals(items, mode) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const { deliveryFee, freeDeliveryAbove } = site.ordering;

  const delivery =
    mode === 'delivery' && subtotal > 0 && subtotal < freeDeliveryAbove ? deliveryFee : 0;

  return { subtotal, delivery, total: subtotal + delivery };
}

/** Is this cart allowed to check out under the chosen mode? */
export function orderBlocker(items, mode) {
  if (!items.length) return 'Your thali is empty.';
  const { subtotal } = computeTotals(items, mode);
  if (mode === 'delivery' && subtotal < site.ordering.minDelivery) {
    return `Delivery starts at ${formatINR(site.ordering.minDelivery)} — add ${formatINR(
      site.ordering.minDelivery - subtotal
    )} more.`;
  }
  return null;
}

/** Short human-quotable reference, e.g. PP-4F92. */
export function makeOrderRef() {
  const n = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .toUpperCase()
    .padStart(4, '0');
  return `PP-${n}`;
}

/**
 * The kitchen has no order backend, so the order goes to WhatsApp as a message
 * the staff can read and act on directly.
 */
export function buildOrderMessage({ ref, items, mode, totals, details }) {
  const modeLabel = ORDER_MODES.find((m) => m.id === mode)?.label ?? mode;

  const lines = [
    `*${site.name} — new order ${ref}*`,
    '',
    `*${modeLabel}*`,
    `Name: ${details.name}`,
    `Phone: ${details.phone}`,
  ];

  if (details.table) lines.push(`Table: ${details.table}`);
  if (mode === 'dine-in' && details.people) lines.push(`Guests: ${details.people}`);
  if (mode === 'dine-in' && details.when) lines.push(`Arriving: ${details.when}`);
  if (mode === 'delivery') lines.push(`Address: ${details.address}`);

  lines.push('', '*Order*');
  items.forEach((i) => {
    lines.push(`${i.qty} × ${i.name} — ${formatINR(i.price * i.qty)}`);
  });

  lines.push('', `Subtotal: ${formatINR(totals.subtotal)}`);
  if (totals.delivery) lines.push(`Delivery: ${formatINR(totals.delivery)}`);
  lines.push(`*Total: ${formatINR(totals.total)}*`);

  if (details.note) lines.push('', `Note: ${details.note}`);

  return lines.join('\n');
}

export function whatsappHref(message) {
  return `${site.whatsappHref}?text=${encodeURIComponent(message)}`;
}
