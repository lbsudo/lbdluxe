// client/src/hooks/supabase/deleteProfileImage.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  DeleteProfileImageBody,
  DeleteProfileImageResponse,
} from "server/src/routes/supabase/delete-profile-image.ts";
/* ----------------------------------------
   Fetcher
---------------------------------------- */

async function deleteProfileImageRequest(
  serverUrl: string,
  body: DeleteProfileImageBody,
): Promise<DeleteProfileImageResponse> {
  const res = await fetch(`${serverUrl}/api/supabase/delete-profile-image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Failed to delete profile image");
  }

  const data: DeleteProfileImageResponse = await res.json();

  if (!data.success) {
    throw new Error(data.error);
  }

  return data;
}

/* ----------------------------------------
   TanStack Mutation Hook
---------------------------------------- */

export function useDeleteProfileImage(serverUrl: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: DeleteProfileImageBody) =>
      deleteProfileImageRequest(serverUrl, body),

    // 🔁 Refresh images after delete
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile-images"],
      });
    },
  });
}
