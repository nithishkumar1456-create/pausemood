import { z } from 'zod';

export const createCheckinSchema = z.object({
  mood: z
    .number({ required_error: 'Mood is required' })
    .int('Mood must be an integer')
    .min(1, 'Mood must be between 1 and 5')
    .max(5, 'Mood must be between 1 and 5'),
  note: z
    .string()
    .trim()
    .max(200, 'Note must not exceed 200 characters')
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val ?? null)),
  tag: z
    .string()
    .trim()
    .max(40, 'Tag must not exceed 40 characters')
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val ?? null)),
});

export const updateCheckinSchema = z.object({
  tag: z
    .string()
    .trim()
    .max(40, 'Tag must not exceed 40 characters')
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val ?? null)),
});

export const checkinIdParamSchema = z.object({
  id: z.string().uuid('Invalid check-in ID format (must be UUID)'),
});

export const checkinQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 50))
    .pipe(z.number().int().min(1).max(100)),
  mood: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .pipe(z.number().int().min(1).max(5).optional()),
});

