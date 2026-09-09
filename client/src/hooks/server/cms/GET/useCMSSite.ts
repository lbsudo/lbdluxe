import { useQuery } from "@tanstack/react-query"
import type { CMSSite } from "shared"

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8787"

export function useCMSSite() {
  return useQuery({
    queryKey: ["cms", "site"],
    queryFn: async () => {
      const res = await fetch(`${serverUrl}/cms/site`)
      if (!res.ok) {
        throw new Error("Failed to fetch CMS site")
      }
      return (await res.json()) as CMSSite | null
    },
    retry: 0,
    staleTime: 1000 * 60 * 5,
  })
}