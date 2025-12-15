import { toast } from "sonner";
import { useDeleteProfileImage } from "@/hooks/supabase/useDeleteProfileImage";
import type { ProfileImage } from "server/src/routes/supabase/get-profile-images";

interface ProfileImageGridProps {
  serverUrl: string;
  images: ProfileImage[];
}

export function ProfileImageGrid({ serverUrl, images }: ProfileImageGridProps) {
  const deleteImage = useDeleteProfileImage(serverUrl);

  return (
    <div className="grid grid-cols-2 gap-4">
      {images.map((img) => (
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
  );
}
