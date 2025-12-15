import { Hono } from "hono";
import { getProfileImages } from "./get-profile-images";
import { deleteProfileImage } from "./delete-profile-image";
import { uploadProfileImage } from "./upload-profile-image";
import { updateProfile } from "./update-profile";
import { getProfile } from "./get-profile";

export const supabaseRoutes = new Hono();

/**
 * Mount Supabase-related routes
 *
 * Resulting path:
 * /api/supabase/get-profile-images
 */
supabaseRoutes.route("/get-profile-images", getProfileImages);
supabaseRoutes.route("/delete-profile-image", deleteProfileImage);
supabaseRoutes.route("/upload-profile-image", uploadProfileImage);
supabaseRoutes.route("/update-profile", updateProfile);
supabaseRoutes.route("get-profile", getProfile);
export default supabaseRoutes;
