import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Signatures from '@/components/Signatures';
import Ritual from '@/components/Ritual';
import Menu from '@/components/Menu';
import Thali from '@/components/Thali';
import ScanToOrder from '@/components/ScanToOrder';
import Story from '@/components/Story';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import Reserve from '@/components/Reserve';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import RevealProvider from '@/components/RevealProvider';
import { CartProvider } from '@/context/CartContext';
import CartBar from '@/components/CartBar';
import CartDrawer from '@/components/CartDrawer';

export default function HomePage() {
  return (
    <CartProvider>
      <RevealProvider>
        <Header />
        <main>
          <Hero />
          <Marquee />
          <Signatures />
          <Ritual />
          <Menu />
          <Thali />
          <ScanToOrder />
          <Story />
          <Gallery />
          <Testimonials />
          <Reserve />
        </main>
        <Footer />
        <ScrollToTop />
        <CartBar />
        <CartDrawer />
      </RevealProvider>
    </CartProvider>
  );
}
