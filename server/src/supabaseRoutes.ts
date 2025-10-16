// supabaseRoutes.ts
import {Hono} from "hono";
import {Buffer} from "buffer";
import {createClient} from "@supabase/supabase-js";
import postgres from "postgres";
import {drizzle} from "drizzle-orm/postgres-js";
import {authors, blogPosts, categories, postCategories} from "@server/db/schema";
import {inArray, sql} from "drizzle-orm";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export const supabaseRoutes = new Hono();

// Get all blog posts route
supabaseRoutes.get("/getBlogPosts", async (c) => {
    try {
        const allPosts = await db.select().from(blogPosts);
        return c.json({success: true, posts: allPosts}, {status: 200});
    } catch (err) {
        console.error("GetBlogPosts route error:", err);
        return c.json({success: false, error: (err as Error).message}, {status: 500});
    }
});

supabaseRoutes.get("/getBlogPost/:id", async (c) => {
    try {
        const postId = c.req.param("id");
        const post = await db
            .select()
            .from(blogPosts)
            .where(sql`${blogPosts.id} = ${postId}`)
            .limit(1);

        if (!post || post.length === 0) {
            return c.json({success: false, error: "Blog post not found"}, {status: 404});
        }

        return c.json({success: true, post: post[0]}, {status: 200});
    } catch (err) {
        console.error("GetBlogPost route error:", err);
        return c.json({success: false, error: (err as Error).message}, {status: 500});
    }
});

// Create blog post route
supabaseRoutes.post("/createBlogPost", async (c) => {
    try {
        const body = await c.req.json();
        const {coverImage, title, content, author, categories: categoryIds} = body;

        // Validate required fields
        if (!coverImage || !title || !content || !author) {
            return c.json(
                {success: false, error: "Missing required fields: coverImage, title, content, author"},
                {status: 400}
            );
        }

        // Get category names from IDs
        let categoryTags: string[] = [];
        if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
            const selectedCategories = await db
                .select()
                .from(categories)
                .where(inArray(categories.id, categoryIds));
            
            categoryTags = selectedCategories.map(cat => cat.name);
        }

        // Insert the blog post with tags
        const [newPost] = await db
            .insert(blogPosts)
            .values({
                coverImage,
                title,
                content,
                author,
                tags: categoryTags,
            })
            .returning();
            
        if (!newPost) {
            return c.json(
                {success: false, error: "Failed to create blog post"},
                {status: 500}
            );
        }

        // Also maintain the join table for relationships
        if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
            await db.insert(postCategories).values(
                categoryIds.map((categoryId: number) => ({
                    postId: newPost.id,
                    categoryId,
                }))
            );
        }

        return c.json({success: true, post: newPost}, {status: 201});
    } catch (err) {
        console.error("CreateBlogPost route error:", err);
        return c.json({success: false, error: (err as Error).message}, {status: 500});
    }
});

// Update blog post route
supabaseRoutes.put("/updateBlogPost/:id", async (c) => {
    try {
        const postId = c.req.param("id");
        const body = await c.req.json();
        const {coverImage, title, content, author, categories: categoryIds} = body;

        // Validate required fields
        if (!coverImage || !title || !content || !author) {
            return c.json(
                {success: false, error: "Missing required fields: coverImage, title, content, author"},
                {status: 400}
            );
        }

        // Get category names from IDs
        let categoryTags: string[] = [];
        if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
            const selectedCategories = await db
                .select()
                .from(categories)
                .where(inArray(categories.id, categoryIds));
            
            categoryTags = selectedCategories.map(cat => cat.name);
        }

        // Update the blog post
        const [updatedPost] = await db
            .update(blogPosts)
            .set({
                coverImage,
                title,
                content,
                author,
                tags: categoryTags,
            })
            .where(sql`${blogPosts.id} = ${postId}`)
            .returning();
            
        if (!updatedPost) {
            return c.json(
                {success: false, error: "Blog post not found or failed to update"},
                {status: 404}
            );
        }

        // Update the join table for relationships
        // First, delete existing relationships
        await db
            .delete(postCategories)
            .where(sql`${postCategories.postId} = ${postId}`);

        // Then, insert new relationships
        if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
            await db.insert(postCategories).values(
                categoryIds.map((categoryId: number) => ({
                    postId: updatedPost.id,
                    categoryId,
                }))
            );
        }

        return c.json({success: true, post: updatedPost}, {status: 200});
    } catch (err) {
        console.error("UpdateBlogPost route error:", err);
        return c.json({success: false, error: (err as Error).message}, {status: 500});
    }
});

// Add category route
supabaseRoutes.post("/addCategory", async (c) => {
    try {
        const body = await c.req.json();
        const {name} = body;

        // Validate required field
        if (!name || !name.trim()) {
            return c.json(
                {success: false, error: "Category name is required"},
                {status: 400}
            );
        }

        // Insert the category
        const [newCategory] = await db
            .insert(categories)
            .values({
                name: name.trim(),
            })
            .returning();

        if (!newCategory) {
            return c.json(
                {success: false, error: "Failed to create category"},
                {status: 500}
            );
        }

        return c.json({success: true, category: newCategory}, {status: 201});
    } catch (err) {
        console.error("AddCategory route error:", err);
        // Handle unique constraint violation
        if ((err as any).code === "23505") {
            return c.json({success: false, error: "Category already exists"}, {status: 409});
        }
        return c.json({success: false, error: (err as Error).message}, {status: 500});
    }
});

// Get all categories route
supabaseRoutes.get("/categories", async (c) => {
    try {
        const allCategories = await db.select().from(categories);
        return c.json(allCategories, {status: 200});
    } catch (err) {
        console.error("GetCategories route error:", err);
        return c.json({success: false, error: (err as Error).message}, {status: 500});
    }
});

// Add author route
supabaseRoutes.post("/addAuthor", async (c) => {
    try {
        const body = await c.req.json();
        const {name} = body;

        // Validate required field
        if (!name || !name.trim()) {
            return c.json(
                {success: false, error: "Author name is required"},
                {status: 400}
            );
        }

        // Insert the author
        const [newAuthor] = await db
            .insert(authors)
            .values({
                name: name.trim(),
            })
            .returning();

        if (!newAuthor) {
            return c.json(
                {success: false, error: "Failed to create author"},
                {status: 500}
            );
        }

        return c.json({success: true, author: newAuthor}, {status: 201});
    } catch (err) {
        console.error("AddAuthor route error:", err);
        // Handle unique constraint violation if you add one
        if ((err as any).code === "23505") {
            return c.json({success: false, error: "Author already exists"}, {status: 409});
        }
        return c.json({success: false, error: (err as Error).message}, {status: 500});
    }
});

// Get all authors route
supabaseRoutes.get("/authors", async (c) => {
    try {
        const allAuthors = await db.select().from(authors);
        return c.json(allAuthors, {status: 200});
    } catch (err) {
        console.error("GetAuthors route error:", err);
        return c.json({success: false, error: (err as Error).message}, {status: 500});
    }
});

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