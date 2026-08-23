export const site = {
  name: 'Madhurima Food Park',
  nameDevanagari: 'मधुरिमा फूड पार्क',
  tagline: 'Every meal, a small ceremony.',
  description:
    'Madhurima Food Park — eating well is the oldest ritual there is. A pure vegetarian kitchen, kept properly: spices ground at dawn, dal left on the coals all night, breads pulled from the clay oven only once you have asked for them — and the dosa batter set to ferment the night before.',
  url: 'https://madhurimafoodpark.com',
  phone: '+91 86503 68283',
  phoneHref: 'tel:+918650368283',
  whatsappHref: 'https://wa.me/918650368283',
  email: 'hello@madhurimafoodpark.com',
  address: {
    street: '123 Main Street',
    locality: 'City',
    region: 'State',
    postalCode: '12345',
    country: 'IN',
  },
  addressLine: '123 Main Street, City, State 12345',
  mapsHref: 'https://maps.google.com/?q=123+Main+Street+City+State+12345',
  hours: 'Every day · 11:00 AM – 11:00 PM',
  // Drives both the printed hours and the live open/closed chip.
  hoursSpec: [{ days: 'Mo-Su', opens: '11:00', closes: '23:00' }],
  opensAt: 11,
  closesAt: 23,
  established: 1978,

  /**
   * Ordering rules. PLACEHOLDER VALUES — confirm these with the kitchen before
   * launch. Every number here is shown to the customer at checkout.
   */
  ordering: {
    minDelivery: 300, // minimum cart value for delivery, in ₹
    deliveryFee: 40,
    freeDeliveryAbove: 800,
    prepTime: '30–40 min',
    deliveryRadius: '5 km',
  },

  social: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
    { label: 'Google', href: 'https://google.com/maps' },
  ],
};

export const navLinks = [
  { label: 'Menu', hi: 'व्यंजन', href: '#menu' },
  { label: 'Thali', hi: 'थाली', href: '#thali' },
  { label: 'Scan', hi: 'स्कैन', href: '#scan' },
  { label: 'Story', hi: 'कहानी', href: '#story' },
  { label: 'Gallery', hi: 'झलक', href: '#gallery' },
  { label: 'Visit', hi: 'आइए', href: '#visit' },
];

export const accolades = [
  { value: '47', label: 'Years of feeding people' },
  { value: '4.8', label: 'Average guest rating' },
  { value: '18', label: 'Spices ground at dawn' },
  { value: '12h', label: 'The dal stays on the fire' },
];
