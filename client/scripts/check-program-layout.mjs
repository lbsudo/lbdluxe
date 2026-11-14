/**
 * Layout guard for the generated program PDF.
 *
 *   node scripts/check-program-layout.mjs
 *
 * Loads the rendered HTML in headless Chromium and reports any .page whose
 * content overflows its 8.5in x 11in box. Because the CSS clips overflow,
 * an overfull page would silently drop content in the PDF — this catches it
 * before the PDF is built.
 */

import { execFile } from "node:child_process"
import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"

const execFileAsync = promisify(execFile)

const dir = path.dirname(fileURLToPath(import.meta.url))
const clientDir = path.resolve(dir, "..")
const htmlPath = path.join(clientDir, ".program-build", "foundation-30.html")

const CHROMIUM = process.env.CHROMIUM_PATH || "chromium"

const probe = `
<script>
window.addEventListener('load', () => {
  const out = []
  document.querySelectorAll('.page').forEach((el, i) => {
    const over = el.scrollHeight - el.clientHeight
    const overW = el.scrollWidth - el.clientWidth
    // Find the deepest offending child so the report is actionable.
    let worst = null
    if (over > 1 || overW > 1) {
      for (const child of el.querySelectorAll('*')) {
        const cy = child.getBoundingClientRect().bottom - el.getBoundingClientRect().bottom
        const cx = child.getBoundingClientRect().right - el.getBoundingClientRect().right
        if (cy > 1 || cx > 1) {
          if (!worst || cy > worst.overflow) {
            worst = { overflow: Math.max(cy, 0), tag: child.tagName, cls: child.className, text: (child.textContent || '').trim().slice(0, 60) }
          }
        }
      }
    }
    out.push({ page: i + 1, over, overW, worst })
  })
  document.title = 'RESULT' + JSON.stringify(out)
})
</script>
`

const html = await readFile(htmlPath, "utf8")
const probePath = path.join(path.dirname(htmlPath), "probe.html")
await (await import("node:fs/promises")).writeFile(
  probePath,
  html.replace("</body>", `${probe}</body>`),
  "utf8",
)

const { stdout } = await execFileAsync(
  CHROMIUM,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--virtual-time-budget=8000",
    "--dump-dom",
    `file://${probePath}`,
  ],
  { cwd: clientDir, maxBuffer: 64 * 1024 * 1024 },
)

const match = stdout.match(/RESULT(\[.*?\])<\/title>/s)
if (!match) {
  console.error("Could not read the layout probe result.")
  process.exit(2)
}

const results = JSON.parse(match[1])
const bad = results.filter((r) => r.over > 1 || r.overW > 1)

console.log(`Checked ${results.length} pages.`)
if (bad.length === 0) {
  console.log("No overflow detected.")
} else {
  for (const r of bad) {
    console.log(
      `  OVERFLOW page ${r.page}: +${r.over}px vertical, +${r.overW}px horizontal` +
        (r.worst ? ` — worst: <${r.worst.tag}> "${r.worst.text}"` : ""),
    )
  }
  process.exitCode = 1
}
