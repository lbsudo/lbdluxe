import { Hono } from "hono";
import type { SupabaseContext } from "@shared/types";

export const deleteProductImage = new Hono<SupabaseContext>();

deleteProductImage.delete("/", async (c) => {
  try {
    const supabase = c.var.supabase;
    const body = await c.req.json();
    // @ts-ignore
    const filePath = String(body.filePath || "");

    // Extract the file path from the full Supabase URL if needed
    // Supabase URLs look like: https://[project-id].supabase.co/storage/v1/object/public/products/[path]
    let storagePath = filePath;
    if (filePath.includes('supabase.co/storage/v1/object/public/products/')) {
      const match = filePath.match(/\/storage\/v1\/object\/public\/products\/(.+)/);
      if (match && match[1]) {
        storagePath = match[1];
      } else {
        return c.json({ success: false, error: "Invalid file path format" }, 400);
      }
    }

    console.log("Attempting to delete product image:", storagePath);

    // Delete from Supabase storage
    const { error: deleteError } = await supabase.storage
      .from("products")
      .remove([storagePath]);

    if (deleteError) {
      console.error("Supabase delete error:", deleteError);
      return c.json({ success: false, error: deleteError.message }, 500);
    }

    // Remove the image URL from the product's image_urls array
    const imageUrl = body.filePath; // Assuming filePath is the full URL
    const { data: products, error: fetchError } = await supabase
      .from("products")
      .select("id, image_urls")
      .contains("image_urls", [imageUrl]);

    if (fetchError) {
      console.error("Error fetching products for image removal:", fetchError);
      return c.json({ success: false, error: "Failed to update product records" }, 500);
    }

    for (const product of products || []) {
      const updatedUrls = (product.image_urls || []).filter((url: string) => url !== imageUrl);
      const { error: updateError } = await supabase
        .from("products")
        .update({ image_urls: updatedUrls })
        .eq("id", product.id);

      if (updateError) {
        console.error(`Failed to update product ${product.id}:`, updateError);
        // Continue with other updates
      } else {
        console.log(`Updated product ${product.id} to remove image URL`);
      }
    }

    console.log("Product image deleted successfully:", storagePath);
    return c.json({ success: true });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return c.json(
      { success: false, error: err.message ?? "Internal Server Error" },
      500,
    );
  }
});