'use client';

import { useReveal } from '@/lib/useReveal';

/** Mounts the single page-wide scroll-reveal observer. */
export default function RevealProvider({ children }) {
  useReveal();
  return children;
}
