/**
 * Verifies the program-contact capture endpoint against a stubbed Resend
 * client, so the signup logic can be checked without a live API key.
 *
 *   bun scripts/test-add-program-contact.ts
 *
 * The stub models the two API behaviours that matter here: a contact carrying
 * an unknown custom property is rejected (and must fall back to a plain
 * contact), and a repeat signup is an error message rather than a failure.
 */

import { Hono } from "hono"

type Stub = {
  createError?: string
  duplicate?: boolean
  segments?: { id: string; name: string }[]
}

const calls = { created: [] as any[], segments: [] as any[], added: [] as any[] }

const makeResend = (opts: Stub = {}) => ({
  contacts: {
    create: async (payload: any) => {
      calls.created.push(payload)
      // A contact with an unknown custom property is rejected; the same
      // contact without properties is accepted.
      if (opts.createError && payload.properties) {
        return { data: undefined, error: { message: opts.createError } }
      }
      if (opts.duplicate) {
        return { data: undefined, error: { message: "Contact already exists" } }
      }
      return { data: { id: "contact_1", object: "contact" }, error: undefined }
    },
    segments: {
      add: async (payload: any) => {
        calls.added.push(payload)
        return { data: { id: "membership" }, error: undefined }
      },
    },
  },
  segments: {
    list: async () => ({ data: { data: opts.segments ?? [] }, error: undefined }),
    create: async (payload: any) => {
      calls.segments.push(payload)
      return { data: { id: "seg_new", name: payload.name }, error: undefined }
    },
  },
})

const build = async (resend: any) => {
  const { addProgramContact } = await import(
    "../src/resend/add-program-contact.ts"
  )
  const app = new Hono()
  app.use("*", async (c: any, next: any) => {
    c.set("resend", resend)
    c.set("audienceId", "aud_123")
    await next()
  })
  app.post("/resend/add-program-contact", addProgramContact)
  return app
}

const post = async (app: any, body: any) => {
  const res = await app.fetch(
    new Request("http://localhost/resend/add-program-contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  )
  return { status: res.status, body: await res.json() }
}

let failures = 0
const check = (name: string, cond: boolean, detail = "") => {
  if (!cond) failures++
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${detail ? " — " + detail : ""}`)
}

// 1. Happy path: creates the contact, creates the segment, attaches it.
{
  calls.created = []; calls.segments = []; calls.added = []
  const app = await build(makeResend())
  const r = await post(app, {
    email: "a@b.com",
    firstName: "A",
    program: "foundation-30",
  })
  check("happy path returns success", r.body.success === true)
  check("contact created with the right email", calls.created[0]?.email === "a@b.com")
  check(
    "contact tagged with the program",
    calls.created[0]?.properties?.fitness_interest === "program:foundation-30",
  )
  check(
    "segment created on demand",
    calls.segments[0]?.name === "Program: foundation-30",
  )
  check("contact attached to the segment", calls.added[0]?.email === "a@b.com")
  check("attached to the new segment id", calls.added[0]?.segmentId === "seg_new")
}

// 2. An existing segment is reused, not duplicated.
{
  calls.created = []; calls.segments = []; calls.added = []
  const app = await build(
    makeResend({
      segments: [{ id: "seg_existing", name: "Program: foundation-30" }],
    }),
  )
  const r = await post(app, { email: "a@b.com", program: "foundation-30" })
  check("reuses the existing segment", calls.segments.length === 0)
  check("attaches to the existing segment id", calls.added[0]?.segmentId === "seg_existing")
  check("still succeeds", r.body.success === true)
}

// 3. A repeat signup is a success, not an error.
{
  calls.created = []; calls.segments = []; calls.added = []
  const app = await build(makeResend({ duplicate: true }))
  const r = await post(app, { email: "a@b.com", program: "foundation-30" })
  check("duplicate signup succeeds", r.body.success === true)
  check("duplicate still files the segment", calls.added.length === 1)
}

// 4. If the custom property is rejected, the contact is still created.
{
  calls.created = []; calls.segments = []; calls.added = []
  const app = await build(makeResend({ createError: "property not found" }))
  const r = await post(app, { email: "a@b.com", program: "foundation-30" })
  check("falls back to a plain contact", calls.created.length === 2)
  check("fallback contact has no properties", calls.created[1]?.properties === undefined)
  check("still succeeds", r.body.success === true)
}

// 5. A bad email is rejected.
{
  const app = await build(makeResend())
  const r = await post(app, { email: "nope", program: "foundation-30" })
  check("rejects an invalid email", r.status === 400 && r.body.success === false)
}

// 6. A segment failure never blocks the download.
{
  calls.created = []; calls.segments = []; calls.added = []
  const resend = makeResend()
  resend.segments.create = async () => ({
    data: undefined,
    error: { message: "segment creation failed" },
  })
  const app = await build(resend)
  const r = await post(app, { email: "a@b.com", program: "foundation-30" })
  check(
    "segment failure does not fail the signup",
    r.body.success === true,
    JSON.stringify(r.body),
  )
}

console.log(
  failures === 0
    ? "\nAll program-contact checks passed."
    : `\n${failures} check(s) failed.`,
)
if (failures > 0) process.exit(1)
