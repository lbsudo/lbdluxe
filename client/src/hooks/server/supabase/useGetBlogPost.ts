import { useQuery } from '@tanstack/react-query'
import type { GetBlogPostResponse } from 'shared'

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8787'

/** Fetches a single blog post by ID */
export function useGetBlogPost(id: number | undefined) {
  return useQuery({
    queryKey: ['blogPost', id],
    queryFn: async () => {
      if (!id) throw new Error('Blog post ID is required')
      const res = await fetch(`${serverUrl}/supabase/get-blog-post?id=${id}`)
      if (!res.ok) {
        const err: any = await res.json()
        throw new Error(err.error ?? 'Failed to fetch blog post')
      }
      return (await res.json()) as GetBlogPostResponse
    },
    enabled: !!id,
  })
}