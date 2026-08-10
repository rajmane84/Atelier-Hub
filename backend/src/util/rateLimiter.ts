import rateLimit from 'express-rate-limit';
import { ApiResponse } from './response/ApiResponse';

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    return ApiResponse.error(
      res,
      'Too many requests, please try again later',
      429
    );
  },
});

/**
 * Strict rate limiter for sending phone OTP codes.
 * Limits each authenticated user / IP to 3 requests per 15 minutes.
 */
export const otpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 3, // 3 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user?.id || req.ip || 'global-otp';
  },
  handler: (_req, res) => {
    return ApiResponse.error(
      res,
      'Too many OTP requests. Please wait 15 minutes before requesting a new verification code.',
      429
    );
  },
});

/**
 * Rate limiter for email sending operations (e.g. email verification, password reset).
 * Limits each user / IP to 5 requests per 15 minutes.
 */
export const emailRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // 5 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user?.id || req.ip || 'global-email';
  },
  handler: (_req, res) => {
    return ApiResponse.error(
      res,
      'Too many email requests. Please wait 15 minutes before requesting another verification email.',
      429
    );
  },
});
