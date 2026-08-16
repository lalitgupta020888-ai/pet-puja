/**
 * A small, dependency-free QR Code encoder (ISO/IEC 18004), byte mode only.
 *
 * We generate the code ourselves rather than pull a library in because the card
 * needs custom module shapes — rounded dots, drawn eyes, a punched-out centre for
 * the logo. That needs the raw module matrix, which is all this file returns.
 *
 * `encodeQR()` hands back `{ version, size, modules }` where `modules[y][x]` is
 * true for a dark module. Rendering lives in components/QRCode.jsx.
 */

const FORMAT_BITS = { L: 1, M: 0, Q: 3, H: 2 };
const ECL_INDEX = { L: 0, M: 1, Q: 2, H: 3 };

// Index 0 is padding so the version number indexes directly.
// prettier-ignore
const ECC_CODEWORDS_PER_BLOCK = [
  [-1, 7,10,15,20,26,18,20,24,30,18,20,24,26,30,22,24,28,30,28,28,28,28,30,30,26,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30], // L
  [-1,10,16,26,18,24,16,18,22,22,20,24,28,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,28,28,28,28,28,28,28,28,28,28,28], // M
  [-1,13,22,18,26,18,24,18,22,20,24,28,26,24,20,30,24,28,28,26,30,28,30,30,30,30,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30], // Q
  [-1,17,28,22,16,22,28,26,26,24,28,24,28,22,24,24,30,28,28,26,28,30,24,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30], // H
];

// prettier-ignore
const NUM_ECC_BLOCKS = [
  [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9,10,12,12,12,13,14,15,16,17,18,19,19,20,21,22,24,25], // L
  [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9,10,10,11,13,14,16,17,17,18,20,21,23,25,26,28,29,31,33,35,37,38,40,43,45,47,49], // M
  [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8,10,12,16,12,17,16,18,21,20,23,23,25,27,29,34,34,35,38,40,43,45,48,51,53,56,59,62,65,68], // Q
  [-1, 1, 1, 2, 4, 4, 4, 5, 5, 8, 8,11,11,16,16,18,16,19,21,25,25,25,34,30,32,35,37,40,42,45,48,51,54,57,60,63,66,70,74,77,81], // H
];

/* ------------------------------------------------------------------ GF(256) */

/** Multiply in GF(2^8) modulo the QR primitive polynomial x^8+x^4+x^3+x^2+1. */
function gfMul(x, y) {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z & 0xff;
}

function rsDivisor(degree) {
  const result = new Uint8Array(degree);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) {
      result[j] = gfMul(result[j], root);
      if (j + 1 < degree) result[j] ^= result[j + 1];
    }
    root = gfMul(root, 0x02);
  }
  return result;
}

function rsRemainder(data, divisor) {
  const result = new Uint8Array(divisor.length);
  for (const b of data) {
    const factor = b ^ result[0];
    result.copyWithin(0, 1);
    result[result.length - 1] = 0;
    for (let i = 0; i < result.length; i++) result[i] ^= gfMul(divisor[i], factor);
  }
  return result;
}

/* ------------------------------------------------------------- capacities */

function numRawDataModules(ver) {
  let result = (16 * ver + 128) * ver + 64;
  if (ver >= 2) {
    const numAlign = Math.floor(ver / 7) + 2;
    result -= (25 * numAlign - 10) * numAlign - 55;
    if (ver >= 7) result -= 36;
  }
  return result;
}

function numDataCodewords(ver, ecl) {
  const e = ECL_INDEX[ecl];
  return (
    Math.floor(numRawDataModules(ver) / 8) -
    ECC_CODEWORDS_PER_BLOCK[e][ver] * NUM_ECC_BLOCKS[e][ver]
  );
}

const charCountBits = (ver) => (ver <= 9 ? 8 : 16);

/* --------------------------------------------------------------- assembly */

function addEccAndInterleave(data, ver, ecl) {
  const e = ECL_INDEX[ecl];
  const numBlocks = NUM_ECC_BLOCKS[e][ver];
  const blockEccLen = ECC_CODEWORDS_PER_BLOCK[e][ver];
  const rawCodewords = Math.floor(numRawDataModules(ver) / 8);
  const numShortBlocks = numBlocks - (rawCodewords % numBlocks);
  const shortBlockLen = Math.floor(rawCodewords / numBlocks);

  const divisor = rsDivisor(blockEccLen);
  const blocks = [];

  for (let i = 0, k = 0; i < numBlocks; i++) {
    const len = shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1);
    const dat = data.slice(k, k + len);
    k += len;
    const ecc = rsRemainder(dat, divisor);
    // Short blocks carry a placeholder so every block is the same length when
    // interleaving; the placeholder is skipped on the way out.
    if (i < numShortBlocks) dat.push(0);
    blocks.push(dat.concat(Array.from(ecc)));
  }

  const result = [];
  for (let i = 0; i < blocks[0].length; i++) {
    blocks.forEach((block, j) => {
      if (i !== shortBlockLen - blockEccLen || j >= numShortBlocks) result.push(block[i]);
    });
  }
  return result;
}

const getBit = (x, i) => ((x >>> i) & 1) !== 0;

/* ----------------------------------------------------------------- matrix */

class Matrix {
  constructor(version, ecl) {
    this.version = version;
    this.ecl = ecl;
    this.size = version * 4 + 17;
    const row = () => new Array(this.size).fill(false);
    this.modules = Array.from({ length: this.size }, row);
    this.isFunction = Array.from({ length: this.size }, row);
  }

  set(x, y, dark) {
    this.modules[y][x] = dark;
    this.isFunction[y][x] = true;
  }

  alignmentPositions() {
    const ver = this.version;
    if (ver === 1) return [];
    const numAlign = Math.floor(ver / 7) + 2;
    const step = ver === 32 ? 26 : Math.ceil((ver * 4 + 4) / (numAlign * 2 - 2)) * 2;
    const result = [6];
    for (let pos = this.size - 7; result.length < numAlign; pos -= step) result.splice(1, 0, pos);
    return result;
  }

  drawFinder(cx, cy) {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        const x = cx + dx;
        const y = cy + dy;
        if (x >= 0 && x < this.size && y >= 0 && y < this.size) {
          this.set(x, y, dist !== 2 && dist !== 4);
        }
      }
    }
  }

  drawAlignment(cx, cy) {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        this.set(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }
    }
  }

  drawFormatBits(mask) {
    const data = (FORMAT_BITS[this.ecl] << 3) | mask;
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = ((data << 10) | rem) ^ 0x5412;

    for (let i = 0; i <= 5; i++) this.set(8, i, getBit(bits, i));
    this.set(8, 7, getBit(bits, 6));
    this.set(8, 8, getBit(bits, 7));
    this.set(7, 8, getBit(bits, 8));
    for (let i = 9; i < 15; i++) this.set(14 - i, 8, getBit(bits, i));

    for (let i = 0; i < 8; i++) this.set(this.size - 1 - i, 8, getBit(bits, i));
    for (let i = 8; i < 15; i++) this.set(8, this.size - 15 + i, getBit(bits, i));
    this.set(8, this.size - 8, true); // the always-dark module
  }

  drawVersionBits() {
    if (this.version < 7) return;
    let rem = this.version;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bits = (this.version << 12) | rem;

    for (let i = 0; i < 18; i++) {
      const dark = getBit(bits, i);
      const a = this.size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      this.set(a, b, dark);
      this.set(b, a, dark);
    }
  }

  drawFunctionPatterns() {
    for (let i = 0; i < this.size; i++) {
      this.set(6, i, i % 2 === 0);
      this.set(i, 6, i % 2 === 0);
    }

    this.drawFinder(3, 3);
    this.drawFinder(this.size - 4, 3);
    this.drawFinder(3, this.size - 4);

    const pos = this.alignmentPositions();
    const n = pos.length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const corner =
          (i === 0 && j === 0) || (i === 0 && j === n - 1) || (i === n - 1 && j === 0);
        if (!corner) this.drawAlignment(pos[i], pos[j]);
      }
    }

    this.drawFormatBits(0); // replaced once the mask is chosen
    this.drawVersionBits();
  }

  drawCodewords(data) {
    let i = 0;
    for (let right = this.size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5; // the vertical timing column is skipped
      for (let vert = 0; vert < this.size; vert++) {
        for (let j = 0; j < 2; j++) {
          const x = right - j;
          const upward = ((right + 1) & 2) === 0;
          const y = upward ? this.size - 1 - vert : vert;
          if (!this.isFunction[y][x] && i < data.length * 8) {
            this.modules[y][x] = getBit(data[i >>> 3], 7 - (i & 7));
            i++;
          }
        }
      }
    }
  }

  /** XOR the mask over every non-function module. Applying twice undoes it. */
  applyMask(mask) {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.isFunction[y][x]) continue;
        let invert = false;
        switch (mask) {
          case 0: invert = (x + y) % 2 === 0; break;
          case 1: invert = y % 2 === 0; break;
          case 2: invert = x % 3 === 0; break;
          case 3: invert = (x + y) % 3 === 0; break;
          case 4: invert = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; break;
          case 5: invert = ((x * y) % 2) + ((x * y) % 3) === 0; break;
          case 6: invert = (((x * y) % 2) + ((x * y) % 3)) % 2 === 0; break;
          default: invert = (((x + y) % 2) + ((x * y) % 3)) % 2 === 0; break;
        }
        if (invert) this.modules[y][x] = !this.modules[y][x];
      }
    }
  }

  /** The four penalty rules from the spec — lower is a better-looking code. */
  penalty() {
    const n = this.size;
    const m = this.modules;
    let score = 0;

    const FINDER = [true, false, true, true, true, false, true, false, false, false, false];
    const matches = (line, at, pattern) => {
      for (let k = 0; k < pattern.length; k++) if (line[at + k] !== pattern[k]) return false;
      return true;
    };

    const scanLine = (line) => {
      let runColor = line[0];
      let runLen = 1;
      for (let i = 1; i < n; i++) {
        if (line[i] === runColor) {
          runLen++;
        } else {
          if (runLen >= 5) score += 3 + (runLen - 5);
          runColor = line[i];
          runLen = 1;
        }
      }
      if (runLen >= 5) score += 3 + (runLen - 5);

      for (let i = 0; i + FINDER.length <= n; i++) {
        if (matches(line, i, FINDER)) score += 40;
        if (matches(line, i, [...FINDER].reverse())) score += 40;
      }
    };

    for (let y = 0; y < n; y++) scanLine(m[y]);
    for (let x = 0; x < n; x++) scanLine(m.map((row) => row[x]));

    for (let y = 0; y < n - 1; y++) {
      for (let x = 0; x < n - 1; x++) {
        const c = m[y][x];
        if (c === m[y][x + 1] && c === m[y + 1][x] && c === m[y + 1][x + 1]) score += 3;
      }
    }

    let dark = 0;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (m[y][x]) dark++;
    const total = n * n;
    score += Math.floor(Math.abs(dark * 20 - total * 10) / total) * 10;

    return score;
  }
}

/* ------------------------------------------------------------------ public */

/**
 * Encode `text` as a QR code.
 *
 * @param {string} text        payload — a URL, in our case
 * @param {'L'|'M'|'Q'|'H'} ecl error-correction level; 'H' tolerates the logo
 *                              punched into the middle of the card
 * @param {number} minVersion   force a floor on the version (bigger = denser)
 */
export function encodeQR(text, ecl = 'H', minVersion = 1) {
  const bytes = Array.from(new TextEncoder().encode(text));

  let version = 0;
  for (let v = Math.max(1, minVersion); v <= 40; v++) {
    const capacity = numDataCodewords(v, ecl) * 8;
    if (4 + charCountBits(v) + bytes.length * 8 <= capacity) {
      version = v;
      break;
    }
  }
  if (!version) throw new Error('QR payload too long for a single code');

  // Bit stream: mode indicator, length, payload, terminator, padding.
  const bits = [];
  const push = (val, len) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
  };

  push(0b0100, 4);
  push(bytes.length, charCountBits(version));
  bytes.forEach((b) => push(b, 8));

  const capacity = numDataCodewords(version, ecl) * 8;
  push(0, Math.min(4, capacity - bits.length));
  push(0, (8 - (bits.length % 8)) % 8);
  for (let pad = 0xec; bits.length < capacity; pad ^= 0xec ^ 0x11) push(pad, 8);

  const codewords = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j];
    codewords.push(byte);
  }

  const matrix = new Matrix(version, ecl);
  matrix.drawFunctionPatterns();
  matrix.drawCodewords(addEccAndInterleave(codewords, version, ecl));

  let bestMask = 0;
  let bestPenalty = Infinity;
  for (let mask = 0; mask < 8; mask++) {
    matrix.applyMask(mask);
    matrix.drawFormatBits(mask);
    const p = matrix.penalty();
    if (p < bestPenalty) {
      bestPenalty = p;
      bestMask = mask;
    }
    matrix.applyMask(mask); // undo
  }
  matrix.applyMask(bestMask);
  matrix.drawFormatBits(bestMask);

  return {
    version,
    size: matrix.size,
    modules: matrix.modules,
    // Renderers need this: timing, alignment and format modules must stay solid
    // or a scanner cannot lock onto the grid. Only data modules get styled.
    isFunction: matrix.isFunction,
    mask: bestMask,
  };
}

/** True where a module belongs to one of the three finder eyes. */
export function isEyeModule(x, y, size) {
  return (
    (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7)
  );
}
