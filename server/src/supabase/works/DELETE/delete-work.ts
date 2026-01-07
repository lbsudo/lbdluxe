import { Hono } from "hono";
import type { SupabaseContext } from "@shared/types";

export const deleteWork = new Hono<SupabaseContext>();

deleteWork.delete("/", async (c) => {
  try {
    const supabase = c.var.supabase;
    const { id } = await c.req.json();

    if (!id || typeof id !== "string") {
      return c.json({ success: false, error: "Work ID is required and must be a string" }, 400);
    }

    // First, get the work to check if it exists and get image URLs for cleanup
    const { data: work, error: fetchError } = await supabase
      .from("works")
      .select("id, name, image_urls")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching work:", fetchError);
      return c.json({ success: false, error: "Work not found" }, 404);
    }

    // Delete associated images from storage if they exist
    if (work.image_urls && work.image_urls.length > 0) {
      console.log(`Deleting ${work.image_urls.length} images for work: ${work.name}`);

      for (const imageUrl of work.image_urls) {
        try {
          // Extract the file path from the Supabase URL
          let storagePath = imageUrl;
          if (imageUrl.includes('supabase.co/storage/v1/object/public/works/')) {
            storagePath = imageUrl.split('/storage/v1/object/public/works/')[1];
          }

          if (storagePath !== imageUrl) { // Only delete if we successfully parsed the path
            const { error: deleteError } = await supabase.storage
              .from("works")
              .remove([storagePath]);

            if (deleteError) {
              console.error(`Failed to delete image ${storagePath}:`, deleteError);
              // Continue with other deletions even if one fails
            } else {
              console.log(`Successfully deleted image: ${storagePath}`);
            }
          }
        } catch (imageError) {
          console.error(`Error deleting image ${imageUrl}:`, imageError);
          // Continue with other deletions
        }
      }
    }

    // Delete the work record
    const { error: deleteError } = await supabase
      .from("works")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Supabase delete error:", deleteError);
      return c.json({ success: false, error: deleteError.message }, 500);
    }

    console.log(`Successfully deleted work: ${work.name} (ID: ${id})`);
    return c.json({ success: true });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return c.json(
      { success: false, error: err.message ?? "Internal Server Error" },
      500,
    );
  }
});