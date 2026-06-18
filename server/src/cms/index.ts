import { Hono } from "hono"
import { lexicalToHTML } from "./lexical-to-html"

function env(c: { env?: Record<string, unknown> }, key: string): string | undefined {
  return (c.env?.[key] as string | undefined) || process.env[key]
}

type CMSEnv = {
  Bindings: { CMS_URL: string; CMS_TENANT_ID: string }
}

export const cmsRoutes = new Hono<CMSEnv>()

function convertRichTextFields(
  obj: Record<string, unknown>,
  baseUrl: string = "",
): Record<string, unknown> {
  if (Array.isArray(obj)) {
    return obj.map((item) =>
      typeof item === "object" && item !== null
        ? convertRichTextFields(item as Record<string, unknown>, baseUrl)
        : item,
    ) as unknown as Record<string, unknown>
  }

  if (obj && typeof obj === "object") {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      if (
        (key === "richText" || key === "content") &&
        value &&
        typeof value === "object" &&
        "root" in (value as Record<string, unknown>)
      ) {
        result[key] = lexicalToHTML(value as Record<string, unknown>)
      } else if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        "url" in (value as Record<string, unknown>) &&
        "filename" in (value as Record<string, unknown>)
      ) {
        const media = value as Record<string, unknown>
        const mediaUrl = media.url as string | undefined
        result[key] = {
          url:
            mediaUrl?.startsWith("/api/media/file/")
              ? `/cms${mediaUrl}`
              : (mediaUrl ?? null),
          alt: media.alt ?? null,
          width: media.width ?? null,
          height: media.height ?? null,
        }
      } else if (typeof value === "object" && value !== null) {
        result[key] = convertRichTextFields(value as Record<string, unknown>, baseUrl)
      } else {
        result[key] = value
      }
    }
    return result
  }

  return obj
}

cmsRoutes.get("/pages/:slug", async (c) => {
  const slug = c.req.param("slug")
  const cmsUrl = env(c, "CMS_URL")
  const tenantId = env(c, "CMS_TENANT_ID")

  if (!cmsUrl) {
    return c.json({ error: "CMS_URL not configured" }, 500)
  }
  if (!tenantId) {
    return c.json({ error: "CMS_TENANT_ID not configured" }, 500)
  }

  const url = `${cmsUrl}/api/pages?depth=2&where[slug][equals]=${encodeURIComponent(slug)}&where[tenant][equals]=${encodeURIComponent(tenantId)}`

  let res: Response
  try {
    res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    })
  } catch {
    return c.json({ error: "CMS unreachable" }, 502)
  }

  if (!res.ok) {
    return c.json({ error: "CMS fetch failed" }, res.status as any)
  }

  const json = (await res.json()) as { docs?: Record<string, unknown>[] }
  const doc = json.docs?.[0]
  if (!doc) {
    return c.json(null)
  }

  const converted = convertRichTextFields(doc, cmsUrl)
  return c.json(converted)
})

cmsRoutes.get("/posts", async (c) => {
  const cmsUrl = env(c, "CMS_URL")
  const tenantId = env(c, "CMS_TENANT_ID")

  if (!cmsUrl) return c.json({ error: "CMS_URL not configured" }, 500)
  if (!tenantId) return c.json({ error: "CMS_TENANT_ID not configured" }, 500)

  const url = `${cmsUrl}/api/posts?depth=2&where[_status][equals]=published&where[tenant][equals]=${encodeURIComponent(tenantId)}&sort=-publishedAt&limit=50`

  let res: Response
  try {
    res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    })
  } catch {
    return c.json({ error: "CMS unreachable" }, 502)
  }

  if (!res.ok) {
    return c.json({ error: "CMS fetch failed" }, res.status as any)
  }

  const json = (await res.json()) as { docs?: Record<string, unknown>[] }
  const docs = json.docs ?? []
  const converted = docs.map((doc) => convertRichTextFields(doc, cmsUrl))
  return c.json(converted)
})

cmsRoutes.get("/posts/:slug", async (c) => {
  const slug = c.req.param("slug")
  const cmsUrl = env(c, "CMS_URL")
  const tenantId = env(c, "CMS_TENANT_ID")

  if (!cmsUrl) return c.json({ error: "CMS_URL not configured" }, 500)
  if (!tenantId) return c.json({ error: "CMS_TENANT_ID not configured" }, 500)

  const url = `${cmsUrl}/api/posts?depth=2&where[slug][equals]=${encodeURIComponent(slug)}&where[tenant][equals]=${encodeURIComponent(tenantId)}`

  let res: Response
  try {
    res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    })
  } catch {
    return c.json({ error: "CMS unreachable" }, 502)
  }

  if (!res.ok) {
    return c.json({ error: "CMS fetch failed" }, res.status as any)
  }

  const json = (await res.json()) as { docs?: Record<string, unknown>[] }
  const doc = json.docs?.[0]
  if (!doc) {
    return c.json(null)
  }

  const converted = convertRichTextFields(doc, cmsUrl)
  return c.json(converted)
})

cmsRoutes.get("/api/media/file/:filename", async (c) => {
  const cmsUrl = env(c, "CMS_URL")
  if (!cmsUrl) return new Response(null, { status: 500 })

  const filename = c.req.param("filename")
  const prefix = c.req.query("prefix") || "media"
  const url = `${cmsUrl}/api/media/file/${filename}?prefix=${encodeURIComponent(prefix)}`

  let res: Response
  try {
    res = await fetch(url)
  } catch {
    return new Response(null, { status: 502 })
  }

  if (!res.ok) return new Response(null, { status: res.status })

  return new Response(res.body, {
    headers: {
      "Content-Type": res.headers.get("Content-Type") || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
})
