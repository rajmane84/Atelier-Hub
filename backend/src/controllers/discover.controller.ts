import type { Request, Response } from 'express';
import type { CreativeProfile, User, PortfolioItem } from '@prisma/client';
import { prisma } from '../util/prisma';
import { asyncHandler } from '../middlewares/asyncHandler';
import { ApiResponse } from '../util/response/ApiResponse';
import { NotFoundError } from '../util/errors/AppError';

type DiscoverProfile = CreativeProfile & {
  user: Pick<User, 'id' | 'name' | 'username' | 'image'>;
  skills: { name: string }[];
  ownedPortfolioItems: Pick<
    PortfolioItem,
    'id' | 'title' | 'coverImageUrl' | 'category'
  >[];
  reviews: { rating: number }[];
};

// rating/reviewCount are never stored — always derived from the Review
// relation at read time (see Review model comment in schema.prisma).
function computeRatingStats(reviews: { rating: number }[]) {
  if (reviews.length === 0) {
    return { rating: null as number | null, reviewCount: 0 };
  }
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return {
    rating: Math.round((sum / reviews.length) * 100) / 100,
    reviewCount: reviews.length,
  };
}

function toFreelancerDiscoverItem(profile: DiscoverProfile) {
  const { rating, reviewCount } = computeRatingStats(profile.reviews);

  return {
    id: profile.id,
    type: 'freelancer' as const,
    name: profile.user.name,
    username: profile.user.username,
    headline: profile.headline,
    bio: profile.bio,
    avatarUrl: profile.user.image,
    coverImage: profile.coverImage,
    location: profile.location,
    skills: profile.skills.map((s) => s.name),
    rateType: profile.rateType,
    rateAmount: profile.rateAmount,
    experienceYears: profile.experienceYears,
    completedProjects: profile.completedProjects,
    rating,
    reviewCount,
    isVerified: profile.isVerified,
    availability: profile.availability,
    isFeatured: profile.isFeatured,
    portfolio: profile.ownedPortfolioItems.map((p) => ({
      id: p.id,
      title: p.title,
      image: p.coverImageUrl,
      category: p.category,
    })),
    tools: profile.tools,
  };
}

const discoverProfileInclude = {
  user: {
    select: { id: true, name: true, username: true, image: true },
  },
  skills: { select: { name: true } },
  ownedPortfolioItems: {
    select: { id: true, title: true, coverImageUrl: true, category: true },
    orderBy: { createdAt: 'desc' as const },
    take: 6,
  },
  reviews: { select: { rating: true } },
};

/**
 * GET /discover/freelancers
 * Public discovery listing for individual creatives — mirrors the cult
 * discovery listing, but sorting relies on the computed rating (and price
 * needs a null-safe compare for NEGOTIABLE rateType), so filtering happens
 * in the DB but sort + pagination happen in memory after that.
 */
export const listFreelancersHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const search = req.query.search ? String(req.query.search) : undefined;
    const skill = req.query.skill ? String(req.query.skill) : undefined;
    const availability = req.query.availability
      ? String(req.query.availability)
      : undefined;
    const sortBy = req.query.sortBy ? String(req.query.sortBy) : 'FEATURED';
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 12;

    const where = {
      onboardingCompleted: true,
      user: { username: { not: null } },
      ...(search && {
        OR: [
          { headline: { contains: search, mode: 'insensitive' as const } },
          { location: { contains: search, mode: 'insensitive' as const } },
          {
            user: {
              is: {
                OR: [
                  { name: { contains: search, mode: 'insensitive' as const } },
                  {
                    username: {
                      contains: search,
                      mode: 'insensitive' as const,
                    },
                  },
                ],
              },
            },
          },
        ],
      }),
      ...(skill && {
        skills: {
          some: {
            name: { contains: skill, mode: 'insensitive' as const },
          },
        },
      }),
      ...(availability && { availability: availability as never }),
    };

    const profiles = await prisma.creativeProfile.findMany({
      where,
      include: discoverProfileInclude,
    });

    const items = profiles.map((p) =>
      toFreelancerDiscoverItem(p as unknown as DiscoverProfile)
    );

    items.sort((a, b) => {
      if (sortBy === 'FEATURED') {
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
      if (sortBy === 'RATING') {
        return (b.rating ?? 0) - (a.rating ?? 0);
      }
      if (sortBy === 'PROJECTS') {
        return b.completedProjects - a.completedProjects;
      }
      if (sortBy === 'PRICE_LOW' || sortBy === 'PRICE_HIGH') {
        // Negotiable (null) rates always sort last, regardless of direction.
        if (a.rateAmount === null && b.rateAmount === null) return 0;
        if (a.rateAmount === null) return 1;
        if (b.rateAmount === null) return -1;
        return sortBy === 'PRICE_LOW'
          ? a.rateAmount - b.rateAmount
          : b.rateAmount - a.rateAmount;
      }
      return 0;
    });

    const total = items.length;
    const paged = items.slice((page - 1) * limit, (page - 1) * limit + limit);

    return ApiResponse.paginated(
      res,
      paged,
      ApiResponse.calculatePagination(page, limit, total)
    );
  }
);

/**
 * GET /discover/freelancers/:username
 * Public freelancer profile page.
 */
export const getFreelancerByUsernameHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const username = String(req.params.username);

    const user = await prisma.user.findFirst({
      where: { username: { equals: username, mode: 'insensitive' } },
      include: {
        creativeProfile: { include: discoverProfileInclude },
      },
    });

    if (!user?.creativeProfile) {
      throw new NotFoundError('Creative not found');
    }

    const item = toFreelancerDiscoverItem({
      ...user.creativeProfile,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
      },
    } as unknown as DiscoverProfile);

    return ApiResponse.success(res, item);
  }
);
