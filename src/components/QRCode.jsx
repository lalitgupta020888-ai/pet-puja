import { encodeQR, isEyeModule } from '@/lib/qr';

/**
 * Renders a QR code as SVG with the house style: round data modules, drawn
 * finder eyes and a punched-out centre carrying the Devanagari mark.
 *
 * The centre hole and the softened modules both eat into what a scanner can
 * read, so this always encodes at error-correction level H (≈30% recoverable)
 * and the hole is kept under ~6% of the code area.
 */
export default function QRCode({
  value,
  size = 320,
  quiet = 3,
  dark = '#0E3D4F',
  accent = '#C1552F',
  background = '#FFF8E8',
  logo = true,
  logoText = 'मधु',
  logoBackground = '#FFF8E8',
  title,
  className = '',
}) {
  const { size: n, modules, isFunction } = encodeQR(value, 'H');

  const span = n + quiet * 2;
  const centre = n / 2;
  // Radius of the cleared disc, in modules. Kept proportional so the punched
  // area stays the same share of the code at every version.
  const holeR = logo ? n * 0.115 : 0;

  const dots = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!modules[y][x]) continue;
      if (isEyeModule(x, y, n)) continue; // the eyes are drawn by hand below
      if (logo) {
        const dx = x + 0.5 - centre;
        const dy = y + 0.5 - centre;
        if (Math.hypot(dx, dy) < holeR + 0.9) continue;
      }
      // Timing and alignment patterns are how a scanner finds the grid, so they
      // stay square and touching. Only payload modules become dots.
      if (isFunction[y][x]) {
        dots.push(<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} rx={0.14} />);
      } else {
        dots.push(<circle key={`${x}-${y}`} cx={x + 0.5} cy={y + 0.5} r={0.47} />);
      }
    }
  }

  const eyes = [
    [0, 0],
    [n - 7, 0],
    [0, n - 7],
  ].map(([ex, ey]) => (
    <g key={`${ex}-${ey}`}>
      <rect
        x={ex + 0.5}
        y={ey + 0.5}
        width={6}
        height={6}
        rx={2}
        fill="none"
        stroke={accent}
        strokeWidth={1}
      />
      <rect x={ex + 2} y={ey + 2} width={3} height={3} rx={1.05} fill={accent} />
    </g>
  ));

  return (
    <svg
      viewBox={`${-quiet} ${-quiet} ${span} ${span}`}
      width={size}
      height={size}
      role="img"
      aria-label={title ?? `QR code for ${value}`}
      className={className}
      shapeRendering="geometricPrecision"
    >
      <rect x={-quiet} y={-quiet} width={span} height={span} fill={background} />

      <g fill={dark}>{dots}</g>
      {eyes}

      {logo && (
        <g>
          <circle cx={centre} cy={centre} r={holeR + 0.75} fill={logoBackground} />
          <circle
            cx={centre}
            cy={centre}
            r={holeR + 0.2}
            fill="none"
            stroke={accent}
            strokeWidth={0.34}
          />
          <text
            x={centre}
            y={centre}
            textAnchor="middle"
            dominantBaseline="central"
            fill={accent}
            fontSize={holeR * 1.02}
            style={{ fontFamily: 'var(--font-hindi), serif' }}
          >
            {logoText}
          </text>
        </g>
      )}
    </svg>
  );
}
