/** The green/brown square every Indian menu uses to mark veg and non-veg. */
export function DietMark({ veg, className = '' }) {
  return (
    <span
      aria-label={veg ? 'Vegetarian' : 'Non-vegetarian'}
      title={veg ? 'Vegetarian' : 'Non-vegetarian'}
      className={`inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center border ${
        veg ? 'border-pista-400/70' : 'border-vermilion-400/80'
      } ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${veg ? 'bg-pista-400' : 'bg-vermilion-400'}`} />
    </span>
  );
}

export function Heat({ level }) {
  if (!level) return null;
  return (
    <span className="inline-flex gap-0.5" aria-label={`Spice level ${level} of 3`}>
      {Array.from({ length: level }).map((_, i) => (
        <span key={i} className="text-[0.7rem] leading-none text-vermilion-400">
          ▲
        </span>
      ))}
    </span>
  );
}
