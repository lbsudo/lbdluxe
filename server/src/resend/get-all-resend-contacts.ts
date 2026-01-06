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

  try {
    // Get segment_id from query params (use URL search params for Workers compatibility)
    const url = new URL(c.req.url);
    const segmentId = url.searchParams.get('segment_id');

    console.log("Fetching contacts for segmentId:", segmentId);

    // Resend SDK returns `{ data, error }`. We forward any SDK error directly.
    const { data, error } = segmentId
      ? await resend.contacts.list({ segmentId })
      : await resend.contacts.list();

    if (error) {
      console.error("Resend API error:", error);
      return c.json({ success: false, error: `Resend API error: ${error.message}` }, 400);
    }

    // Extract contacts array from Resend response structure
    // Response is: { "object": "list", "has_more": false, "data": [...] }
    const contacts: Contact[] = data?.data || [];

    console.log("Fetched contacts count:", contacts.length);

    // Return contacts array in expected format for client
    return c.json({ success: true, contacts: contacts }, 200);
  } catch (err: any) {
    console.error("Unexpected error fetching Resend contacts:", err);
    
    // Log more details about the error for debugging
    if (err.response) {
      console.error("Response status:", err.response.status);
      try {
        const responseText = await err.response.text();
        console.error("Response text:", responseText);
      } catch (textErr) {
        console.error("Could not read response text:", textErr);
      }
    }
    
    return c.json(
      { 
        success: false, 
        error: "Failed to fetch contacts",
        details: err.message || "Unknown error"
      },
      500,
    );
  }
};
