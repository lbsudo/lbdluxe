import { Hono } from "hono";
import { cors } from "hono/cors";
import { resendRoutes } from "./routes/resend";
import supabaseRoutes from "./routes/supabase";

export const app = new Hono().basePath("/api");

app.use(
  "/*",
  cors({
    origin: [
      "http://localhost:5173",
      "https://lbdluxe.com",
      "https://www.lbdluxe.com",
      "https://lbdluxe.pages.dev",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.get("/", (c) => c.text("Hello Hono!"));

// Mount route group: /api/resend/*
app.route("/resend", resendRoutes);
app.route("/supabase", supabaseRoutes);

export default app;
