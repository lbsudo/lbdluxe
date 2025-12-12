import {resendRoutes} from "@server/resend/index";
import {Resend} from "resend";

resendRoutes.get('/get-resend-contacts', async (c:any) => {
    const resend = new Resend(c.env.RESEND_API_KEY)
    try {
        const {data, error} = await resend.contacts.list({
            audienceId: "ce05c2d0-c68b-411f-b28c-54316f486d35",
        });
        if (error) return c.json({success: false, error}, {status: 400})

        return c.json({success: true, data}, {status: 200});
    } catch (err) {
        return c.json({success: false, error: (err as Error).message}, {status: 500});
    }
})