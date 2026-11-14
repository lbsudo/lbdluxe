import type { Context } from "hono";
import type { Resend } from "resend";

type Env = {
  Variables: {
    resend: Resend;
    audienceId: string;
  };
};

/**
 * Captures a download signup for a free program.
 *
 * The contact is upserted into the Resend audience with a `fitness_interest`
 * property so the program can be told apart from other traffic, and added to a
 * per-program segment so every downloader can be sent the same follow-up
 * sequence later.
 *
 * The segment is created on demand -- list first, create only if it is
 * missing -- so adding a new free program needs no manual Resend setup.
 *
 * A repeat signup is a success, not an error: people re-download, and the
 * segment membership is idempotent.
 */
export const addProgramContact = async (c: Context<Env>) => {
  const { email, firstName, lastName, program } = await c.req.json();

  const resend = c.get("resend");
  const audienceId = c.get("audienceId");

  if (!resend) {
    return c.json({ success: false, error: "Resend client not initialized" }, 500);
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return c.json({ success: false, error: "A valid email is required" }, 400);
  }

  const slug = typeof program === "string" && program ? program : "free-program";
  const segmentName = `Program: ${slug}`;

  const base = {
    audienceId,
    email,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
  };

  // The custom property may not exist yet in the Resend dashboard. Fall back
  // to a plain contact so the signup still lands.
  const property = { fitness_interest: `program:${slug}` };

  try {
    let { data, error } = await resend.contacts.create({
      ...base,
      properties: property,
    });

    if (error) {
      ({ data, error } = await resend.contacts.create(base));
    }

    if (error) {
      const message = String((error as { message?: string })?.message ?? "");
      if (!/already exists/i.test(message)) {
        return c.json({ success: false, error: message || "Failed to save the contact" }, 400);
      }
    }

    // Segment membership is best-effort: the download must never be blocked
    // because a segment could not be created or attached.
    try {
      const segmentId = await ensureSegment(resend, segmentName);
      if (segmentId) {
        await resend.contacts.segments.add({ email, segmentId });
      }
    } catch (err: unknown) {
      console.warn("Could not attach contact to segment:", err);
    }

    return c.json({ success: true, data: data ?? { id: "existing", object: "contact" } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save the contact";
    return c.json({ success: false, error: message }, 500);
  }
};

/** Finds a segment by name, creating it if it does not exist yet. */
const ensureSegment = async (resend: Resend, name: string): Promise<string | null> => {
  const existing = await resend.segments.list();
  const found = existing.data?.data?.find((s) => s.name === name);
  if (found) return found.id;

  const created = await resend.segments.create({ name });
  if (created.error) {
    console.warn(`Could not create segment "${name}":`, created.error);
    return null;
  }
  return created.data?.id ?? null;
};
