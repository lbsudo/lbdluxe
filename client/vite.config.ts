import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import type { Plugin } from "vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

const SITE_URL = "https://lbdluxe.com";
const SHOP_URL = "https://shop.lbdluxe.com";

const STATIC_ROUTES: { path: string; changeFreq: string; priority: string }[] = [
  { path: "/", changeFreq: "weekly", priority: "1.0" },
  { path: "/works", changeFreq: "weekly", priority: "0.9" },
  { path: "/shelf", changeFreq: "weekly", priority: "0.7" },
  { path: "/shelf-items", changeFreq: "weekly", priority: "0.6" },
  { path: "/products", changeFreq: "monthly", priority: "0.6" },
  { path: "/blog", changeFreq: "weekly", priority: "0.9" },
];

// The shop is canonical on its own subdomain, so it gets its own sitemap.
// NOTE: type path segments must match the route param values exactly
// (program | supplement | peptide — singular), not the plural labels.
const SHOP_STATIC_ROUTES: { path: string; changeFreq: string; priority: string }[] = [
  { path: "/fitness", changeFreq: "weekly", priority: "0.9" },
  { path: "/fitness/program", changeFreq: "weekly", priority: "0.7" },
  { path: "/fitness/supplement", changeFreq: "weekly", priority: "0.6" },
  { path: "/fitness/peptide", changeFreq: "weekly", priority: "0.6" },
];

function sitemapXml(entries: { loc: string; lastmod?: string; changeFreq: string; priority: string }[]) {
  const urls = entries
    .map((e) => {
      const lastmod = e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>\n` : "";
      return `  <url>
    <loc>${e.loc}</loc>
${lastmod}    <changefreq>${e.changeFreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n${urls}\n</urlset>\n`;
}

function buildSitemap(): Plugin {
  return {
    name: "sitemap-generator",
    apply: "build",
    async writeBundle(options) {
      const entries: { loc: string; lastmod?: string; changeFreq: string; priority: string }[] =
        STATIC_ROUTES.map((r) => ({
          loc: `${SITE_URL}${r.path === "/" ? "/" : r.path}`,
          changeFreq: r.changeFreq,
          priority: r.priority,
        }));

      const apiUrl = process.env.VITE_SERVER_URL || "https://api.lbdluxe.com";
      try {
        const res = await fetch(`${apiUrl}/cms/posts`, {
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(10000),
        });
        if (res.ok) {
          const posts = (await res.json()) as { slug?: string | null; updatedAt?: string }[];
          for (const post of posts) {
            if (!post.slug) continue;
            const lastmod = post.updatedAt ? post.updatedAt.slice(0, 10) : undefined;
            entries.push({
              loc: `${SITE_URL}/blog/${post.slug}`,
              lastmod,
              changeFreq: "monthly",
              priority: "0.8",
            });
          }
        }
      } catch {
        // CMS unreachable at build time — static routes only.
      }

      const outFile = path.join(options.dir ?? "dist", "sitemap.xml");
      await writeFile(outFile, sitemapXml(entries));
      this.info(`sitemap.xml written with ${entries.length} URLs`);

      // Shop sitemap (canonical on shop.lbdluxe.com).
      const shopEntries: { loc: string; lastmod?: string; changeFreq: string; priority: string }[] =
        SHOP_STATIC_ROUTES.map((r) => ({
          loc: `${SHOP_URL}${r.path}`,
          changeFreq: r.changeFreq,
          priority: r.priority,
        }));

      try {
        const res = await fetch(`${apiUrl}/cms/fitness-products`, {
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(10000),
        });
        if (res.ok) {
          const products = (await res.json()) as {
            slug?: string | null;
            type?: string | null;
            updatedAt?: string;
          }[];
          for (const product of products) {
            if (!product.slug || !product.type) continue;
            const lastmod = product.updatedAt ? product.updatedAt.slice(0, 10) : undefined;
            shopEntries.push({
              loc: `${SHOP_URL}/fitness/${product.type}/${product.slug}`,
              lastmod,
              changeFreq: "monthly",
              priority: "0.7",
            });
          }
        }
      } catch {
        // CMS unreachable at build time — static shop routes only.
      }

      const shopOutFile = path.join(options.dir ?? "dist", "sitemap-shop.xml");
      await writeFile(shopOutFile, sitemapXml(shopEntries));
      this.info(`sitemap-shop.xml written with ${shopEntries.length} URLs`);
    },
  };
}

/**
 * Injects the card's precache manifest into the service worker.
 *
 * Vite's output filenames carry a content hash, so the service worker cannot
 * know them ahead of time. This works out which files the card actually needs
 * — the ones the built HTML references, plus the card route's lazily loaded
 * chunk and everything either of them imports — and writes the list into
 * dist/sw.js. Without it the card has no JavaScript the first time it is
 * opened offline and only ever shows the loading screen.
 */
function pwaPrecache(): Plugin {
  return {
    name: "pwa-precache",
    apply: "build",
    async writeBundle(options, bundle) {
      const outDir = options.dir ?? "dist";
      const files = new Set<string>();

      const add = (fileName: string) => {
        if (fileName) files.add(fileName.replace(/^\//, ""));
      };

      /** Adds a chunk and everything it statically pulls in. */
      const walk = (key: string) => {
        const chunk = bundle[key];
        if (!chunk || chunk.type !== "chunk") return;
        if (files.has(chunk.fileName)) return;
        add(chunk.fileName);
        for (const css of chunk.viteMetadata?.importedCss ?? []) add(css);
        for (const imported of chunk.imports) walk(imported);
      };

      // What the built HTML actually asks the browser for. This is the
      // authoritative list — the Rollup "entry" chunk is not necessarily the
      // script the HTML ends up referencing.
      const html = await readFile(path.join(outDir, "index.html"), "utf8");
      const referenced = new Set<string>();
      for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) {
        referenced.add(match[1]);
        add(match[1]);
      }

      // Pull in the import graph of each referenced chunk.
      for (const [key, chunk] of Object.entries(bundle)) {
        if (chunk.type !== "chunk") continue;
        if (referenced.has(`/${chunk.fileName}`)) walk(key);
      }

      // The card route is code-split, so its chunk is fetched at runtime and
      // has to be precached explicitly for the offline launch.
      for (const [key, chunk] of Object.entries(bundle)) {
        if (chunk.type !== "chunk") continue;
        if (chunk.facadeModuleId?.includes("routes/card/index.tsx")) walk(key);
      }

      const assets = [...files].sort().map((f) => `/${f}`);
      const total = assets.reduce((sum, f) => {
        const chunk = Object.values(bundle).find(
          (c) => c.type === "chunk" && c.fileName === f.replace(/^\//, ""),
        );
        return sum + (chunk && "code" in chunk ? chunk.code.length : 0);
      }, 0);

      const swPath = path.join(outDir, "sw.js");
      const source = await readFile(swPath, "utf8");
      const patched = source.replace(
        "/* __PRECACHE_ASSETS__ */ []",
        JSON.stringify(assets, null, 2),
      );

      if (patched === source) {
        this.warn("pwa-precache: precache marker not found in sw.js");
        return;
      }

      await writeFile(swPath, patched);
      this.info(
        `sw.js precache: ${assets.length} assets (~${Math.round(total / 1024)} kB of JS)`,
      );
    },
  };
}

export default defineConfig({
  plugins: [
    // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    buildSitemap(),
    pwaPrecache(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@server": path.resolve(__dirname, "../server/src"),
      "@shared": path.resolve(__dirname, "../shared/src"),
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "framer-motion",
      "lucide-react",
      "clsx",
      "tailwind-merge",
    ],
    exclude: ["server", "shared"],
  },
});