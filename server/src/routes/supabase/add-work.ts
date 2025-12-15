import { Hono } from "hono";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

/* ----------------------------------------
   Env (typed once)
---------------------------------------- */

type Env = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
};

/* ----------------------------------------
   Supabase helper
---------------------------------------- */

function getSupabase(env: Env) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
}

/* ----------------------------------------
   Zod Schemas
---------------------------------------- */

const AddWorkBodySchema = z.object({
  id: z.uuid().optional(), // update support
  name: z.string().min(1),
  description: z.string().min(1),
  project_link: z.url(),
  beta: z.boolean(),
  directory: z.boolean(),
  icon_file_base64: z.string().optional(), // base64 (NO data:image prefix)
  icon_filename: z.string().optional(), // ex: icon.png
});

const WorkSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string(),
  project_link: z.string(),
  beta: z.boolean(),
  directory: z.boolean(),
  icon_image_url: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

/* ----------------------------------------
   Route
---------------------------------------- */

export const addWork = new Hono<{ Bindings: Env }>();

addWork.post("/", async (c) => {
  try {
    const body = AddWorkBodySchema.parse(await c.req.json());
    const supabase = getSupabase(c.env);

    let iconImageUrl: string | undefined;

    /* ----------------------------------------
   Upload icon (optional)
---------------------------------------- */

    if (body.icon_file_base64 && body.icon_filename) {
      // ✅ Decode base64 safely (edge compatible)
      const binary = atob(body.icon_file_base64);
      const bytes = new Uint8Array(binary.length);

      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const extension = body.icon_filename.split(".").pop() ?? "png";

      const mime =
        extension === "svg"
          ? "image/svg+xml"
          : extension === "jpg" || extension === "jpeg"
            ? "image/jpeg"
            : "image/png";

      const path = `icons/${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("works")
        .upload(path, bytes, {
          contentType: mime,
          upsert: false,
        });

      if (uploadError) {
        return c.json({ success: false, error: uploadError.message }, 500);
      }

      const { data } = supabase.storage.from("works").getPublicUrl(path);
      iconImageUrl = data.publicUrl;
    }

    /* ----------------------------------------
       Upsert work
    ---------------------------------------- */

    const { data, error } = await supabase
      .from("works")
      .upsert(
        {
          id: body.id,
          name: body.name,
          description: body.description,
          project_link: body.project_link,
          beta: body.beta,
          directory: body.directory,
          icon_image_url: iconImageUrl, // ✅ correct column
        },
        { onConflict: "id" },
      )
      .select()
      .single();

    if (error) {
      return c.json({ success: false, error: error.message }, 500);
    }

    return c.json(
      {
        success: true,
        work: WorkSchema.parse(data),
      },
      200,
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      return c.json({ success: false, error: err.flatten() }, 400);
    }

    return c.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      },
      500,
    );
  }
});
