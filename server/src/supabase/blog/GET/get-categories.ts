// server/src/supabase/get-categories.ts
import { Hono } from "hono";
import type { SupabaseContext } from "@shared/types";

export const getCategories = new Hono<SupabaseContext>();

getCategories.get("/", async (c) => {
  try {
    const supabase = c.var.supabase;

    const { data, error } = await supabase
      .from("categories")
      .select("id, name")
      .order("name");

    if (error) {
      console.error("Supabase error:", error);
      return c.json({ success: false, error: "Failed to fetch categories" }, 400);
    }

    const categories = data || [];

    return c.json({ success: true, categories: categories }, 200);
  } catch (err: any) {
    console.error("Unexpected error fetching categories:", err);
    return c.json(
      { success: false, error: "Failed to fetch categories" },
      500,
    );
  }
});