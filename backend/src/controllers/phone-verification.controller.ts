import type { Request, Response } from 'express';
import { prisma } from '../util/prisma';
import { asyncHandler } from '../middlewares/asyncHandler';
import { BadRequestError } from '../util/errors/AppError';
import { ApiResponse } from '../util/response/ApiResponse';
import { smsService } from '../services/sms.service';
import { hashOtp, verifyOtpHash } from '../util/crypto';

export const handleSendPhoneOtp = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { phoneNumber } = req.body;

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (clientProfile?.phoneVerified) {
      throw new BadRequestError(
        'Your phone number is already verified and cannot be changed.'
      );
    }

    // 1. Cooldown check: prevent requesting a code within 30 seconds
    const existing = await prisma.phoneVerification.findFirst({
      where: {
        userId,
        phoneNumber,
        createdAt: {
          gte: new Date(Date.now() - 30 * 1000),
        },
      },
    });

    if (existing) {
      throw new BadRequestError(
        'Please wait 30 seconds before requesting another verification code.'
      );
    }

    // 2. Daily limit check: max 5 OTP requests per user per 24 hours
    const MAX_DAILY_OTP_REQUESTS = 5;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const dailyCount = await prisma.phoneVerification.count({
      where: {
        userId,
        createdAt: {
          gte: twentyFourHoursAgo,
        },
      },
    });

    if (dailyCount >= MAX_DAILY_OTP_REQUESTS) {
      throw new BadRequestError(
        `You have reached the maximum limit of ${MAX_DAILY_OTP_REQUESTS} OTP requests in 24 hours. Please try again tomorrow.`
      );
    }

    // Generate 6-digit numeric OTP and hash it before database storage
    const plainOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtpCode = hashOtp(plainOtpCode);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await prisma.phoneVerification.create({
      data: {
        userId,
        phoneNumber,
        otpCode: hashedOtpCode,
        expiresAt,
      },
    });

    // Send SMS via AWS SNS (pass plainOtpCode for SMS / dev console logging)
    const message = `Your Atelier Hub verification code is: ${plainOtpCode}. Valid for 10 minutes.`;
    await smsService.sendSms(phoneNumber, message, plainOtpCode);

    return ApiResponse.success(
      res,
      { phoneNumber },
      'Verification code sent successfully'
    );
  }
);

export const handleVerifyPhoneOtp = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { phoneNumber, otpCode } = req.body;

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (clientProfile?.phoneVerified) {
      throw new BadRequestError(
        'Your phone number is already verified and cannot be changed.'
      );
    }

    const record = await prisma.phoneVerification.findFirst({
      where: {
        userId,
        phoneNumber,
        verified: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new BadRequestError(
        'No active verification code found. Please request a new code.'
      );
    }

    if (record.expiresAt < new Date()) {
      throw new BadRequestError(
        'Verification code has expired. Please request a new code.'
      );
    }

    if (record.attempts >= 5) {
      throw new BadRequestError(
        'Too many failed attempts. Please request a new code.'
      );
    }

    // Verify incoming OTP against stored SHA-256 hash
    const isValidOtp = verifyOtpHash(otpCode, record.otpCode);

    if (!isValidOtp) {
      await prisma.phoneVerification.update({
        where: { id: record.id },
        data: { attempts: record.attempts + 1 },
      });
      throw new BadRequestError('Invalid verification code.');
    }

    // Delete all OTP verification records for this user upon successful verification
    await prisma.phoneVerification.deleteMany({
      where: { userId },
    });

    // Update ClientProfile phone number and phoneVerified = true
    await prisma.clientProfile.update({
      where: { userId },
      data: {
        phoneNumber,
        phoneVerified: true,
      },
    });

    return ApiResponse.success(
      res,
      {
        phoneNumber,
        phoneVerified: true,
      },
      'Phone number verified successfully'
    );
  }
);
