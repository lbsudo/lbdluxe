/* eslint-disable no-restricted-globals */
/**
 * Card PWA service worker — https://card.lbdluxe.com
 *
 * The card is meant to be opened in a pinch: at a table, in a queue, on bad
 * signal. So the shell and the card data are cached and the app renders even
 * with no network at all.
 *
 * This worker is registered ONLY on the card host (see src/lib/pwa.ts). A
 * service worker is scoped to its origin, so lbdluxe.com, links.lbdluxe.com
 * and shop.lbdluxe.com never run this file.
 *
 * Bump VERSION whenever the caching rules change — it namespaces the caches
 * and the old ones are dropped on activate.
 */
const VERSION = "v1";

const SHELL_CACHE = `lbdluxe-card-shell-${VERSION}`;
const ASSET_CACHE = `lbdluxe-card-assets-${VERSION}`;
const DATA_CACHE = `lbdluxe-card-data-${VERSION}`;
const MEDIA_CACHE = `lbdluxe-card-media-${VERSION}`;

const ALL_CACHES = [SHELL_CACHE, ASSET_CACHE, DATA_CACHE, MEDIA_CACHE];

/** The card's canonical path. Offline navigations fall back to this. */
const CARD_PATH = "/card";

/** Pre-cached so the app boots (and paints its icon) with no network. */
const SHELL_URLS = [
  CARD_PATH,
  "/manifest.webmanifest",
  "/favicon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-512.png",
  "/icons/apple-touch-icon-180.png",
  "/fonts/bebas/BebasNeue-latin.woff2",
  "/fonts/bebas/BebasNeue-latin-ext.woff2",
];

/**
 * The hashed build output for the card: the entry chunk, the card route's
 * chunk and everything they pull in. Vite's filenames contain a content
 * hash, so this list is injected at build time by the pwa-precache plugin in
 * vite.config.ts. Without it the app has no JavaScript on the first offline
 * launch and only ever shows the loading screen.
 */
const PRECACHE_ASSETS = /* __PRECACHE_ASSETS__ */ [];

/** How long to wait on the network before falling back to cache. */
const NAV_TIMEOUT_MS = 3500;
const DATA_TIMEOUT_MS = 3000;

/**
 * Media above this size is not put in the Cache API. The quota on a phone is
 * shared with the rest of the origin, and one oversized cover photo would
 * evict the shell.
 */
const MAX_MEDIA_BYTES = 2 * 1024 * 1024;

/* ------------------------------------------------------------------ utils */

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

/** Vite's build output and the static assets we ship by hand. */
function isStaticAsset(url) {
  if (!isSameOrigin(url)) return false;
  return (
    url.pathname.startsWith("/assets/") ||
    url.pathname.startsWith("/fonts/") ||
    url.pathname.startsWith("/icons/")
  );
}

/**
 * The card record itself. Matched on path so the same rule covers the
 * production API (api.lbdluxe.com) and the local worker (localhost:8787).
 */
function isCardData(url) {
  return url.pathname === "/cms/business-card";
}

/**
 * Fetches with a deadline. The underlying request is not aborted — it is left
 * to finish in the background — but the caller stops waiting for it.
 */
function fetchWithTimeout(request, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    fetch(request).then(
      (res) => {
        clearTimeout(timer);
        resolve(res);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

/**
 * Matches a request against a cache, ignoring `Vary`.
 *
 * The CDN sends `Vary: Origin`. A script tag with `crossorigin` sends an
 * Origin header while the service worker's own precache fetch does not, so a
 * strict match misses every cached asset.
 */
const MATCH_OPTIONS = { ignoreVary: true };

function putQuietly(cache, request, response) {
  // Never let a quota error take down the response path.
  cache.put(request, response).catch(() => {});
}

/* ------------------------------------------------------------- strategies */

/**
 * Cache-first. For content-hashed build output this is always a hit after
 * the first load, and for fonts/icons it is always correct.
 *
 * Both caches are consulted: the build assets are precached into the shell
 * cache at install time, while anything fetched later lands in the asset
 * cache.
 */
async function cacheFirst(request) {
  const assetCache = await caches.open(ASSET_CACHE);
  const shellCache = await caches.open(SHELL_CACHE);
  const cached =
    (await assetCache.match(request, MATCH_OPTIONS)) ||
    (await shellCache.match(request, MATCH_OPTIONS));
  if (cached) return cached;

  const fresh = await fetch(request);
  if (fresh && (fresh.ok || fresh.type === "opaque")) {
    putQuietly(assetCache, request, fresh.clone());
  }
  return fresh;
}

/**
 * Network-first with a cached fallback. Used for the card record: the CMS is
 * the source of truth, but a stale card beats no card when the signal drops.
 */
async function networkFirstData(request) {
  const cache = await caches.open(DATA_CACHE);
  try {
    const fresh = await fetchWithTimeout(request, DATA_TIMEOUT_MS);
    if (fresh && fresh.ok) putQuietly(cache, request, fresh.clone());
    return fresh;
  } catch {
    const cached = await cache.match(request, MATCH_OPTIONS);
    if (cached) return cached;
    return new Response(JSON.stringify({ error: "offline" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * Stale-while-revalidate for images.
 *
 * Cross-origin images (the CMS keeps media on S3, which sends no CORS and no
 * Cache-Control) arrive here as opaque responses. Those expose no headers, so
 * their size is unknowable and caching them could fill the device's quota
 * with a single 20 MB photo. They are left to the browser's own HTTP cache
 * instead; only responses whose size we can actually see are stored.
 */
async function staleWhileRevalidateMedia(request) {
  const cache = await caches.open(MEDIA_CACHE);
  const cached = await cache.match(request, MATCH_OPTIONS);

  const network = fetch(request)
    .then((res) => {
      const length = Number(res.headers.get("content-length") || 0);
      if (res.ok && length > 0 && length <= MAX_MEDIA_BYTES) {
        putQuietly(cache, request, res.clone());
      }
      return res;
    })
    .catch(() => null);

  if (cached) {
    network.catch(() => {});
    return cached;
  }

  const fresh = await network;
  if (fresh) return fresh;
  // An empty 504 makes the <img> fire its error handler, which swaps in the
  // card's own gradient/initial placeholder instead of a broken-image icon.
  return new Response("", { status: 504, statusText: "Offline" });
}

/**
 * Navigations. The card is a single-page app, so every card URL resolves to
 * the same document — the response is stored under the canonical card path
 * and reused as the offline fallback.
 */
async function handleNavigate(request) {
  const cache = await caches.open(SHELL_CACHE);

  try {
    const fresh = await fetchWithTimeout(request, NAV_TIMEOUT_MS);
    if (fresh && fresh.ok) {
      putQuietly(cache, CARD_PATH, fresh.clone());
    }
    return fresh;
  } catch {
    const cached =
      (await cache.match(CARD_PATH, MATCH_OPTIONS)) ||
      (await cache.match(request, MATCH_OPTIONS));
    if (cached) return cached;
    return offlineDocument();
  }
}

/** Last-resort page when the shell was never cached. */
function offlineDocument() {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>LB DLUXE — Offline</title>
<style>html,body{margin:0;height:100%;background:#0a0a0a;color:#fff;
font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;
justify-content:center;text-align:center;padding:2rem}
h1{font-size:1.25rem;margin:0 0 .5rem}p{margin:0;color:rgba(255,255,255,.6);font-size:.875rem}</style>
</head><body><div><h1>LB DLUXE</h1><p>You're offline and this card hasn't been cached yet.<br>Reconnect once and it will work offline from then on.</p></div></body></html>`,
    {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    },
  );
}

/* ------------------------------------------------------------- lifecycle */

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      // allSettled, not addAll: one missing file must not fail the install
      // and leave the app without a service worker at all.
      await Promise.allSettled([
        ...SHELL_URLS.map((url) => cache.add(url)),
        ...PRECACHE_ASSETS.map((url) => cache.add(url)),
      ]);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => name.startsWith("lbdluxe-card-") && !ALL_CACHES.includes(name))
          .map((name) => caches.delete(name)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
    return;
  }

  /**
   * The page hands us the card it just fetched. On the very first visit the
   * worker is not controlling the page yet, so the card request never passed
   * through here and nothing was cached — this puts it in the cache so the
   * first offline launch still has something to show.
   */
  if (event.data?.type === "CACHE_CARD" && event.data?.url) {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(DATA_CACHE);
        const response = new Response(JSON.stringify(event.data.card ?? null), {
          headers: { "Content-Type": "application/json" },
        });
        await cache.put(event.data.url, response);
      })(),
    );
  }
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return;

  if (request.mode === "navigate") {
    event.respondWith(handleNavigate(request));
    return;
  }
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  if (isCardData(url)) {
    event.respondWith(networkFirstData(request));
    return;
  }
  if (request.destination === "image") {
    event.respondWith(staleWhileRevalidateMedia(request));
  }
});
