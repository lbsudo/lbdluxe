import { Hono } from "hono";
import { z } from "zod";
import { getSupabase } from "../../clients/supabase";

/* ----------------------------------------
   Zod Schemas
---------------------------------------- */

// Request body
const DeleteProfileImageBodySchema = z.object({
  name: z.string().min(1),
});

// Success response
const DeleteProfileImageSuccessSchema = z.object({
  success: z.literal(true),
  name: z.string(),
});

// Error response
const DeleteProfileImageErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

// Union response
const DeleteProfileImageResponseSchema = z.union([
  DeleteProfileImageSuccessSchema,
  DeleteProfileImageErrorSchema,
]);

/* ----------------------------------------
   Exported Types
---------------------------------------- */

export type DeleteProfileImageBody = z.infer<
  typeof DeleteProfileImageBodySchema
>;
export type DeleteProfileImageResponse = z.infer<
  typeof DeleteProfileImageResponseSchema
>;

/* ----------------------------------------
   Hono Route
---------------------------------------- */

type Env = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
};

export const deleteProfileImage = new Hono<{ Bindings: Env }>();

deleteProfileImage.post("/", async (c) => {
  const supabase = getSupabase(c.env);

  // Parse & validate request body
  const body = await c.req.json();
  const parsed = DeleteProfileImageBodySchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      {
        success: false,
        error: "Invalid request body",
      },
      400,
    );
  }

  const { name } = parsed.data;

  // Delete file from bucket
  const { error } = await supabase.storage
    .from("profile-images")
    .remove([name]);

  if (error) {
    return c.json(
      {
        success: false,
        error: error.message,
      },
      500,
    );
  }

  return c.json({
    success: true,
    name,
  });
});
