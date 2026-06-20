import { useQuery } from "@tanstack/react-query"
import type { CMSProduct } from "shared"

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8787"

export function useCMSProducts() {
  return useQuery({
    queryKey: ["cms", "products"],
    queryFn: async () => {
      const res = await fetch(`${serverUrl}/cms/products`)
      if (!res.ok) {
        throw new Error("Failed to fetch CMS products")
      }
      return (await res.json()) as CMSProduct[]
    },
  })
}
