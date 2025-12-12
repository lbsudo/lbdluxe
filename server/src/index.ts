import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ApiResponse } from "shared/dist";
import { resendRoutes } from "@server/resendRoutes";

export const app = new Hono()
  .basePath("/api")

  // Apply CORS to ALL routes
  .use(
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
      exposeHeaders: ["Content-Length", "Content-Type"],
      // maxAge: 86400,
      credentials: true,
    }),
  )

  // Explicit OPTIONS handler for preflight - ADD THIS
  /*.options('/!*', (c) => {
		return c.body(null, 204);
	})*/

  .get("/", (c) => {
    return c.text("Hello Hono!");
  })

  .get("/hello", async (c) => {
    const data: ApiResponse = {
      message: "Hello BHVR!",
      success: true,
    };

    return c.json(data, { status: 200 });
  });
app.route("/resend", resendRoutes);

export default app;
