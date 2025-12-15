import { Hono } from "hono";
import { z } from "zod";
import { getSupabase } from "../../clients/supabase";

/* ----------------------------------------
   Zod Schemas
---------------------------------------- */

// Optional custom filename (without path)
const UploadProfileImageFieldsSchema = z.object({
  name: z.string().min(1).optional(),
  upsert: z
    .union([z.literal("true"), z.literal("false")])
    .optional()
    .transform((v) => v === "true"),
});

// Success response
const UploadProfileImageSuccessSchema = z.object({
  success: z.literal(true),
  name: z.string(),
  url: z.string().url(),
});

// Error response
const UploadProfileImageErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

// Union response
const UploadProfileImageResponseSchema = z.union([
  UploadProfileImageSuccessSchema,
  UploadProfileImageErrorSchema,
]);

export type UploadProfileImageResponse = z.infer<
  typeof UploadProfileImageResponseSchema
>;

/* ----------------------------------------
   Hono Route
---------------------------------------- */

type Env = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
};

export const uploadProfileImage = new Hono<{ Bindings: Env }>();

uploadProfileImage.post("/", async (c) => {
  const supabase = getSupabase(c.env);
  const bucket = "profile-images";

  try {
    const form = await c.req.formData();

    const file = form.get("file");
    if (!(file instanceof File)) {
      return c.json(
        UploadProfileImageErrorSchema.parse({
          success: false,
          error: "Missing file (field name: file)",
        }),
        400,
      );
    }

    const rawFields = {
      name: form.get("name") ?? undefined,
      upsert: form.get("upsert") ?? undefined,
    };

    const fieldsInput = {
      name: typeof rawFields.name === "string" ? rawFields.name : undefined,
      upsert:
        typeof rawFields.upsert === "string" ? rawFields.upsert : undefined,
    };

    const parsed = UploadProfileImageFieldsSchema.safeParse(fieldsInput);
    if (!parsed.success) {
      return c.json(
        UploadProfileImageErrorSchema.parse({
          success: false,
          error: "Invalid form fields",
        }),
        400,
      );
    }

    const { name, upsert } = parsed.data;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return c.json(
        UploadProfileImageErrorSchema.parse({
          success: false,
          error: "Only image uploads are allowed",
        }),
        400,
      );
    }

    // Optional size limit (5MB)
    const MAX_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      return c.json(
        UploadProfileImageErrorSchema.parse({
          success: false,
          error: "File too large (max 5MB)",
        }),
        400,
      );
    }

    // Determine filename (root only)
    const extFromOriginal = (() => {
      const parts = file.name.split(".");
      return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
    })();

    const extFromType = file.type.split("/")[1] ?? "png";
    const ext = extFromOriginal || extFromType;

    const finalName = name?.trim() || `profile-${crypto.randomUUID()}.${ext}`;

    // Upload directly to bucket root
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(finalName, file, {
        contentType: file.type,
        upsert: upsert ?? false,
      });

    if (uploadError) {
      return c.json(
        UploadProfileImageErrorSchema.parse({
          success: false,
          error: uploadError.message,
        }),
        500,
      );
    }

    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(finalName);

    return c.json(
      UploadProfileImageSuccessSchema.parse({
        success: true,
        name: finalName,
        url: publicData.publicUrl,
      }),
      200,
    );
  } catch (err) {
    return c.json(
      UploadProfileImageErrorSchema.parse({
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      500,
    );
  }
});
