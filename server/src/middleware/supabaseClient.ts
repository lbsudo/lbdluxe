// server/middleware/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";
import type { MiddlewareHandler } from "hono";
import type { SupabaseContext } from "@shared/types";

export const supabaseMiddleware: MiddlewareHandler<SupabaseContext> = async (
  c,
  next,
) => {
  const { SUPABASE_URL, SUPABASE_SEC_KEY } = c.env;

  if (!SUPABASE_URL || !SUPABASE_SEC_KEY) {
    return c.json(
      { success: false, error: "Missing Supabase environment variables" },
      500,
    );
  }

  // Create a per-request client
  const supabase = createClient(SUPABASE_URL, SUPABASE_SEC_KEY);

  // Attach to context
  c.set("supabase", supabase);

  await next();
};
