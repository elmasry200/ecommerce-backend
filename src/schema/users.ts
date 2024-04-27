import { z } from 'zod'

export const SignUpSchema = z.object({
    email: z.string().email().nullable(),
    phone: z.string().min(10).nullable(),
    name: z.string(),
    password: z.string().min(6)
})