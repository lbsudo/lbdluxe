import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import type { CMSPage } from "shared"

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8787"

export function cmsPageQuery(slug: string): UseQueryOptions<CMSPage | null> {
  return {
    queryKey: ["cms", "pages", slug],
    queryFn: async () => {
      const res = await fetch(`${serverUrl}/cms/pages/${encodeURIComponent(slug)}`)
      if (!res.ok) {
        throw new Error("Failed to fetch CMS page")
      }
      return (await res.json()) as CMSPage | null
    },
  }
}

export function useCMSPage(slug: string) {
  return useQuery(cmsPageQuery(slug))
}