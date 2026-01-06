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

function generateCoverImagePath(title: string, fileName: string): string {
  const sanitizedTitle = sanitizeTitleForFolder(title);
  return `covers/${sanitizedTitle}/${fileName}`;
}

export const updateBlogPost = new Hono<SupabaseContext>();

// Expected body: { id: number, cover_image?: string, title?: string, content?: string, author?: string, categories?: string[] }
updateBlogPost.put("/", async (c) => {
  try {
    const supabase = c.var.supabase;
    const body = await c.req.json();

    const { id, cover_image, title, content, author, categories } = body;

    if (!id || typeof id !== "number") {
      return c.json({ success: false, error: "Blog post ID is required and must be a number" }, 400);
    }

    // Check if blog post exists and get current data
    const { data: existing, error: fetchError } = await supabase
      .from("blog_posts")
      .select("id, cover_image, title")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!existing) {
      return c.json({ success: false, error: "Blog post not found" }, 404);
    }

    // Prepare update data (only include defined fields)
    const updateData: any = {};
    if (cover_image !== undefined) updateData.cover_image = cover_image;
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (author !== undefined) updateData.author = author;
    if (categories !== undefined) updateData.tags = categories;

    const { data, error } = await supabase
      .from("blog_posts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    // Move cover image folder if title changed and cover image exists (and cover_image wasn't explicitly updated)
    if (title !== undefined && existing.title !== title && existing.cover_image && cover_image === undefined) {
      try {
        // Extract old path
        const oldPath = extractPathFromUrl(existing.cover_image);
        if (oldPath) {
          // Extract filename from old path
          const pathParts = oldPath.split('/');
          const fileName = pathParts[pathParts.length - 1] || 'cover.jpg';

          // Generate new path with updated title
          const newPath = generateCoverImagePath(title, fileName);

          // Download old file
          const { data: fileData, error: downloadError } = await supabase.storage
            .from("blog")
            .download(oldPath);

          if (downloadError) {
            console.error(`Failed to download cover image ${oldPath}:`, downloadError);
          } else {
            // Upload to new path
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from("blog")
              .upload(newPath, fileData, {
                contentType: fileData.type || "image/*",
                cacheControl: "3600",
                upsert: true,
              });

            if (uploadError) {
              console.error(`Failed to upload to new path ${newPath}:`, uploadError);
            } else {
              // Get new public URL
              const { data: urlData } = supabase.storage
                .from("blog")
                .getPublicUrl(newPath);

              // Update DB with new cover_image URL
              const { error: updateError } = await supabase
                .from("blog_posts")
                .update({ cover_image: urlData.publicUrl })
                .eq("id", id);

              if (updateError) {
                console.error(`Failed to update cover_image URL:`, updateError);
              } else {
                console.log(`Successfully moved cover image from ${oldPath} to ${newPath}`);
                // Update the returned data
                data.cover_image = urlData.publicUrl;
              }

              // Delete old file
              const { error: deleteError } = await supabase.storage
                .from("blog")
                .remove([oldPath]);

              if (deleteError) {
                console.error(`Failed to delete old cover image ${oldPath}:`, deleteError);
              }
            }
          }
        }
      } catch (moveError) {
        console.error(`Error moving cover image folder:`, moveError);
      }
    }

    // Delete old cover image if cover_image was changed
    if (cover_image !== undefined && existing.cover_image && existing.cover_image !== cover_image) {
      try {
        // Extract the file path from the old Supabase URL using utility function
        const storagePath = extractPathFromUrl(existing.cover_image);
        if (storagePath) {
          const { error: deleteError } = await supabase.storage
            .from("blog")
            .remove([storagePath]);

          if (deleteError) {
            console.error(`Failed to delete old cover image ${storagePath}:`, deleteError);
          } else {
            console.log(`Successfully deleted old cover image: ${storagePath}`);
          }
        }
      } catch (imageError) {
        console.error(`Error deleting old cover image ${existing.cover_image}:`, imageError);
      }
    }

    return c.json({ success: true, blogPost: data });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return c.json({ success: false, error: err.message ?? "Internal Server Error" }, 500);
  }
});