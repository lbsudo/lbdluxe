import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import type { CMSPost } from "shared"

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8787"

export function cmsPostQuery(slug: string): UseQueryOptions<CMSPost | null> {
  return {
    queryKey: ["cms", "posts", slug],
    queryFn: async () => {
      const res = await fetch(
        `${serverUrl}/cms/posts/${encodeURIComponent(slug)}`,
      )
      if (!res.ok) {
        throw new Error("Failed to fetch CMS post")
      }
      return (await res.json()) as CMSPost | null
    },
    enabled: !!slug,
  }
}

export function useCMSPost(slug: string) {
  return useQuery(cmsPostQuery(slug))
}