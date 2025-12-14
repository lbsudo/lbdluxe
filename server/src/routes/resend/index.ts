import { Hono } from "hono";
import { getResendContacts } from "./get-resend-contacts";
import { addResendContact } from "./add-resend-contact";

export const resendRoutes = new Hono();

// GET /api/resend/get-resend-contacts
resendRoutes.get("/get-resend-contacts", getResendContacts);

// POST /api/resend/add-resend-contact
resendRoutes.post("/add-resend-contact", addResendContact);
