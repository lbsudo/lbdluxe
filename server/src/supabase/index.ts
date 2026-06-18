import { Hono } from "hono";
import type { SupabaseContext } from "@shared/types";
import { supabaseMiddleware } from "../middleware/supabase";
import { worksRoutes } from "./works";
import { productsRoutes } from "./products";

export const supabaseRoutes = new Hono<SupabaseContext>();

// Apply middleware to all routes
supabaseRoutes.use("*", supabaseMiddleware);

// Works Table Routes
supabaseRoutes.route("/works", worksRoutes);

// Products Table Routes
supabaseRoutes.route("/products", productsRoutes);