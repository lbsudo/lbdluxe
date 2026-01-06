// src/client/hooks/resend/useGetResendContacts.ts
import { useQuery } from '@tanstack/react-query'
import { hcWithType } from 'server/client'
import type { Contact } from 'resend'

// ------------------------
// Server URL
// ------------------------
const isProd = import.meta.env.PROD
const SERVER_URL = isProd
  ? import.meta.env.VITE_SERVER_URL
  : 'http://localhost:8787'

const client = hcWithType(`${SERVER_URL}/resend`) as any

const supabaseClient = hcWithType(`${SERVER_URL}/supabase`) as any

// ------------------------
// Hooks
// ------------------------

export function useAuthors() {
  return useQuery({
    queryKey: ['supabase-authors'],
    queryFn: async () => {
      const response = await supabaseClient.authors.$get({})
      const json = await response.json()

      // Extract authors: { success: true, authors: [...] }
      const authors = (json as any)?.authors || []

      return authors
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['supabase-categories'],
    queryFn: async () => {
      const response = await supabaseClient.categories.$get({})
      const json = await response.json()

      // Extract categories: { success: true, categories: [...] }
      const categories = (json as any)?.categories || []

      // Return array of category names
      return categories.map((cat: any) => cat.name)
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useSegments() {
  return useQuery({
    queryKey: ['resend-segments'],
    queryFn: async () => {
      const response = await client.segments.$get({})
      
      // Check response content type
      const contentType = response.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        const text = await response.text()
        console.error('Segments API returned non-JSON response:', text)
        throw new Error(`API returned non-JSON response: ${text.substring(0, 100)}`)
      }

      const json = await response.json()

      // Extract segments: { success: true, segments: [...] }
      const segments = (json as any)?.segments || []

      return segments
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('non-JSON')) return false
      if (error?.message?.includes('status 5')) return failureCount < 1
      return false
    },
  })
}

export function useContacts(segmentId?: string) {
  return useQuery({
    queryKey: ['resend-contacts', segmentId],
    queryFn: async () => {
      const params = segmentId ? { segment_id: segmentId } : {}
      const response = await client['get-resend-contacts'].$get({ query: params })
      
      // Check response content type
      const contentType = response.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        const text = await response.text()
        console.error('Contacts API returned non-JSON response:', text)
        throw new Error(`API returned non-JSON response: ${text.substring(0, 100)}`)
      }
      
      const json = await response.json()

      // Extract contacts: { success: true, contacts: [...] }
      const contacts = (json as any)?.contacts || []

      return contacts as Array<Contact>
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!segmentId, // Only run if segmentId is provided
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('non-JSON')) return false
      if (error?.message?.includes('status 5')) return failureCount < 1
      return false
    },
  })
}