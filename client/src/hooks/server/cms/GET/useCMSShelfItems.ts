import { useQuery } from "@tanstack/react-query"
import type { CMSShelfItem } from "shared"

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8787"

export function useCMSShelfItems(categoryId?: number) {
  return useQuery({
    queryKey: ["cms", "shelf-items", categoryId],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (categoryId != null) {
        params.set("categoryId", String(categoryId))
      }
      const qs = params.toString()
      const url = `${serverUrl}/cms/shelf-items${qs ? `?${qs}` : ""}`
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error("Failed to fetch CMS shelf items")
      }
      return (await res.json()) as CMSShelfItem[]
    },
  })
}

export function useCMSShelfItem(slug: string) {
  return useQuery({
    queryKey: ["cms", "shelf-items", slug],
    queryFn: async () => {
      const res = await fetch(`${serverUrl}/cms/shelf-items/${encodeURIComponent(slug)}`)
      if (!res.ok) {
        throw new Error("Failed to fetch CMS shelf item")
      }
      return (await res.json()) as CMSShelfItem | null
    },
  })
}
