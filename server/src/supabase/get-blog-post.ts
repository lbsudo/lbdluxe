import { Hono } from "hono";
import type { SupabaseContext } from "@shared/types";

export const getBlogPost = new Hono<SupabaseContext>();

getBlogPost.get("/", async (c) => {
  try {
    const supabase = c.var.supabase;
    const id = c.req.query("id");

    if (!id || isNaN(Number(id))) {
      return c.json({ success: false, error: "Blog post ID is required and must be a number" }, 400);
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", Number(id))
      .single();

    if (error) {
      console.error("Supabase query error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    // Return tags as categories
    const blogPost = { ...data, categories: data.tags || [] };

    return c.json({ success: true, blogPost });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return c.json(
      { success: false, error: err.message ?? "Internal Server Error" },
      500,
    );
  }
});