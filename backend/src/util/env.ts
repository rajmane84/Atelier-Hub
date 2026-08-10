import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),

  // Better Auth
  BETTER_AUTH_URL: z.string().url('BETTER_AUTH_URL must be a valid URL'),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, 'BETTER_AUTH_SECRET must be at least 32 characters'),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),

  // Email Configuration
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default('Atelier-Hub <onboarding@resend.dev>'),

  // SMTP Configuration (for Nodemailer development)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_SECURE: z
    .string()
    .optional()
    .transform((val) => val === 'true'),

  // Server
  PORT: z.string().default('3000').transform(Number),
  NODE_ENV: z.string().default('development'),

  // CORS
  CORS_ORIGINS: z
    .string()
    .min(1, 'CORS_ORIGINS is required')
    .transform((val) => {
      return val
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
    }),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),

  // OpenRouter
  OPENROUTER_API_KEY: z.string().optional(),

  // Feature Flags
  RESUME_UPLOAD_ENABLED: z
    .string()
    .default('false')
    .transform((val) => val.toLowerCase() === 'true'),

  // AWS SNS Configuration for SMS Verification
  AWS_REGION: z.string().default('us-east-1'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
