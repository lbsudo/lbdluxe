import { Hono } from "hono";
import { getAllWorks } from "./GET/get-all-works";
import { createWork } from "./POST/create-work";
import { updateWork } from "./PUT/update-work";
import { deleteWork } from "./DELETE/delete-work";
import { uploadWorkImage } from "./PUT/upload-work-image";
import { deleteWorkImage } from "./DELETE/delete-work-image";

export const worksRoutes = new Hono();

// Route names exactly match file names
worksRoutes.route("/get-all-works", getAllWorks);
worksRoutes.route("/create-work", createWork);
worksRoutes.route("/update-work", updateWork);
worksRoutes.route("/delete-work", deleteWork);
worksRoutes.route("/upload-work-image", uploadWorkImage);
worksRoutes.route("/delete-work-image", deleteWorkImage);