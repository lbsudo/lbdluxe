import type { Context } from "hono";
import type { Resend } from "resend";

type Env = {
  Variables: {
    resend: Resend;
    audienceId: string;
  };
};

export const addResendContact = async (c: Context<Env>) => {
  const { email, firstName, lastName, unsubscribed } = await c.req.json();

  const resend = c.get("resend");
  const audienceId = c.get("audienceId");

  if (!resend) {
    return c.json({ success: false, error: "Resend client not initialized" }, 500);
  }

  if (!email || typeof email !== "string") {
    return c.json({ success: false, error: "A valid email is required" }, 400);
  }

  try {
    const { data, error } = await resend.contacts.create({
      audienceId,
      email,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      unsubscribed: Boolean(unsubscribed),
    });

    if (error) {
      const message = String((error as { message?: string })?.message ?? "");
      // A returning subscriber is still a successful signup.
      if (/already exists/i.test(message)) {
        return c.json({ success: true, data: { id: "existing", object: "contact" } });
      }
      return c.json({ success: false, error: message || "Failed to add contact" }, 400);
    }

    return c.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to add contact";
    return c.json({ success: false, error: message }, 500);
  }
};
