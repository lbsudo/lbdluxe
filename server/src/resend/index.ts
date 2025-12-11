// resendRoutes.ts
import {Hono} from "hono";
import {Resend} from "resend";

import "./get-resend-contacts";
import "./add-resend-contact";

export const resend = new Resend(process.env.RESEND_API_KEY);
export const resendRoutes = new Hono();
// Import and register routes

// Route to add a contact to Resend
// resendRoutes.post("/addResendContact", async (c) => {
//     try {
//         const body = await c.req.json(); // Expect { email, firstName, lastName }
//
//         const resend = new Resend(process.env.RESEND_API_KEY);
//
//         const {data, error} = await resend.contacts.create({
//             email: body.email,
//             unsubscribed: false,
//             audienceId: "ce05c2d0-c68b-411f-b28c-54316f486d35",
//         });
//
//         if (error) return c.json({success: false, error}, {status: 400});
//
//         return c.json({success: true, data}, {status: 200});
//     } catch (err) {
//         return c.json({success: false, error: (err as Error).message}, {status: 500});
//     }
// });

// resendRoutes.get('/getResendContacts', async (c) => {
//     try {
//         const resend = new Resend(process.env.RESEND_API_KEY);
//
//         const {data, error} = await resend.contacts.list({
//             // audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
//             audienceId: "ce05c2d0-c68b-411f-b28c-54316f486d35",
//         });
//         if (error) return c.json({success: false, error}, {status: 400})
//
//         return c.json({success: true, data}, {status: 200});
//     } catch (err) {
//         return c.json({success: false, error: (err as Error).message}, {status: 500});
//     }
// })