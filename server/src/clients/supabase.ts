import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type SupabaseEnv = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
};

let client: SupabaseClient | null = null;

export function getSupabase(env: SupabaseEnv): SupabaseClient {
  if (client) return client;

  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables");
  }

  client = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return client;
}
