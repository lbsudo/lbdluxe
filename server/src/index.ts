import {Hono} from "hono";
import {cors} from "hono/cors";
import type {ApiResponse} from "shared/dist";
import {Resend} from "resend";
import {createClient} from "@supabase/supabase-js";
import 'dotenv/config'
import {supabaseRoutes} from "./supabaseRoutes";
import {resendRoutes} from "./resendRoutes";


const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // service role key (not anon key)
)

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

// Mount Resend routes under /resend
app.route("/", resendRoutes);

app.route("/", supabaseRoutes);
export default app;