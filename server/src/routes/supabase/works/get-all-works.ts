import { Hono } from "hono";
import type { SupabaseContext } from "@shared/types";

export const getAllWorks = new Hono<SupabaseContext>();

getAllWorks.get("/", async (c) => {
  try {
    const supabase = c.var.supabase;

    const { data, error } = await supabase
      .from("works")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase query error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({ success: true, works: data });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return c.json(
      { success: false, error: err.message ?? "Internal Server Error" },
      500,
    );
  }
});