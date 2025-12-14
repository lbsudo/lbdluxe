import type { Context } from "hono";
import { Resend } from "resend";
import { z } from "zod";

const AddContactSchema = z.object({
  email: z.email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const addResendContact = async (c: Context) => {
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

    if (error) return c.json({ success: false, error }, 400);

    return c.json({ success: true, data }, 200);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return c.json({ success: false, error: err.issues }, 400);
    }

    return c.json({ success: false, error: (err as Error).message }, 500);
  }
};
