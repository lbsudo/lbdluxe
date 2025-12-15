import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import AdminLayout from "@/layouts/admin-layout";
import { useGetProfileImages } from "@/hooks/supabase/useGetProfileImages";
import { useDeleteProfileImage } from "@/hooks/supabase/useDeleteProfileImage";
import { useUploadProfileImage } from "@/hooks/supabase/useUploadProfileImage";
import { useRef } from "react";

export const Route = createFileRoute("/admin/profile")({
  component: RouteComponent,
});

const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? "http://localhost:8787";

function RouteComponent() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { data, isLoading, error } = useGetProfileImages(SERVER_URL);
  const uploadImage = useUploadProfileImage(SERVER_URL);
  const deleteImage = useDeleteProfileImage(SERVER_URL);

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold mb-4">Profile Images</h1>

      <div className="mb-6">
        <label
          htmlFor="profile-image-upload"
          className="
            inline-flex items-center gap-2
            rounded-md border border-foreground
            bg-background px-4 py-2
            text-sm font-medium
            shadow-sm
            cursor-pointer
            hover:bg-accent
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring
            focus-visible:ring-offset-2
          "
        >
          {uploadImage.isPending ? "Uploading…" : "Upload profile image"}
        </label>

        <input
          ref={fileInputRef}
          id="profile-image-upload"
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={uploadImage.isPending}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            uploadImage.mutate(
              { file },
              {
                onSuccess: () => {
                  toast.success("Profile image uploaded");

                  // ✅ SAFE reset
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                },
                onError: (err) => {
                  toast.error(
                    err instanceof Error ? err.message : "Upload failed",
                  );
                },
              },
            );
          }}
        />
      </div>

      {isLoading && <p>Loading images…</p>}

      {error && <p className="text-red-500">{(error as Error).message}</p>}

      {data && (
        <div className="grid grid-cols-2 gap-4">
          {data.map((img) => (
            <div
              key={img.name}
              className="relative aspect-square overflow-hidden rounded-md border bg-muted h-50 w-50"
            >
              {/* Delete button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();

                  deleteImage.mutate(
                    { name: img.name },
                    {
                      onSuccess: () => {
                        toast.success("Profile image deleted");
                      },
                      onError: (err) => {
                        toast.error(
                          err instanceof Error
                            ? err.message
                            : "Failed to delete image",
                        );
                      },
                    },
                  );
                }}
                className="
                  absolute right-2 top-2 z-50
                  flex items-center justify-center
                  h-6 w-6
                  rounded-full bg-red-600 text-white
                  text-lg
                  shadow
                  hover:bg-red-700
                "
                aria-label={`Delete ${img.name}`}
              >
                ×
              </button>

              {/* Image */}
              <img
                src={img.url}
                alt={img.name}
                className="h-full w-full object-cover pointer-events-none"
              />
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
