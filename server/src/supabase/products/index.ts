import { Hono } from "hono";
import { getAllProducts } from "./GET/get-all-products";
import { createProduct } from "./POST/create-product";
import { updateProduct } from "./PUT/update-product";
import { deleteProduct } from "./DELETE/delete-product";
import { uploadProductImage } from "./PUT/upload-product-image";
import { deleteProductImage } from "./DELETE/delete-product-image";

export const productsRoutes = new Hono();

// Route names exactly match file names
productsRoutes.route("/get-all-products", getAllProducts);
productsRoutes.route("/create-product", createProduct);
productsRoutes.route("/update-product", updateProduct);
productsRoutes.route("/delete-product", deleteProduct);
productsRoutes.route("/upload-product-image", uploadProductImage);
productsRoutes.route("/delete-product-image", deleteProductImage);