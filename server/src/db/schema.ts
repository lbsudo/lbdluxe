import {pgTable, text, timestamp, varchar, serial, integer} from "drizzle-orm/pg-core";
import {sql} from "drizzle-orm";


// Authors table
export const authors = pgTable("authors", {
    id: serial("id").primaryKey(),
    name: varchar("name", {length: 100}).notNull(),
});

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
    id: serial("id").primaryKey(),

    coverImage: text("cover_image").notNull(), // Supabase image URL
    title: varchar("title", {length: 255}).notNull(),
    content: text("content").notNull(), // markdown/HTML with image URLs
    author: varchar("author", {length: 100}).notNull(),
    tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`), // Array of category tags

    datePosted: timestamp("date_posted", {withTimezone: true})
        .defaultNow()
        .notNull(),
});

// Categories table
export const categories = pgTable("categories", {
    id: serial("id").primaryKey(),
    name: varchar("name", {length: 100}).notNull().unique(),
});

// Join table (many-to-many between posts and categories)
export const postCategories = pgTable("post_categories", {
    postId: integer("post_id")
        .notNull()
        .references(() => blogPosts.id, {onDelete: "cascade"}),

    categoryId: integer("category_id")
        .notNull()
        .references(() => categories.id, {onDelete: "cascade"}),
});
