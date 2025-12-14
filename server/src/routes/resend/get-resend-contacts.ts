import type { Context } from "hono";
import { Resend } from "resend";
import { z } from "zod";

// No input body for GET but we still define output structure using Zod
const ApiSuccessSchema = z.object({
  success: z.literal(true),
  data: z.unknown(),
});

const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.unknown(),
});

export const getResendContacts = async (c: Context) => {
  const resend = new Resend(c.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.contacts.list({
      audienceId: c.env.RESEND_AUDIENCE_ID,
    });

    if (error) {
      const errorResponse = ApiErrorSchema.parse({
        success: false,
        error,
      });

      return c.json(errorResponse, 400);
    }

    const successResponse = ApiSuccessSchema.parse({
      success: true,
      data,
    });

    return c.json(successResponse, 200);
  } catch (err) {
    const errorResponse = ApiErrorSchema.parse({
      success: false,
      error: (err as Error).message,
    });

    return c.json(errorResponse, 500);
  }
};
