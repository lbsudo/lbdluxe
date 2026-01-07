// resend/index.ts
import { Hono } from "hono";
import { Resend } from "resend";
import { addResendContact } from "./add-resend-contact";
import { getResendContacts } from "./get-all-resend-contacts";
import { getSegments } from "./get-segments";
import { resendMiddleware } from "../middleware/resend";

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

// Apply Resend middleware to all routes
resendRoutes.use("*", resendMiddleware);

// Mount routes
resendRoutes.post("/add-resend-contact", addResendContact);
resendRoutes.get("/get-resend-contacts", getResendContacts);
resendRoutes.get("/segments", getSegments);
