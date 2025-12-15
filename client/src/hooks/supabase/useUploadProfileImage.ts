import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UploadProfileImageResponse } from "server/src/routes/supabase/upload-profile-image";

/* ----------------------------------------
   Input type (client-side)
---------------------------------------- */

export interface UploadProfileImageInput {
  file: File;
  name?: string;
  upsert?: boolean;
}

/* ----------------------------------------
   Fetcher
---------------------------------------- */

async function uploadProfileImageRequest(
  serverUrl: string,
  input: UploadProfileImageInput,
): Promise<UploadProfileImageResponse> {
  const formData = new FormData();

  formData.append("file", input.file);

  if (input.name) {
    formData.append("name", input.name);
  }

  if (input.upsert !== undefined) {
    formData.append("upsert", String(input.upsert));
  }

  const res = await fetch(`${serverUrl}/api/supabase/upload-profile-image`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to upload profile image");
  }

  const data: UploadProfileImageResponse = await res.json();

  if (!data.success) {
    throw new Error(data.error);
  }

  return data;
}

/* ----------------------------------------
   TanStack Mutation Hook
---------------------------------------- */

export function useUploadProfileImage(serverUrl: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UploadProfileImageInput) =>
      uploadProfileImageRequest(serverUrl, input),

    // 🔁 Refresh image list after upload
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile-images"],
      });
    },
  });
}
