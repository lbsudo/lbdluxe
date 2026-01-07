import { createClient } from "@supabase/supabase-js";
import type { SupabaseContext } from "@shared/types";

export const supabaseMiddleware = async (c: any, next: () => Promise<void>) => {
  const { SUPABASE_URL, SUPABASE_SEC_KEY } = c.env;

  if (!SUPABASE_URL || !SUPABASE_SEC_KEY) {
    return c.json(
      { success: false, error: "Missing Supabase environment variables" },
      500,
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SEC_KEY);
  c.set("supabase", supabase);

  await next();
};