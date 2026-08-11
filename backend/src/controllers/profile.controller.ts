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

export const handleGetProfile = asyncHandler(
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

    let creativeProfile = await prisma.creativeProfile.findUnique({
      where: { userId },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
        experiences: true,
        education: true,
        _count: {
          select: { ownedPortfolioItems: true },
        },
      },
    });

    if (!creativeProfile) {
      throw new NotFoundError('Creative profile not found');
    }

    // Location detection can fail during onboarding (e.g. unresolvable IP) -
    // retry here since it's a cheap lookup, so it self-heals on a later request.
    if (!creativeProfile.location) {
      const detectedLocation = getLocationFromRequest(req);
      if (detectedLocation) {
        creativeProfile = await prisma.creativeProfile.update({
          where: { id: creativeProfile.id },
          data: { location: detectedLocation },
          include: {
            skills: {
              include: {
                skill: true,
              },
            },
            experiences: true,
            education: true,
            _count: {
              select: { ownedPortfolioItems: true },
            },
          },
        });
      }
    }

    const completionSteps = {
      about: Boolean(creativeProfile.headline && creativeProfile.bio),
      skills: creativeProfile.skills.length > 0,
      experience: creativeProfile.experiences.length > 0,
      education: creativeProfile.education.length > 0,
      portfolio: creativeProfile._count.ownedPortfolioItems > 0,
    };
    const totalSteps = Object.keys(completionSteps).length;
    const completedSteps =
      Object.values(completionSteps).filter(Boolean).length;

    return ApiResponse.success(
      res,
      {
        user,
        creativeProfile,
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

export const handleUpdateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const {
      headline,
      bio,
      availability,
      rateType,
      rateAmount,
      experienceYears,
      tools,
    } = req.body;

    const creativeProfile = await prisma.creativeProfile.findUnique({
      where: { userId },
    });

    if (!creativeProfile) {
      throw new NotFoundError('Creative profile not found');
    }

    const updatedProfile = await prisma.creativeProfile.update({
      where: { id: creativeProfile.id },
      data: {
        headline: headline !== undefined ? headline : creativeProfile.headline,
        bio: bio !== undefined ? bio : creativeProfile.bio,
        availability:
          availability !== undefined
            ? availability
            : creativeProfile.availability,
        rateType: rateType !== undefined ? rateType : creativeProfile.rateType,
        // Explicit NEGOTIABLE clears any previously set amount.
        rateAmount:
          rateType === 'NEGOTIABLE'
            ? null
            : rateAmount !== undefined
              ? rateAmount
              : creativeProfile.rateAmount,
        experienceYears:
          experienceYears !== undefined
            ? experienceYears
            : creativeProfile.experienceYears,
        tools: tools !== undefined ? tools : creativeProfile.tools,
      },
    });

    return ApiResponse.success(
      res,
      updatedProfile,
      'Profile updated successfully'
    );
  }
);

// One-time fallback for when IP-based detection never resolved a location.
// Only usable while location is unset - once set, it can never be changed again.
export const handleSetLocation = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { location } = req.body;

    const creativeProfile = await prisma.creativeProfile.findUnique({
      where: { userId },
    });

    if (!creativeProfile) {
      throw new NotFoundError('Creative profile not found');
    }

    if (creativeProfile.location) {
      throw new BadRequestError(
        'Location is already set and cannot be changed'
      );
    }

    const updatedProfile = await prisma.creativeProfile.update({
      where: { id: creativeProfile.id },
      data: { location },
    });

    return ApiResponse.success(
      res,
      updatedProfile,
      'Location set successfully'
    );
  }
);

export const handleUpdateAvatar = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;

    if (!req.file) {
      throw new BadRequestError('No file uploaded');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      'avatars',
      'image'
    );

    if (user.image && user.image.includes('cloudinary')) {
      try {
        const oldPublicId = getPublicIdFromUrl(user.image);
        await deleteFromCloudinary(oldPublicId, 'image');
      } catch (error) {
        console.error('Failed to delete previous avatar:', error);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { image: uploadResult.url },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        username: true,
      },
    });

    return ApiResponse.success(res, updatedUser, 'Avatar updated successfully');
  }
);

export const handleUpdateCoverImage = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;

    if (!req.file) {
      throw new BadRequestError('No file uploaded');
    }

    const creativeProfile = await prisma.creativeProfile.findUnique({
      where: { userId },
    });

    if (!creativeProfile) {
      throw new NotFoundError('Creative profile not found');
    }

    const uploadResult = await uploadToCloudinary(
      req.file.buffer,
      'cover-images',
      'image'
    );

    if (
      creativeProfile.coverImage &&
      creativeProfile.coverImage.includes('cloudinary')
    ) {
      try {
        const oldPublicId = getPublicIdFromUrl(creativeProfile.coverImage);
        await deleteFromCloudinary(oldPublicId, 'image');
      } catch (error) {
        console.error('Failed to delete previous cover image:', error);
      }
    }

    const updatedProfile = await prisma.creativeProfile.update({
      where: { id: creativeProfile.id },
      data: { coverImage: uploadResult.url },
    });

    return ApiResponse.success(
      res,
      updatedProfile,
      'Cover image updated successfully'
    );
  }
);

export const handleUpdateSkills = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { skills } = req.body;

    const creativeProfile = await prisma.creativeProfile.findUnique({
      where: { userId },
    });

    if (!creativeProfile) {
      throw new NotFoundError('Creative profile not found');
    }

    // Delete existing skills for this profile to avoid duplicates
    await prisma.creativeSkill.deleteMany({
      where: { creativeProfileId: creativeProfile.id },
    });

    // Process each skill
    for (const skillInput of skills) {
      if (!skillInput.name || skillInput.name.trim().length < 2) {
        continue; // Skip invalid skills
      }

      const skillName = skillInput.name.trim();
      const skillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT' =
        skillInput.expertise || 'INTERMEDIATE';

      // Check if skill exists in the Skill table (case-insensitive check)
      const existingSkill = await prisma.skill.findFirst({
        where: {
          name: {
            equals: skillName,
            mode: 'insensitive',
          },
        },
      });

      let skill;
      if (existingSkill) {
        skill = existingSkill;
      } else {
        // Create slug from skill name
        const slug = skillName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        skill = await prisma.skill.create({
          data: {
            name: skillName,
            slug,
          },
        });
      }

      // Create CreativeSkill record connecting profile to skill
      await prisma.creativeSkill.create({
        data: {
          creativeProfileId: creativeProfile.id,
          skillId: skill.id,
          level: skillLevel,
          name: skill.name,
        },
      });
    }

    // Fetch updated profile with skills
    const updatedProfile = await prisma.creativeProfile.findUnique({
      where: { id: creativeProfile.id },
      include: {
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    return ApiResponse.success(
      res,
      updatedProfile,
      'Skills updated successfully'
    );
  }
);

export const handleUpdateAvailability = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { availability } = req.body;

    const creativeProfile = await prisma.creativeProfile.findUnique({
      where: { userId },
    });

    if (!creativeProfile) {
      throw new NotFoundError('Creative profile not found');
    }

    const updatedProfile = await prisma.creativeProfile.update({
      where: { id: creativeProfile.id },
      data: {
        availability,
      },
    });

    return ApiResponse.success(
      res,
      updatedProfile,
      'Availability status updated successfully'
    );
  }
);

export const handleUpdateEducation = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { education } = req.body;

    const creativeProfile = await prisma.creativeProfile.findUnique({
      where: { userId },
    });

    if (!creativeProfile) {
      throw new NotFoundError('Creative profile not found');
    }

    await prisma.$transaction([
      prisma.education.deleteMany({
        where: { creativeProfileId: creativeProfile.id },
      }),
      prisma.education.createMany({
        data: education.map(
          (edu: {
            school: string;
            degree: string;
            fieldOfStudy: string;
            country: string;
            yearOfGraduation: string;
          }) => ({
            ...edu,
            creativeProfileId: creativeProfile.id,
          })
        ),
      }),
    ]);

    const updatedProfile = await prisma.creativeProfile.findUnique({
      where: { id: creativeProfile.id },
      include: { education: true },
    });

    return ApiResponse.success(
      res,
      updatedProfile,
      'Education updated successfully'
    );
  }
);

export const handleUpdateExperience = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { experiences } = req.body;

    const creativeProfile = await prisma.creativeProfile.findUnique({
      where: { userId },
    });

    if (!creativeProfile) {
      throw new NotFoundError('Creative profile not found');
    }

    await prisma.$transaction([
      prisma.experience.deleteMany({
        where: { creativeProfileId: creativeProfile.id },
      }),
      prisma.experience.createMany({
        data: experiences.map(
          (exp: {
            title: string;
            employmentType: string;
            companyName?: string;
            industry?: string;
            startDate: Date;
            endDate?: Date;
            currentlyWorking: boolean;
            description?: string;
            skills: string[];
          }) => ({
            ...exp,
            creativeProfileId: creativeProfile.id,
          })
        ),
      }),
    ]);

    const updatedProfile = await prisma.creativeProfile.findUnique({
      where: { id: creativeProfile.id },
      include: { experiences: true },
    });

    return ApiResponse.success(
      res,
      updatedProfile,
      'Experience updated successfully'
    );
  }
);
