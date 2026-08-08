import { prisma } from '../util/prisma';
import { NotFoundError } from '../util/errors/AppError';
import type {
  SavedItemResponse,
  SavedItemsListResponse,
  SavedIdsResponse,
  SavedItemType,
} from '../types/saved';

function computeRatingStats(reviews: { rating: number }[]) {
  if (!reviews || reviews.length === 0) {
    return { rating: null as number | null, reviewCount: 0 };
  }
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return {
    rating: Math.round((sum / reviews.length) * 100) / 100,
    reviewCount: reviews.length,
  };
}

export const saveCreative = async (
  userId: string,
  creativeProfileId: string
) => {
  const creativeProfile = await prisma.creativeProfile.findUnique({
    where: { id: creativeProfileId },
  });

  if (!creativeProfile) {
    throw new NotFoundError('Creative profile not found');
  }

  const db = prisma as any;
  const saved = await db.savedCreative.upsert({
    where: {
      userId_creativeProfileId: {
        userId,
        creativeProfileId,
      },
    },
    create: {
      userId,
      creativeProfileId,
    },
    update: {},
  });

  return saved;
};

export const unsaveCreative = async (
  userId: string,
  creativeProfileId: string
) => {
  const db = prisma as any;
  try {
    await db.savedCreative.delete({
      where: {
        userId_creativeProfileId: {
          userId,
          creativeProfileId,
        },
      },
    });
  } catch {
    // Ignore error if already not saved
  }
  return { success: true };
};

export const toggleSaveCreative = async (
  userId: string,
  creativeProfileId: string
) => {
  const creativeProfile = await prisma.creativeProfile.findUnique({
    where: { id: creativeProfileId },
  });

  if (!creativeProfile) {
    throw new NotFoundError('Creative profile not found');
  }

  const db = prisma as any;
  const existing = await db.savedCreative.findUnique({
    where: {
      userId_creativeProfileId: {
        userId,
        creativeProfileId,
      },
    },
  });

  if (existing) {
    await db.savedCreative.delete({
      where: {
        id: existing.id,
      },
    });
    return { isSaved: false };
  } else {
    await db.savedCreative.create({
      data: {
        userId,
        creativeProfileId,
      },
    });
    return { isSaved: true };
  }
};

export const saveCult = async (userId: string, cultId: string) => {
  const cult = await prisma.cult.findUnique({
    where: { id: cultId },
  });

  if (!cult) {
    throw new NotFoundError('Cult not found');
  }

  const db = prisma as any;
  const saved = await db.savedCult.upsert({
    where: {
      userId_cultId: {
        userId,
        cultId,
      },
    },
    create: {
      userId,
      cultId,
    },
    update: {},
  });

  return saved;
};

export const unsaveCult = async (userId: string, cultId: string) => {
  const db = prisma as any;
  try {
    await db.savedCult.delete({
      where: {
        userId_cultId: {
          userId,
          cultId,
        },
      },
    });
  } catch {
    // Ignore error if already not saved
  }
  return { success: true };
};

export const toggleSaveCult = async (userId: string, cultId: string) => {
  const cult = await prisma.cult.findUnique({
    where: { id: cultId },
  });

  if (!cult) {
    throw new NotFoundError('Cult not found');
  }

  const db = prisma as any;
  const existing = await db.savedCult.findUnique({
    where: {
      userId_cultId: {
        userId,
        cultId,
      },
    },
  });

  if (existing) {
    await db.savedCult.delete({
      where: {
        id: existing.id,
      },
    });
    return { isSaved: false };
  } else {
    await db.savedCult.create({
      data: {
        userId,
        cultId,
      },
    });
    return { isSaved: true };
  }
};

export const getSavedIds = async (
  userId: string
): Promise<SavedIdsResponse> => {
  const db = prisma as any;
  const [savedCreatives, savedCults] = await Promise.all([
    db.savedCreative.findMany({
      where: { userId },
      select: { creativeProfileId: true },
    }),
    db.savedCult.findMany({
      where: { userId },
      select: { cultId: true },
    }),
  ]);

  return {
    creativeIds: savedCreatives.map((s: any) => s.creativeProfileId),
    cultIds: savedCults.map((s: any) => s.cultId),
  };
};

export const getSavedItems = async (
  userId: string,
  options: {
    type?: SavedItemType;
    search?: string;
    page?: number;
    limit?: number;
  }
): Promise<SavedItemsListResponse> => {
  const db = prisma;
  const type = options.type || 'ALL';
  const search = options.search ? options.search.toLowerCase().trim() : '';
  const page = options.page || 1;
  const limit = options.limit || 20;

  const [savedCreativesCount, savedCultsCount] = await Promise.all([
    db.savedCreative.count({ where: { userId } }),
    db.savedCult.count({ where: { userId } }),
  ]);

  let creativeItems: SavedItemResponse[] = [];
  let cultItems: SavedItemResponse[] = [];

  if (type === 'ALL' || type === 'CREATIVE') {
    const rawSavedCreatives = await db.savedCreative.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        creativeProfile: {
          include: {
            user: {
              select: { id: true, name: true, username: true, image: true },
            },
            skills: { select: { name: true } },
            ownedPortfolioItems: {
              select: { id: true, title: true, coverImageUrl: true },
              orderBy: { createdAt: 'desc' },
              take: 3,
            },
            reviews: { select: { rating: true } },
          },
        },
      },
    });

    creativeItems = rawSavedCreatives
      .filter((sc) => Boolean(sc.creativeProfile))
      .map((sc) => {
        const cp = sc.creativeProfile;
        const { rating, reviewCount } = computeRatingStats(cp.reviews || []);

        return {
          savedId: sc.id,
          savedAt: sc.createdAt.toISOString(),
          type: 'CREATIVE' as const,
          item: {
            id: cp.id,
            userId: cp.userId,
            name: cp.user!.name,
            username: cp.user?.username || null,
            avatarUrl: cp.user?.image || null,
            headline: cp.headline || null,
            bio: cp.bio || null,
            location: cp.location || null,
            availability: cp.availability || 'AVAILABLE',
            rateType: cp.rateType || null,
            rateAmount: cp.rateAmount || null,
            disciplines: cp.disciplines || [],
            skills: (cp.skills || []).map((s) => s.name),
            rating,
            reviewCount,
            portfolio: (cp.ownedPortfolioItems || []).map((p) => ({
              id: p.id,
              title: p.title,
              image: p.coverImageUrl || '',
            })),
          },
        };
      });
  }

  if (type === 'ALL' || type === 'CULT') {
    const rawSavedCults = await db.savedCult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        cult: {
          include: {
            memberships: {
              where: { status: 'ACTIVE' },
              include: {
                creativeProfile: {
                  include: {
                    user: {
                      select: { id: true, name: true, image: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    cultItems = rawSavedCults
      .filter((sc) => Boolean(sc.cult))
      .map((sc) => {
        const cult = sc.cult;
        const members = (cult.memberships || []).map((m) => ({
          id: m.id,
          name: m.creativeProfile?.user?.name || 'Member',
          role: m.role || 'MEMBER',
          avatar: m.creativeProfile?.user?.image || null,
        }));

        return {
          savedId: sc.id,
          savedAt: sc.createdAt.toISOString(),
          type: 'CULT' as const,
          item: {
            id: cult.id,
            name: cult.name,
            slug: cult.slug,
            tagline: cult.tagline || null,
            bio: cult.bio || null,
            avatarUrl: cult.avatarUrl || null,
            coverImage: cult.avatarUrl || null,
            memberCount: members.length,
            startingPrice: null,
            startingPriceNum: null,
            turnaround: null,
            rating: null,
            reviewCount: 0,
            location: null,
            disciplines: [],
            members,
          },
        };
      });
  }

  let combined: SavedItemResponse[] = [...creativeItems, ...cultItems];

  // Sort combined by savedAt desc
  combined.sort(
    (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
  );

  // Apply search query filter if provided
  if (search) {
    combined = combined.filter((entry) => {
      if (entry.type === 'CREATIVE') {
        const item = entry.item;
        return (
          item.name.toLowerCase().includes(search) ||
          (item.username && item.username.toLowerCase().includes(search)) ||
          (item.headline && item.headline.toLowerCase().includes(search)) ||
          (item.location && item.location.toLowerCase().includes(search)) ||
          item.skills.some((s) => s.toLowerCase().includes(search)) ||
          item.disciplines.some((d) => d.toLowerCase().includes(search))
        );
      } else {
        const item = entry.item;
        return (
          item.name.toLowerCase().includes(search) ||
          item.slug.toLowerCase().includes(search) ||
          (item.tagline && item.tagline.toLowerCase().includes(search)) ||
          (item.bio && item.bio.toLowerCase().includes(search))
        );
      }
    });
  }

  const total = combined.length;
  const pagedItems = combined.slice((page - 1) * limit, page * limit);

  return {
    items: pagedItems,
    total,
    totalCreatives: savedCreativesCount,
    totalCults: savedCultsCount,
    page,
    limit,
  };
};
