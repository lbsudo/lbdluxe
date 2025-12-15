import { useRef } from "react";
import { toast } from "sonner";
import { useUploadProfileImage } from "@/hooks/supabase/useUploadProfileImage";

interface ProfileImageUploaderProps {
  serverUrl: string;
}

export function ProfileImageUploader({ serverUrl }: ProfileImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const uploadImage = useUploadProfileImage(serverUrl);

  return (
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

                // Reset input safely
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
  );
}
