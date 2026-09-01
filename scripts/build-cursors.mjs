/**
 * Builds the four Wii player pointers from public/PointerP1.svg.
 *
 * The source already draws player 1's numeral as a monoline stroked path
 * (`id="path42"`, stroke-width 1, butt caps). Rather than set type, each player
 * swaps that path's `d` and stroke colour, so 2/3/4 inherit the exact stroke
 * style — same weight, caps and joins — as the original "1".
 *
 * Player colours are sampled from the Wii U cursor sheet's swatch row.
 */
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.join(process.cwd(), 'public');
const pointer = path.join(publicDir, 'PointerP1.svg');

/**
 * Digit outlines in the source's own coordinate space, all sharing the "1"'s
 * vertical extent (y 149.512 to 153.491) and centred on its ink centre
 * (x 105.11), so every numeral sits identically on the fist.
 */
const DIGITS = {
  1: 'm 104.55548,149.51174 h 1.11107 v 3.97909',
  // The base runs the bowl's full ink width (103.61 to 106.61) rather than
  // stopping at the centreline, otherwise the tail looks clipped next to the
  // bowl, whose stroke extends half a unit past its endpoint.
  2:
    'M 104.11,150.785 C 104.11,149.088 106.11,149.088 106.11,150.785 ' +
    'C 106.11,151.95 104.55,152.60 103.61,153.491 L 106.61,153.491',
  3:
    'M 104.11,150.63 C 104.11,149.139 106.11,149.139 106.11,150.63 ' +
    'C 106.11,151.30 105.55,151.50 105.05,151.50 ' +
    'C 105.55,151.50 106.11,151.70 106.11,152.37 ' +
    'C 106.11,153.865 104.11,153.865 104.11,152.37',
  4: 'M 105.56,149.512 V 153.491 M 105.56,149.512 L 103.86,152.138 H 106.36',
};

/**
 * The source numeral sits large and high on the fist; the console's own
 * pointers carry a smaller one. Scaling via transform (rather than redrawing)
 * shrinks stroke-width along with the geometry, so the weight stays in
 * proportion instead of turning chunky.
 */
const NUMERAL_SCALE = 0.7;
const NUMERAL_CENTER = { x: 105.11, y: 151.6 };

const NUMERAL_TRANSFORM =
  `translate(${(NUMERAL_CENTER.x * (1 - NUMERAL_SCALE)).toFixed(4)},` +
  `${(NUMERAL_CENTER.y * (1 - NUMERAL_SCALE)).toFixed(4)}) scale(${NUMERAL_SCALE})`;

const PLAYERS = [
  { n: 1, color: '#008cff', tint: '#bfe2ff' },
  { n: 2, color: '#ff4033', tint: '#ffd2cc' },
  { n: 3, color: '#00a65f', tint: '#c4f0dc' },
  { n: 4, color: '#ffb300', tint: '#ffe7b8' },
];

const SIZES = [
  { px: 64, file: (n) => `wii-pointer-p${n}.png` }, // what the browser draws
  { px: 128, file: (n) => `wii-pointer-p${n}-lg.png` }, // crisper copy for the picker UI
];

/** The SVG is 20mm wide; supersample at 4x so downscaling smooths the edges. */
const density = (px) => Math.round((px * 4) / (20 / 25.4));

if (!existsSync(pointer)) throw new Error(`missing source: ${pointer}`);

const svg = readFileSync(pointer, 'utf8');
const numeralTag = svg.match(/<path\b[^>]*\bid="path42"[^>]*\/>/);
if (!numeralTag) throw new Error('could not find path42 (the numeral) in PointerP1.svg');

for (const player of PLAYERS) {
  const numeral = numeralTag[0]
    .replace(/\sd="[^"]*"/, ` d="${DIGITS[player.n]}"`)
    .replace('stroke:#008cff', `stroke:${player.color}`)
    .replace(/\s*\/>$/, ` transform="${NUMERAL_TRANSFORM}" />`);

  const variant = svg
    .replace(numeralTag[0], numeral)
    .replaceAll('#bfe2ff', player.tint);

  for (const { px, file } of SIZES) {
    await sharp(Buffer.from(variant), { density: density(px) })
      .resize(px, px, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toFile(path.join(publicDir, file(player.n)));
  }

  console.log(`cursor -> wii-pointer-p${player.n}.png (${player.color})`);
}
