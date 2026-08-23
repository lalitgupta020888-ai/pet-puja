import Link from 'next/link';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <p className="devanagari text-3xl text-saffron-300/85">कुछ नहीं मिला</p>
        <p className="eyebrow mt-6 justify-center">404</p>
        <h1 className="mt-6 font-display text-5xl font-light text-cream-50 sm:text-6xl">
          Nothing cooking <span className="italic text-terracotta-300">here</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-cream-300/70">
          That page has left the pass. The menu, however, is right where you left it.
        </p>
        <Link href="/" className="btn-primary mt-10">
          Back to the table
        </Link>
      </div>
    </main>
  );
}
