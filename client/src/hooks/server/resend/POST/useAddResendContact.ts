// client/hooks/resend/useAddResendContact.ts
import { useMutation } from '@tanstack/react-query'
import { hcWithType, type Client } from "server/client"
import { z } from 'zod'

// Detect production
const isProd = import.meta.env.PROD

// Use absolute URL ONLY in production
const SERVER_URL = isProd
  ? import.meta.env.VITE_SERVER_URL
  : 'http://localhost:8787'

// Typed Hono client
const client: Client = hcWithType(`${SERVER_URL}/resend`)

// Runtime validation schema for API response
const addContactResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      id: z.string(),
      object: z.string(),
    })
    .optional(),
  error: z.string().optional(),
})

// Input type for the hook (audienceId handled by middleware)
export type AddContactInput = {
  email: string
  firstName?: string
  lastName?: string
  unsubscribed?: boolean
}

export function useAddResendContact() {
  return useMutation({
    mutationFn: async (input: AddContactInput) => {
      const res = await (client as any)['add-resend-contact'].$post({
        json: input,
      })

      const data = await res.json()
      const validated = addContactResponseSchema.parse(data)

      if (!validated.success) {
        throw new Error(validated.error ?? 'Failed to add contact')
      }

      return validated
    },
  })
}
