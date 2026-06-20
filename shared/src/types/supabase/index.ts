// shared/src/types/supabase/index.ts
import type { SupabaseClient } from "@supabase/supabase-js";

export type SupabaseEnv = {
  SUPABASE_URL: string;
  SUPABASE_SEC_KEY: string;
};

export type SupabaseContext = {
  Variables: {
    supabase: SupabaseClient;
  };
  Bindings: SupabaseEnv;
};
