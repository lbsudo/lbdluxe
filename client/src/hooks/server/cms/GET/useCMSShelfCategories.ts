import { useQuery, type UseQueryOptions } from "@tanstack/react-query"
import type { CMSShelfCategory } from "shared"

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8787"

export const cmsShelfCategoriesQuery: UseQueryOptions<CMSShelfCategory[]> = {
  queryKey: ["cms", "shelf-categories"],
  queryFn: async () => {
    const res = await fetch(`${serverUrl}/cms/shelf-categories`)
    if (!res.ok) {
      throw new Error("Failed to fetch CMS shelf categories")
    }
    return (await res.json()) as CMSShelfCategory[]
  },
}

export function useCMSShelfCategories() {
  return useQuery(cmsShelfCategoriesQuery)
}