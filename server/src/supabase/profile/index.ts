import { Hono } from "hono";
import { getProfile } from "./GET/get-profile";
import { getProfileImages } from "./GET/get-profile-images";
import { updateProfile } from "./PUT/update-profile";
import { deleteProfileImage } from "./DELETE/delete-profile-image";
import { updateProfileImage } from "./PUT/update-profile-image";
import { uploadProfileImage } from "./PUT/upload-profile-image";
import { uploadProductImage } from "../products/PUT/upload-product-image";

export const profileRoutes = new Hono();

// Route names exactly match file names, preserving :filename parameter for delete route
profileRoutes.route("/get-profile", getProfile);
profileRoutes.route("/update-profile", updateProfile);
profileRoutes.route("/get-profile-images", getProfileImages);
profileRoutes.route("/upload-profile-image", uploadProfileImage);
profileRoutes.route("/delete-profile-image/:filename", deleteProfileImage);
profileRoutes.route("/update-profile-image", updateProfileImage);
profileRoutes.route("/upload-product-image", uploadProductImage);