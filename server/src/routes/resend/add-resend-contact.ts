import { Hono } from "hono";
import { Resend } from "resend";
import { z } from "zod";

/* ----------------------------------------
   Env
---------------------------------------- */

type Env = {
  RESEND_API_KEY: string;
  RESEND_AUDIENCE_ID: string;
};

/* ----------------------------------------
   Zod Schema
---------------------------------------- */

const AddContactSchema = z.object({
  email: z.email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

/* ----------------------------------------
   Router
---------------------------------------- */

export const addResendContact = new Hono<{ Bindings: Env }>();

addResendContact.post("/", async (c) => {
  const resend = new Resend(c.env.RESEND_API_KEY);

  try {
    const json = await c.req.json();
    const body = AddContactSchema.parse(json);

    const { email, firstName, lastName } = body;

    const { data, error } = await resend.contacts.create({
      email,
      firstName,
      lastName,
      unsubscribed: false,
      audienceId: c.env.RESEND_AUDIENCE_ID,
    });

    if (error) {
      return c.json(
        { success: false, error: error.message ?? "Resend error" },
        400,
      );
    }

    return c.json({ success: true, data }, 200);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return c.json({ success: false, error: err.issues }, 400);
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
