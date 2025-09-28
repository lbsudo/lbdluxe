import {pgTable, text, timestamp, varchar, serial, integer} from "drizzle-orm/pg-core";

// Blog posts table
export const blogPosts = pgTable("blog_posts", {
    id: serial("id").primaryKey(),

    coverImage: text("cover_image").notNull(), // Supabase image URL
    title: varchar("title", {length: 255}).notNull(),
    content: text("content").notNull(), // markdown/HTML with image URLs
    author: varchar("author", {length: 100}).notNull(),

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
