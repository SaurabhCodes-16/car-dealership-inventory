import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters long').max(100),
  email: z.string().trim().toLowerCase().email('Please provide a valid email address').max(255),
  password: z.string().min(6, 'Password must be at least 6 characters long').max(128),
  role: z.enum(['admin', 'customer']).optional().default('customer')
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password cannot be empty')
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
