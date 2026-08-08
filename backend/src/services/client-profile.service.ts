import { prisma } from '../util/prisma';
import { NotFoundError } from '../util/errors/AppError';
import type { ClientStats } from '../types/client-profile';

export const getClientStats = async (userId: string): Promise<ClientStats> => {
  const clientProfile = await prisma.clientProfile.findUnique({
    where: { userId },
  });

  if (!clientProfile) {
    throw new NotFoundError('Client profile not found');
  }

  const db = prisma as any;
  const [activeListings, totalListings, closedListings, savedCreatives] =
    await Promise.all([
      prisma.listing.count({
        where: {
          clientProfileId: clientProfile.id,
          status: 'ACTIVE',
        },
      }),
      prisma.listing.count({
        where: {
          clientProfileId: clientProfile.id,
        },
      }),
      prisma.listing.count({
        where: {
          clientProfileId: clientProfile.id,
          status: { in: ['CLOSED', 'FILLED'] },
        },
      }),
      db.savedCreative
        .count({
          where: { userId },
        })
        .catch(() => 0),
    ]);

  return {
    activeListings,
    totalListings,
    closedListings,
    applicationsReceived: 0,
    savedCreatives,
    avgTimeToFirstApp: '—',
  };
};
