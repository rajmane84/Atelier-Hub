import { z } from 'zod';

export const sendPhoneOtpSchema = z.object({
  phoneNumber: z
    .string('Phone number is required')
    .min(5, 'Phone number must be at least 5 characters')
    .max(25, 'Phone number must be at most 25 characters'),
});

export const verifyPhoneOtpSchema = z.object({
  phoneNumber: z
    .string('Phone number is required')
    .min(5, 'Phone number must be at least 5 characters')
    .max(25, 'Phone number must be at most 25 characters'),
  otpCode: z
    .string('OTP code is required')
    .length(6, 'OTP code must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP code must contain only digits'),
});

export type SendPhoneOtpInput = z.infer<typeof sendPhoneOtpSchema>;
export type VerifyPhoneOtpInput = z.infer<typeof verifyPhoneOtpSchema>;
