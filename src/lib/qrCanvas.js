/**
 * Draws the table card to a canvas so it can be downloaded as a PNG.
 *
 * The on-screen card is HTML, and rasterising HTML in the browser is not a
 * thing you can do reliably, so the print-ready copy is redrawn here. Keep the
 * two in step by eye: same order of elements, same words.
 */

import { encodeQR, isEyeModule } from './qr';
import { site } from '@/data/site';

const W = 1000;
const H = 1420;

const INK = '#2A0C13';
const GOLD = '#A88338';
const GOLD_SOFT = 'rgba(168,131,56,0.28)';
const MUTED = '#6B5257';
const PAPER = '#FBF4EC';

/** Pull the real webfont families off the document so the PNG matches the page. */
function fontStacks() {
  const fallback = {
    display: 'Georgia, "Times New Roman", serif',
    body: 'Inter, system-ui, sans-serif',
    hindi: '"Nirmala UI", "Noto Sans Devanagari", serif',
  };
  if (typeof document === 'undefined') return fallback;

  const css = getComputedStyle(document.documentElement);
  const read = (name, tail) => {
    const v = css.getPropertyValue(name).trim();
    return v ? `${v}, ${tail}` : tail;
  };
  return {
    display: read('--font-display', fallback.display),
    body: read('--font-body', fallback.body),
    hindi: read('--font-hindi', fallback.hindi),
  };
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Letter-spaced centred text — canvas has no tracking we can rely on.
 * @returns {number} the drawn width, so callers can flank it with rules.
 */
function tracked(ctx, text, cx, y, spacing) {
  const chars = [...text];
  const width =
    chars.reduce((sum, c) => sum + ctx.measureText(c).width, 0) + spacing * (chars.length - 1);
  let x = cx - width / 2;
  const prev = ctx.textAlign;
  ctx.textAlign = 'left';
  for (const c of chars) {
    ctx.fillText(c, x, y);
    x += ctx.measureText(c).width + spacing;
  }
  ctx.textAlign = prev;
  return width;
}

function drawQR(ctx, value, x, y, box) {
  const { size: n, modules, isFunction } = encodeQR(value, 'H');
  const quiet = 2;
  const unit = box / (n + quiet * 2);
  const ox = x + quiet * unit;
  const oy = y + quiet * unit;

  const centre = n / 2;
  const holeR = n * 0.115;

  ctx.fillStyle = INK;
  for (let my = 0; my < n; my++) {
    for (let mx = 0; mx < n; mx++) {
      if (!modules[my][mx] || isEyeModule(mx, my, n)) continue;
      if (Math.hypot(mx + 0.5 - centre, my + 0.5 - centre) < holeR + 0.9) continue;
      // Function modules stay square — see the note in QRCode.jsx.
      if (isFunction[my][mx]) {
        roundRect(ctx, ox + mx * unit, oy + my * unit, unit, unit, unit * 0.14);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(ox + (mx + 0.5) * unit, oy + (my + 0.5) * unit, unit * 0.47, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Finder eyes, drawn rather than plotted.
  ctx.strokeStyle = GOLD;
  ctx.fillStyle = GOLD;
  for (const [ex, ey] of [
    [0, 0],
    [n - 7, 0],
    [0, n - 7],
  ]) {
    ctx.lineWidth = unit;
    roundRect(ctx, ox + (ex + 0.5) * unit, oy + (ey + 0.5) * unit, 6 * unit, 6 * unit, unit * 2);
    ctx.stroke();
    roundRect(ctx, ox + (ex + 2) * unit, oy + (ey + 2) * unit, 3 * unit, 3 * unit, unit * 1.05);
    ctx.fill();
  }

  // Punched centre with the Devanagari mark.
  const cx = ox + centre * unit;
  const cy = oy + centre * unit;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx, cy, (holeR + 0.75) * unit, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = unit * 0.34;
  ctx.beginPath();
  ctx.arc(cx, cy, (holeR + 0.2) * unit, 0, Math.PI * 2);
  ctx.stroke();

  const fonts = fontStacks();
  ctx.fillStyle = GOLD;
  ctx.font = `${holeR * unit * 1.02}px ${fonts.hindi}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('मधु', cx, cy + unit * 0.1);
}

/**
 * @returns {HTMLCanvasElement} the card, rendered at 2× for a crisp print.
 */
export function renderCardCanvas({ url, table = '', scale = 2 }) {
  const canvas = document.createElement('canvas');
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);

  const f = fontStacks();
  const cx = W / 2;

  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, W, H);

  // Warm bloom behind the code.
  const bloom = ctx.createRadialGradient(cx, 520, 40, cx, 520, 620);
  bloom.addColorStop(0, 'rgba(217,184,106,0.20)');
  bloom.addColorStop(1, 'rgba(217,184,106,0)');
  ctx.fillStyle = bloom;
  ctx.fillRect(0, 0, W, H);

  // Foil edge.
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 3;
  roundRect(ctx, 24, 24, W - 48, H - 48, 54);
  ctx.stroke();
  ctx.strokeStyle = GOLD_SOFT;
  ctx.lineWidth = 1.5;
  roundRect(ctx, 42, 42, W - 84, H - 84, 42);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  // Identity.
  ctx.fillStyle = 'rgba(168,131,56,0.85)';
  ctx.font = `34px ${f.hindi}`;
  ctx.fillText(site.nameDevanagari, cx, 150);

  // The same lockup the <Wordmark> renders on screen: the house name in the
  // display face, the trade tracked out beneath it under a gold hairline.
  const [house, ...rest] = site.name.split(' ');
  const trade = rest.join(' ').toUpperCase();

  ctx.font = `600 82px ${f.display}`;
  ctx.fillStyle = '#1D080C';
  ctx.fillText(house, cx, 232);

  if (trade) {
    ctx.fillStyle = GOLD;
    ctx.font = `500 19px ${f.body}`;
    const tradeW = tracked(ctx, trade, cx, 274, 9);
    // Hairlines run out to either side of the trade line.
    ctx.strokeStyle = GOLD_SOFT;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - tradeW / 2 - 96, 268);
    ctx.lineTo(cx - tradeW / 2 - 22, 268);
    ctx.moveTo(cx + tradeW / 2 + 22, 268);
    ctx.lineTo(cx + tradeW / 2 + 96, 268);
    ctx.stroke();
  }

  ctx.fillStyle = MUTED;
  ctx.font = `500 17px ${f.body}`;
  tracked(ctx, `EST. ${site.established}`, cx, 314, 7);

  // Code tile.
  const box = 560;
  const boxX = cx - box / 2;
  const boxY = 350;
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, boxX, boxY, box, box, 40);
  ctx.fill();
  ctx.strokeStyle = 'rgba(168,131,56,0.35)';
  ctx.lineWidth = 2;
  roundRect(ctx, boxX, boxY, box, box, 40);
  ctx.stroke();
  drawQR(ctx, url, boxX + 30, boxY + 30, box - 60);

  // Instruction.
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#1D080C';
  ctx.font = `300 52px ${f.display}`;
  ctx.fillText('Scan for the menu', cx, 985);

  ctx.fillStyle = 'rgba(168,131,56,0.9)';
  ctx.font = `30px ${f.hindi}`;
  ctx.fillText('मेन्यू के लिए स्कैन कीजिए', cx, 1031);

  ctx.fillStyle = MUTED;
  ctx.font = `22px ${f.body}`;
  ctx.fillText('Point your camera at the code. The whole kitchen', cx, 1073);
  ctx.fillText('opens on your phone — order without waiting.', cx, 1103);

  // Both branches land on the same baseline so the footer never runs off the
  // card, whether or not there is a table chip to fit in.
  let y = table ? 1158 : 1232;
  if (table) {
    const label = `TABLE ${table}`;
    ctx.font = `600 20px ${f.body}`;
    const chipW = ctx.measureText(label).width + 110;
    ctx.fillStyle = 'rgba(217,184,106,0.16)';
    roundRect(ctx, cx - chipW / 2, y - 32, chipW, 52, 26);
    ctx.fill();
    ctx.strokeStyle = 'rgba(168,131,56,0.5)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, cx - chipW / 2, y - 32, chipW, 52, 26);
    ctx.stroke();
    ctx.fillStyle = '#3A1019';
    tracked(ctx, label, cx, y + 2, 5);
    y += 74;
  }

  ctx.strokeStyle = GOLD_SOFT;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(120, y + 2);
  ctx.lineTo(W - 120, y + 2);
  ctx.stroke();

  ctx.fillStyle = MUTED;
  ctx.font = `italic 26px ${f.display}`;
  ctx.fillText(site.tagline, cx, y + 50);

  ctx.font = `16px ${f.body}`;
  ctx.fillStyle = '#6B5257';
  tracked(ctx, `${site.phone}  ·  11 AM – 11 PM`, cx, y + 92, 4);

  ctx.fillStyle = GOLD;
  tracked(ctx, site.url.replace('https://', '').toUpperCase(), cx, y + 126, 8);

  return canvas;
}

/** Render and hand the browser a PNG download. */
export async function downloadCardPNG({ url, table = '', filename }) {
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    // Without this the first export falls back to Georgia mid-draw.
    try {
      await document.fonts.ready;
    } catch {
      /* fonts are a nicety, not a blocker */
    }
  }

  const canvas = renderCardCanvas({ url, table });
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Could not render the card');

  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = filename ?? `madhurima-food-park-qr${table ? `-table-${table}` : ''}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(href);
}
