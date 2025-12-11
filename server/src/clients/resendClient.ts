import { Resend } from "resend";

// Already initialized and ready to use
export const resendClient = new Resend(process.env.RESEND_API_KEY);

// Export audience ID as a constant
export const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || "";