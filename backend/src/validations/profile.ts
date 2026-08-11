import { z } from 'zod';
import {
  AvailabilityStatus,
  SkillLevel,
  Degree,
  EmploymentType,
  RateType,
} from '@prisma/client';

export const updateProfileSchema = z
  .object({
    headline: z.string('Headline is required').optional(),
    bio: z.string('Bio is required').optional(),
    availability: z
      .enum(AvailabilityStatus, {
        error: (issue) =>
          issue.input === undefined
            ? 'Availability is required'
            : 'Invalid availability status. Must be one of: AVAILABLE, BUSY, NOT_AVAILABLE',
      })
      .optional(),
    rateType: z.enum(RateType).nullable().optional(),
    rateAmount: z
      .number('Rate amount must be a number')
      .int()
      .positive('Rate amount must be greater than 0')
      .nullable()
      .optional(),
    experienceYears: z
      .number('Experience years must be a number')
      .int()
      .min(0)
      .max(60)
      .nullable()
      .optional(),
    tools: z.array(z.string().min(1).max(60)).max(30).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.rateType === 'NEGOTIABLE' && data.rateAmount) {
      ctx.addIssue({
        code: 'custom',
        message: 'rateAmount must not be set when rateType is NEGOTIABLE',
        path: ['rateAmount'],
      });
    }
  });

export const setLocationSchema = z.object({
  location: z
    .string('Location is required')
    .min(1, 'Location is required')
    .max(100, 'Location must be at most 100 characters'),
});

export const updateSkillsSchema = z.object({
  skills: z
    .array(
      z.object({
        name: z
          .string('Skill name is required')
          .min(2, 'Skill name must be at least 2 characters'),
        expertise: z
          .enum(SkillLevel, {
            error: (issue) =>
              issue.input === undefined
                ? 'Skill level is required'
                : 'Invalid skill level. Must be one of: BEGINNER, INTERMEDIATE, EXPERT',
          })
          .optional(),
      })
    )
    .min(1, 'At least one skill is required'),
});

export const updateAvailabilitySchema = z.object({
  availability: z.enum(AvailabilityStatus, {
    error: (issue) =>
      issue.input === undefined
        ? 'Availability status is required'
        : 'Invalid availability status. Must be one of: AVAILABLE, BUSY, NOT_AVAILABLE',
  }),
});

export const updateEducationSchema = z.object({
  education: z.array(
    z.object({
      school: z
        .string('School / University is required')
        .min(2, 'School name must be at least 2 characters'),
      degree: z.enum(Degree, {
        error: (issue) =>
          issue.input === undefined ? 'Degree is required' : 'Invalid degree',
      }),
      fieldOfStudy: z
        .string('Field of study is required')
        .min(2, 'Field of study must be at least 2 characters'),
      country: z
        .string('Country is required')
        .min(2, 'Country must be at least 2 characters'),
      yearOfGraduation: z
        .string('Graduation year is required')
        .regex(/^(19|20)\d{2}$/, 'Enter a valid 4-digit graduation year'),
    })
  ),
});

export const updateExperienceSchema = z.object({
  experiences: z.array(
    z.object({
      title: z
        .string('Title is required')
        .min(2, 'Title must be at least 2 characters'),
      employmentType: z.enum(EmploymentType, {
        error: (issue) =>
          issue.input === undefined
            ? 'Employment type is required'
            : 'Invalid employment type',
      }),
      companyName: z.string().optional(),
      industry: z.string().optional(),
      startDate: z.coerce.date('Start date is required'),
      endDate: z.coerce.date().optional(),
      currentlyWorking: z.boolean().default(false),
      description: z.string().optional(),
      skills: z.array(z.string()).default([]),
    })
  ),
});
