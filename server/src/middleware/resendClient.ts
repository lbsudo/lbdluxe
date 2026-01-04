import type { Context, Next } from "hono";
import { Resend } from "resend";

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

export const resendClientMiddleware = async (c: Context<Env>, next: Next) => {
  // Read keys from environment
  const apiKey = c.env.RESEND_API_KEY;
  const audienceId = c.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    return c.json(
      { success: false, error: "Missing RESEND API credentials" },
      500,
    );
  }

  // Store on context for your routes
  c.set("resend", new Resend(apiKey));
  c.set("audienceId", audienceId);

  await next();
};
