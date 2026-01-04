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

export const GetProfileSuccessSchema = z.object({
  success: z.literal(true),
  profile: z.object({
    id: z.string().uuid(),
    profile_image_url: z.string().nullable(),
    words: z.array(z.string()),
    description: z.string().nullable(),
    created_at: z.string(),
    updated_at: z.string(),
  }),
});

export const GetProfileErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const GetProfileResponseSchema = z.union([
  GetProfileSuccessSchema,
  GetProfileErrorSchema,
]);

export const DeleteProfileImageSuccessSchema = z.object({
  success: z.literal(true),
});

export const DeleteProfileImageErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const DeleteProfileImageResponseSchema = z.union([
  DeleteProfileImageSuccessSchema,
  DeleteProfileImageErrorSchema,
]);

export const UploadProfileImageSuccessSchema = z.object({
  success: z.literal(true),
  url: z.string(),
  fileName: z.string(),
});

export const UploadProfileImageErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const UploadProfileImageResponseSchema = z.union([
  UploadProfileImageSuccessSchema,
  UploadProfileImageErrorSchema,
]);

export const UpdateProfileImageSuccessSchema = z.object({
  success: z.literal(true),
});

export const UpdateProfileImageErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const UpdateProfileImageResponseSchema = z.union([
  UpdateProfileImageSuccessSchema,
  UpdateProfileImageErrorSchema,
]);

export const UpdateProfileSuccessSchema = z.object({
  success: z.literal(true),
});

export const UpdateProfileErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
});

export const UpdateProfileResponseSchema = z.union([
  UpdateProfileSuccessSchema,
  UpdateProfileErrorSchema,
]);

export const WorkSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  project_link: z.string().nullable(),
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
export type Profile = z.infer<typeof GetProfileSuccessSchema>["profile"];
export type GetProfileResponse = z.infer<typeof GetProfileResponseSchema>;
export type DeleteProfileImageResponse = z.infer<typeof DeleteProfileImageResponseSchema>;
export type UploadProfileImageResponse = z.infer<typeof UploadProfileImageResponseSchema>;
export type UpdateProfileImageResponse = z.infer<typeof UpdateProfileImageResponseSchema>;
export type UpdateProfileResponse = z.infer<typeof UpdateProfileResponseSchema>;
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
