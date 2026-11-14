/**
 * Builds the cover images for THE FOUNDATION 30 — DAY RECOMP.
 *
 *   node scripts/build-program-cover.mjs
 *
 * Two sizes are produced, because the shop card and the social preview crop
 * differently:
 *
 *   foundation-30-day-recomp-cover.png  1200x900 (4:3)  shop card
 *   foundation-30-day-recomp-og.png     1200x630 (16:9) social / link preview
 *
 * Rendered through headless Chromium rather than sharp's SVG rasteriser so the
 * display type is the real brand font with its gradient, not an approximation.
 */

import { execFile } from "node:child_process"
import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"

import { program } from "../src/content/programs/foundation-30/program.ts"

const execFileAsync = promisify(execFile)

const dir = path.dirname(fileURLToPath(import.meta.url))
const clientDir = path.resolve(dir, "..")
const outDir = path.join(clientDir, "public", "programs")
const fontsDir = path.join(clientDir, "public", "fonts")

const CHROMIUM = process.env.CHROMIUM_PATH || "chromium"

const toDataUri = async (file, mime) => {
  const buf = await readFile(file)
  return `data:${mime};base64,${buf.toString("base64")}`
}

const bebas = await toDataUri(
  path.join(fontsDir, "bebas", "BebasNeue-latin.woff2"),
  "font/woff2",
)
const switzer = await toDataUri(
  path.join(fontsDir, "switzer", "Switzer-Regular.woff2"),
  "font/woff2",
)

/**
 * Builds the markup for a given canvas.
 *
 * The 4:3 version is the shop card, so the title is larger and the stat row
 * sits along the bottom. The 16:9 version is a link preview, where the title
 * needs to survive being cropped small in a feed.
 */
const markup = (w, h) => {
  const isCard = h / w > 0.6
  const pad = isCard ? 56 : 64
  // The shop card stamps a "FREE" badge in its top-left corner. The card
  // variant therefore starts its eyebrow to the right of where that badge
  // lands, so the two never crowd each other.
  const eyebrowLeft = isCard ? 176 : 0
  const titleSize = isCard ? 108 : 132
  const subSize = isCard ? 26 : 22
  const stats = program.stats
    .map(
      (s) =>
        `<div class="stat"><div class="n">${s.value}</div><div class="l">${s.label}</div></div>`,
    )
    .join("")

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
@font-face { font-family:"Bebas Neue"; src:url("${bebas}") format("woff2"); font-weight:400; }
@font-face { font-family:"Switzer"; src:url("${switzer}") format("woff2"); font-weight:400; }
* { box-sizing:border-box; }
html, body { margin:0; padding:0; width:${w}px; height:${h}px; overflow:hidden; background:#0b0a14; }
.wrap {
  width:${w}px; height:${h}px; padding:${pad}px; position:relative;
  background:
    radial-gradient(${Math.round(w * 0.63)}px ${Math.round(h * 0.73)}px at 82% 12%, rgba(255,106,213,.18), transparent 62%),
    radial-gradient(${Math.round(w * 0.58)}px ${Math.round(h * 0.67)}px at 8% 96%, rgba(127,231,245,.16), transparent 60%),
    #0b0a14;
  font-family:"Switzer", system-ui, sans-serif; color:#f2f2f6;
}
.eyebrow { font-size:${isCard ? 14 : 15}px; letter-spacing:.34em; text-transform:uppercase; color:#7fe7f5; margin-left:${eyebrowLeft}px; }
h1 {
  font-family:"Bebas Neue", sans-serif; font-weight:400;
  font-size:${titleSize}px; line-height:.86; margin:${isCard ? 22 : 26}px 0 0; letter-spacing:.01em;
  background:linear-gradient(100deg,#7fe7f5 0%,#ff6ad5 100%);
  -webkit-background-clip:text; background-clip:text; color:transparent;
}
.sub { margin:${isCard ? 18 : 22}px 0 0; font-size:${subSize}px; line-height:1.45; color:#a7a3bd; max-width:${Math.round(w * 0.62)}px; }
.rule { height:4px; width:150px; margin:${isCard ? 20 : 26}px 0 0; background:linear-gradient(90deg,#7fe7f5,#ff6ad5); }
.stats { position:absolute; left:${pad}px; right:${pad}px; bottom:${isCard ? 52 : 58}px; display:grid; grid-template-columns:repeat(4,1fr); gap:${isCard ? 16 : 18}px; }
.stat { background:rgba(255,255,255,.045); border:1px solid rgba(127,231,245,.22); border-radius:14px; padding:${isCard ? 14 : 16}px ${isCard ? 16 : 18}px; }
.stat .n { font-family:"Bebas Neue"; font-size:${isCard ? 36 : 40}px; line-height:1; color:#7fe7f5; }
.stat .l { font-size:12px; letter-spacing:.18em; text-transform:uppercase; color:#a7a3bd; margin-top:7px; }
.brand { position:absolute; right:${pad}px; top:${pad}px; font-size:14px; letter-spacing:.3em; text-transform:uppercase; color:#6f6c85; }
</style>
</head>
<body>
<div class="wrap">
  <div class="brand">${program.brand}</div>
  <div class="eyebrow">Beginner Calisthenics</div>
  <h1>THE FOUNDATION 30<br>DAY RECOMP</h1>
  <div class="rule"></div>
  <p class="sub">${program.tagline} A complete beginner program for building muscle and losing fat at the same time.</p>
  <div class="stats">${stats}</div>
</div>
</body>
</html>`
}

const targets = [
  { file: "foundation-30-day-recomp-cover.png", w: 1200, h: 900 },
  { file: "foundation-30-day-recomp-og.png", w: 1200, h: 630 },
]

await mkdir(outDir, { recursive: true })

for (const t of targets) {
  const html = markup(t.w, t.h)
  const tmpHtml = path.join(outDir, `.cover-${t.w}x${t.h}.html`)
  await writeFile(tmpHtml, html, "utf8")

  const outFile = path.join(outDir, t.file)
  await execFileAsync(
    CHROMIUM,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      `--screenshot=${outFile}`,
      `--window-size=${t.w},${t.h}`,
      `file://${tmpHtml}`,
    ],
    { cwd: clientDir },
  )

  console.log(`Wrote ${outFile} (${t.w}x${t.h})`)

  // The rendered HTML is scratch space, not an asset.
  await rm(tmpHtml, { force: true })
}
