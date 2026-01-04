import { Hono } from "hono";
import { cors } from "hono/cors";
import { resendRoutes } from "./routes/resend";
import { supabaseRoutes } from "@server/routes/supabase";

// ------------------------
// Create Hono app
// ------------------------
const app = new Hono();

console.log("🚀 Dev server running at http://localhost:8787");

// ------------------------
// Middleware
// ------------------------
app.use(
  "/*",
  cors({
    origin: (origin) => {
      // Allow all localhost origins in development
      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return origin;
      }
      // Allow production domain
      if (origin === "https://lbdluxe.com") {
        return origin;
      }
      return "http://localhost:5173"; // fallback
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Health check
app.get("/", (c) => c.text("Hello Hono!"));

// Mount routes directly
app.route("/resend", resendRoutes);
app.route("/supabase", supabaseRoutes);

export type AppType = typeof app;

export default app;

