// resend/index.ts
import { Hono } from "hono";
import { resendClientMiddleware } from "@server/middleware/resendClient";
import { addResendContact } from "./add-resend-contact";
import { getResendContacts } from "@server/routes/resend/get-all-resend-contacts";

export const resendRoutes = new Hono();

resendRoutes.use("*", resendClientMiddleware);

// Mount both routes under the same segment name
resendRoutes.post("/add-resend-contact", addResendContact); // POST
resendRoutes.get("/get-resend-contacts", getResendContacts); // GET
