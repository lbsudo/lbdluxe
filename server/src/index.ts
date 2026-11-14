import { Hono } from "hono";
import { cors } from "hono/cors";
import { supabaseRoutes } from "./supabase";
import { resendRoutes } from "./resend";
import { cmsRoutes } from "./cms";

const app = new Hono();

app.use(cors({
  origin: (origin) => {
    if (
      origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
    ) {
      return origin;
    }
    if (origin === "https://lbdluxe.com" || origin === "https://www.lbdluxe.com" || origin === "https://links.lbdluxe.com" || origin === "https://shop.lbdluxe.com" || origin === "https://card.lbdluxe.com") {
      return origin;
    }
    return "http://localhost:5173";
  },
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.get("/", (c) => c.text("🚀 Local Blog API Server is running!"));

// The API has no crawlable content — keep bots off it entirely.
app.get("/robots.txt", (c) =>
  c.text("User-agent: *\nDisallow: /\n", 200, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "public, max-age=86400",
  }),
);

// Mount group routers
app.route("/supabase", supabaseRoutes);
app.route("/resend", resendRoutes);
app.route("/cms", cmsRoutes);

export { app };

export default {
  fetch: app.fetch,
  // Every 5 minutes: the CMS decides whether a daily or drop-time sync is due.
  async scheduled(_event: unknown, env: { CMS_URL: string; PRINTIFY_SYNC_SECRET: string }) {
    const res = await fetch(`${env.CMS_URL}/api/printify/sync-due`, {
      method: "POST",
      headers: { "x-sync-secret": env.PRINTIFY_SYNC_SECRET },
    });
    if (!res.ok) console.error(`printify sync-due failed: ${res.status}`);
  },
};