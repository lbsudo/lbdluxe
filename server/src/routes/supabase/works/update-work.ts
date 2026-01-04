import { Hono } from "hono";
import type { SupabaseContext } from "@shared/types";

export const updateWork = new Hono<SupabaseContext>();

// Expected body: { id: string, name?: string, description?: string, project_link?: string, directory?: boolean, beta?: boolean, icon_image_url?: string, image_urls?: string[] }
updateWork.put("/", async (c) => {
  try {
    const supabase = c.var.supabase;
    const body = await c.req.json();

    const { id, name, description, project_link, directory, beta, icon_image_url, image_urls } = body;

    if (!id || typeof id !== "string") {
      return c.json({ success: false, error: "Work ID is required and must be a string" }, 400);
    }

    // Check if work exists
    const { data: existing, error: fetchError } = await supabase
      .from("works")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!existing) {
      return c.json({ success: false, error: "Work not found" }, 404);
    }

    // Prepare update data (only include defined fields)
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (project_link !== undefined) updateData.project_link = project_link;
    if (directory !== undefined) updateData.directory = directory;
    if (beta !== undefined) updateData.beta = beta;
    if (icon_image_url !== undefined) updateData.icon_image_url = icon_image_url;
    if (image_urls !== undefined) updateData.image_urls = image_urls;

    const { data, error } = await supabase
      .from("works")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({ success: true, work: data });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return c.json({ success: false, error: err.message ?? "Internal Server Error" }, 500);
  }
});