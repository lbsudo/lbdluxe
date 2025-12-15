import { Hono } from "hono";
import { z } from "zod";
import { Resend } from "resend";

/* ----------------------------------------
   Env
---------------------------------------- */

type Env = {
  RESEND_API_KEY: string;
  RESEND_AUDIENCE_ID: string;
};

/* ----------------------------------------
   Zod Schemas (single source of truth)
---------------------------------------- */

const ResendContactSchema = z.object({
  id: z.string(),
  email: z.email(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  unsubscribed: z.boolean(),
  created_at: z.string(),
});

const GetResendContactsSuccessSchema = z.object({
  success: z.literal(true),
  data: z.object({
    data: z.array(ResendContactSchema),
  }),
});

const GetResendContactsErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

const GetResendContactsResponseSchema = z.union([
  GetResendContactsSuccessSchema,
  GetResendContactsErrorSchema,
]);

/* ----------------------------------------
   Exported Types
---------------------------------------- */

export type ResendContact = z.infer<typeof ResendContactSchema>;
export type GetResendContactsResponse = z.infer<
  typeof GetResendContactsResponseSchema
>;

/* ----------------------------------------
   Route
---------------------------------------- */

export const getResendContacts = new Hono<{ Bindings: Env }>();

getResendContacts.get("/", async (c) => {
  try {
    const resend = new Resend(c.env.RESEND_API_KEY);

    const { data, error } = await resend.contacts.list({
      audienceId: c.env.RESEND_AUDIENCE_ID,
    });

    if (error) {
      return c.json(
        GetResendContactsErrorSchema.parse({
          success: false,
          error: error.message ?? "Resend API error",
        }),
        400,
      );
    }

    return c.json(
      GetResendContactsSuccessSchema.parse({
        success: true,
        data,
      }),
      200,
    );
  } catch (err) {
    return c.json(
      GetResendContactsErrorSchema.parse({
        success: false,
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      500,
    );
  }
});
