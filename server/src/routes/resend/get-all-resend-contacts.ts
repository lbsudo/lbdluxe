// Simplified Resend contacts list handler – works with Hono's typed Context
import type { Context } from "hono";
import type { Contact, Resend } from "resend";

type Env = {
  Variables: {
    resend: Resend; // injected by resendClientMiddleware
    audienceId: string; // injected by resendClientMiddleware
  };
};

/**
 * GET /resend/get-all-resend-contacts
 * Returns the full list of contacts for the configured Resend audience.
 * The response shape is an array of contacts on success or `{ success: false, error: string }` on failure.
 */
export const getResendContacts = async (c: Context<Env>) => {
  const resend = c.get("resend");

  if (!resend) {
    // Middleware should have set the client – if not, something is mis‑configured.
    return c.json(
      { success: false, error: "Resend client not initialized" },
      500,
    );
  }

  // Resend SDK returns `{ data, error }`. We forward any SDK error directly.
  const { data, error } = await resend.contacts.list();

  if (error) {
    return c.json({ success: false, error: error.message }, 400);
  }

  // Extract contacts array from Resend response structure
  // Response is: { "object": "list", "has_more": false, "data": [...] }
  const contacts: Contact[] = data?.data || [];

  // Return contacts array in expected format for client
  return c.json({ success: true, data: contacts }, 200);
};
