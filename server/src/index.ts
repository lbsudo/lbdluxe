import {Hono} from "hono";
import {cors} from "hono/cors";
import type {ApiResponse} from "shared/dist";
import {Resend} from "resend";
import {createClient} from "@supabase/supabase-js";
import 'dotenv/config'
import {Buffer} from "buffer"


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
    })

    // New route to upload images to Supabase

    .post("/uploadImage", async (c) => {
        try {
            const arrayBuffer = await c.req.arrayBuffer();
            if (!arrayBuffer || arrayBuffer.byteLength === 0) {
                return c.json({success: false, error: "No file uploaded"}, {status: 400});
            }

            const buffer = Buffer.from(new Uint8Array(arrayBuffer));
            const fileName = c.req.header("x-filename") || `upload-${Date.now()}`;
            const filePath = `cover-images/${fileName}`;

            const {data: uploadData, error: uploadError} = await supabase.storage
                .from("blog")
                .upload(filePath, buffer, {cacheControl: "3600", upsert: true});

            if (uploadError) {
                console.error("Supabase upload error:", uploadError);
                return c.json({success: false, error: uploadError.message}, {status: 500});
            }

            const {data: publicData} = supabase.storage.from("blog").getPublicUrl(filePath);

            return c.json({success: true, url: publicData.publicUrl}, {status: 200});
        } catch (err) {
            console.error("UploadImage route error:", err);
            return c.json({success: false, error: (err as Error).message}, {status: 500});
        }
    });

export default app;