import { useQuery } from "@tanstack/react-query"
import type { CMSProfileLink } from "shared"

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8787"

export function useCMSProfileLinks() {
  return useQuery({
    queryKey: ["cms", "profile-links"],
    queryFn: async () => {
      const res = await fetch(`${serverUrl}/cms/profile-links`)
      if (!res.ok) {
        throw new Error("Failed to fetch CMS profile links")
      }
      return (await res.json()) as CMSProfileLink[]
    },
  })
}
