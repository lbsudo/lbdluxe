import { useQuery } from "@tanstack/react-query"
import type { CMSPost } from "shared"

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8787"

export function useCMSPosts() {
  return useQuery({
    queryKey: ["cms", "posts"],
    queryFn: async () => {
      const res = await fetch(`${serverUrl}/cms/posts`)
      if (!res.ok) {
        throw new Error("Failed to fetch CMS posts")
      }
      return (await res.json()) as CMSPost[]
    },
  })
}
