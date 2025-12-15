import { Hono } from "hono";
import { z } from "zod";
import { getSupabase } from "../../clients/supabase";

/* ----------------------------------------
   Zod Schemas
---------------------------------------- */

const UpdateProfileBodySchema = z.object({
  profile_image_url: z.url().optional(),
  words: z.array(z.string().min(1)).optional(),
  description: z.string().min(1).optional(),
});

const UpdateProfileSuccessSchema = z.object({
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

const UpdateProfileErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

const UpdateProfileResponseSchema = z.union([
  UpdateProfileSuccessSchema,
  UpdateProfileErrorSchema,
]);

/* ----------------------------------------
   Exported Types
---------------------------------------- */

export type UpdateProfileBody = z.infer<typeof UpdateProfileBodySchema>;
export type UpdateProfileResponse = z.infer<typeof UpdateProfileResponseSchema>;

/* ----------------------------------------
   Hono Route
---------------------------------------- */

type Env = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SUPABASE_ANON_KEY: string;
};

export const updateProfile = new Hono<{ Bindings: Env }>();

updateProfile.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = UpdateProfileBodySchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ success: false, error: "Invalid request body" }, 400);
    }

    const supabase = getSupabase(c.env);

    // Check if profile already exists
    const { data: existing, error: selectError } = await supabase
      .from("profile")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (selectError) {
      return c.json({ success: false, error: selectError.message }, 500);
    }

    // UPDATE if exists
    if (existing) {
      const { data, error } = await supabase
        .from("profile")
        .update(parsed.data)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        return c.json({ success: false, error: error.message }, 500);
      }

      return c.json({ success: true, profile: data });
    }

    // INSERT if missing
    const { data, error } = await supabase
      .from("profile")
      .insert(parsed.data)
      .select()
      .single();

    if (error) {
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json({ success: true, profile: data });
  } catch (err) {
    return c.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      500,
    );
  }
});
