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
import { useGetAllWorks } from "@/hooks/server/supabase/works/GET/useGetAllWorks.ts";
import { useCreateWork } from "@/hooks/server/supabase/works/POST/useCreateWork.ts";
import { useUpdateWork } from "@/hooks/server/supabase/works/PUT/useUpdateWork.ts";
import { useUploadWorkImage } from "@/hooks/server/supabase/works/POST/useUploadWorkImage.ts";
import { useDeleteWorkImage } from "@/hooks/server/supabase/works/DELETE/useDeleteWorkImage.ts";
import { useDeleteWork } from "@/hooks/server/supabase/works/DELETE/useDeleteWork.ts";
import { toast } from "sonner";
import type { Work } from "shared";

export const Route = createFileRoute("/admin/content/works")({
  component: RouteComponent,
  ssr: false,
});

type WorkFormData = {
  name: string;
  description: string;
  project_link: string;
  directory: boolean;
  beta: boolean;
  icon_image_url: string;
  image_urls?: string[];
};

type ImageManagementData = {
  workId: string;
  workName: string;
  image_urls: string[];
};

function RouteComponent() {
  const [isClient, setIsClient] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [imageManagementOpen, setImageManagementOpen] = useState(false);
  const [selectedWork, setSelectedWork] = useState<ImageManagementData | null>(
    null,
  );
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const { data: worksResponse, isLoading, error } = useGetAllWorks();
  const createWorkMutation = useCreateWork({
    onSuccess: () => {
      setIsFormOpen(false);
      resetForm();
      toast.success("Work created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create work: " + error.message);
    },
  });
  const updateWorkMutation = useUpdateWork({
    onSuccess: () => {
      setImageManagementOpen(false);
      setSelectedWork(null);
      setIsFormOpen(false);
      resetForm();
      toast.success(
        editingWork
          ? "Work updated successfully"
          : "Work images updated successfully",
      );
    },
    onError: (error) => {
      toast.error("Failed to update work: " + error.message);
    },
  });
  const uploadImageMutation = useUploadWorkImage({
    onSuccess: (data) => {
      console.log("Upload success:", data);
      if (data.success) {
        setImageUrls((prev) => [...prev, data.url]);
        console.log("Added image URL to list:", data.url);
        toast.success("Image uploaded successfully");
        // Reset file input after successful upload
        const fileInput = document.querySelector(
          'input[type="file"]',
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        console.error("Upload failed:", data);
        const errorMessage = "error" in data ? data.error : "Unknown error";
        toast.error("Upload failed: " + errorMessage);
      }
      setUploadingImage(false);
    },
    onError: (error) => {
      console.error("Upload error:", error);
      toast.error("Upload error: " + error.message);
      setUploadingImage(false);
    },
  });
  const deleteImageMutation = useDeleteWorkImage({
    onSuccess: () => {
      console.log("Image deleted from storage successfully");
    },
    onError: (error) => {
      console.error("Failed to delete image from storage:", error);
      // Still remove from UI even if storage deletion fails
    },
  });
  const deleteWorkMutation = useDeleteWork({
    onSuccess: () => {
      toast.success("Work deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete work: " + error.message);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WorkFormData>({
    defaultValues: {
      directory: false,
      beta: false,
      image_urls: [],
    },
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const directory = watch("directory");
  const beta = watch("beta");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const openImageManagement = (work: Work) => {
    setSelectedWork({
      workId: work.id,
      workName: work.name,
      image_urls: work.image_urls || [],
    });
    setImageUrls(work.image_urls || []);
    setImageManagementOpen(true);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    const projectName = watch("name");

    if (!file) return;

    if (!projectName || projectName.trim() === "") {
      toast.error("Please enter a project name first");
      return;
    }

    setUploadingImage(true);
    uploadImageMutation.mutate({
      file,
      projectName: projectName.trim(),
    });

    // Reset the input
    event.target.value = "";
  };

  const removeImageUrl = (index: number) => {
    const imageUrlToRemove = imageUrls[index];
    if (imageUrlToRemove) {
      // Delete from storage first
      deleteImageMutation.mutate(imageUrlToRemove);
    }
    // Remove from local state regardless of storage deletion success
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const saveImages = () => {
    if (selectedWork) {
      updateWorkMutation.mutate({
        id: selectedWork.workId,
        image_urls: imageUrls,
      });
    }
  };

  const openEditForm = (work: Work) => {
    setEditingWork(work);
    setIsFormOpen(true);
    // Pre-populate form with work data
    setValue("name", work.name);
    setValue("description", work.description);
    setValue("project_link", work.project_link || "");
    setValue("directory", work.directory);
    setValue("beta", work.beta);
    setValue("icon_image_url", work.icon_image_url || "");
    setImageUrls(work.image_urls || []);
  };

  const handleDeleteWork = (workId: string) => {
    deleteWorkMutation.mutate(workId);
  };

  const resetForm = () => {
    setEditingWork(null);
    reset();
    setImageUrls([]);
  };

  const columnHelper = createColumnHelper<Work>();

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
            alt="Work icon"
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
        const work = info.row.original;
        const imageCount = work.image_urls?.length || 0;
        return (
          <Dialog
            open={imageManagementOpen}
            onOpenChange={setImageManagementOpen}
          >
            <DialogTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openImageManagement(work)}
                >
                  {imageCount} image{imageCount !== 1 ? "s" : ""}
                </Button>
              }
            />
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  Manage Images - {selectedWork?.workName}
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
                      console.log("Selected work:", selectedWork);
                      if (file && selectedWork) {
                        console.log(
                          "Starting upload for file:",
                          file.name,
                          "to project:",
                          selectedWork.workName,
                        );
                        setUploadingImage(true);
                        uploadImageMutation.mutate({
                          file,
                          projectName: selectedWork.workName,
                        });
                        // Don't reset here - let the success handler reset it
                      } else if (!file) {
                        console.log("No file selected");
                        toast.error("No image chosen");
                      } else if (!selectedWork) {
                        console.log(
                          "No selected work - this should not happen in modal",
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
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA5IDE4VjE2QzYuOSAxNiA2IDE3LjEgNiAxOFYyMEM2IDIxLjEgNy4xIDIyIDEyIDIyQzE2LjkgMjIgMTggMjEuMSAxOCAyMFYyMEMxOCAyLjkgMTYuOSAyIDEyIDJaTTEzIDlIMTFWN0gxM1Y5Wk0xMyAxN0gxMVYxMUgxM1YxN1oiIGZpbGw9IiM5Q0E0QUYiLz4KPHN2Zz4=";
                        }}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                    disabled={updateWorkMutation.isPending}
                  >
                    {updateWorkMutation.isPending ? "Saving..." : "Save Images"}
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
        const work = info.row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openEditForm(work)}
            >
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger
                render={<Button variant="destructive" size="sm">Delete</Button>}
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Work</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{work.name}"? This will
                    permanently delete the work and all its associated images
                    from storage.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteWork(work.id)}
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
    data: worksResponse?.success ? worksResponse.works : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const onSubmit = (data: WorkFormData) => {
    if (editingWork) {
      // Update existing work
      updateWorkMutation.mutate({
        id: editingWork.id,
        name: data.name,
        description: data.description,
        project_link: data.project_link || undefined,
        directory: data.directory,
        beta: data.beta,
        icon_image_url: data.icon_image_url || undefined,
        image_urls: imageUrls,
      });
    } else {
      // Create new work
      createWorkMutation.mutate({
        ...data,
        image_urls: imageUrls,
      });
    }
  };

  const works = worksResponse?.success ? worksResponse.works : [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Works</h1>
          <Button onClick={() => setIsFormOpen(!isFormOpen)}>
            {isFormOpen ? "Cancel" : "Add New Work"}
          </Button>
        </div>

        {isFormOpen && (
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-lg font-medium">
              {editingWork
                ? `Edit Work: ${editingWork.name}`
                : "Create New Work"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <Input
                  {...register("name", { required: "Name is required" })}
                  placeholder="Project name"
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
                  placeholder="Project description"
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

              <div>
                <label className="block text-sm font-medium mb-1">
                  Additional Images
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadingImage}
                      className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-muted file:text-sm"
                    />
                    {uploadingImage && (
                      <span className="text-sm text-muted-foreground">
                        Uploading...
                      </span>
                    )}
                  </div>
                  {imageUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Image ${index + 1}`}
                            className="w-full h-16 object-cover rounded border"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA5IDE4VjE2QzYuOSAxNiA2IDE3LjEgNiAxOFYyMEM2IDIxLjEgNy4xIDIyIDEyIDIyQzE2LjkgMjIgMTggMjEuMSAxOCAyMFYyMEMxOCAyLjkgMTYuOSAyIDEyIDJaTTEzIDlIMTFWN0gxM1Y5Wk0xMyAxN0gxMVYxMUgxM1YxN1oiIGZpbGw9IiM5Q0E0QUYiLz4KPHN2Zz4+";
                            }}
                          />
                          <Button
                            type="button"
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
                  )}
                </div>
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

              <div className="flex gap-2">
                <Button type="submit" disabled={createWorkMutation.isPending}>
                  {createWorkMutation.isPending || updateWorkMutation.isPending
                    ? editingWork
                      ? "Updating..."
                      : "Creating..."
                    : editingWork
                      ? "Update Work"
                      : "Create Work"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {!isClient ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <>
            {isLoading && (
              <p className="text-muted-foreground">Loading works…</p>
            )}

            {error && <p className="text-red-500">{error.message}</p>}

            {works.length === 0 && !isLoading && (
              <p className="text-muted-foreground">No works found.</p>
            )}

            {works.length > 0 && (
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
