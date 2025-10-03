// supabaseRoutes.ts
import {Hono} from "hono";
import {Buffer} from "buffer";
import {createClient} from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const supabaseRoutes = new Hono();

// Upload image route
supabaseRoutes.post("/uploadCoverImage", async (c) => {
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

supabaseRoutes.delete("/deleteCoverImage", async (c) => {
    try {
        const body = await c.req.json(); // expect { url: string }
        const {url} = body;

        if (!url) return c.json({success: false, error: "No URL provided"}, {status: 400});

        // Extract filename from public URL
        const parts = url.split("/cover-images/");
        if (parts.length < 2) return c.json({success: false, error: "Invalid URL"}, {status: 400});

        const fileName = parts[1];
        const {data, error} = await supabase.storage.from("blog").remove([`cover-images/${fileName}`]);

        if (error) return c.json({success: false, error: error.message}, {status: 500});
        return c.json({success: true}, {status: 200});
    } catch (err) {
        return c.json({success: false, error: (err as Error).message}, {status: 500});
    }
});

// List images route
supabaseRoutes.get("/listCoverImages", async (c) => {
    try {
        const {data: files, error} = await supabase.storage
            .from("blog")
            .list("cover-images");

        if (error) {
            console.error("Supabase list error:", error);
            return c.json({success: false, images: [], error: error.message}, {status: 200});
        }

        const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
        const images = files
            .filter(file => !file.name.startsWith(".") && imageExtensions.some(ext => file.name.toLowerCase().endsWith(ext)))
            .map(file => {
                const {data: publicData} = supabase.storage.from("blog").getPublicUrl(`cover-images/${file.name}`);
                return publicData.publicUrl;
            });

        const uniqueImages = Array.from(new Set(images));
        return c.json({success: true, images: uniqueImages}, {status: 200});
    } catch (err) {
        console.error("ListImages route error:", err);
        return c.json({success: false, images: [], error: (err as Error).message}, {status: 200});
    }
});

//Post Images
supabaseRoutes.post("/uploadPostImage", async (c) => {
    try {
        const arrayBuffer = await c.req.arrayBuffer();
        if (!arrayBuffer || arrayBuffer.byteLength === 0) {
            return c.json({success: false, error: "No file uploaded"}, {status: 400});
        }

        const buffer = Buffer.from(new Uint8Array(arrayBuffer));
        const fileName = c.req.header("x-filename") || `upload-${Date.now()}`;
        const filePath = `post-images/${fileName}`;

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

supabaseRoutes.delete("/deletePostImage", async (c) => {
    try {
        const body = await c.req.json(); // expect { url: string }
        const {url} = body;

        if (!url) return c.json({success: false, error: "No URL provided"}, {status: 400});

        // Extract filename from public URL
        const parts = url.split("/post-images/");
        if (parts.length < 2) return c.json({success: false, error: "Invalid URL"}, {status: 400});

        const fileName = parts[1];
        const {data, error} = await supabase.storage.from("blog").remove([`post-images/${fileName}`]);

        if (error) return c.json({success: false, error: error.message}, {status: 500});
        return c.json({success: true}, {status: 200});
    } catch (err) {
        return c.json({success: false, error: (err as Error).message}, {status: 500});
    }
});

// List images route
supabaseRoutes.get("/listPostImages", async (c) => {
    try {
        const {data: files, error} = await supabase.storage
            .from("blog")
            .list("post-images");

        if (error) {
            console.error("Supabase list error:", error);
            return c.json({success: false, images: [], error: error.message}, {status: 200});
        }

        const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
        const images = files
            .filter(file => !file.name.startsWith(".") && imageExtensions.some(ext => file.name.toLowerCase().endsWith(ext)))
            .map(file => {
                const {data: publicData} = supabase.storage.from("blog").getPublicUrl(`post-images/${file.name}`);
                return publicData.publicUrl;
            });

        const uniqueImages = Array.from(new Set(images));
        return c.json({success: true, images: uniqueImages}, {status: 200});
    } catch (err) {
        console.error("ListImages route error:", err);
        return c.json({success: false, images: [], error: (err as Error).message}, {status: 200});
    }
});