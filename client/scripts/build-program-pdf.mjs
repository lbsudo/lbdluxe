/**
 * Builds the branded PDF for THE FOUNDATION 30 — DAY RECOMP.
 *
 *   node scripts/build-program-pdf.mjs
 *
 * Renders the shared program module to print-oriented HTML and drives headless
 * Chromium to produce client/public/programs/foundation-30-day-recomp.pdf.
 *
 * Design notes:
 *  - Page geometry is US Letter (8.5in x 11in). Each .page div is exactly one
 *    page tall and breaks after itself, so pagination is explicit rather than
 *    whatever the renderer decides.
 *  - Fonts are inlined as base64 so the build has no dependency on system
 *    fonts, on the network, or on where Chromium is looking.
 *  - Chromium sets the PDF title from <title>; author/subject/keywords are
 *    stamped afterwards with pdf-lib.
 */

import { execFile } from "node:child_process"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"

import {
  benchmark,
  calendar,
  cooldown,
  exercises,
  exerciseOrder,
  getExercise,
  program,
  totalSessions,
  warmUp,
  weeks,
} from "../src/content/programs/foundation-30/program.ts"
import {
  cta,
  disclaimer,
  faq,
  nextSteps,
  nutrition,
  recovery,
  safety,
  tracking,
} from "../src/content/programs/foundation-30/guide.ts"

const execFileAsync = promisify(execFile)

const dir = path.dirname(fileURLToPath(import.meta.url))
const clientDir = path.resolve(dir, "..")
const outDir = path.join(clientDir, "public", "programs")
const scratchDir = path.join(clientDir, ".program-build")
const outFile = path.join(outDir, "foundation-30-day-recomp.pdf")
const fontsDir = path.join(clientDir, "public", "fonts")

await mkdir(path.join(clientDir, "public", "programs"), { recursive: true })
await mkdir(path.join(clientDir, ".program-build"), { recursive: true })

const CHROMIUM = process.env.CHROMIUM_PATH || "chromium"

/* ------------------------------------------------------------------ fonts -- */

const toDataUri = async (file, mime) => {
  const buf = await readFile(file)
  return `data:${mime};base64,${buf.toString("base64")}`
}

const fonts = {
  bebas: await toDataUri(path.join(fontsDir, "bebas", "BebasNeue-latin.woff2"), "font/woff2"),
  switzer: await toDataUri(path.join(fontsDir, "switzer", "Switzer-Regular.woff2"), "font/woff2"),
}

/* ------------------------------------------------------------------ theme -- */

const C = {
  bg: "#0b0a14",
  panel: "rgba(255,255,255,0.045)",
  border: "rgba(127,231,245,0.22)",
  cyan: "#7fe7f5",
  magenta: "#ff6ad5",
  text: "#f2f2f6",
  muted: "#a7a3bd",
  dim: "#6f6c85",
}

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

/* ------------------------------------------------------------------- css --- */

const css = `
@font-face { font-family:"Bebas Neue"; src:url("${fonts.bebas}") format("woff2"); font-weight:400; font-display:block; }
@font-face { font-family:"Switzer"; src:url("${fonts.switzer}") format("woff2"); font-weight:400; font-display:block; }

@page { size: 8.5in 11in; margin: 0; }
* { box-sizing: border-box; }
html, body { margin:0; padding:0; background:${C.bg}; }
body { font-family:"Switzer", system-ui, sans-serif; color:${C.text}; -webkit-print-color-adjust:exact; print-color-adjust:exact; }

.page {
  width:8.5in; height:11in; position:relative; overflow:hidden;
  background:${C.bg}; padding:0.72in 0.78in 0.62in;
  page-break-after:always; break-after:page;
}
.page:last-child { page-break-after:auto; break-after:auto; }

h1,h2,h3,h4 { font-family:"Bebas Neue", sans-serif; font-weight:400; margin:0; letter-spacing:.02em; }
h1 { font-size:74px; line-height:.9; }
h2 { font-size:44px; line-height:.94; }
h3 { font-size:26px; line-height:1.02; letter-spacing:.03em; }
h4 { font-size:19px; line-height:1.1; letter-spacing:.06em; }
p  { margin:0 0 .12in; font-size:11.2px; line-height:1.62; color:${C.muted}; }
strong { color:${C.text}; font-weight:400; }
em { color:${C.cyan}; font-style:normal; }

.eyebrow { font-size:8.6px; letter-spacing:.34em; text-transform:uppercase; color:${C.cyan}; }
.display { background:linear-gradient(100deg, ${C.cyan} 0%, ${C.magenta} 100%); -webkit-background-clip:text; background-clip:text; color:transparent; display:inline-block; }
.sub { font-size:13px; line-height:1.55; color:${C.muted}; }
.rule { height:3px; width:1.05in; background:linear-gradient(90deg, ${C.cyan}, ${C.magenta}); margin:.2in 0 .22in; }
.rule.thin { height:1px; background:${C.border}; margin:.16in 0; width:100%; }

.stat { background:${C.panel}; border:1px solid ${C.border}; border-radius:12px; padding:.17in .19in; }
.stat .n { font-family:"Bebas Neue"; font-size:34px; line-height:1; color:${C.cyan}; }
.stat .l { font-size:8.2px; letter-spacing:.18em; text-transform:uppercase; color:${C.muted}; margin-top:.05in; }

.card { background:${C.panel}; border:1px solid ${C.border}; border-radius:12px; padding:.19in .21in; }
.card h4 { color:${C.text}; margin-bottom:.05in; }
.card p { margin:0; font-size:10.2px; line-height:1.55; }

.cols2 { display:grid; grid-template-columns:1fr 1fr; gap:.16in; }
.cols3 { display:grid; grid-template-columns:repeat(3,1fr); gap:.16in; }
.cols4 { display:grid; grid-template-columns:repeat(4,1fr); gap:.14in; }

/* Exercise library: two independent columns, each packed to the page height. */
.libcols { display:grid; grid-template-columns:1fr 1fr; gap:.16in; align-items:start; }
.libcol { display:flex; flex-direction:column; gap:.085in; }
.libcol .card { break-inside:avoid; page-break-inside:avoid; }

table { width:100%; border-collapse:collapse; font-size:10.4px; }
th { font-family:"Bebas Neue"; font-size:14px; letter-spacing:.05em; text-align:left; color:${C.cyan};
     border-bottom:1px solid ${C.cyan}; padding:.055in .07in; }
td { padding:.052in .07in; border-bottom:1px solid rgba(255,255,255,.09); vertical-align:top; color:${C.muted}; }
td strong { color:${C.text}; }
tr { break-inside:avoid; page-break-inside:avoid; }
.tnum { font-family:"Bebas Neue"; font-size:15px; color:${C.text}; }

ul { margin:0 0 .1in; padding-left:.17in; }
li { font-size:10.6px; line-height:1.55; color:${C.muted}; margin-bottom:.035in; }
li::marker { color:${C.cyan}; }

.foot { position:absolute; left:.78in; right:.78in; bottom:.3in; display:flex; justify-content:space-between;
        font-size:8px; letter-spacing:.16em; text-transform:uppercase; color:${C.dim}; }
.pnum { color:${C.dim}; }

/* calendar */
.cal { display:grid; grid-template-columns:repeat(10,1fr); gap:.06in; }
.cal .d { border:1px solid rgba(255,255,255,.1); border-radius:7px; padding:.07in .04in .075in; text-align:center; }
.cal .d .day { font-family:"Bebas Neue"; font-size:14px; color:${C.text}; line-height:1; }
.cal .d .sl { font-size:6.6px; letter-spacing:.11em; text-transform:uppercase; margin-top:.035in; color:${C.dim}; }
.cal .d.train { border-color:${C.border}; background:rgba(127,231,245,.08); }
.cal .d.train .sl { color:${C.cyan}; }
.cal .d.rest .sl { color:${C.dim}; }
.cal .d.test { border-color:${C.magenta}; background:rgba(255,106,213,.1); }
.cal .d.test .sl { color:${C.magenta}; }

.pill { display:inline-block; border:1px solid ${C.border}; border-radius:999px; padding:.045in .1in;
        font-size:8.2px; letter-spacing:.16em; text-transform:uppercase; color:${C.cyan}; }
.badge { display:inline-block; border-radius:6px; padding:.03in .07in; font-size:8.2px; letter-spacing:.14em;
         text-transform:uppercase; color:${C.bg}; background:${C.cyan}; }
.badge.m { background:${C.magenta}; }
.badge.dim { background:rgba(255,255,255,.12); color:${C.muted}; }

.note { background:rgba(255,106,213,.07); border-left:2px solid ${C.magenta}; border-radius:0 8px 8px 0;
        padding:.11in .14in; margin:.1in 0; }
.note p { margin:0; font-size:10.2px; }
.note b { color:${C.magenta}; font-weight:400; }

.hr-title { display:flex; align-items:baseline; gap:.12in; margin-bottom:.1in; }
.hr-title .num { font-family:"Bebas Neue"; font-size:15px; color:${C.magenta}; letter-spacing:.06em; }
.hr-title .ttl { font-family:"Bebas Neue"; font-size:15px; color:${C.dim}; letter-spacing:.24em; text-transform:uppercase; }
`

/* ------------------------------------------------------------ page parts -- */

/**
 * Wraps content in a page shell. The footer is appended later, once the total
 * page count is known — otherwise every page would read "n / 0".
 */
const page = (inner, { cls = "" } = {}) => `<section class="page ${cls}">${inner}</section>`

const ex = (id) => getExercise(id)

/* ----------------------------------------------------------------- pages -- */

const pages = []

/* 1 — cover */
{
  const stats = program.stats
    .map((s) => `<div class="stat"><div class="n">${esc(s.value)}</div><div class="l">${esc(s.label)}</div></div>`)
    .join("")
  pages.push(
    page(`
      <div class="eyebrow">${esc(program.brand)} &nbsp;/&nbsp; Beginner Calisthenics</div>
      <h1 style="margin-top:.2in">
        <span class="display">THE FOUNDATION 30</span><br>
        <span class="display">DAY RECOMP</span>
      </h1>
      <div class="rule"></div>
      <p class="sub" style="max-width:5.1in">${esc(program.tagline)} A complete beginner program for building muscle and losing fat at the same time, built on the same principles I train with — progressive overload, form before load, and tendon work that lasts.</p>
      <div class="cols4" style="margin-top:.34in">${stats}</div>
      <div style="position:absolute;left:.78in;right:.78in;bottom:1.05in">
        <div class="rule thin"></div>
        <div class="cols2" style="gap:.3in">
          <div>
            <p style="font-size:10.4px;margin:0">${esc(disclaimer.short)}</p>
          </div>
          <div style="text-align:right">
            <span class="pill">Free download</span>
          </div>
        </div>
      </div>
    `),
  )
}

/* 2 — how to use */
{
  const promise = program.promise
    .map((p) => `<div class="card"><h4>${esc(p)}</h4></div>`)
    .join("")
  pages.push(
    page(`
      <h2 class="display">HOW TO USE THIS</h2>
      <div class="rule"></div>
      <p>${esc(program.rir)}</p>
      <div class="cols2" style="gap:.22in;margin-top:.2in">
        <div>
          <h3 style="margin-bottom:.09in">THE STRUCTURE</h3>
          <p><strong>${totalSessions} sessions over 30 days.</strong> Three sessions a week in a rotating A-B-C order, with at least two rest days between each working session. Weeks 1 through 4 each add one layer on top of the last:</p>
          <table style="margin-top:.08in">
            <thead><tr><th style="width:.62in">WEEK</th><th>WHAT CHANGES</th></tr></thead>
            <tbody>
              ${weeks
                .map(
                  (w) =>
                    `<tr><td class="tnum">${w.week}</td><td><strong>${esc(w.title)}</strong> — ${esc(w.focus)} <span style="color:${C.dim}">Days ${w.trainingDays.join(", ")}</span></td></tr>`,
                )
                .join("")}
              <tr><td class="tnum">T</td><td><strong>Benchmark</strong> — one test set per pattern <span style="color:${C.dim}">Day 29</span></td></tr>
            </tbody>
          </table>
        </div>
        <div>
          <h3 style="margin-bottom:.09in">YOU WILL WALK AWAY WITH</h3>
          <div style="display:flex;flex-direction:column;gap:.09in">${promise}</div>
        </div>
      </div>
      <div class="note" style="margin-top:.2in">
        <p><b>Session order matters.</b> Train A, then B, then C, then repeat. Each session pulls in different patterns, and the order is what keeps your two hardest days 48 hours apart. If you miss one, skip it — never stack two sessions in a day.</p>
      </div>
    `),
  )
}

/* 3 — safety */
{
  const items = safety.principles
    .map(
      (p) =>
        `<div class="card" style="margin-bottom:.09in"><h4>${esc(p.heading)}</h4><p>${esc(p.body)}</p></div>`,
    )
    .join("")
  pages.push(
    page(`
      <div class="eyebrow">Read this before Day 1</div>
      <h2 class="display" style="margin-top:.06in">TRAINING SAFELY</h2>
      <div class="rule"></div>
      <div class="cols2" style="gap:.2in;align-items:start">${items}</div>
    `),
  )
}

/* 4 — the 30-day map */
{
  const cells = calendar
    .map((d) => {
      const isTrain = d.label !== "Rest"
      const isTest = d.label === "T"
      const cls = isTest ? "test" : isTrain ? "train" : "rest"
      return `<div class="d ${cls}"><div class="day">${d.day}</div><div class="sl">${esc(d.label)}</div></div>`
    })
    .join("")
  const legend = `<div style="display:flex;gap:.16in;margin-top:.13in">
      <span class="pill">Session A &mdash; Push &amp; Core</span>
      <span class="pill">Session B &mdash; Pull &amp; Legs</span>
      <span class="pill">Session C &mdash; Full Body</span>
      <span class="badge m">Test</span>
    </div>`
  pages.push(
    page(`
      <div class="eyebrow">The plan</div>
      <h2 class="display" style="margin-top:.06in">THE 30-DAY MAP</h2>
      <div class="rule"></div>
      <p>Three sessions a week, two rest days between each. Days 1&ndash;28 are the four training weeks. Day 29 is your benchmark. Day 30 is for reviewing the numbers and setting up what comes next.</p>
      <div class="cal" style="margin-top:.16in">${cells}</div>
      ${legend}
      <div class="note" style="margin-top:.22in">
        <p><b>Do not double up.</b> If you miss a session, skip it and resume on the next scheduled day. The plan runs to Day 30 as written. Missing one session costs you almost nothing; missing two in a row is how programs end.</p>
      </div>
    `),
  )
}

/* 5 — warm-up + cooldown */
{
  const warm = warmUp.steps.map((s) => `<li>${esc(s)}</li>`).join("")
  const cool = cooldown.steps.map((s) => `<li>${esc(s)}</li>`).join("")
  pages.push(
    page(`
      <div class="eyebrow">Every session</div>
      <h2 class="display" style="margin-top:.06in">WARM-UP &amp; COOLDOWN</h2>
      <div class="rule"></div>
      <div class="cols2" style="gap:.26in;align-items:start">
        <div>
          <h3 style="margin-bottom:.08in">WARM-UP &nbsp;<span style="font-size:13px;color:${C.dim}">${warmUp.minutes} MIN</span></h3>
          <ul>${warm}</ul>
          <p style="margin-top:.12in">This is identical every session on purpose. Repetition is what makes it automatic, and automatic is what makes you actually do it when you are tired.</p>
        </div>
        <div>
          <h3 style="margin-bottom:.08in">COOLDOWN &nbsp;<span style="font-size:13px;color:${C.dim}">${cooldown.minutes} MIN</span></h3>
          <ul>${cool}</ul>
          <p style="margin-top:.12in">Passive stretching belongs after training, not before. Work each position at about 6&ndash;8 out of 10 intensity — a strong stretch, never a painful one — and let each exhale take you deeper.</p>
        </div>
      </div>
      <div class="note" style="margin-top:.16in">
        <p><b>The tendon rule.</b> The lowering phase of every press, squat and row is where connective tissue does most of its rebuilding. Slow the descent, all the way down. That is where the durability comes from.</p>
      </div>
    `),
  )
}

/* 6..n — weeks */
for (const w of weeks) {
  for (const s of w.sessions) {
    const blocks = s.blocks
      .map((b) => {
        const rows = b.items
          .map((it) => {
            const e = ex(it.exerciseId)
            return `<tr>
              <td style="width:2.05in"><strong>${esc(e.name)}</strong><div style="font-size:8.6px;letter-spacing:.12em;text-transform:uppercase;color:${C.dim};margin-top:.02in">${esc(e.pattern)}</div></td>
              <td class="tnum" style="width:.55in">${it.sets} &times;</td>
              <td style="width:1.25in">${esc(it.reps)}</td>
              <td style="width:.62in">${esc(it.rest)}</td>
              <td>${it.note ? esc(it.note) : ""}</td>
            </tr>`
          })
          .join("")

        // The one or two cues that matter most for this movement, so the
        // reader does not have to flip back to the library mid-session.
        const cues = b.items
          .map((it) => {
            const e = ex(it.exerciseId)
            const cue = e.cues[0]
            return `<li><strong style="color:${C.text}">${esc(e.name)}</strong> &mdash; ${esc(cue)}</li>`
          })
          .join("")

        return `<div style="margin-bottom:.14in">
          <h3 style="margin-bottom:.055in">${esc(b.title)}</h3>
          <table><thead><tr><th>Movement</th><th>Sets</th><th>Reps</th><th>Rest</th><th>Note</th></tr></thead><tbody>${rows}</tbody></table>
          <ul style="margin-top:.06in">${cues}</ul>
        </div>`
      })
      .join("")

    const fin = s.finisher
      ? `<div class="card" style="margin-top:.1in"><h4>Finisher &nbsp;&mdash;&nbsp; ${esc(ex(s.finisher.exerciseId).name)}</h4><p><strong>${esc(s.finisher.prescription)}</strong>${s.finisher.note ? " &nbsp;&middot;&nbsp; " + esc(s.finisher.note) : ""}</p></div>`
      : ""

    pages.push(
      page(`
        <div class="eyebrow">Week ${w.week} &nbsp;/&nbsp; ${esc(w.focus)}</div>
        <h2 class="display" style="margin-top:.06in">SESSION ${esc(s.id)}</h2>
        <div class="rule"></div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:.1in">
          <h3 style="color:${C.text}">${esc(s.title)}</h3>
          <span class="pill">${s.minutes} min</span>
        </div>
        <p>${esc(s.focus)}</p>
        ${blocks}
        ${fin}
        <div style="margin-top:.12in;font-size:9.2px;color:${C.dim};letter-spacing:.04em">
          Cooldown: ${s.cooldown.length} positions &nbsp;&middot;&nbsp; ${esc(w.intent)}
        </div>
      `),
    )
  }
}

/* benchmark */
{
  const rows = benchmark.blocks[0].items
    .map((it) => {
      const e = ex(it.exerciseId)
      return `<tr><td style="width:2.3in"><strong>${esc(e.name)}</strong></td><td>${esc(it.reps)}</td><td style="width:1.5in">Write it here: ________</td></tr>`
    })
    .join("")
  pages.push(
    page(`
      <div class="eyebrow">Day 29</div>
      <h2 class="display" style="margin-top:.06in">THE BENCHMARK</h2>
      <div class="rule"></div>
      <p>One set of each, after the warm-up, stopped at genuine technical failure. These numbers are the only reliable baseline you will ever have — every future plan gets measured against them.</p>
      <table style="margin-top:.16in">
        <thead><tr><th>Movement</th><th>Test</th><th>Your result</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="cols2" style="margin-top:.2in;gap:.2in">
        <div class="card">
          <h4>Also record on Day 29</h4>
          <p style="margin-bottom:.08in">Weight (same time of day): ________ kg</p>
          <p style="margin-bottom:.08in">Waist at navel: ________ cm</p>
          <p style="margin-bottom:.08in">Front photo, relaxed: ________</p>
          <p style="margin:0">Side photo, relaxed: ________</p>
        </div>
        <div class="card">
          <h4>Why this matters</h4>
          <p>Ten days from now you will not remember how many push-ups you did on Day 1 — but you will remember it if it is written down. Numbers are what separate a training history from a vague feeling that things are going well.</p>
        </div>
      </div>
    `),
  )
}

/* nutrition */
{
  const sections = nutrition.sections
    .map(
      (s) =>
        `<div class="card" style="margin-bottom:.085in"><h4>${esc(s.heading)}</h4><p>${esc(s.body)}</p></div>`,
    )
    .join("")
  pages.push(
    page(`
      <div class="eyebrow">The part most people skip</div>
      <h2 class="display" style="margin-top:.06in">EATING FOR RECOMP</h2>
      <div class="rule"></div>
      <p>${esc(nutrition.intro)}</p>
      <div class="cols2" style="gap:.16in;align-items:start;margin-top:.06in">${sections}</div>
    `),
  )
}

/* recovery */
{
  const items = recovery.body.map((b) => `<li>${esc(b)}</li>`).join("")
  pages.push(
    page(`
      <div class="eyebrow">Where the results actually come from</div>
      <h2 class="display" style="margin-top:.06in">SLEEP &amp; RECOVERY</h2>
      <div class="rule"></div>
      <ul>${items}</ul>
      <div class="note" style="margin-top:.14in">
        <p><b>Soreness is not a score.</b> It measures an unfamiliar stimulus, not a good session. By Week 3 you should feel markedly less sore. If you do not, your sessions are probably too far apart or too easy — and that is a fixable problem.</p>
      </div>
    `),
  )
}

/* tracking */
{
  const what = tracking.whatToTrack.map((t) => `<li>${esc(t)}</li>`).join("")
  const review = tracking.weeklyReview
    .map((r) => `<div class="card" style="margin-bottom:.075in"><p style="margin:0;font-size:10.4px">${esc(r)}</p></div>`)
    .join("")
  pages.push(
    page(`
      <div class="eyebrow">Make the plan measurable</div>
      <h2 class="display" style="margin-top:.06in">THE TRACKING SYSTEM</h2>
      <div class="rule"></div>
      <p>${esc(tracking.intro)}</p>
      <div class="cols2" style="gap:.24in;align-items:start;margin-top:.06in">
        <div>
          <h3 style="margin-bottom:.07in">WHAT TO TRACK</h3>
          <ul>${what}</ul>
        </div>
        <div>
          <h3 style="margin-bottom:.07in">WEEKLY REVIEW</h3>
          ${review}
        </div>
      </div>
    `),
  )
}

/* weekly log sheets */
for (let w = 1; w <= 4; w++) {
  const week = weeks[w - 1]
  const head = `<tr><th style="width:.5in">DAY</th><th style="width:.62in">SESSION</th><th style="width:2.35in">MOVEMENTS &amp; SETS COMPLETED</th><th>NOTES</th></tr>`
  const rows = week.trainingDays
    .map((d, i) => {
      const s = week.sessions[i]
      const names = s.blocks
        .flatMap((b) => b.items.map((it) => `${ex(it.exerciseId).name} ${it.sets}x${it.reps}`))
        .join(", ")
      return `<tr style="height:.62in">
        <td class="tnum">${d}</td>
        <td class="tnum">${esc(s.id)}</td>
        <td style="font-size:9.2px;line-height:1.45">${esc(names)}</td>
        <td></td>
      </tr>`
    })
    .join("")

  // Ruled writing lines so the sheet is genuinely usable when printed.
  const noteLines = Array.from(
    { length: 7 },
    () => `<div style="border-bottom:1px solid rgba(255,255,255,.14);height:.26in"></div>`,
  ).join("")

  pages.push(
    page(`
      <div class="eyebrow">Training log</div>
      <h2 class="display" style="margin-top:.06in">WEEK ${w} LOG</h2>
      <div class="rule"></div>
      <p style="font-size:10.4px">${esc(week.title)} &mdash; ${esc(week.intent)}</p>
      <table style="margin-top:.12in"><thead>${head}</thead><tbody>${rows}</tbody></table>
      <div class="cols2" style="margin-top:.2in;gap:.22in;align-items:start">
        <div>
          <h3 style="margin-bottom:.06in">NOTES</h3>
          <div>${noteLines}</div>
        </div>
        <div>
          <div class="card" style="margin-bottom:.11in"><h4>Weight (kg)</h4><p>Day 1: ________ &nbsp;&nbsp; Day 8: ________</p></div>
          <div class="card" style="margin-bottom:.11in"><h4>Waist (cm)</h4><p>Day 1: ________ &nbsp;&nbsp; Day 8: ________</p></div>
          <div class="card"><h4>How the session felt</h4><p>Good / Okay / Heavy</p></div>
        </div>
      </div>
    `),
  )
}

/* exercise library */

/**
 * One exercise card. Rendered identically during the measuring pass and the
 * real build, so measured heights are valid.
 */
const exerciseCard = (id) => {
  const e = ex(id)
  const cues = e.cues.map((c) => `<li>${esc(c)}</li>`).join("")
  const mistakes = e.mistakes.map((m) => `<li>${esc(m)}</li>`).join("")
  const ladder =
    e.regressions.length || e.progressions.length
      ? `<p style="margin-top:.06in;font-size:9.4px;color:${C.dim}"><strong style="color:${C.cyan}">EASIER</strong> ${esc(e.regressions.join(" · ") || "—")} &nbsp;|&nbsp; <strong style="color:${C.magenta}">HARDER</strong> ${esc(e.progressions.join(" · ") || "—")}</p>`
      : ""
  return `<div class="card" data-ex="${esc(id)}">
          <div style="display:flex;justify-content:space-between;align-items:baseline">
            <h4>${esc(e.name)}</h4>
            <span style="font-size:7.8px;letter-spacing:.14em;text-transform:uppercase;color:${C.dim}">${esc(e.pattern)}</span>
          </div>
          <p style="margin:.03in 0 .05in"><strong>Setup.</strong> ${esc(e.setup)}</p>
          <ul style="margin-bottom:.03in">${cues}</ul>
          <p style="font-size:9.2px;color:${C.dim};margin:.04in 0 .03in"><strong style="color:${C.magenta}">COMMON MISTAKES</strong></p>
          <ul style="margin:0">${mistakes}</ul>
          ${ladder}
        </div>`
}

const LIBRARY_HEADER = `<div class="eyebrow">Every movement</div><h2 class="display" style="margin-top:.06in">EXERCISE LIBRARY</h2><div class="rule"></div><p style="margin-bottom:.1in">Setup, cues, the mistakes that cost people reps, and the ladder above and below each movement. When a prescribed version is out of reach, take the easier option listed here.</p>`

/**
 * Measures every card's rendered height at the exact width it will occupy in
 * the final two-column layout, plus the height of the library page header.
 *
 * Exercise cards vary a lot in length, so a fixed number per page either
 * overflows the page or wastes half of it. Measuring first lets the builder
 * pack pages to the height that is actually available.
 */
const measureCardHeights = async (ids) => {
  const probe = `
<script>
// document.fonts.ready matters: measuring before the webfonts load gives
// fallback-font metrics, which wrap differently and produce wrong heights.
// No requestAnimationFrame here -- it never fires under --virtual-time-budget.
(async () => {
  await document.fonts.ready
  const out = [...document.querySelectorAll('.card[data-ex]')].map(el => ({
    id: el.dataset.ex,
    h: el.getBoundingClientRect().height,
  }))
  const header = document.querySelector('[data-header]')
  document.title = 'MEASURE' + JSON.stringify({
    cards: out,
    header: header ? header.getBoundingClientRect().height : 0,
  })
})()
</script>`

  // Replicate the real DOM exactly: the same page box, the same two-column
  // grid, so the cards measure at the width they will actually occupy.
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${css}</style></head>
<body>
<div class="page" style="height:auto;overflow:visible">
  <div data-header>${LIBRARY_HEADER}</div>
  <div class="libcols"><div class="libcol">${ids.map(exerciseCard).join("")}</div><div class="libcol"></div></div>
</div>
${probe}</body></html>`

  const probePath = path.join(scratchDir, "measure.html")
  await writeFile(probePath, html, "utf8")

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

  const m = stdout.match(/MEASURE(\{.*?\})<\/title>/s)
  if (!m) throw new Error("Could not measure exercise cards.")
  const parsed = JSON.parse(m[1])
  return {
    heights: new Map(parsed.cards.map((r) => [r.id, r.h])),
    header: parsed.header,
  }
}

{
  const GAP = 0.16 * 96 // .16in column gap in px
  const CARD_GAP = 0.085 * 96 // vertical gap between cards in a column
  const PAGE_CONTENT = 11 * 96 - 0.72 * 96 - 0.62 * 96
  const SAFETY = 12 // px of slack, so rounding never pushes a page over

  const { heights, header } = await measureCardHeights(exerciseOrder)

  // Pack cards into pages: fill the shorter column first, and never let a
  // column exceed the height budget for that page.
  const pagesOfCards = []
  let columns = [[], []]
  let columnHeights = [0, 0]

  const flush = () => {
    pagesOfCards.push(columns)
    columns = [[], []]
    columnHeights = [0, 0]
  }

  for (const id of exerciseOrder) {
    const h = (heights.get(id) ?? 0) + CARD_GAP

    // Place the card on the current page if it fits. When the current page is
    // full, start a new one and place it there -- the card must never be
    // skipped, so the loop continues rather than dropping the exercise.
    let placed = false
    while (!placed) {
      // The first page carries a header, so it has less room. This depends on
      // the page index, not on whether a card has been placed yet.
      const isFirstPage = pagesOfCards.length === 0
      const budget = PAGE_CONTENT - (isFirstPage ? header : 0) - SAFETY

      // Always add to the shorter column so the two stay close in length.
      const target = columnHeights[0] <= columnHeights[1] ? 0 : 1

      // Only the column being added to grows, so the fit test is on that
      // column's new height -- not on the taller one, which is untouched.
      if (columnHeights[target] + h <= budget) {
        columns[target].push(id)
        columnHeights[target] += h
        placed = true
      } else if (columns[0].length || columns[1].length) {
        // This page is full. Close it and retry on a fresh one.
        flush()
      } else {
        // A single card taller than the whole page: give it its own page
        // anyway, so the exercise is still documented.
        columns[target].push(id)
        columnHeights[target] += h
        placed = true
      }
    }
  }
  if (columns[0].length || columns[1].length) flush()

  pagesOfCards.forEach((cols, i) => {
    const isFirst = i === 0
    const headerHtml = isFirst ? LIBRARY_HEADER : ""
    const col = (ids) =>
      ids.length ? `<div class="libcol">${ids.map(exerciseCard).join("")}</div>` : ""
    pages.push(
      page(`
        ${headerHtml}
        <div class="libcols">${col(cols[0])}${col(cols[1])}</div>
      `),
    )
  })
}

/* faq */
{
  const half = Math.ceil(faq.items.length / 2)
  const card = (it) =>
    `<div class="card" style="margin-bottom:.075in"><h4 style="color:${C.cyan}">${esc(it.q)}</h4><p>${esc(it.a)}</p></div>`
  pages.push(
    page(`
      <div class="eyebrow">Straight answers</div>
      <h2 class="display" style="margin-top:.06in">FAQ</h2>
      <div class="rule"></div>
      <div class="cols2" style="gap:.16in;align-items:start">
        <div>${faq.items.slice(0, half).map(card).join("")}</div>
        <div>${faq.items.slice(half).map(card).join("")}</div>
      </div>
    `),
  )
}

/* next steps */
{
  const steps = nextSteps.steps
    .map(
      (s) =>
        `<div class="card" style="margin-bottom:.085in"><h4>${esc(s.heading)}</h4><p>${esc(s.body)}</p></div>`,
    )
    .join("")
  pages.push(
    page(`
      <div class="eyebrow">Day 30 onward</div>
      <h2 class="display" style="margin-top:.06in">AFTER DAY 30</h2>
      <div class="rule"></div>
      <p>${esc(nextSteps.intro)}</p>
      <div class="cols2" style="gap:.16in;align-items:start;margin-top:.06in">${steps}</div>
    `),
  )
}

/* cta + disclaimer */
{
  const lines = cta.lines.map((l) => `<li>${esc(l)}</li>`).join("")
  pages.push(
    page(`
      <div class="eyebrow">${esc(program.brand)}</div>
      <h1 style="margin-top:.16in"><span class="display">KEEP GOING</span></h1>
      <div class="rule"></div>
      <p class="sub" style="max-width:4.9in">Thirty days is the setup, not the finish. Everything you need to keep progressing is in the channel and the shop.</p>
      <ul style="margin-top:.22in">${lines}</ul>
      <div class="cols2" style="margin-top:.26in;gap:.18in">
        <div class="card"><h4>Training programs</h4><p>Structured blocks with programming, progressions and direct feedback when you are ready to go past the bodyweight ceiling.</p><p style="margin-top:.07in;color:${C.cyan}">${esc(cta.shopUrl)}</p></div>
        <div class="card"><h4>${esc(program.brand)}</h4><p>Martial arts, martial arts fitness, and the training that holds it together.</p><p style="margin-top:.07in;color:${C.cyan}">${esc(cta.siteUrl)}</p></div>
      </div>
      <div style="position:absolute;left:.78in;right:.78in;bottom:1.0in">
        <div class="rule thin"></div>
        ${disclaimer.body.map((b) => `<p style="font-size:8.6px;line-height:1.5;margin:0 0 .05in">${esc(b)}</p>`).join("")}
      </div>
    `),
  )
}

/* --------------------------------------------------------------- render -- */

const totalPages = pages.length

const foot = (n) =>
  `<div class="foot"><span>${esc(program.brand)} &nbsp;/&nbsp; ${esc(program.title)} ${esc(program.subtitle)}</span><span class="pnum">${n} / ${totalPages}</span></div>`

const rendered = pages
  .map((p, i) => p.replace("</section>", `${foot(i + 1)}</section>`))
  .join("\n")

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(program.title)} ${esc(program.subtitle)} — ${esc(program.brand)}</title>
<meta name="author" content="${esc(program.brand)}">
<meta name="description" content="${esc(program.tagline)}">
<meta name="keywords" content="calisthenics, beginner, bodyweight, recomposition, fitness, training program">
<style>${css}</style>
</head>
<body>${rendered}</body>
</html>`

await mkdir(outDir, { recursive: true })

const tmpHtml = path.join(scratchDir, "foundation-30.html")
await writeFile(tmpHtml, html, "utf8")

await execFileAsync(
  CHROMIUM,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--no-pdf-header-footer",
    `--print-to-pdf=${outFile}`,
    `file://${tmpHtml}`,
  ],
  { cwd: clientDir },
)

console.log(`Wrote ${outFile}`)

/* Stamp metadata with pdf-lib (Chromium only sets the title from <title>). */
try {
  const { PDFDocument } = await import("pdf-lib")
  const bytes = await readFile(outFile)
  const doc = await PDFDocument.load(bytes)
  doc.setTitle(`${program.title} ${program.subtitle}`)
  doc.setAuthor(program.brand)
  doc.setSubject(
    "A 30-day beginner bodyweight calisthenics program for muscle gain and fat loss.",
  )
  doc.setKeywords([
    "calisthenics",
    "beginner",
    "bodyweight",
    "recomposition",
    "fitness",
    "training program",
  ])
  doc.setProducer(program.brand)
  await writeFile(outFile, await doc.save())
  console.log(`Stamped metadata on ${path.basename(outFile)}`)
} catch (err) {
  console.warn(`Skipped metadata stamping (pdf-lib unavailable): ${err.message}`)
}

// The scratch HTML lives in .program-build/ (gitignored) so the layout
// checker can inspect the same markup the PDF was printed from.
