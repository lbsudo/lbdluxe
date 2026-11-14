import app from "./src/index"

const varsContent = await Bun.file(".dev.vars").text()
for (const line of varsContent.split("\n")) {
  const s = line.trim()
  if (!s || s.startsWith("#")) continue
  const i = s.indexOf("=")
  if (i === -1) continue
  let value = s.slice(i + 1).trim()
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1)
  }
  process.env[s.slice(0, i).trim()] = value
}

const port = parseInt(process.env.PORT || "8787")
console.log(`🚀 CMS BFF server running on http://localhost:${port}`)

// Hono reads runtime secrets from c.env, not process.env. Bun.serve does not
// forward process.env into the fetch handler, so the env has to be passed
// explicitly -- otherwise every middleware that reads c.env sees undefined.
const env = { ...process.env } as Record<string, string>

Bun.serve({
  port,
  fetch: (request) => app.fetch(request, env),
})
