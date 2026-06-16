import { useQuery } from "@tanstack/react-query"
import type { CMSPage } from "shared"

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8787"

export function useCMSPage(slug: string, tenant = "lbdluxe") {
  return useQuery({
    queryKey: ["cms", "pages", slug, tenant],
    queryFn: async () => {
      const res = await fetch(
        `${serverUrl}/cms/pages/${encodeURIComponent(slug)}?tenant=${encodeURIComponent(tenant)}`,
      )
      if (!res.ok) {
        throw new Error("Failed to fetch CMS page")
      }
      return (await res.json()) as CMSPage | null
    },
  })
}
