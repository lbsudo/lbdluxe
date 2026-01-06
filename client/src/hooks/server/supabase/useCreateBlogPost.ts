import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateBlogPostResponse } from 'shared'

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8787'

/** Creates a new blog post */
export function useCreateBlogPost(options?: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      cover_image: string
      title: string
      content: string
      author: string
      tags?: string[]
    }) => {
      const res = await fetch(`${serverUrl}/supabase/create-blog-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err: any = await res.json()
        throw new Error(err.error ?? 'Failed to create blog post')
      }
      return (await res.json()) as CreateBlogPostResponse
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