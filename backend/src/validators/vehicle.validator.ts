import { z } from 'zod';

export const vehicleCreateSchema = z.object({
  make: z.string().trim().min(1, 'Make is required').max(50),
  model: z.string().trim().min(1, 'Model is required').max(50),
  category: z.string().trim().min(1, 'Category is required'),
  price: z.number().nonnegative('Price must be greater than or equal to 0'),
  quantity: z.number().int('Quantity must be an integer').nonnegative('Quantity must be greater than or equal to 0'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 2).optional(),
  vin: z.string().trim().optional(),
  mileage: z.number().nonnegative().optional(),
  fuelType: z.string().trim().optional(),
  transmission: z.string().trim().optional(),
  imageUrl: z.string().trim().url('Must be a valid URL').optional().or(z.literal('')),
  description: z.string().trim().max(1000).optional()
});

export const vehicleUpdateSchema = vehicleCreateSchema.partial();

export const restockSchema = z.object({
  quantity: z.number().int('Restock quantity must be an integer').positive('Restock quantity must be greater than zero')
});
