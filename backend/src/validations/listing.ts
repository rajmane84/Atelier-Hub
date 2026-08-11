import { z } from 'zod';
import {
  ListingStatus,
  LocationType,
  RateType,
  EmploymentType,
  Currency,
} from '@prisma/client';

export const createListingObject = z.object({
  title: z
    .string('Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be at most 100 characters'),
  description: z
    .string('Description is required')
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be at most 2000 characters'),
  status: z
    .enum(ListingStatus, {
      error: () => 'Invalid listing status',
    })
    .optional(),
  locationType: z
    .enum(LocationType, {
      error: () => 'Invalid location type',
    })
    .optional(),
  location: z
    .string('Location is required')
    .max(100, 'Location must be at most 100 characters')
    .optional(),
  budgetMin: z
    .number('Budget minimum must be a number')
    .int('Budget minimum must be a whole number')
    .positive('Budget minimum must be positive')
    .optional(),
  budgetMax: z
    .number('Budget maximum must be a number')
    .int('Budget maximum must be a whole number')
    .positive('Budget maximum must be positive')
    .optional(),
  rateType: z
    .enum(RateType, {
      error: () => 'Invalid rate type',
    })
    .optional(),
  currency: z
    .enum(Currency, {
      error: () => 'Invalid currency',
    })
    .optional(),
  employmentType: z
    .enum(EmploymentType, {
      error: () => 'Invalid employment type',
    })
    .optional(),
  skills: z
    .array(z.string('Skill must be a string'))
    .min(1, 'At least one skill is required')
    .max(20, 'Maximum 20 skills allowed')
    .optional(),
  deadline: z
    .string('Deadline must be a valid date')
    .datetime('Deadline must be a valid ISO date')
    .optional()
    .or(z.literal('')),
  startDate: z
    .string('Start date must be a valid date')
    .datetime('Start date must be a valid ISO date')
    .optional()
    .or(z.literal('')),
  duration: z
    .string('Duration is required')
    .max(50, 'Duration must be at most 50 characters')
    .optional(),
});

export const createListingSchema = createListingObject
  .refine(
    (data) => {
      // If budgetMin is provided, budgetMax must be greater than or equal to budgetMin
      if (data.budgetMin !== undefined && data.budgetMax !== undefined) {
        return data.budgetMax >= data.budgetMin;
      }
      return true;
    },
    {
      message: 'Budget maximum must be greater than or equal to budget minimum',
      path: ['budgetMax'],
    }
  )
  .refine(
    (data) => {
      if (data.startDate) {
        const start = new Date(data.startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (start < today) {
          return false;
        }
      }
      return true;
    },
    {
      message: 'Start date must be today or a future date',
      path: ['startDate'],
    }
  )
  .refine(
    (data) => {
      if (data.deadline) {
        const dline = new Date(data.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dline < today) {
          return false;
        }
      }
      return true;
    },
    {
      message: 'Application deadline must be today or a future date',
      path: ['deadline'],
    }
  )
  .refine(
    (data) => {
      if (data.startDate && data.deadline) {
        const start = new Date(data.startDate);
        const dline = new Date(data.deadline);
        if (dline > start) {
          return false;
        }
      }
      return true;
    },
    {
      message: 'Application deadline cannot be after the start date',
      path: ['deadline'],
    }
  );

export const updateListingSchema = createListingObject
  .partial()
  .refine(
    (data) => {
      if (data.budgetMin !== undefined && data.budgetMax !== undefined) {
        return data.budgetMax >= data.budgetMin;
      }
      return true;
    },
    {
      message: 'Budget maximum must be greater than or equal to budget minimum',
      path: ['budgetMax'],
    }
  )
  .refine(
    (data) => {
      if (data.startDate) {
        const start = new Date(data.startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (start < today) {
          return false;
        }
      }
      return true;
    },
    {
      message: 'Start date must be today or a future date',
      path: ['startDate'],
    }
  )
  .refine(
    (data) => {
      if (data.deadline) {
        const dline = new Date(data.deadline);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dline < today) {
          return false;
        }
      }
      return true;
    },
    {
      message: 'Application deadline must be today or a future date',
      path: ['deadline'],
    }
  )
  .refine(
    (data) => {
      if (data.startDate && data.deadline) {
        const start = new Date(data.startDate);
        const dline = new Date(data.deadline);
        if (dline > start) {
          return false;
        }
      }
      return true;
    },
    {
      message: 'Application deadline cannot be after the start date',
      path: ['deadline'],
    }
  );

export const listingQuerySchema = z.object({
  status: z
    .enum(ListingStatus, {
      error: () => 'Invalid listing status',
    })
    .optional(),
  page: z
    .string('Page must be a number')
    .transform((val) => parseInt(val, 10))
    .optional(),
  limit: z
    .string('Limit must be a number')
    .transform((val) => parseInt(val, 10))
    .optional(),
});
