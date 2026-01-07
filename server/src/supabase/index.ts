import { Hono } from "hono";
import type { SupabaseContext } from "@shared/types";
import { supabaseMiddleware } from "../middleware/supabase";
import { profileRoutes } from "./profile";
import { worksRoutes } from "./works";
import { productsRoutes } from "./products";
import { blogRoutes } from "./blog";

export const supabaseRoutes = new Hono<SupabaseContext>();

// Apply middleware to all routes
supabaseRoutes.use("*", supabaseMiddleware);



// Profile Routes
supabaseRoutes.route("/profile", profileRoutes);

// Works Table Routes
supabaseRoutes.route("/works", worksRoutes);

// Products Table Routes
supabaseRoutes.route("/products", productsRoutes);

// Blog Posts Table Routes
supabaseRoutes.route("/blog", blogRoutes);