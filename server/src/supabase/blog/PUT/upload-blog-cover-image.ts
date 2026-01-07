import { Hono } from "hono";
import type { SupabaseContext } from "@shared/types";

// Inline utility functions
function sanitizeTitleForFolder(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\-_\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function generateCoverImagePath(title: string, fileName: string): string {
  const sanitizedTitle = sanitizeTitleForFolder(title);
  return `covers/${sanitizedTitle}/${fileName}`;
}

function generateUniqueFileName(originalFileName: string): string {
  const fileExt = originalFileName.split('.').pop();
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  return `cover-${timestamp}-${random}.${fileExt || 'jpg'}`;
}

export const uploadBlogCoverImage = new Hono<SupabaseContext>();

uploadBlogCoverImage.post("/", async (c) => {
  try {
    const supabase = c.var.supabase;
    const contentType = c.req.header("content-type");

    if (contentType?.includes("multipart/form-data")) {
      const formData = await c.req.formData();
      const file = formData.get("file") as File;
      const blogTitle = formData.get("blogTitle") as string;

      if (!file) {
        return c.json({ success: false, error: "No file provided" }, 400);
      }

      if (!blogTitle) {
        return c.json({ success: false, error: "Blog title is required" }, 400);
      }

      // Validate file type
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

      // Generate unique filename and path
      const fileName = generateUniqueFileName(file.name);
      const fullPath = generateCoverImagePath(blogTitle, fileName);

      // Convert file to ArrayBuffer for upload
      const fileBuffer = await file.arrayBuffer();

      // Upload to Supabase storage in blog bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("blog")
        .upload(fullPath, fileBuffer, {
          contentType: file.type,
          cacheControl: "3600",
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        return c.json({
          success: false,
          error: `Upload failed: ${uploadError.message}`
        }, 500);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("blog")
        .getPublicUrl(fullPath);

      return c.json({
        success: true,
        url: urlData.publicUrl,
        fileName: fullPath
      });
    }

    return c.json({ success: false, error: "Invalid request" }, 400);
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return c.json(
      { success: false, error: err.message ?? "Internal Server Error" },
      500,
    );
  }
});