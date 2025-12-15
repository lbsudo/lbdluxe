import { Hono } from "hono";
import { z } from "zod";
import { getSupabase } from "../../clients/supabase";

/* ----------------------------------------
   Env
---------------------------------------- */

type Env = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

/* ----------------------------------------
   Zod Schemas
---------------------------------------- */

const GetProfileSuccessSchema = z.object({
  success: z.literal(true),
  profile: z.object({
    id: z.uuid(),
    profile_image_url: z.string().nullable(),
    words: z.array(z.string()),
    description: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
  }),
});

const GetProfileErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export type GetProfileResponse =
  | z.infer<typeof GetProfileSuccessSchema>
  | z.infer<typeof GetProfileErrorSchema>;

/* ----------------------------------------
   Route
---------------------------------------- */

export const getProfile = new Hono<{ Bindings: Env }>();

getProfile.get("/", async (c) => {
  const supabase = getSupabase(c.env);

  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    return c.json({ success: false, error: error.message }, 500);
  }

  if (!data) {
    return c.json({ success: false, error: "Profile not found" }, 404);
  }

  return c.json({
    success: true,
    profile: data,
  });
});
