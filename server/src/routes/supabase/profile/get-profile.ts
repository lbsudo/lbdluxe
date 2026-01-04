import { Hono } from "hono";
import type { SupabaseContext } from "@shared/types";

export const getProfile = new Hono<SupabaseContext>();

getProfile.get("/", async (c) => {
  try {
    const supabase = c.var.supabase;

    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Supabase query error:", error);
      return c.json({ success: false, error: error.message }, 500);
    }

    if (!data) {
      return c.json({ success: false, error: "Profile not found" }, 404);
    }

    return c.json({ success: true, profile: data });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return c.json(
      { success: false, error: err.message ?? "Internal Server Error" },
      500,
    );
  }
});
