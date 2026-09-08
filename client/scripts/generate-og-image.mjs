import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(dir, "../public/og-image.png");

const W = 1200;
const H = 630;

const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a0a"/>
      <stop offset="100%" stop-color="#141014"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.82" cy="0.18" r="0.75">
      <stop offset="0%" stop-color="#8F4BD2" stop-opacity="0.4"/>
      <stop offset="60%" stop-color="#8F4BD2" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#8F4BD2" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- accent slash -->
  <path d="M0 470 L470 0" stroke="#8F4BD2" stroke-opacity="0.5" stroke-width="6" fill="none"/>
  <path d="M40 630 L570 470" stroke="#8F4BD2" stroke-opacity="0.25" stroke-width="3" fill="none"/>

  <g>
    <text x="600" y="330" font-family="Arial, Helvetica, sans-serif"
      font-size="150" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="14">
      LBDLUXE
    </text>
    <text x="600" y="400" font-family="Arial, Helvetica, sans-serif"
      font-size="42" font-weight="400" fill="#c8c8c8" text-anchor="middle" letter-spacing="2">
      Lawrence Brown &#183; Full-Stack Developer
    </text>
    <text x="600" y="470" font-family="Arial, Helvetica, sans-serif"
      font-size="30" font-weight="700" fill="#8F4BD2" text-anchor="middle" letter-spacing="6">
      lbdluxe.com
    </text>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(OUT);
console.log(`Wrote ${OUT}`);