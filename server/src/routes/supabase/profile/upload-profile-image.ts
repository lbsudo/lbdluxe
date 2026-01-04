import { Hono } from "hono";
import type { SupabaseContext } from "@shared/types";

export const uploadProfileImage = new Hono<SupabaseContext>();

uploadProfileImage.post("/", async (c) => {
  try {
    const supabase = c.var.supabase;
    const contentType = c.req.header("content-type");
    
    console.log("Content-Type received:", contentType);

    // Handle both FormData and JSON base64 uploads
    if (contentType?.includes("multipart/form-data")) {
      const formData = await c.req.formData();
      const file = formData.get("file") as File;
      
      if (!file) {
        return c.json({ success: false, error: "No file provided" }, 400);
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

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(fileName, file, {
          contentType: file.type,
          cacheControl: "3600",
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        return c.json({ success: false, error: uploadError.message }, 500);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("profile-images")
        .getPublicUrl(fileName);

return c.json({ 
        success: true, 
        url: urlData.publicUrl,
        fileName: fileName
      });
    }

    // For now, we'll focus on FormData uploads since hc handles them better
    // Base64 approach requires Node.js Buffer which isn't available in serverless environments

    // Fallback - try to parse as FormData regardless of content type
    console.log("Fallback: attempting to parse as FormData");
    try {
      const formData = await c.req.formData();
      const file = formData.get("file") as File;
      
      if (!file) {
        return c.json({ success: false, error: "No file provided" }, 400);
      }

      // Process the file (same logic as above)
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        return c.json({ 
          success: false, 
          error: "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed" 
        }, 400);
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(fileName, file, {
          contentType: file.type,
          cacheControl: "3600",
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        return c.json({ success: false, error: uploadError.message }, 500);
      }

      const { data: urlData } = supabase.storage
        .from("profile-images")
        .getPublicUrl(fileName);

      return c.json({ 
        success: true, 
        url: urlData.publicUrl,
        fileName: fileName
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