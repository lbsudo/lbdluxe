import { Hono } from "hono";
import type { SupabaseContext } from "@shared/types";

export const deleteProduct = new Hono<SupabaseContext>();

deleteProduct.delete("/", async (c) => {
  try {
    const supabase = c.var.supabase;
    const { id } = await c.req.json();

    if (!id || typeof id !== "string") {
      return c.json({ success: false, error: "Product ID is required and must be a string" }, 400);
    }

    // First, get the product to check if it exists and get images for cleanup
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("id, name, image_urls")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching product:", fetchError);
      return c.json({ success: false, error: "Product not found" }, 404);
    }

    // Delete associated images from storage if they exist
    if (product.image_urls && product.image_urls.length > 0) {
      console.log(`Deleting ${product.image_urls.length} images for product: ${product.name}`);

      for (const imageUrl of product.image_urls) {
        try {
          // Extract the file path from the Supabase URL
          let storagePath = imageUrl;
          if (imageUrl.includes('supabase.co/storage/v1/object/public/products/')) {
            const match = imageUrl.match(/\/storage\/v1\/object\/public\/products\/(.+)/);
            if (match && match[1]) {
              storagePath = match[1];
            } else {
              console.error(`Invalid image URL format: ${imageUrl}`);
              continue;
            }
          }

          if (storagePath !== imageUrl) { // Only delete if we successfully parsed the path
            const { error: deleteError } = await supabase.storage
              .from("products")
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

    // Delete the product record
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Supabase delete error:", deleteError);
      return c.json({ success: false, error: deleteError.message }, 500);
    }

    console.log(`Successfully deleted product: ${product.name} (ID: ${id})`);
    return c.json({ success: true });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return c.json(
      { success: false, error: err.message ?? "Internal Server Error" },
      500,
    );
  }
});