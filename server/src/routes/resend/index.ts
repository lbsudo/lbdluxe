import { Hono } from "hono";
import { getResendContacts } from "./get-resend-contacts";
import { addResendContact } from "./add-resend-contact";

export const resendRoutes = new Hono();

// Mount sub-routes
resendRoutes.route("/get-resend-contacts", getResendContacts);
resendRoutes.route("/add-resend-contact", addResendContact);
