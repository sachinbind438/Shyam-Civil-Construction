import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .max(255, 'Email too long')
    .email('Invalid email format')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .max(128, 'Password too long'),
})

export type LoginInput = z.infer<typeof loginSchema>
