import { Hono } from "hono";
import { z } from "zod";
import type { SupabaseContext } from "@shared/types";

export const deleteProfileImage = new Hono<SupabaseContext>();

// DELETE /:filename - removes a file from the "profile-images" bucket
deleteProfileImage.delete("/:filename", async (c) => {
  try {
    const supabase = c.var.supabase;
    const { filename } = c.req.param();
    
    // Validate filename with Zod
    const filenameSchema = z.string().min(1, "Filename required");
    const result = filenameSchema.safeParse(filename);
    
    if (!result.success) {
      return c.json({ 
        success: false, 
        error: result.error.issues[0]?.message || "Invalid filename" 
      }, 400);
    }

    const { error } = await supabase.storage.from("profile-images").remove([result.data]);
    if (error) {
      console.error("Supabase delete error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }
    return c.json({ success: true });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return c.json({ success: false, error: err.message ?? "Internal Server Error" }, 500);
  }
});
