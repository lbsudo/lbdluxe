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

function extractPathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/blog\/(.+)/);
    return pathMatch?.[1] || null;
  } catch {
    return null;
  }
}

function extractFolderFromPath(path: string): string | null {
  const parts = path.split('/');
  if (parts.length >= 3 && parts[0] === 'covers') {
    return parts[1] || null;
  }
  return null;
}

function generateCoverImagePath(title: string, fileName: string): string {
  const sanitizedTitle = sanitizeTitleForFolder(title);
  return `covers/${sanitizedTitle}/${fileName}`;
}

function needsFolderMove(currentPath: string, newTitle: string): boolean {
  const currentFolder = extractFolderFromPath(currentPath);
  const expectedFolder = sanitizeTitleForFolder(newTitle);
  return currentFolder !== expectedFolder;
}

export const moveBlogCoverImage = new Hono<SupabaseContext>();

moveBlogCoverImage.post("/", async (c) => {
  try {
    const supabase = c.var.supabase;
    const body = await c.req.json();

    const { currentCoverImageUrl, newTitle } = body;

    if (!currentCoverImageUrl) {
      return c.json({ success: false, error: "Current cover image URL is required" }, 400);
    }

    if (!newTitle) {
      return c.json({ success: false, error: "New blog title is required" }, 400);
    }

    // Extract current path from URL
    const currentPath = extractPathFromUrl(currentCoverImageUrl);
    if (!currentPath) {
      return c.json({ success: false, error: "Invalid cover image URL" }, 400);
    }

    // Check if move is needed
    if (!needsFolderMove(currentPath, newTitle)) {
      return c.json({ 
        success: true, 
        message: "No move needed - folder already matches title",
        url: currentCoverImageUrl 
      });
    }

    // Extract filename from current path
    const pathParts = currentPath.split('/');
    const fileName = pathParts[pathParts.length - 1] || 'cover.jpg';

    // Generate new path
    const newPath = generateCoverImagePath(newTitle, fileName);

    // Download current file
    const { data: downloadData, error: downloadError } = await supabase.storage
      .from("blog")
      .download(currentPath);

    if (downloadError) {
      console.error("Failed to download current image:", downloadError);
      return c.json({ success: false, error: "Failed to download current image" }, 500);
    }

    // Upload to new location
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("blog")
      .upload(newPath, downloadData, {
        contentType: "image/*", // Let Supabase detect the content type
        cacheControl: "3600",
        upsert: true, // Allow overwriting if file exists
      });

    if (uploadError) {
      console.error("Failed to upload to new location:", uploadError);
      return c.json({ success: false, error: "Failed to upload to new location" }, 500);
    }

    // Get new public URL
    const { data: urlData } = supabase.storage
      .from("blog")
      .getPublicUrl(newPath);

    // Delete old file
    const { error: deleteError } = await supabase.storage
      .from("blog")
      .remove([currentPath]);

    if (deleteError) {
      console.error(`Failed to delete old image ${currentPath}:`, deleteError);
      // Don't fail the operation, just log the error
    }

    return c.json({
      success: true,
      url: urlData.publicUrl,
      oldPath: currentPath,
      newPath: newPath
    });

  } catch (err: any) {
    console.error("Unexpected error moving cover image:", err);
    return c.json(
      { success: false, error: err.message ?? "Internal Server Error" },
      500,
    );
  }
});