/**
 * Menu source of truth. Prices are in INR.
 *
 * `photo` holds the bare Unsplash photo path; `img()` in lib/images.js turns it
 * into a sized, cropped URL so every card requests exactly what it renders.
 */

export const categories = [
  { id: 'all', name: 'Everything', note: 'The full table' },
  { id: 'starters', name: 'To Begin', note: 'From the tandoor' },
  { id: 'main', name: 'Main Course', note: 'Slow-cooked curries' },
  { id: 'breads', name: 'Breads & Rice', note: 'Clay oven, fresh' },
  { id: 'desserts', name: 'Sweets', note: 'Made each morning' },
  { id: 'beverages', name: 'Drinks', note: 'Cooling & spiced' },
];

export const menuItems = [
  {
    id: 1,
    name: 'Paneer Tikka',
    description:
      'Hand-pressed cottage cheese in a hung-curd and ajwain marinade, charred on skewers over open coal.',
    price: 250,
    category: 'starters',
    veg: true,
    heat: 1,
    signature: true,
    photo: 'photo-1666001120694-3ebe8fd207be',
  },
  {
    id: 2,
    name: 'Chicken Tikka',
    description:
      'Thigh meat rested overnight in ginger, garlic and red chilli, finished with a smoke of ghee.',
    price: 280,
    category: 'starters',
    veg: false,
    heat: 2,
    signature: true,
    photo: 'photo-1599487488170-d11ec9c172f0',
  },
  {
    id: 3,
    name: 'Samosa',
    description:
      'Flaky short-crust pastry, spiced potato and pea filling, fried to order. Served with mint chutney.',
    price: 40,
    category: 'starters',
    veg: true,
    heat: 1,
    photo: 'photo-1601050690597-df0568f70950',
  },
  {
    id: 4,
    name: 'Butter Chicken',
    description:
      'Tandoor-roasted chicken folded into a tomato gravy finished with white butter and a whisper of fenugreek.',
    price: 320,
    category: 'main',
    veg: false,
    heat: 1,
    signature: true,
    photo: 'photo-1603894584373-5ac82b2ae398',
  },
  {
    id: 5,
    name: 'Dal Makhani',
    description:
      'Whole black urad simmered twelve hours over low coal with cream and butter. The dish we are known for.',
    price: 180,
    category: 'main',
    veg: true,
    heat: 1,
    signature: true,
    photo: 'photo-1627366422957-3efa9c6df0fc',
  },
  {
    id: 6,
    name: 'Paneer Butter Masala',
    description:
      'Soft paneer in a silken cashew and tomato gravy, sweetened only by slow-cooked onion.',
    price: 280,
    category: 'main',
    veg: true,
    heat: 1,
    photo: 'photo-1631452180519-c014fe946bc7',
  },
  {
    id: 7,
    name: 'Chicken Biryani',
    description:
      'Aged basmati and marinated chicken sealed under dough and cooked on dum until the steam does the work.',
    price: 350,
    category: 'main',
    veg: false,
    heat: 2,
    signature: true,
    photo: 'photo-1589302168068-964664d93dc0',
  },
  {
    id: 8,
    name: 'Veg Biryani',
    description:
      'Seasonal vegetables layered with saffron rice, fried onion and mint, sealed and steamed the same way.',
    price: 220,
    category: 'main',
    veg: true,
    heat: 1,
    photo: 'photo-1563379091339-03b21ab4a4f8',
  },
  {
    id: 9,
    name: 'Naan',
    description: 'Leavened dough slapped onto the clay wall and pulled at the blister.',
    price: 30,
    category: 'breads',
    veg: true,
    heat: 0,
    photo: 'photo-1697155406014-04dc649b0953',
  },
  {
    id: 10,
    name: 'Butter Naan',
    description: 'The same bread, brushed edge to edge with white butter as it leaves the oven.',
    price: 40,
    category: 'breads',
    veg: true,
    heat: 0,
    photo: 'photo-1655979284091-eea0e93405ee',
  },
  {
    id: 11,
    name: 'Garlic Naan',
    description: 'Crushed garlic and coriander pressed into the dough before it meets the tandoor.',
    price: 50,
    category: 'breads',
    veg: true,
    heat: 0,
    signature: true,
    photo: 'photo-1690915475862-336b65f571a3',
  },
  {
    id: 12,
    name: 'Jeera Rice',
    description: 'Long-grain basmati tempered in ghee with cumin bloomed until it turns nutty.',
    price: 80,
    category: 'breads',
    veg: true,
    heat: 0,
    photo: 'photo-1603133872878-684f208fb84b',
  },
  {
    id: 13,
    name: 'Gulab Jamun',
    description: 'Khoya dumplings fried to a deep amber and rested warm in cardamom syrup.',
    price: 60,
    category: 'desserts',
    veg: true,
    heat: 0,
    signature: true,
    photo: 'photo-1666190092159-3171cf0fbb12',
  },
  {
    id: 14,
    name: 'Kheer',
    description: 'Rice reduced slowly in full-cream milk with saffron, finished with slivered pistachio.',
    price: 70,
    category: 'desserts',
    veg: true,
    heat: 0,
    photo: 'photo-1621658537360-dfcb008fe19f',
  },
  {
    id: 15,
    name: 'Rasmalai',
    description: 'Fresh chenna patties pressed thin and steeped in thickened milk until they drink it in.',
    price: 80,
    category: 'desserts',
    veg: true,
    heat: 0,
    photo: 'photo-1694402594431-23c594be1745',
  },
  {
    id: 16,
    name: 'Lassi',
    description: 'Hand-churned curd, sweet or salted, poured thick enough to hold a spoon.',
    price: 50,
    category: 'beverages',
    veg: true,
    heat: 0,
    photo: 'photo-1692620609860-be6717812f71',
  },
  {
    id: 17,
    name: 'Mango Lassi',
    description: 'Alphonso pulp blended into the same curd base. Available through the season.',
    price: 60,
    category: 'beverages',
    veg: true,
    heat: 0,
    photo: 'photo-1623065422902-30a2d299bbe4',
  },
  {
    id: 18,
    name: 'Masala Chai',
    description: 'Loose leaf boiled hard with ginger, cardamom and clove, strained tableside.',
    price: 30,
    category: 'beverages',
    veg: true,
    heat: 0,
    signature: true,
    photo: 'photo-1683533698664-12ee473e8c9d',
  },
];

/** The four dishes given the large editorial treatment, in display order. */
const FEATURED_IDS = [4, 5, 7, 2];

export const signatures = FEATURED_IDS.map((id) => menuItems.find((item) => item.id === id));

const byId = (id) => menuItems.find((item) => item.id === id);

/**
 * Thalis are bundles of dishes already on the menu, so the price follows from
 * the à la carte prices rather than being maintained separately.
 *
 * NOTE: the 15% set discount is a placeholder — confirm the real thali pricing
 * with the kitchen before this goes live.
 */
const SET_DISCOUNT = 0.15;

const buildThali = ({ id, name, hi, note, veg, itemIds, photo }) => {
  const items = itemIds.map(byId);
  const full = items.reduce((sum, item) => sum + item.price, 0);
  return {
    id,
    name,
    hi,
    note,
    veg,
    photo,
    items,
    fullPrice: full,
    // Rounded to the nearest ₹10 so the board price reads cleanly.
    price: Math.round((full * (1 - SET_DISCOUNT)) / 10) * 10,
  };
};

export const thalis = [
  buildThali({
    id: 'veg',
    name: 'Veg Thali',
    hi: 'शाकाहारी थाली',
    note: 'The everyday plate. What most of the room is eating.',
    veg: true,
    itemIds: [5, 6, 10, 12, 13],
    photo: 'photo-1631452180519-c014fe946bc7',
  }),
  buildThali({
    id: 'non-veg',
    name: 'Non-Veg Thali',
    hi: 'मांसाहारी थाली',
    note: 'Built around the butter chicken, with a skewer to start.',
    veg: false,
    itemIds: [2, 4, 5, 11, 14],
    photo: 'photo-1603894584373-5ac82b2ae398',
  }),
  buildThali({
    id: 'feast',
    name: 'The Full Pet Puja',
    hi: 'पूरी पेट पूजा',
    note: 'Everything we are known for, on one tray. Bring an appetite and a friend.',
    veg: false,
    itemIds: [1, 4, 5, 7, 11, 15, 18],
    photo: 'photo-1589302168068-964664d93dc0',
  }),
];
