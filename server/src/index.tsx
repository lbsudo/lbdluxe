import {Hono} from "hono";
import {cors} from "hono/cors";
import type {ApiResponse} from "shared/dist";
import {auth} from "@server/lib/auth";
import {Resend} from "resend";
import { EmailTemplate } from '../emails/email-template'; // value import for JSX
// and optionally:
const resend = new Resend('re_cJwoPrcV_Ap8G6s9HGZKRMN5B7AoWRSDA');
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

    .get('/', async (c) => {
    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: ['delivered@resend.dev'],
        subject: 'hello world',
        react: <EmailTemplate firstName="John" />,
    })

    if (error) {
        return c.json(error, 400);
    }

    return c.json(data);
});


export default app;