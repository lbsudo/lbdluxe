import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { writeFile } from "node:fs/promises";
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