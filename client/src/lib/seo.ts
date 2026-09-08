import { useEffect } from "react";

export const SITE_NAME = "LBDLUXE";
export const SITE_URL = "https://lbdluxe.com";
export const LINKS_URL = "https://links.lbdluxe.com";
export const DEFAULT_TITLE = "Lawrence Brown — Full-Stack Developer";
export const DEFAULT_DESCRIPTION =
  "Portfolio of Lawrence Brown, a full-stack developer crafting modern, accessible, high-performance web applications, tutorials, and open-source projects.";
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

export interface SEOOptions {
  /** Page-specific title suffix; defaults to the site tagline. */
  title?: string;
  description: string;
  /** Path relative to the host root, e.g. "/", "/works", "/blog/my-post". */
  path: string;
  host?: "main" | "links";
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function seoHead(opts: SEOOptions) {
  const base = opts.host === "links" ? LINKS_URL : SITE_URL;
  const url = `${base}${opts.path === "/" ? "/" : opts.path}`;
  const title = opts.title ? `${SITE_NAME} | ${opts.title}` : `${SITE_NAME} | ${DEFAULT_TITLE}`;
  const description = opts.description;
  const image = opts.image ?? DEFAULT_IMAGE;
  const robots = opts.noindex ? "noindex, follow" : "index, follow";
  const type = opts.type ?? "website";

  const meta: Record<string, unknown>[] = [
    { title },
    { name: "description", content: description },
    { name: "robots", content: robots },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:image", content: image },
    { property: "og:image:alt", content: title },
    { property: "og:locale", content: "en_US" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];

  if (opts.jsonLd) {
    meta.push({ "script:ld+json": opts.jsonLd });
  }

  return {
    meta,
    links: [{ rel: "canonical", href: url }],
  };
}

const DYNAMIC_KEYS = [
  "description",
  "robots",
  "og:site_name",
  "og:title",
  "og:description",
  "og:type",
  "og:url",
  "og:image",
  "og:image:alt",
  "og:locale",
  "twitter:card",
  "twitter:title",
  "twitter:description",
  "twitter:image",
] as const;

function upsertMeta(key: string, content: string, create: (el: HTMLMetaElement) => void) {
  const selector = key.startsWith("og:") || key.startsWith("twitter:")
    ? `meta[property="${key}"]`
    : `meta[name="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    if (key.startsWith("og:") || key.startsWith("twitter:")) {
      el.setAttribute("property", key);
    } else {
      el.setAttribute("name", key);
    }
    el.setAttribute("data-seo", key);
    document.head.appendChild(el);
  }
  if (el.getAttribute("data-seo") !== key) {
    el.setAttribute("data-seo", key);
  }
  create(el);
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    el.setAttribute("data-seo", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(data: Record<string, unknown> | Record<string, unknown>[]) {
  let el = document.head.querySelector<HTMLScriptElement>('script[data-seo="ld+json"]');
  if (!el) {
    el = document.createElement("script");
    el.setAttribute("type", "application/ld+json");
    el.setAttribute("data-seo", "ld+json");
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function removeDynamicTags() {
  document.head
    .querySelectorAll("[data-seo]")
    .forEach((el) => el.remove());
}

export function applyDynamicHead(opts: SEOOptions) {
  const base = opts.host === "links" ? LINKS_URL : SITE_URL;
  const url = `${base}${opts.path === "/" ? "/" : opts.path}`;
  const title = opts.title ? `${SITE_NAME} | ${opts.title}` : `${SITE_NAME} | ${DEFAULT_TITLE}`;
  const image = opts.image ?? DEFAULT_IMAGE;
  const robots = opts.noindex ? "noindex, follow" : "index, follow";
  const type = opts.type ?? "website";

  document.title = title;

  for (const key of DYNAMIC_KEYS) {
    let content: string;
    switch (key) {
      case "description":
        content = opts.description;
        break;
      case "robots":
        content = robots;
        break;
      case "og:site_name":
        content = SITE_NAME;
        break;
      case "og:title":
      case "twitter:title":
        content = title;
        break;
      case "og:description":
      case "twitter:description":
        content = opts.description;
        break;
      case "og:type":
        content = type;
        break;
      case "og:url":
        content = url;
        break;
      case "og:image":
      case "twitter:image":
        content = image;
        break;
      case "og:image:alt":
        content = title;
        break;
      case "og:locale":
        content = "en_US";
        break;
      case "twitter:card":
        content = "summary_large_image";
        break;
      default:
        content = "";
    }
    upsertMeta(key, content, () => undefined);
  }

  upsertCanonical(url);

  if (opts.jsonLd) {
    upsertJsonLd(opts.jsonLd);
  } else {
    document.head.querySelector('script[data-seo="ld+json"]')?.remove();
  }
}

/** Imperatively applies/removes dynamic metadata for data that loads after the route head. */
export function useDynamicHead(opts: SEOOptions | null | undefined, deps: unknown[] = []) {
  useEffect(() => {
    if (!opts) return;
    applyDynamicHead(opts);
    return () => {
      removeDynamicTags();
      document.title = `${SITE_NAME} | ${DEFAULT_TITLE}`;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Strips HTML to a plain-text excerpt of roughly `max` characters. */
export function excerptFromHtml(html: string | null | undefined, max = 160): string {
  if (!html) return "";
  const text = html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max).lastIndexOf(" ");
  return `${text.slice(0, cut > 0 ? cut : max).trim()}…`;
}