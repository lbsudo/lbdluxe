import { Hono } from "hono";
import { Resend } from "resend";

export const resendRoutes = new Hono();

// GET: Fetch all contacts
resendRoutes.get("/get-resend-contacts", async (c: any) => {
  const resend = new Resend(c.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.contacts.list({
      audienceId: c.env.RESEND_AUDIENCE_ID,
    });

    if (error) return c.json({ success: false, error }, 400);

    return c.json({ success: true, data }, 200);
  } catch (err) {
    return c.json({ success: false, error: (err as Error).message }, 500);
  }
});

// POST: Add a new contact
resendRoutes.post("/add-resend-contact", async (c: any) => {
  const resend = new Resend(c.env.RESEND_API_KEY);

  try {
    const body = await c.req.json();

    const { data, error } = await resend.contacts.create({
      email: body.email,
      unsubscribed: false,
      audienceId: c.env.RESEND_AUDIENCE_ID,
    });

    if (error) return c.json({ success: false, error }, 400);

    return c.json({ success: true, data }, 200);
  } catch (err) {
    return c.json({ success: false, error: (err as Error).message }, 500);
  }
});
