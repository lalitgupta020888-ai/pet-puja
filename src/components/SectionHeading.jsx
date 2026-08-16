export default function SectionHeading({ hi, eyebrow, title, accent, lead, align = 'left' }) {
  const centered = align === 'center';

  return (
    <div className={`reveal max-w-2xl ${centered ? 'mx-auto text-center' : ''}`}>
      {hi && (
        <p className={`devanagari mb-4 text-2xl text-marigold-300/85 ${centered ? '' : ''}`}>
          {hi}
        </p>
      )}
      {eyebrow && <p className={`eyebrow ${centered ? 'justify-center' : ''}`}>{eyebrow}</p>}
      <h2 className="mt-6 font-display text-4xl font-light leading-[1.05] tracking-tight text-cream-50 sm:text-5xl lg:text-6xl">
        {title} {accent && <span className="italic text-marigold-300">{accent}</span>}
      </h2>
      {lead && <p className="mt-6 text-lg leading-relaxed text-cream-300/75">{lead}</p>}
    </div>
  );
}
