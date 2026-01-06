import { Hono } from "hono";
import { cors } from "hono/cors";

console.log("🚀 Dev server running at http://localhost:8787");

// ------------------------
// Create Hono app
// ------------------------
const app = new Hono();

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

// Test upload endpoint
app.post("/supabase/upload-blog-cover-image", async (c) => {
  try {
    const contentType = c.req.header("content-type");
    
    if (contentType?.includes("multipart/form-data")) {
      const formData = await c.req.formData();
      const file = formData.get("file") as File;
      const blogTitle = formData.get("blogTitle") as string;
      
      if (!file) {
        return c.json({ success: false, error: "No file provided" }, 400);
      }
      
      if (!blogTitle) {
        return c.json({ success: false, error: "Blog title is required" }, 400);
      }
      
      return c.json({
        success: true,
        message: "Upload endpoint is working!",
        fileName: file.name,
        blogTitle: blogTitle,
        size: file.size,
        type: file.type
      });
    }
    
    return c.json({ success: false, error: "Invalid request" }, 400);
  } catch (err: any) {
    console.error("Upload error:", err);
    return c.json(
      { success: false, error: err.message ?? "Internal Server Error" },
      500,
    );
  }
});

export type AppType = typeof app;

export default app;