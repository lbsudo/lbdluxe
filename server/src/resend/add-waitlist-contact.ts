import type { Context } from "hono";
import type { Resend } from "resend";

type Env = {
  Variables: {
    resend: Resend;
    audienceId: string;
  };
};

/**
 * Adds a "notify me" waitlist signup to the Resend audience. `interest`
 * (e.g. "programs" / "supplements" / a product slug) is stored as a contact
 * property when the property exists in Resend; if it does not, the contact is
 * still created so a signup is never lost.
 */
export const addWaitlistContact = async (c: Context<Env>) => {
  const { email, firstName, lastName, interest } = await c.req.json();

  const resend = c.get("resend");
  const audienceId = c.get("audienceId");

  if (!resend) {
    return c.json({ success: false, error: "Resend client not initialized" }, 500);
  }

  if (!email || typeof email !== "string") {
    return c.json({ success: false, error: "A valid email is required" }, 400);
  }

  const base = {
    audienceId,
    email,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
  };

  const isDuplicate = (message: string) => /already exists/i.test(message);
  const property = interest ? { fitness_interest: String(interest) } : undefined;

  try {
    let { data, error } = await resend.contacts.create(
      property ? { ...base, properties: property } : base,
    );

    // The custom property may not exist yet in the Resend dashboard. Fall back
    // to a plain contact so the waitlist signup still lands.
    if (error && property) {
      ({ data, error } = await resend.contacts.create(base));
    }

    if (error) {
      const message = String((error as { message?: string })?.message ?? "");
      if (isDuplicate(message)) {
        return c.json({ success: true, data: { id: "existing", object: "contact" } });
      }
      return c.json({ success: false, error: message || "Failed to join the waitlist" }, 400);
    }

    return c.json({ success: true, data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to join the waitlist";
    return c.json({ success: false, error: message }, 500);
  }
};
