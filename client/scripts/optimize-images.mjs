// Generates the optimized profile image variants used by the links pages.
// Run with: node scripts/optimize-images.mjs
//
// The source proPic-500x500.png is ~616 KB and was previously shipped at full
// size even for the 36px sticky-bar avatar. These outputs cut the critical
// image payload by >95% while keeping the PNG as a <picture> fallback.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(__dirname, "../src/assets");
const source = path.join(assetsDir, "proPic-500x500.png");

const outputs = [
  { name: "proPic-avatar", size: 96 },
  { name: "proPic-hero", size: 500 },
];

async function main() {
  const input = await readFile(source);

  for (const { name, size } of outputs) {
    const base = sharp(input).resize(size, size, { fit: "cover" });

    const webp = await base.clone().webp({ quality: 80 }).toBuffer();
    await writeFile(path.join(assetsDir, `${name}.webp`), webp);

    const avif = await base.clone().avif({ quality: 50 }).toBuffer();
    await writeFile(path.join(assetsDir, `${name}.avif`), avif);

    console.log(
      `${name}: webp ${(webp.length / 1024).toFixed(1)} KB, avif ${(avif.length / 1024).toFixed(1)} KB`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
