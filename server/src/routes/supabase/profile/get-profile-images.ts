import { Hono } from "hono";
import type { SupabaseContext } from "@shared/types";

export const getProfileImages = new Hono<SupabaseContext>();

// Route to fetch all images from the "profile-images" Supabase Storage bucket
getProfileImages.get("/", async (c) => {
  try {
    const supabase = c.var.supabase;

    // List all files in the bucket (root path)
    const { data: files, error } = await supabase.storage
      .from("profile-images")
      .list("", {
        limit: 1000, // adjust as needed
        offset: 0,
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      console.error("Supabase storage list error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    // Generate public URLs for each file
    const imageUrls = files.map(
      (file) =>
        supabase.storage.from("profile-images").getPublicUrl(file.name).data
          .publicUrl,
    );

    return c.json({ success: true, images: imageUrls });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return c.json(
      { success: false, error: err.message ?? "Internal Server Error" },
      500,
    );
  }
});
