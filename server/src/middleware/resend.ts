import { Resend } from "resend";

export const resendMiddleware = async (c: any, next: () => Promise<void>) => {
  const { RESEND_API_KEY, RESEND_AUDIENCE_ID } = c.env;

  if (!RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY environment variable");
    return c.json(
      { success: false, error: "Missing RESEND_API_KEY environment variable" },
      500,
    );
  }
  
  if (!RESEND_AUDIENCE_ID) {
    console.error("Missing RESEND_AUDIENCE_ID environment variable");
    return c.json(
      { success: false, error: "Missing RESEND_AUDIENCE_ID environment variable" },
      500,
    );
  }

  const resend = new Resend(RESEND_API_KEY);
  c.set("resend", resend);
  c.set("audienceId", RESEND_AUDIENCE_ID);

  await next();
};