import { Hono } from "hono";
import { z } from "zod";
import type { FileObject } from "@supabase/storage-js";
import { getSupabase } from "../../clients/supabase";
/* ----------------------------------------
   Zod Schemas
---------------------------------------- */

const ProfileImageSchema = z.object({
  name: z.string(),
  url: z.url(),
});

const GetProfileImagesSuccessSchema = z.object({
  success: z.literal(true),
  images: z.array(ProfileImageSchema),
});

const GetProfileImagesErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

const GetProfileImagesResponseSchema = z.union([
  GetProfileImagesSuccessSchema,
  GetProfileImagesErrorSchema,
]);

export type ProfileImage = z.infer<typeof ProfileImageSchema>;
export type GetProfileImagesResponse = z.infer<
  typeof GetProfileImagesResponseSchema
>;

/* ----------------------------------------
   Hono Route
---------------------------------------- */

type Env = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
};

export const getProfileImages = new Hono<{ Bindings: Env }>();

getProfileImages.get("/", async (c) => {
  const supabase = getSupabase(c.env);
  const bucket = "profile-images";

  const { data, error } = await supabase.storage.from(bucket).list("", {
    limit: 100,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) {
    return c.json(
      GetProfileImagesErrorSchema.parse({
        success: false,
        error: error.message,
      }),
      500,
    );
  }

  const files: FileObject[] = data ?? [];

  const images = files
    .filter((file) => file.name && !file.name.endsWith("/"))
    .map((file) => {
      const { data } = supabase.storage.from(bucket).getPublicUrl(file.name);

      return {
        name: file.name,
        url: data.publicUrl,
      };
    });

  return c.json(
    GetProfileImagesSuccessSchema.parse({
      success: true,
      images,
    }),
  );
});
