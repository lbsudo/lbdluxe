// server/src/supabase/get-authors.ts
import { Hono } from "hono";
import type { SupabaseContext } from "@shared/types";

export const getAuthors = new Hono<SupabaseContext>();

getAuthors.get("/", async (c) => {
  try {
    const supabase = c.var.supabase;

    const { data, error } = await supabase
      .from("authors")
      .select("id, name")
      .order("name");

    if (error) {
      console.error("Supabase error:", error);
      return c.json({ success: false, error: "Failed to fetch authors" }, 400);
    }

    const authors = data || [];

    return c.json({ success: true, authors: authors }, 200);
  } catch (err: any) {
    console.error("Unexpected error fetching authors:", err);
    return c.json(
      { success: false, error: "Failed to fetch authors" },
      500,
    );
  }
});