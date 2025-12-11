// resendRoutes.ts
import {Hono} from "hono";

export const resendRoutes = new Hono();

import "./get-resend-contacts";
import "./add-resend-contact";
