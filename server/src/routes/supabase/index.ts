import { Hono } from "hono";
import type { SupabaseContext } from "@shared/types";
import { supabaseMiddleware } from "@server/middleware/supabaseClient";
import { getProfile } from "@server/routes/supabase/profile/get-profile";
import { getProfileImages } from "@server/routes/supabase/profile/get-profile-images";
import { updateProfile } from "@server/routes/supabase/profile/update-profile";
import { deleteProfileImage } from "@server/routes/supabase/profile/delete-profile-image";
import { updateProfileImage } from "@server/routes/supabase/profile/update-profile-image";
import { uploadProfileImage } from "@server/routes/supabase/profile/upload-profile-image";
import { createWork } from "@server/routes/supabase/works/create-work";
import { getAllWorks } from "@server/routes/supabase/works/get-all-works";
import { updateWork } from "@server/routes/supabase/works/update-work";
import { uploadWorkImage } from "@server/routes/supabase/works/upload-work-image";
import { deleteWorkImage } from "@server/routes/supabase/works/delete-work-image";
import { deleteWork } from "@server/routes/supabase/works/delete-work";
import { createProduct } from "@server/routes/supabase/products/create-product";
import { getAllProducts } from "@server/routes/supabase/products/get-all-products";
import { updateProduct } from "@server/routes/supabase/products/update-product";
import { deleteProduct } from "@server/routes/supabase/products/delete-product";
import { deleteProductImage } from "@server/routes/supabase/products/delete-product-image";
import { uploadProductImage } from "@server/routes/supabase/products/upload-product-image";

export const supabaseRoutes = new Hono<SupabaseContext>();

// Apply middleware to all Supabase routes
supabaseRoutes.use("*", supabaseMiddleware);

// Profile Table Routes
supabaseRoutes.route("/get-profile", getProfile);
supabaseRoutes.route("/get-profile-images", getProfileImages);
supabaseRoutes.route("/update-profile", updateProfile);
supabaseRoutes.route("/delete-profile-image", deleteProfileImage);
supabaseRoutes.route("/update-profile-image", updateProfileImage);
supabaseRoutes.route("/upload-profile-image", uploadProfileImage);

//Works Table Routes
supabaseRoutes.route("/get-all-works", getAllWorks);
supabaseRoutes.route("/create-work", createWork);
supabaseRoutes.route("/update-work", updateWork);
supabaseRoutes.route("/upload-work-image", uploadWorkImage);
supabaseRoutes.route("/delete-work-image", deleteWorkImage);
supabaseRoutes.route("/delete-work", deleteWork);

//Products Table Routes
supabaseRoutes.route("/get-all-products", getAllProducts);
supabaseRoutes.route("/create-product", createProduct);
supabaseRoutes.route("/update-product", updateProduct);
supabaseRoutes.route("/delete-product", deleteProduct);
supabaseRoutes.route("/delete-product-image", deleteProductImage);
supabaseRoutes.route("/upload-product-image", uploadProductImage);
