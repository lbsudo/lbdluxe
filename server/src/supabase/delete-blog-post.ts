import { Hono } from "hono";
import type { SupabaseContext } from "@shared/types";

// Inline utility functions
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

export const deleteBlogPost = new Hono<SupabaseContext>();

deleteBlogPost.delete("/", async (c) => {
  try {
    const supabase = c.var.supabase;
    const { id } = await c.req.json();

    if (!id || typeof id !== "number") {
      return c.json({ success: false, error: "Blog post ID is required and must be a number" }, 400);
    }

    // Check if blog post exists
    const { data: blogPost, error: fetchError } = await supabase
      .from("blog_posts")
      .select("id, title, cover_image")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching blog post:", fetchError);
      return c.json({ success: false, error: "Blog post not found" }, 404);
    }

    // Delete cover image from storage if it exists
    if (blogPost.cover_image && typeof blogPost.cover_image === 'string' && blogPost.cover_image.startsWith('https://')) {
      try {
        // Extract the file path from the Supabase URL using utility function
        const storagePath = extractPathFromUrl(blogPost.cover_image);
        if (storagePath) {
          const { error: deleteError } = await supabase.storage
            .from("blog")
            .remove([storagePath]);

          if (deleteError) {
            console.error(`Failed to delete cover image ${storagePath}:`, deleteError);
            // Continue with deletion
          } else {
            console.log(`Successfully deleted cover image: ${storagePath}`);
            
            // Try to delete the entire folder if it's empty
            try {
              const folder = extractFolderFromPath(storagePath);
              if (folder) {
                // List all files in the folder to check if it's empty
                const folderPath = `covers/${folder}/`;
                const { data: files } = await supabase.storage
                  .from("blog")
                  .list(folderPath);
                
                // If no files left, the folder is automatically cleaned up by Supabase
                if (files && files.length === 0) {
                  console.log(`Folder ${folderPath} is now empty and will be cleaned up automatically`);
                }
              }
            } catch (folderError) {
              console.error(`Error checking folder cleanup:`, folderError);
              // Don't fail the operation for folder cleanup issues
            }
          }
        }
      } catch (imageError) {
        console.error(`Error deleting cover image ${blogPost.cover_image}:`, imageError);
        // Continue with deletion
      }
    }

    // Delete the blog post record
    const { error: deleteError } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Supabase delete error:", deleteError);
      return c.json({ success: false, error: deleteError.message }, 500);
    }

    console.log(`Successfully deleted blog post: ${blogPost.title} (ID: ${id})`);
    return c.json({ success: true });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return c.json(
      { success: false, error: err.message ?? "Internal Server Error" },
      500,
    );
  }
});