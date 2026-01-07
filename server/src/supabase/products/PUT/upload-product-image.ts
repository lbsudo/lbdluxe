import { Hono } from "hono";
import type { SupabaseContext } from "@shared/types";

export const uploadProductImage = new Hono<SupabaseContext>();

uploadProductImage.post("/", async (c) => {
  try {
    const supabase = c.var.supabase;
    const contentType = c.req.header("content-type");

    console.log("Content-Type received:", contentType);

    // Handle FormData uploads
    if (contentType?.includes("multipart/form-data")) {
      const formData = await c.req.formData();
      const file = formData.get("file") as File;
      const productName = formData.get("productName") as string;

      if (!file) {
        return c.json({ success: false, error: "No file provided" }, 400);
      }

      if (!productName) {
        return c.json({ success: false, error: "Product name is required" }, 400);
      }

      // Validate file type (allow common image formats)
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        return c.json({
          success: false,
          error: "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed"
        }, 400);
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return c.json({
          success: false,
          error: "File too large. Maximum size is 5MB"
        }, 400);
      }

      // Sanitize product name for folder name (remove special characters, spaces)
      const sanitizedProductName = productName
        .toLowerCase()
        .replace(/[^a-z0-9\-_]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const fullPath = `${sanitizedProductName}/${fileName}`;

      // Upload to Supabase storage in products bucket
      console.log("Attempting to upload to path:", fullPath);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("products")
        .upload(fullPath, file, {
          contentType: file.type,
          cacheControl: "3600",
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        console.error("Upload data:", uploadData);

        // Provide more specific error messages
        if (uploadError.message.includes('not found')) {
          return c.json({
            success: false,
            error: "The 'products' storage bucket does not exist or is not accessible. Please create it in your Supabase dashboard under Storage and make it public."
          }, 400);
        }

        return c.json({
          success: false,
          error: `Upload failed: ${uploadError.message}`
        }, 500);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(fullPath);

      console.log("Upload successful:", uploadData);
      return c.json({
        success: true,
        url: urlData.publicUrl,
        fileName: fullPath
      });
    }

    // Fallback - try to parse as FormData regardless of content type
    console.log("Fallback: attempting to parse as FormData");
    try {
      const formData = await c.req.formData();
      const file = formData.get("file") as File;
      const productName = formData.get("productName") as string;

      if (!file) {
        return c.json({ success: false, error: "No file provided" }, 400);
      }

      if (!productName) {
        return c.json({ success: false, error: "Product name is required" }, 400);
      }

      // Process the file (same logic as above)
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        return c.json({
          success: false,
          error: "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed"
        }, 400);
      }

      const sanitizedProductName = productName
        .toLowerCase()
        .replace(/[^a-z0-9\-_]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const fullPath = `${sanitizedProductName}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("products")
        .upload(fullPath, file, {
          contentType: file.type,
          cacheControl: "3600",
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        return c.json({ success: false, error: uploadError.message }, 500);
      }

      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(fullPath);

      return c.json({
        success: true,
        url: urlData.publicUrl,
        fileName: fullPath
      });
    } catch (formError) {
      console.error("FormData parsing failed:", formError);
      return c.json({ success: false, error: "Failed to parse form data" }, 400);
    }
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return c.json(
      { success: false, error: err.message ?? "Internal Server Error" },
      500,
    );
  }
});