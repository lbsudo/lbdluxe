import { useQuery } from "@tanstack/react-query";
import type { GetProfileResponse } from "server/src/routes/supabase/get-profile";

async function fetchProfile(serverUrl: string) {
  const res = await fetch(`${serverUrl}/api/supabase/get-profile`);

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  const data: GetProfileResponse = await res.json();

  if (!data.success) {
    throw new Error(data.error);
  }

  return data.profile;
}

export function useGetProfile(serverUrl: string) {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(serverUrl),
  });
}
