import { Hono } from "hono";
import type { SupabaseContext } from "@shared/types";

export const createWork = new Hono<SupabaseContext>();

// Expected body: { name: string, description: string, project_link?: string, directory?: boolean, beta?: boolean, icon_image_url?: string }
createWork.post("/", async (c) => {
  try {
    const supabase = c.var.supabase;
    const body = await c.req.json();

    const { name, description, project_link, directory, beta, icon_image_url } = body;

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim() === "") {
      return c.json({ success: false, error: "Name is required and must be a non-empty string" }, 400);
    }

    if (!description || typeof description !== "string" || description.trim() === "") {
      return c.json({ success: false, error: "Description is required and must be a non-empty string" }, 400);
    }

    // Prepare data for insertion
    const workData = {
      name: name.trim(),
      description: description.trim(),
      project_link: project_link || null,
      directory: directory ?? false,
      beta: beta ?? false,
      icon_image_url: icon_image_url || null,
    };

    const { data, error } = await supabase
      .from("works")
      .insert(workData)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({ success: true, work: data });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return c.json({ success: false, error: err.message ?? "Internal Server Error" }, 500);
  }
});