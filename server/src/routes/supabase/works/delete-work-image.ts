import { Hono } from "hono";
import type { SupabaseContext } from "@shared/types";

export const deleteWorkImage = new Hono<SupabaseContext>();

deleteWorkImage.delete("/", async (c) => {
  try {
    const supabase = c.var.supabase;
    const body = await c.req.json();

    if (!body || typeof body !== 'object' || !('filePath' in body)) {
      return c.json({ success: false, error: "filePath is required in request body" }, 400);
    }

    const filePathRaw = (body as any).filePath;
    // Validate file path
    if (!filePathRaw || (typeof filePathRaw !== "string" && typeof filePathRaw !== "number")) {
      return c.json({ success: false, error: "File path is required and must be a string or number" }, 400);
    }

    // For now, just convert to string - will add proper validation later
    let filePath = "";
    if (filePathRaw) {
      if (typeof filePathRaw.toString === 'function') {
        filePath = filePathRaw.toString();
      } else {
        filePath = "" + filePathRaw;
      }
    }
    if (filePath === "") {
      return c.json({ success: false, error: "File path cannot be empty" }, 400);
    }

    // Extract the file path from the full Supabase URL if needed
    // Supabase URLs look like: https://[project-id].supabase.co/storage/v1/object/public/works/[path]
    let storagePath = filePath;
    if (filePath.includes('supabase.co/storage/v1/object/public/works/')) {
      const splitResult = filePath.split('/storage/v1/object/public/works/');
      storagePath = splitResult[1] || filePath;
    }

    console.log("Attempting to delete file:", storagePath);

    // Delete from Supabase storage
    const { error: deleteError } = await supabase.storage
      .from("works")
      .remove([storagePath]);

    if (deleteError) {
      console.error("Supabase delete error:", deleteError);
      return c.json({ success: false, error: deleteError.message }, 500);
    }

    console.log("File deleted successfully:", storagePath);
    return c.json({ success: true });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return c.json(
      { success: false, error: err.message ?? "Internal Server Error" },
      500,
    );
  }
});