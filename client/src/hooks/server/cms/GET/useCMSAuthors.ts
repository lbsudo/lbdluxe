import { useQuery } from "@tanstack/react-query"
import type { CMSShelfAuthor } from "shared"

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8787"

export function useCMSAuthors() {
  return useQuery({
    queryKey: ["cms", "authors"],
    queryFn: async () => {
      const res = await fetch(`${serverUrl}/cms/authors`)
      if (!res.ok) {
        throw new Error("Failed to fetch CMS authors")
      }
      return (await res.json()) as CMSShelfAuthor[]
    },
  })
}
