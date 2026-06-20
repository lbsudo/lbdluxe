import { useQuery } from "@tanstack/react-query"
import type { CMSWork } from "shared"

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8787"

export function useCMSWorks() {
  return useQuery({
    queryKey: ["cms", "works"],
    queryFn: async () => {
      const res = await fetch(`${serverUrl}/cms/works`)
      if (!res.ok) {
        throw new Error("Failed to fetch CMS works")
      }
      return (await res.json()) as CMSWork[]
    },
  })
}
