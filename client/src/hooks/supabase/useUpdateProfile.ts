import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  UpdateProfileBody,
  UpdateProfileResponse,
} from "server/src/routes/supabase/update-profile";

/* ----------------------------------------
   Fetcher
---------------------------------------- */

async function updateProfileRequest(
  serverUrl: string,
  body: UpdateProfileBody,
): Promise<UpdateProfileResponse> {
  const res = await fetch(`${serverUrl}/api/supabase/update-profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Failed to update profile");
  }

  const data: UpdateProfileResponse = await res.json();

  if (!data.success) {
    throw new Error(data.error);
  }

  return data;
}

/* ----------------------------------------
   TanStack Mutation Hook
---------------------------------------- */

export function useUpdateProfile(serverUrl: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateProfileBody) =>
      updateProfileRequest(serverUrl, body),

    // 🔁 Invalidate anything that depends on profile data
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
