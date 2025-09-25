import {Hono} from "hono";
import {cors} from "hono/cors";
import type {ApiResponse} from "shared/dist";
import {Resend} from "resend";

export const app = new Hono().basePath("/api")

    .use(cors())


    .get("/", (c) => {
        return c.text("Hello Hono!");
    })

    .get("/hello", async (c) => {
        const data: ApiResponse = {
            message: "Hello BHVR!",
            success: true,
        };

        return c.json(data, {status: 200});
    })
    // New route to add contact to Resend
    .post("/resendContact", async (c) => {
        try {
            const body = await c.req.json(); // Expect { email, firstName, lastName } in request body

            const resend = new Resend(process.env.RESEND_API_KEY); // Replace with your actual API key

            const {data, error} = await resend.contacts.create({
                email: body.email,
                unsubscribed: false,
                audienceId: "ce05c2d0-c68b-411f-b28c-54316f486d35",
            });

            if (error) {
                return c.json({success: false, error}, {status: 400});
            }

            return c.json({success: true, data}, {status: 200});
        } catch (err) {
            return c.json({success: false, error: (err as Error).message}, {status: 500});
        }
    });

export default app;