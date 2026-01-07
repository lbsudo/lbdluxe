import { Hono } from "hono";
import { getAllBlogPosts } from "./GET/get-all-blog-posts";
import { getBlogPost } from "./GET/get-blog-post";
import { getAuthors } from "./GET/get-authors";
import { getCategories } from "./GET/get-categories";
import { createBlogPost } from "./POST/create-blog-post";
import { updateBlogPost } from "./PUT/update-blog-post";
import { deleteBlogPost } from "./DELETE/delete-blog-post";
import { uploadBlogImage } from "./PUT/upload-blog-image";
import { uploadBlogCoverImage } from "./PUT/upload-blog-cover-image";
import { moveBlogCoverImage } from "./POST/move-blog-cover-image";

export const blogRoutes = new Hono();

// Route names exactly match file names
blogRoutes.route("/get-all-blog-posts", getAllBlogPosts);
blogRoutes.route("/get-blog-post", getBlogPost);
blogRoutes.route("/get-authors", getAuthors);
blogRoutes.route("/get-categories", getCategories);
blogRoutes.route("/create-blog-post", createBlogPost);
blogRoutes.route("/update-blog-post", updateBlogPost);
blogRoutes.route("/delete-blog-post", deleteBlogPost);
blogRoutes.route("/upload-blog-image", uploadBlogImage);
blogRoutes.route("/upload-blog-cover-image", uploadBlogCoverImage);
blogRoutes.route("/move-blog-cover-image", moveBlogCoverImage);