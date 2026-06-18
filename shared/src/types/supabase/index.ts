// shared/src/types/supabase/index.ts
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

export type SupabaseEnv = {
  SUPABASE_URL: string;
  SUPABASE_SEC_KEY: string;
};

export type SupabaseContext = {
  Variables: {
    supabase: SupabaseClient;
  };
  Bindings: SupabaseEnv;
};

export const WorkSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  project_link: z.string().nullable(),
  repo_link: z.string().nullable(),
  directory: z.boolean(),
  beta: z.boolean(),
  icon_image_url: z.string().nullable(),
  image_urls: z.array(z.string()).default([]),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  project_link: z.string().nullable(),
  directory: z.boolean(),
  beta: z.boolean(),
  icon_image_url: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  image_urls: z.array(z.string()).default([]),
});

export const CreateWorkSuccessSchema = z.object({
  success: z.literal(true),
  work: WorkSchema,
});

export const CreateWorkErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const CreateWorkResponseSchema = z.union([
  CreateWorkSuccessSchema,
  CreateWorkErrorSchema,
]);

export const GetAllWorksSuccessSchema = z.object({
  success: z.literal(true),
  works: z.array(WorkSchema),
});

export const GetAllWorksErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const GetAllWorksResponseSchema = z.union([
  GetAllWorksSuccessSchema,
  GetAllWorksErrorSchema,
]);

export const UpdateWorkSuccessSchema = z.object({
  success: z.literal(true),
  work: WorkSchema,
});

export const UpdateWorkErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const UpdateWorkResponseSchema = z.union([
  UpdateWorkSuccessSchema,
  UpdateWorkErrorSchema,
]);

export const UploadWorkImageSuccessSchema = z.object({
  success: z.literal(true),
  url: z.string(),
  fileName: z.string(),
});

export const UploadWorkImageErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const UploadWorkImageResponseSchema = z.union([
  UploadWorkImageSuccessSchema,
  UploadWorkImageErrorSchema,
]);

export const DeleteWorkSuccessSchema = z.object({
  success: z.literal(true),
});

export const DeleteWorkErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const DeleteWorkResponseSchema = z.union([
  DeleteWorkSuccessSchema,
  DeleteWorkErrorSchema,
]);

export const GetAllProductsSuccessSchema = z.object({
  success: z.literal(true),
  products: z.array(ProductSchema),
});

export const GetAllProductsErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const GetAllProductsResponseSchema = z.union([
  GetAllProductsSuccessSchema,
  GetAllProductsErrorSchema,
]);

export const CreateProductSuccessSchema = z.object({
  success: z.literal(true),
  product: ProductSchema,
});

export const CreateProductErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const CreateProductResponseSchema = z.union([
  CreateProductSuccessSchema,
  CreateProductErrorSchema,
]);

export const UpdateProductSuccessSchema = z.object({
  success: z.literal(true),
  product: ProductSchema,
});

export const UpdateProductErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const UpdateProductResponseSchema = z.union([
  UpdateProductSuccessSchema,
  UpdateProductErrorSchema,
]);

export const DeleteProductSuccessSchema = z.object({
  success: z.literal(true),
});

export const DeleteProductErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const DeleteProductResponseSchema = z.union([
  DeleteProductSuccessSchema,
  DeleteProductErrorSchema,
]);



// Shared TS types (used by server + client)
export type Work = z.infer<typeof WorkSchema>;
export type CreateWorkResponse = z.infer<typeof CreateWorkResponseSchema>;
export type GetAllWorksResponse = z.infer<typeof GetAllWorksResponseSchema>;
export type UpdateWorkResponse = z.infer<typeof UpdateWorkResponseSchema>;
export type UploadWorkImageResponse = z.infer<typeof UploadWorkImageResponseSchema>;
export type DeleteWorkResponse = z.infer<typeof DeleteWorkResponseSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type GetAllProductsResponse = z.infer<typeof GetAllProductsResponseSchema>;
export type CreateProductResponse = z.infer<typeof CreateProductResponseSchema>;
export type UpdateProductResponse = z.infer<typeof UpdateProductResponseSchema>;
export type DeleteProductResponse = z.infer<typeof DeleteProductResponseSchema>;
