import {resend ,resendRoutes} from "@server/resend/index";

resendRoutes.get('/get-resend-contacts', async (c) => {
    try {
        const {data, error} = await resend.contacts.list({
            // audienceId: '78261eea-8f8b-4381-83c6-79fa7120f1cf',
            audienceId: "ce05c2d0-c68b-411f-b28c-54316f486d35",
        });
        if (error) return c.json({success: false, error}, {status: 400})

        return c.json({success: true, data}, {status: 200});
    } catch (err) {
        return c.json({success: false, error: (err as Error).message}, {status: 500});
    }
})