import type { Request, Response } from 'express';
import { prisma } from '../util/prisma';
import { asyncHandler } from '../middlewares/asyncHandler';
import { BadRequestError, NotFoundError } from '../util/errors/AppError';
import { ApiResponse } from '../util/response/ApiResponse';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  getPublicIdFromUrl,
} from '../util/cloudinary';
import { getLocationFromRequest } from '../util/geolocation';
import { getClientStats } from '../services/client-profile.service';

export const handleGetClientProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Selecting the CLIENT role creates this row (see handleUpdateUserRole),
    // but upsert here too so any user who already had the role before that
    // wiring existed still gets a profile on their first fetch.
    let clientProfile = await prisma.clientProfile.upsert({
      where: { userId },
      create: {
        userId,
        location: getLocationFromRequest(req),
        onboardingCompleted: true,
      },
      update: {},
    });

    if (!clientProfile.location) {
      const detectedLocation = getLocationFromRequest(req);
      if (detectedLocation) {
        clientProfile = await prisma.clientProfile.update({
          where: { id: clientProfile.id },
          data: { location: detectedLocation },
        });
      }
    }

    // Company-only fields (companyName, industry, companySize, foundedYear)
    // don't apply to individual clients, so they'd never be able to reach
    // 100% otherwise - only include those steps when clientType is COMPANY.
    const completionSteps =
      clientProfile.clientType === 'COMPANY'
        ? {
            basics: Boolean(clientProfile.companyName),
            details: Boolean(
              clientProfile.industry &&
              clientProfile.companySize &&
              clientProfile.foundedYear
            ),
            bio: Boolean(clientProfile.bio),
            contact: Boolean(
              clientProfile.phoneNumber && clientProfile.website
            ),
            location: Boolean(clientProfile.location),
            isEmailVerified: Boolean(user.emailVerified),
            isMobileVerified: Boolean(clientProfile.phoneVerified),
          }
        : {
            bio: Boolean(clientProfile.bio),
            phoneNumber: Boolean(clientProfile.phoneNumber),
            website: Boolean(clientProfile.website),
            location: Boolean(clientProfile.location),
            isEmailVerified: Boolean(user.emailVerified),
            isMobileVerified: Boolean(clientProfile.phoneVerified),
          };
    const totalSteps = Object.keys(completionSteps).length;
    const completedSteps =
      Object.values(completionSteps).filter(Boolean).length;

    return ApiResponse.success(
      res,
      {
        user,
        clientProfile,
        completion: {
          steps: completionSteps,
          completedSteps,
          totalSteps,
          percentage: Math.round((completedSteps / totalSteps) * 100),
        },
      },
      'Profile retrieved successfully'
    );
  }
);

export const handleUpdateClientProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const {
      clientType,
      companyName,
      industry,
      companySize,
      foundedYear,
      bio,
      website,
      phoneNumber,
      location,
    } = req.body;

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (!clientProfile) {
      throw new NotFoundError('Client profile not found');
    }

    const updatedProfile = await prisma.clientProfile.update({
      where: { id: clientProfile.id },
      data: {
        clientType: clientType !== undefined ? clientType : undefined,
        companyName: companyName !== undefined ? companyName : undefined,
        industry: industry !== undefined ? industry : undefined,
        companySize: companySize !== undefined ? companySize : undefined,
        foundedYear: foundedYear !== undefined ? foundedYear : undefined,
        bio: bio !== undefined ? bio : undefined,
        website: website !== undefined ? website : undefined,
        phoneNumber: phoneNumber !== undefined ? phoneNumber : undefined,
        location: location !== undefined ? location : undefined,
      },
    });

    return ApiResponse.success(
      res,
      updatedProfile,
      'Profile updated successfully'
    );
  }
);

export const handleUpdateClientCoverImage = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;

    if (!req.file) {
      throw new BadRequestError('No file uploaded');
    }

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (!clientProfile) {
      throw new NotFoundError('Client profile not found');
    }

    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      'cover-images',
      'image'
    );

    if (
      clientProfile.coverImage &&
      clientProfile.coverImage.includes('cloudinary')
    ) {
      try {
        const oldPublicId = getPublicIdFromUrl(clientProfile.coverImage);
        await deleteFromCloudinary(oldPublicId, 'image');
      } catch (error) {
        console.error('Failed to delete previous cover image:', error);
      }
    }

    const updatedProfile = await prisma.clientProfile.update({
      where: { id: clientProfile.id },
      data: { coverImage: uploadResult.url },
    });

    return ApiResponse.success(
      res,
      updatedProfile,
      'Cover image updated successfully'
    );
  }
);

export const handleGetClientStats = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const stats = await getClientStats(userId);
    return ApiResponse.success(
      res,
      stats,
      'Client stats retrieved successfully'
    );
  }
);
