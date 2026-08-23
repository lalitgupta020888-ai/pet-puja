# Madhurima Food Park · मधुरिमा फूड पार्क

Marketing site for **Madhurima Food Park**, built with **Next.js 15 (App Router)**, **React 19** and
**Tailwind CSS**.

> *Pet puja* — the oldest ritual there is. The whole site is built around that idea:
> eating well as a daily ceremony, not an occasion.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint
```

## How it is put together

```
src/
  app/
    layout.jsx      fonts, metadata, Restaurant JSON-LD
    page.jsx        the single landing page, section by section
    globals.css     design tokens and shared component classes
  components/       one file per section
  data/
    site.js         name, phone, address, hours, nav — edit business details here
    menu.js         every dish, price, photo, and the thali sets
    content.js      testimonials, story chapters, the ritual steps, gallery
  lib/
    images.js       builds sized image URLs
    useReveal.js    scroll-reveal observer
```

**Everything a non-developer needs to change lives in `src/data/`.** Prices, dishes,
opening hours and contact details are plain data — no component edits required.

## The design

| | |
|---|---|
| **Ground** | `masala` — warm, roasted near-blacks. Never blue-black. |
| **Primary** | `marigold` — the flower on every threshold. |
| **Accent** | `vermilion` for heat and emphasis; `pista` green for veg marks and the open-now chip. |
| **Display** | Fraunces |
| **Body** | Inter |
| **Devanagari** | Tiro Devanagari Hindi |

Hindi and English are set as a pair throughout — the wordmark, every section mark, the
nav on hover. The Devanagari is never a decorative squiggle; it always says what the
English says.

Motion is CSS-only and fully respects `prefers-reduced-motion`.

## Sections worth knowing about

- **Thali** (`components/Thali.jsx`) — thalis are composed from dishes already in
  `menu.js`, so the set price is derived from the à la carte prices rather than
  maintained separately. **The 15% set discount is a placeholder — confirm real thali
  pricing before launch.**
- **Open now chip** (`components/OpenStatus.jsx`) — live open/closed state computed from
  `site.opensAt` / `site.closesAt`. Renders only after mount, since it depends on the
  viewer's clock.
- **Ritual** (`components/Ritual.jsx`) — the four-step "how it is done" strip.

## Ordering

Customers can build an order without leaving the page.

| Piece | File |
|---|---|
| Cart state, persisted to `localStorage` | `context/CartContext.jsx` |
| Add button / inline stepper | `components/AddToCart.jsx` |
| Floating pill (desktop) + sticky bar (mobile) | `components/CartBar.jsx` |
| Cart → checkout → confirmation drawer | `components/CartDrawer.jsx` |
| Totals, delivery rules, message builder | `lib/order.js` |

The flow: add from the menu, signature cards or a thali set → the control turns
into a stepper in place → the cart pill appears → the drawer reviews the order →
pick Dine in / Takeaway / Delivery → name, phone (and address for delivery) →
place order. The cart survives a reload.

**There is no order backend.** A placed order opens WhatsApp with a formatted
message for the kitchen and shows the customer a reference like `PP-4F92`. To store
orders instead, replace the `window.open` call in `CartDrawer.jsx`'s `placeOrder`
with a POST to a route handler.

**Delivery rules are placeholders** — minimum order, fee, free-delivery threshold,
prep time and radius all live in `site.ordering` in `src/data/site.js`. Set the real
numbers before launch; they are shown to the customer at checkout.

## Photography

Images are served from Unsplash and sized on request via `lib/images.js`. Each dish's
`photo` field holds a bare Unsplash photo ID.

To use the restaurant's own photography, drop the files in `public/images/` and change
`img()` in `src/lib/images.js` to return a local path. The `photo` fields and every
`<Image>` call keep working unchanged. Remote hosts must also be listed in
`next.config.js` under `images.remotePatterns`.

## Reservations

The form validates client-side and hands the request off to email via `mailto:`, since
there is no booking backend. To store bookings instead, replace the `onSubmit` handler in
`src/components/Reserve.jsx` with a POST to a route handler or a form provider.

## Before going live

- Set the real domain in `src/data/site.js` (`url`) — it drives canonical and OG tags.
- Replace the placeholder address, phone, email and social links in the same file.
- Confirm the thali contents and set pricing with the kitchen.
- Add `public/favicon.ico` and an OG share image.
- The repo folder should be named `MADHURIMA FOOD PARK` to match the project; rename it while no dev server is running.
