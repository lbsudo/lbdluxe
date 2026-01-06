import { Hono } from "hono";
import type { SupabaseContext } from "@shared/types";

export const createProduct = new Hono<SupabaseContext>();

// Expected body: { name: string, description: string, project_link?: string, directory?: boolean, beta?: boolean, icon_image_url?: string, image_urls?: string[] }
createProduct.post("/", async (c) => {
  try {
    const supabase = c.var.supabase;
    const body = await c.req.json();

    const { name, description, project_link, directory, beta, icon_image_url, image_urls } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim() === "") {
      return c.json({ success: false, error: "Name is required and must be a non-empty string" }, 400);
    }

    if (!description || typeof description !== "string" || description.trim() === "") {
      return c.json({ success: false, error: "Description is required and must be a non-empty string" }, 400);
    }

    // Prepare data for insertion
    const productData = {
      name: name.trim(),
      description: description.trim(),
      project_link: project_link || null,
      directory: directory ?? false,
      beta: beta ?? false,
      icon_image_url: icon_image_url || null,
      image_urls: image_urls || [],
    };

    const { data, error } = await supabase
      .from("products")
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({ success: true, product: data });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return c.json({ success: false, error: err.message ?? "Internal Server Error" }, 500);
  }
});