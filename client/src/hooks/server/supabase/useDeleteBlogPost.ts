import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { DeleteBlogPostResponse } from 'shared'

const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:8787'

/** Deletes a blog post */
export function useDeleteBlogPost(options?: {
  onSuccess?: () => void
  onError?: (error: Error) => void
}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${serverUrl}/supabase/delete-blog-post`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) {
        const err: any = await res.json()
        throw new Error(err.error ?? 'Failed to delete blog post')
      }

      const result = await res.json()
      return result as DeleteBlogPostResponse
    },
    onSuccess: () => {
      // Refetch the blog posts list after deletion
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] })
      options?.onSuccess?.()
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
}