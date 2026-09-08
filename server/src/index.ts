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
    if (origin === "https://lbdluxe.com" || origin === "https://www.lbdluxe.com" || origin === "https://links.lbdluxe.com") {
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

export default app;