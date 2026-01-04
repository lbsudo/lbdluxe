import { Hono } from "hono";
import type { SupabaseContext } from "@shared/types";

export const updateProfile = new Hono<SupabaseContext>();

// Expected body: { description: string, words: string[] }
updateProfile.post("/", async (c) => {
  try {
    const supabase = c.var.supabase;
    const { description, words } = await c.req.json();

    // Assuming there is only one profile row; fetch its id first
    const { data: existing, error: fetchError } = await supabase
      .from("profile")
      .select("id")
      .limit(1)
      .maybeSingle();
    if (fetchError) throw fetchError;
    if (!existing) return c.json({ success: false, error: "Profile not found" }, 404);

    const { error: updateError } = await supabase
      .from("profile")
      .update({ description, words })
      .eq("id", existing.id);

    if (updateError) {
      console.error("Supabase update error:", updateError);
      return c.json({ success: false, error: updateError.message }, 500);
    }

    return c.json({ success: true });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return c.json({ success: false, error: err.message ?? "Internal Server Error" }, 500);
  }
});
