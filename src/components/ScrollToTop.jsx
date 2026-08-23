'use client';

import { useEffect, useState } from 'react';

export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 800);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className={`fixed bottom-7 right-7 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-saffron-400/40 bg-petrol-900/80 text-saffron-300 backdrop-blur transition-all duration-500 hover:bg-saffron-400 hover:text-petrol-950 ${
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      ↑
    </button>
  );
}
