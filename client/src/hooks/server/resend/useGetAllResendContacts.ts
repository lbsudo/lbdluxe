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

const client = hcWithType(`${SERVER_URL}/resend`)

// ------------------------
// Zod schema removed for debugging
// ------------------------

export function useGetAllResendContacts() {
  return useQuery({
    queryKey: ['resend-contacts'],
    queryFn: async () => {
      const response = await client['get-resend-contacts'].$get({})
      const json = await response.json()

      // Extract contacts from nested structure: { success: true, data: { data: [...] } }
      const contacts = (json as any)?.data || []

      return contacts as Array<Contact>
    },
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.message?.includes('status 5')) return failureCount < 1
      return false
    },
  })
}
