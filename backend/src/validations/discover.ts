import { z } from 'zod';
import { AvailabilityStatus } from '@prisma/client';

export const discoverFreelancersQuerySchema = z.object({
  search: z.string().optional(),
  skill: z.string().optional(),
  availability: z.enum(AvailabilityStatus).optional(),
  sortBy: z
    .enum(['FEATURED', 'RATING', 'PRICE_LOW', 'PRICE_HIGH', 'PROJECTS'])
    .default('FEATURED')
    .optional(),
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).max(100).default(12).optional(),
});
