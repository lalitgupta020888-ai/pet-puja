const BASE = 'https://images.unsplash.com/';

/**
 * Build a cropped, quality-capped Unsplash URL.
 * Kept in one place so swapping the image host later is a single edit.
 */
export function img(photo, { w = 1200, h, q = 72 } = {}) {
  const params = new URLSearchParams({
    auto: 'format',
    fit: 'crop',
    w: String(w),
    q: String(q),
  });
  if (h) params.set('h', String(h));
  return `${BASE}${photo}?${params.toString()}`;
}

/** A tiny, cheap blur source for the same photo. */
export function blur(photo) {
  return img(photo, { w: 24, q: 20 });
}
