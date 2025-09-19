import {Hono} from "hono";
import {cors} from "hono/cors";
import type {ApiResponse} from "shared/dist";
import {auth} from "@server/lib/auth";
import {Resend} from "resend";

export const app = new Hono().basePath("/api")

    .use(cors())

    .on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw))

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
    // Add a route to send an email via Resend
    .post("/api/email/send", async (c) => {
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        if (!RESEND_API_KEY) {
            return c.json({error: "Missing RESEND_API_KEY"}, 500);
        }

        const resend = new Resend(RESEND_API_KEY);

        // Optional: read payload from request body
        // Expecting: { to: string | string[], subject?: string, html?: string, from?: string }
        let payload: any = {};
        try {
            payload = await c.req.json();
        } catch {
            // ignore, will use defaults
        }

        const {
            to = ["delivered@resend.dev"],
            subject = "Hello World",
            html = "<strong>It works!</strong>",
            from = "Acme <onboarding@resend.dev>",
        } = payload ?? {};

        try {
            const {data, error} = await resend.emails.send({
                from,
                to,
                subject,
                html,
            });

            if (error) {
                return c.json({error}, 500);
            }
            return c.json({data}, 200);
        } catch (e) {
            return c.json({error: String(e)}, 500);
        }
    });


export default app;