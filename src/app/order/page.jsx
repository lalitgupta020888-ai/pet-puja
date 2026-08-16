import { CartProvider } from '@/context/CartContext';
import OrderClient from '@/components/OrderClient';
import CartBar from '@/components/CartBar';
import CartDrawer from '@/components/CartDrawer';
import { menuItems, thalis } from '@/data/menu';
import { site } from '@/data/site';

export const metadata = {
  title: 'Order',
  description: `The full ${site.name} menu — ${menuItems.length} dishes and ${thalis.length} set thalis. Scan, choose and send your order straight to the kitchen.`,
  alternates: { canonical: '/order' },
  openGraph: {
    title: `Order · ${site.name}`,
    description: `The full menu, on your phone. ${menuItems.length} dishes, ordered from your table.`,
    url: `${site.url}/order`,
  },
};

/** Where the QR card lands. Everything ordering-related lives under one cart. */
export default function OrderPage() {
  return (
    <CartProvider>
      <OrderClient />
      <CartBar />
      <CartDrawer />
    </CartProvider>
  );
}
