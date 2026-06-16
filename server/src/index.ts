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
    if (origin === "https://lbdluxe.com" || "https://www.lbdluxe.com") {
      return origin;
    }
    return "http://localhost:5173";
  },
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.get("/", (c) => c.text("🚀 Local Blog API Server is running!"));

// Mount group routers
app.route("/supabase", supabaseRoutes);
app.route("/resend", resendRoutes);
app.route("/cms", cmsRoutes);

export default app;