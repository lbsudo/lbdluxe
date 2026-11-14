import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { hcWithType, type Client } from "server/client"

// Detect production
const isProd = import.meta.env.PROD

// Use absolute URL ONLY in production
const SERVER_URL = isProd
  ? import.meta.env.VITE_SERVER_URL
  : 'http://localhost:8787'

// Typed Hono client
const client: Client = hcWithType(`${SERVER_URL}/resend`)

// Runtime validation schema for API response
const addProgramContactResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      id: z.string(),
      object: z.string(),
    })
    .optional(),
  error: z.string().optional(),
})

/**
 * Free-program download signup. `program` is the program slug, which the
 * server uses to tag the contact and to file them in the right segment.
 */
export type AddProgramContactInput = {
  email: string
  firstName?: string
  lastName?: string
  program: string
}

export function useAddProgramContact() {
  return useMutation({
    mutationFn: async (input: AddProgramContactInput) => {
      const res = await (client as any)['add-program-contact'].$post({
        json: input,
      })

      const data = await res.json()
      const validated = addProgramContactResponseSchema.parse(data)

      if (!validated.success) {
        throw new Error(validated.error ?? 'Failed to save the contact')
      }

      return validated
    },
  })
}
