import { Hono } from "hono";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseContext } from "@shared/types";
import { getProfile } from "./get-profile";
import { getProfileImages } from "./get-profile-images";
import { updateProfile } from "./update-profile";
import { deleteProfileImage } from "./delete-profile-image";
import { updateProfileImage } from "./update-profile-image";
import { uploadProfileImage } from "./upload-profile-image";
import { createWork } from "./create-work";
import { getAllWorks } from "./get-all-works";
import { updateWork } from "./update-work";
import { uploadWorkImage } from "./upload-work-image";
import { deleteWorkImage } from "./delete-work-image";
import { deleteWork } from "./delete-work";
import { createProduct } from "./create-product";
import { getAllProducts } from "./get-all-products";
import { updateProduct } from "./update-product";
import { deleteProduct } from "./delete-product";
import { deleteProductImage } from "./delete-product-image";
import { uploadProductImage } from "./upload-product-image";
import { getAuthors } from "./get-authors";
import { getCategories } from "./get-categories";
import { getAllBlogPosts } from "./get-all-blog-posts";
import { getBlogPost } from "./get-blog-post";
import { createBlogPost } from "./create-blog-post";
import { updateBlogPost } from "./update-blog-post";
import { deleteBlogPost } from "./delete-blog-post";
import { uploadBlogImage } from "./upload-blog-image";
import { uploadBlogCoverImage } from "./upload-blog-cover-image";
import { moveBlogCoverImage } from "./move-blog-cover-image";

// Utility functions for blog cover image management
function sanitizeTitleForFolder(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\-_\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function extractPathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/blog\/(.+)/);
    return pathMatch?.[1] || null;
  } catch {
    return null;
  }
}

function extractFolderFromPath(path: string): string | null {
  const parts = path.split('/');
  if (parts.length >= 3 && parts[0] === 'covers') {
    return parts[1] || null;
  }
  return null;
}

function generateCoverImagePath(title: string, fileName: string): string {
  const sanitizedTitle = sanitizeTitleForFolder(title);
  return `covers/${sanitizedTitle}/${fileName}`;
}

function needsFolderMove(currentPath: string, newTitle: string): boolean {
  const currentFolder = extractFolderFromPath(currentPath);
  const expectedFolder = sanitizeTitleForFolder(newTitle);
  return currentFolder !== expectedFolder;
}

function generateUniqueFileName(originalFileName: string): string {
  const fileExt = originalFileName.split('.').pop();
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  return `cover-${timestamp}-${random}.${fileExt || 'jpg'}`;
}

export const supabaseRoutes = new Hono<SupabaseContext>();

// Inline supabase middleware
supabaseRoutes.use("*", async (c, next) => {
  const { SUPABASE_URL, SUPABASE_SEC_KEY } = c.env;

  if (!SUPABASE_URL || !SUPABASE_SEC_KEY) {
    return c.json(
      { success: false, error: "Missing Supabase environment variables" },
      500,
    );
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SEC_KEY);
  c.set("supabase", supabase);

  await next();
});

// Authors Route
supabaseRoutes.route("/authors", getAuthors);

// Categories Route
supabaseRoutes.route("/categories", getCategories);

// Profile Table Routes
supabaseRoutes.route("/get-profile", getProfile);
supabaseRoutes.route("/get-profile-images", getProfileImages);
supabaseRoutes.route("/update-profile", updateProfile);
supabaseRoutes.route("/delete-profile-image", deleteProfileImage);
supabaseRoutes.route("/update-profile-image", updateProfileImage);
supabaseRoutes.route("/upload-profile-image", uploadProfileImage);

// Works Table Routes
supabaseRoutes.route("/get-all-works", getAllWorks);
supabaseRoutes.route("/create-work", createWork);
supabaseRoutes.route("/update-work", updateWork);
supabaseRoutes.route("/upload-work-image", uploadWorkImage);
supabaseRoutes.route("/delete-work-image", deleteWorkImage);
supabaseRoutes.route("/delete-work", deleteWork);

// Products Table Routes
supabaseRoutes.route("/get-all-products", getAllProducts);
supabaseRoutes.route("/create-product", createProduct);
supabaseRoutes.route("/update-product", updateProduct);
supabaseRoutes.route("/delete-product", deleteProduct);
supabaseRoutes.route("/delete-product-image", deleteProductImage);
supabaseRoutes.route("/upload-product-image", uploadProductImage);

// Blog Posts Table Routes
supabaseRoutes.route("/get-all-blog-posts", getAllBlogPosts);
supabaseRoutes.route("/get-blog-post", getBlogPost);
supabaseRoutes.route("/create-blog-post", createBlogPost);
supabaseRoutes.route("/update-blog-post", updateBlogPost);
supabaseRoutes.route("/delete-blog-post", deleteBlogPost);
supabaseRoutes.route("/upload-blog-image", uploadBlogImage);
supabaseRoutes.route("/upload-blog-cover-image", uploadBlogCoverImage);
supabaseRoutes.route("/move-blog-cover-image", moveBlogCoverImage);