import { Hono } from "hono";
import type { SupabaseContext } from "@shared/types";

export const createBlogPost = new Hono<SupabaseContext>();

// Expected body: { cover_image: string, title: string, content: string, author: string, categories?: string[] }
createBlogPost.post("/", async (c) => {
  try {
    const supabase = c.var.supabase;
    const body = await c.req.json();

    const { cover_image, title, content, author, categories } = body;

    // Validate required fields
    if (!cover_image || typeof cover_image !== "string" || cover_image.trim() === "") {
      return c.json({ success: false, error: "Cover image is required and must be a non-empty string" }, 400);
    }

    if (!title || typeof title !== "string" || title.trim() === "") {
      return c.json({ success: false, error: "Title is required and must be a non-empty string" }, 400);
    }

    if (!content || typeof content !== "string" || content.trim() === "") {
      return c.json({ success: false, error: "Content is required and must be a non-empty string" }, 400);
    }

    if (!author || typeof author !== "string" || author.trim() === "") {
      return c.json({ success: false, error: "Author is required and must be a non-empty string" }, 400);
    }

    // Prepare data for insertion
    const blogPostData = {
      cover_image: cover_image.trim(),
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      tags: categories || [],
    };

    const { data, error } = await supabase
      .from("blog_posts")
      .insert(blogPostData)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({ success: true, blogPost: data });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return c.json({ success: false, error: err.message ?? "Internal Server Error" }, 500);
  }
});