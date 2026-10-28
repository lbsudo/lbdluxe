// Generates the PWA icon set used by the card app's web app manifest.
// Run with: node scripts/generate-pwa-icons.mjs
//
// The monogram is read out of index.html rather than duplicated here: the boot
// screen already ships the exact "LB" paths as a flat, transform-free SVG, so
// there is one source of truth for the mark and the icon can never drift from
// what the site boots with.
//
// Outputs are committed to client/public/icons/ (the same way og-image.png is)
// so both the dev server and the production build serve them without a
// generate-on-build step.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.resolve(__dirname, "..");
const indexHtmlPath = path.join(clientDir, "index.html");
const outDir = path.join(clientDir, "public/icons");

// The boot mark's viewBox. The monogram fills it edge to edge.
const VIEW_BOX = "-9 -9 141 140";
const BG = "#0a0a0a";
const ACCENT = "#6366f1"; // matches CARD_BRAND in components/pages/card/theme.ts

/**
 * Pulls the two monogram path definitions out of the boot screen's inline SVG.
 * Throws loudly if the markup ever changes shape — a broken icon should fail
 * the generator, not silently ship a blank square.
 */
function extractMonogramPaths(html) {
  const block = html.match(
    /<svg[^>]*class="boot-mark"[\s\S]*?<\/svg>/,
  );
  if (!block) {
    throw new Error(
      'Could not find the <svg class="boot-mark"> block in index.html.',
    );
  }
  const paths = [...block[0].matchAll(/<path\s+d="([^"]+)"/g)].map((m) => m[1]);
  if (paths.length !== 2) {
    throw new Error(
      `Expected 2 monogram paths in the boot-mark SVG, found ${paths.length}.`,
    );
  }
  return paths;
}

/** The bare monogram, white on transparency, at a generous working size. */
function monogramSvg(paths) {
  const body = paths
    .map((d) => `<path d="${d}" fill="#ffffff"/>`)
    .join("");
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEW_BOX}" width="1024" height="1024">${body}</svg>`,
  );
}

/** The icon background: flat brand black with a soft accent glow up top. */
function backgroundSvg(size) {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <defs>
        <radialGradient id="glow" cx="0.5" cy="0.32" r="0.72">
          <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.38"/>
          <stop offset="55%" stop-color="${ACCENT}" stop-opacity="0.10"/>
          <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="${BG}"/>
      <rect width="${size}" height="${size}" fill="url(#glow)"/>
    </svg>`,
  );
}

/**
 * Composes one icon: background + centered monogram.
 *
 * `fill` is the fraction of the canvas the monogram spans.
 *  - "any" icons use ~0.74: enough presence without touching the edges.
 *  - "maskable" icons use ~0.52: the platform may crop the canvas to a
 *    circle inscribed in the middle 80%, so the mark has to clear that.
 */
async function compose(monogram, size, fill) {
  const markSize = Math.round(size * fill);
  const mark = await sharp(monogram)
    .resize(markSize, markSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  return sharp(backgroundSvg(size))
    .composite([{ input: mark, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

const outputs = [
  { name: "icon-192.png", size: 192, fill: 0.74 },
  { name: "icon-512.png", size: 512, fill: 0.74 },
  { name: "maskable-512.png", size: 512, fill: 0.52 },
  { name: "apple-touch-icon-180.png", size: 180, fill: 0.74 },
];

async function main() {
  const html = await readFile(indexHtmlPath, "utf8");
  const paths = extractMonogramPaths(html);
  const monogram = monogramSvg(paths);

  await mkdir(outDir, { recursive: true });

  for (const { name, size, fill } of outputs) {
    const png = await compose(monogram, size, fill);
    const file = path.join(outDir, name);
    await writeFile(file, png);
    console.log(`${name}: ${size}x${size}, ${(png.length / 1024).toFixed(1)} KB`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
