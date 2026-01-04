import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import AdminLayout from "@/layouts/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useGetAllProducts } from "@/hooks/server/supabase/useGetAllProducts";
import { useCreateProduct } from "@/hooks/server/supabase/useCreateProduct";
import { useUpdateProduct } from "@/hooks/server/supabase/useUpdateProduct";
import { useDeleteProduct } from "@/hooks/server/supabase/useDeleteProduct";
import { useDeleteProductImage } from "@/hooks/server/supabase/useDeleteProductImage";
import { useUploadProductImage } from "@/hooks/server/supabase/useUploadProductImage";
import { toast } from "sonner";
import type { Product } from "shared";

export const Route = createFileRoute("/admin/content/products")({
  component: RouteComponent,
  ssr: false,
});

type ProductFormData = {
  name: string;
  description: string;
  project_link: string;
  directory: boolean;
  beta: boolean;
  icon_image_url: string;
  image_urls: string[];
};

function RouteComponent() {
  const [isClient, setIsClient] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [imageManagementOpen, setImageManagementOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    workId: string;
    workName: string;
    image_urls: string[];
  } | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { data: productsResponse, isLoading, error } = useGetAllProducts();
  const createProductMutation = useCreateProduct({
    onSuccess: () => {
      setIsFormOpen(false);
      resetForm();
      toast.success("Product created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create product: " + error.message);
    },
  });
  const updateProductMutation = useUpdateProduct({
    onSuccess: () => {
      setImageManagementOpen(false);
      setSelectedProduct(null);
      setIsFormOpen(false);
      resetForm();
      toast.success(
        editingProduct
          ? "Product updated successfully"
          : "Product images updated successfully",
      );
    },
    onError: (error) => {
      toast.error("Failed to update product: " + error.message);
    },
  });
  const deleteProductMutation = useDeleteProduct({
    onSuccess: () => {
      toast.success("Product deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete product: " + error.message);
    },
  });
  const deleteProductImageMutation = useDeleteProductImage({
    onSuccess: () => {
      toast.success("Image deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete image: " + error.message);
    },
  });
  const uploadProductImageMutation = useUploadProductImage({
    onSuccess: (data) => {
      console.log("Product image upload success:", data);
      if (data.success) {
        setImageUrls((prev) => [...prev, data.url]);
        console.log("Added product image URL to list:", data.url);
        // Reset file input after successful upload
        const fileInput = document.querySelector(
          'input[type="file"]',
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        console.error("Product image upload failed:", data);
        toast.error("Upload failed: " + (data as any).error);
      }
      setUploadingImage(false);
    },
    onError: (error) => {
      console.error("Product image upload error:", error);
      toast.error("Upload error: " + error.message);
      setUploadingImage(false);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: {
      directory: false,
      beta: false,
      image_urls: [],
    },
  });

  const directory = watch("directory");
  const beta = watch("beta");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const columnHelper = createColumnHelper<Product>();

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
    }),
    columnHelper.accessor("icon_image_url", {
      header: "Icon",
      cell: (info) => {
        const url = info.getValue();
        return url ? (
          <img
            src={url}
            alt="Product icon"
            className="w-8 h-8 object-cover rounded"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        ) : (
          "—"
        );
      },
    }),
    columnHelper.accessor("description", {
      header: "Description",
      cell: (info) => (
        <div className="max-w-xs truncate" title={info.getValue()}>
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor("project_link", {
      header: "Project Link",
      cell: (info) =>
        info.getValue() ? (
          <a
            href={info.getValue()!}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Link
          </a>
        ) : (
          "—"
        ),
    }),
    columnHelper.accessor("directory", {
      header: "Directory",
      cell: (info) => (info.getValue() ? "Yes" : "No"),
    }),
    columnHelper.accessor("beta", {
      header: "Beta",
      cell: (info) => (info.getValue() ? "Yes" : "No"),
    }),
    columnHelper.accessor("created_at", {
      header: "Created",
      cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.display({
      id: "images",
      header: "Images",
      cell: (info) => {
        const product = info.row.original;
        const imageCount = product.image_urls?.length || 0;
        return (
          <Dialog
            open={imageManagementOpen}
            onOpenChange={setImageManagementOpen}
          >
            <DialogTrigger>
              <Button
                variant="outline"
                size="sm"
                onClick={() => openImageManagement(product)}
              >
                {imageCount} image{imageCount !== 1 ? "s" : ""}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  Manage Images - {selectedProduct?.workName}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      console.log("File input changed:", e.target.files);
                      const file = (e.target as HTMLInputElement).files?.[0];
                      console.log("Selected file:", file);
                      console.log("Selected product:", selectedProduct);
                      if (file && selectedProduct) {
                        console.log(
                          "Starting upload for file:",
                          file.name,
                          "to product:",
                          selectedProduct.workName,
                        );
                        setUploadingImage(true);
                        uploadProductImageMutation.mutate({
                          file,
                          productName: selectedProduct.workName,
                        });
                        // Don't reset here - let the success handler reset it
                      } else if (!file) {
                        console.log("No file selected");
                        toast.error("No image chosen");
                      } else if (!selectedProduct) {
                        console.log(
                          "No selected product - this should not happen in modal",
                        );
                      }
                    }}
                    disabled={uploadingImage}
                    className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-muted file:text-sm"
                  />
                  {uploadingImage && (
                    <span className="text-sm text-muted-foreground">
                      Uploading...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Image ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA5IDE4VjE2QzYuOSAxNiA2IDE3LjEgNiAxOFYyMEM2IDIxLjEgNy4xIDIyIDEyIDIyQzE2LjkgMjIgMTggMjEuMSAxOCAyMFYyMEMxOCAyLjkgMTYuOSAyIDEyIDJaTTEzIDlIMTFWN0gxM1Y5Wk0xMyAxN0gxMVYxMUgxM1YxN1oiIGZpbGw9IiM5Q0E0QUYiLz4KPHN2Zz4+";
                        }}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 p-0"
                        onClick={() => removeImageUrl(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>

                {imageUrls.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">
                    No images added yet
                  </p>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setImageManagementOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveImages}
                    disabled={
                      updateProductMutation.isPending ||
                      uploadProductImageMutation.isPending
                    }
                  >
                    {updateProductMutation.isPending ||
                    uploadProductImageMutation.isPending
                      ? "Saving..."
                      : "Save Images"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const product = info.row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openEditForm(product)}
            >
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Product</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{product.name}"? This will
                    permanently delete the product and all its associated images
                    from storage.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: productsResponse?.success ? productsResponse.products : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const openImageManagement = (product: Product) => {
    setSelectedProduct({
      workId: product.id,
      workName: product.name,
      image_urls: product.image_urls || [],
    });
    setImageUrls(product.image_urls || []);
    setImageManagementOpen(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
    // Pre-populate form with product data
    setValue("name", product.name);
    setValue("description", product.description);
    setValue("project_link", product.project_link || "");
    setValue("directory", product.directory);
    setValue("beta", product.beta);
    setValue("icon_image_url", product.icon_image_url || "");
    setImageUrls(product.image_urls || []);
  };

  const removeImageUrl = (index: number) => {
    const urlToDelete = imageUrls[index];
    if (urlToDelete) {
      deleteProductImageMutation.mutate(urlToDelete);
      // Remove from local state immediately for UI responsiveness
      setImageUrls(imageUrls.filter((_, i) => i !== index));
    }
  };

  const saveImages = () => {
    if (selectedProduct) {
      updateProductMutation.mutate({
        id: selectedProduct.workId,
        image_urls: imageUrls,
      });
    }
  };

  const handleDeleteProduct = (productId: string) => {
    deleteProductMutation.mutate(productId);
  };

  const resetForm = () => {
    setEditingProduct(null);
    reset();
    setImageUrls([]);
  };

  const onSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      // Update existing product
      updateProductMutation.mutate({
        id: editingProduct.id,
        name: data.name,
        description: data.description,
        project_link: data.project_link || undefined,
        directory: data.directory,
        beta: data.beta,
        icon_image_url: data.icon_image_url || undefined,
        image_urls: imageUrls,
      });
    } else {
      // Create new product
      createProductMutation.mutate({
        name: data.name,
        description: data.description,
        project_link: data.project_link,
        directory: data.directory,
        beta: data.beta,
        icon_image_url: data.icon_image_url,
        image_urls: imageUrls,
      });
    }
  };

  const products = productsResponse?.success ? productsResponse.products : [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Products</h1>
          <Button onClick={() => setIsFormOpen(true)}>Add New Product</Button>
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProduct
                  ? `Edit Product: ${editingProduct.name}`
                  : "Create New Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <Input
                  {...register("name", { required: "Name is required" })}
                  placeholder="Product name"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description *
                </label>
                <Textarea
                  {...register("description", {
                    required: "Description is required",
                  })}
                  placeholder="Product description"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Project Link
                </label>
                <Input
                  {...register("project_link")}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Icon Image URL
                </label>
                <Input
                  {...register("icon_image_url")}
                  placeholder="https://example.com/icon.png"
                  type="url"
                />
              </div>

              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={directory}
                    onCheckedChange={(checked) =>
                      setValue("directory", checked)
                    }
                  />
                  <label className="text-sm font-medium">Directory</label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={beta}
                    onCheckedChange={(checked) => setValue("beta", checked)}
                  />
                  <label className="text-sm font-medium">Beta</label>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsFormOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createProductMutation.isPending ||
                    updateProductMutation.isPending ||
                    uploadProductImageMutation.isPending
                  }
                >
                  {createProductMutation.isPending ||
                  updateProductMutation.isPending ||
                  uploadProductImageMutation.isPending
                    ? editingProduct
                      ? "Updating..."
                      : "Creating..."
                    : editingProduct
                      ? "Update Product"
                      : "Create Product"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {!isClient ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <>
            {isLoading && (
              <p className="text-muted-foreground">Loading products…</p>
            )}

            {error && <p className="text-red-500">{error.message}</p>}

            {products.length === 0 && !isLoading && (
              <p className="text-muted-foreground">No products found.</p>
            )}

            {products.length > 0 && (
              <div className="overflow-x-auto rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-3 py-2 text-left font-medium"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="border-t hover:bg-muted/50">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-3 py-2">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
