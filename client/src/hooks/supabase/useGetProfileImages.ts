// client/src/hooks/supabase/useProfileImages.ts

import { useQuery } from "@tanstack/react-query";
import type {
  GetProfileImagesResponse,
  ProfileImage,
} from "server/src/routes/supabase/get-profile-images";

/* ----------------------------------------
   Fetcher
---------------------------------------- */

async function fetchProfileImages(serverUrl: string): Promise<ProfileImage[]> {
  const res = await fetch(`${serverUrl}/api/supabase/get-profile-images`);

  if (!res.ok) {
    throw new Error("Failed to fetch profile images");
  }

  const data: GetProfileImagesResponse = await res.json();

  if (!data.success) {
    throw new Error(data.error);
  }

  return data.images;
}

/* ----------------------------------------
   TanStack Query Hook
---------------------------------------- */

export function useGetProfileImages(serverUrl: string) {
  return useQuery({
    queryKey: ["profile-images"],
    queryFn: () => fetchProfileImages(serverUrl),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}
