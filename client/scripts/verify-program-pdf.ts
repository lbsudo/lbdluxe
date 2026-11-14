/**
 * Content assertions for the generated program PDF.
 *
 *   node scripts/verify-program-pdf.mjs
 *
 * Checks that every week, session, exercise and safety section actually made
 * it into the document. A silent omission in the renderer would otherwise ship
 * a program with a missing session, and nobody would notice until a reader
 * hit the gap.
 *
 * The extracted text is upper-cased once up front, so every probe below is
 * compared in upper case.
 */
import { execFile } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { promisify } from "node:util"

import {
  benchmark,
  exerciseOrder,
  getExercise,
  program,
  totalSessions,
  weeks,
} from "../src/content/programs/foundation-30/program.ts"

const execFileAsync = promisify(execFile)

const dir = path.dirname(fileURLToPath(import.meta.url))
const clientDir = path.resolve(dir, "..")
const pdf = path.join(clientDir, "public", "programs", "foundation-30-day-recomp.pdf")

const { stdout } = await execFileAsync("pdftotext", [pdf, "-"])
const text = stdout.replace(/\s+/g, " ").toUpperCase()

let failures = 0
const check = (name: string, cond: boolean) => {
  if (!cond) failures++
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}`)
}
const has = (s: string) => text.includes(s.toUpperCase())

check("title present", has(program.title))
check("subtitle present", has(program.subtitle))
check("brand present", has(program.brand))
check(
  "session count stated correctly",
  has(`${totalSessions} sessions over 30 days.`),
)

for (const w of weeks) {
  check(`week ${w.week} title present`, has(w.title))
  for (const s of w.sessions) {
    check(`session ${s.id} of week ${w.week} present`, has(`SESSION ${s.id}`))
    check(`session ${s.id} week ${w.week} focus present`, has(s.focus))
    for (const b of s.blocks) {
      for (const it of b.items) {
        check(
          `week ${w.week} ${s.id}: ${getExercise(it.exerciseId).name} prescribed`,
          has(getExercise(it.exerciseId).name),
        )
      }
    }
  }
}

check("benchmark present", has("THE BENCHMARK"))
for (const it of benchmark.blocks[0].items) {
  const e = getExercise(it.exerciseId)
  check(`benchmark: ${e.name}`, has(e.name))
}

for (const id of exerciseOrder) {
  const e = getExercise(id)
  check(`library: ${e.name}`, has(e.name))
  check(`library: ${e.name} setup`, has(e.setup.slice(0, 40)))
}

check("safety section present", has("TRAINING SAFELY"))
check("nutrition section present", has("EATING FOR RECOMP"))
check("protein anchor present", has("PROTEIN IS THE ANCHOR"))
check("recovery section present", has("SLEEP & RECOVERY"))
check("tracking section present", has("THE TRACKING SYSTEM"))
check("FAQ present", has("FAQ"))
check("after day 30 present", has("AFTER DAY 30"))
check("disclaimer present", has("NOT MEDICAL ADVICE"))
check(
  "all four weekly logs present",
  [1, 2, 3, 4].every((w) => has(`WEEK ${w} LOG`)),
)

console.log(
  failures === 0
    ? "\nAll PDF content checks passed."
    : `\n${failures} content check(s) failed.`,
)
if (failures > 0) process.exit(1)
