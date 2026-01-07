import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UpdateBlogPostResponse } from 'shared'

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8787'

/** Updates a blog post */
export function useUpdateBlogPost(options?: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      id: number
      cover_image?: string
      title?: string
      content?: string
      author?: string
      tags?: string[]
    }) => {
      const res = await fetch(`${serverUrl}/supabase/blog/update-blog-post`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err: any = await res.json()
        throw new Error(err.error ?? 'Failed to update blog post')
      }
      return (await res.json()) as UpdateBlogPostResponse
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] })
      options?.onSuccess?.()
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
}