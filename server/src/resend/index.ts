// resend/index.ts
import { Hono } from "hono";
import { Resend } from "resend";
import { addResendContact } from "./add-resend-contact";
import { getResendContacts } from "./get-all-resend-contacts";
import { getSegments } from "./get-segments";

type Env = {
  Variables: {
    resend: Resend;
    audienceId: string;
  };
  Bindings: {
    RESEND_API_KEY: string;
    RESEND_AUDIENCE_ID: string;
  };
};

export const resendRoutes = new Hono<Env>();

// Inline resend middleware
resendRoutes.use("*", async (c, next) => {
  const apiKey = c.env.RESEND_API_KEY;
  const audienceId = c.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    return c.json(
      { success: false, error: "Missing RESEND API credentials" },
      500,
    );
  }

  c.set("resend", new Resend(apiKey));
  c.set("audienceId", audienceId);

  await next();
});

// Mount routes
resendRoutes.post("/add-resend-contact", addResendContact);
resendRoutes.get("/get-resend-contacts", getResendContacts);
resendRoutes.get("/segments", getSegments);
