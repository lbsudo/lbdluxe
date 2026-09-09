import { Hono } from "hono"
import type { Context } from "hono"
import { lexicalToHTML } from "./lexical-to-html"

function env(c: { env?: Record<string, unknown> }, key: string): string | undefined {
  const bound = c.env?.[key] as string | undefined
  if (bound) return bound
  if (typeof process !== "undefined") return process.env[key]
  return undefined
}

type CMSEnv = {
  Bindings: { CMS_URL: string }
}

export const cmsRoutes = new Hono<CMSEnv>()

const TTL_BY_MINUTE = {
  page: 300, // 5 min
  list: 600, // 10 min
  single: 300,
  profile: 600,
}

/**
 * Serves a GET response through the Cloudflare edge cache, keyed by URL plus
 * the request origin so CORS variants never cross-contaminate. Falls back to
 * a direct response if the cache API is unavailable (e.g. local dev).
 */
async function cachedJson(
  c: Context<{ Bindings: { CMS_URL: string } }>,
  ttl: number,
  build: () => Promise<Response>,
): Promise<Response> {
  const cache = (globalThis as { caches?: { default?: { match: (r: Request) => Promise<Response | undefined>; put: (r: Request, res: Response) => Promise<void> } } }).caches?.default

  const keyUrl = (() => {
    const u = new URL(c.req.url)
    const origin = c.req.header("Origin")
    if (origin) u.searchParams.set("__origin", origin)
    return u.toString()
  })()
  const key = new Request(keyUrl)

  if (cache) {
    try {
      const hit = await cache.match(key)
      if (hit) return hit
    } catch {
      // ignore cache failures; fall through
    }
  }

  const res = await build()
  const cacheable = res.status >= 200 && res.status < 400
  if (cacheable) {
    res.headers.set("Cache-Control", `public, s-maxage=${ttl}`)
  }
  if (cache && cacheable) {
    try {
      c.executionCtx.waitUntil(cache.put(key, res.clone()))
    } catch {
      // non-cacheable response — left uncached
    }
  }
  return res
}

type CMSEnvContext = Context<{ Bindings: { CMS_URL: string; CMS_FETCH_BASE?: string } }>

// Where outbound CMS requests actually go. Defaults to the public CMS_URL,
// but may be overridden with a direct origin (e.g. the Railway *.up.railway.app
// host) when the Cloudflare-proxied domain misbehaves for same-zone subrequests.
function cmsFetchBase(c: CMSEnvContext): string | null {
  const url = env(c, "CMS_FETCH_BASE") || env(c, "CMS_URL")
  if (!url) return null
  return url.replace(/\/$/, "")
}

// Strip an absolute media URL back to a path when it points at the CMS origin
// we fetch from, so relative /cms/api/media/... rewriting still applies even
// when fetching via a direct origin host.
function stripOrigin(url: string, base: string): string {
  if (!url.startsWith("http")) return url
  try {
    const u = new URL(url)
    const b = new URL(base)
    if (u.host === b.host) return u.pathname + u.search
  } catch {
    // leave as-is on parse failure
  }
  return url
}

async function readErrorDetail(res: Response): Promise<string> {
  try {
    return (await res.text()).slice(0, 300)
  } catch {
    return ""
  }
}

async function fetchCms(c: CMSEnvContext, ttl: number, path: string): Promise<Response> {
  const base = cmsFetchBase(c)
  return cachedJson(c, ttl, async () => {
    if (!base) return c.json({ error: "CMS_URL not configured" }, 500)
    let res: Response
    try {
      res = await fetch(`${base}${path}`, {
        headers: { "Content-Type": "application/json" },
      })
    } catch {
      return c.json({ error: "CMS unreachable" }, 502)
    }
    if (!res.ok) {
      const detail = await readErrorDetail(res)
      console.error(`CMS fetch failed (${res.status}) for ${path}:`, detail)
      return c.json(
        { error: "CMS fetch failed", cmsStatus: res.status, detail },
        res.status as any,
        { "X-CMS-Status": String(res.status) },
      )
    }
    const json = (await res.json()) as { docs?: Record<string, unknown>[] }
    const docs = json.docs ?? []
    return c.json(docs.map((d) => convertRichTextFields(d, base)))
  })
}

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
        (key === "richText" || key === "content" || key === "review") &&
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
        const filename = media.filename as string | undefined
        let finalUrl: string | null =
          mediaUrl && typeof mediaUrl === "string" && mediaUrl.length > 0
            ? stripOrigin(mediaUrl, baseUrl)
            : null
        if (finalUrl?.startsWith("/api/media/file/")) {
          finalUrl = `/cms${finalUrl}`
        } else if (!finalUrl && filename) {
          const mediaPrefix = (media.prefix as string | undefined) || "media"
          finalUrl = `/cms/api/media/file/${encodeURIComponent(filename)}?prefix=${encodeURIComponent(mediaPrefix)}`
        }
        result[key] = {
          url: finalUrl,
          alt: media.alt ?? null,
          width: media.width ?? null,
          height: media.height ?? null,
          focalPoint: media.focalPoint ?? null,
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

async function firstDoc(c: CMSEnvContext, ttl: number, path: string): Promise<Response> {
  return cachedJson(c, ttl, async () => {
    const base = cmsFetchBase(c)
    if (!base) return c.json({ error: "CMS_URL not configured" }, 500)
    let res: Response
    try {
      res = await fetch(`${base}${path}`, {
        headers: { "Content-Type": "application/json" },
      })
    } catch {
      return c.json({ error: "CMS unreachable" }, 502)
    }
    if (!res.ok) {
      const detail = await readErrorDetail(res)
      console.error(`CMS fetch failed (${res.status}) for ${path}:`, detail)
      return c.json(
        { error: "CMS fetch failed", cmsStatus: res.status, detail },
        res.status as any,
        { "X-CMS-Status": String(res.status) },
      )
    }
    const json = (await res.json()) as { docs?: Record<string, unknown>[] }
    const doc = json.docs?.[0]
    if (!doc) {
      return c.json(null)
    }
    return c.json(convertRichTextFields(doc, base))
  })
}

cmsRoutes.get("/pages/:slug", (c) => {
  const slug = c.req.param("slug")
  return firstDoc(c, TTL_BY_MINUTE.page, `/api/pages?depth=3&where[slug][equals]=${encodeURIComponent(slug)}`)
})

cmsRoutes.get("/posts", (c) =>
  fetchCms(c, TTL_BY_MINUTE.list, `/api/posts?depth=3&where[_status][equals]=published&sort=-publishedAt&limit=50`),
)

cmsRoutes.get("/posts/:slug", (c) => {
  const slug = c.req.param("slug")
  return firstDoc(c, TTL_BY_MINUTE.single, `/api/posts?depth=3&where[slug][equals]=${encodeURIComponent(slug)}`)
})

cmsRoutes.get("/authors", (c) =>
  fetchCms(c, TTL_BY_MINUTE.list, `/api/authors?depth=0&limit=100&sort=title`),
)

cmsRoutes.get("/shelf-categories", (c) =>
  fetchCms(c, TTL_BY_MINUTE.list, `/api/shelf-categories?depth=0&limit=100&sort=title`),
)

cmsRoutes.get("/shelf-items", (c) => {
  const categoryId = c.req.query("categoryId")
  let path = `/api/shelf-items?depth=3&where[_status][equals]=published&sort=-updatedAt&limit=50`
  if (categoryId) {
    path += `&where[shelfCategories][in]=${encodeURIComponent(categoryId)}`
  }
  return fetchCms(c, TTL_BY_MINUTE.list, path)
})

cmsRoutes.get("/shelf-items/:slug", (c) => {
  const slug = c.req.param("slug")
  return firstDoc(c, TTL_BY_MINUTE.single, `/api/shelf-items?depth=3&where[slug][equals]=${encodeURIComponent(slug)}`)
})

cmsRoutes.get("/profile-links", (c) =>
  fetchCms(c, TTL_BY_MINUTE.profile, `/api/profile-links?depth=3&where[_status][equals]=published&sort=order&limit=50`),
)

cmsRoutes.get("/content-network", (c) =>
  fetchCms(c, TTL_BY_MINUTE.profile, `/api/content-network?depth=3&where[_status][equals]=published&sort=order&limit=50`),
)

cmsRoutes.get("/links-profile", (c) =>
  firstDoc(c, TTL_BY_MINUTE.profile, `/api/links-profile?depth=3&limit=1`),
)

cmsRoutes.get("/api/media/file/:filename", async (c) => {
  const base = cmsFetchBase(c)
  if (!base) return new Response(null, { status: 500 })

  const filename = c.req.param("filename")
  const prefix = c.req.query("prefix") || "media"
  const url = `${base}/api/media/file/${filename}?prefix=${encodeURIComponent(prefix)}`

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