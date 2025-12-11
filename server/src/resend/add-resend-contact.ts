// Route to add a contact to Resend
import { resendRoutes} from "@server/resend/index";
import {resendClient} from "@server/clients/resendClient";

resendRoutes.post("/add-resend-contact", async (c) => {
    try {
        const body = await c.req.json(); // Expect { email, firstName, lastName }
        const {data, error} = await resendClient.contacts.create({
            email: body.email,
            unsubscribed: false,
            audienceId: "ce05c2d0-c68b-411f-b28c-54316f486d35",
        });

        if (error) return c.json({success: false, error}, {status: 400});

        return c.json({success: true, data}, {status: 200});
    } catch (err) {
        return c.json({success: false, error: (err as Error).message}, {status: 500});
    }
});