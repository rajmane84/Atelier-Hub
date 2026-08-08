import { z } from 'zod';

export const savedQuerySchema = z.object({
  search: z.string().optional(),
  type: z.enum(['ALL', 'CREATIVE', 'CULT']).optional().default('ALL'),
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).max(100).default(20).optional(),
});

export const savedCreativeParamsSchema = z.object({
  creativeProfileId: z.string().min(1, 'Creative profile ID is required'),
});

export const savedCultParamsSchema = z.object({
  cultId: z.string().min(1, 'Cult ID is required'),
});
