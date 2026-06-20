import { useQuery } from "@tanstack/react-query"
import type { CMSLinksProfile } from "shared"

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8787"

export function useCMSLinksProfile() {
  return useQuery({
    queryKey: ["cms", "links-profile"],
    queryFn: async () => {
      const res = await fetch(`${serverUrl}/cms/links-profile`)
      if (!res.ok) {
        throw new Error("Failed to fetch CMS links profile")
      }
      return (await res.json()) as CMSLinksProfile | null
    },
  })
}
