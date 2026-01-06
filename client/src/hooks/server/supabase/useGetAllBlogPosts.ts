import { useQuery } from '@tanstack/react-query'
import type { GetAllBlogPostsResponse } from 'shared'

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8787'

/** Fetches all blog posts */
export function useGetAllBlogPosts() {
  return useQuery({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      const res = await fetch(`${serverUrl}/supabase/get-all-blog-posts`)
      if (!res.ok) {
        const err: any = await res.json()
        throw new Error(err.error ?? 'Failed to fetch blog posts')
      }
      return (await res.json()) as GetAllBlogPostsResponse
    },
  })
}