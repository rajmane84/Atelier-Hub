import { prisma } from '../util/prisma';

export async function cleanupExpiredOtps(): Promise<number> {
  try {
    const result = await prisma.phoneVerification.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    if (result.count > 0) {
      console.log(
        `[OTP Cleanup Job] Purged ${result.count} expired OTP record(s) from database.`
      );
    }
    return result.count;
  } catch (error) {
    console.error(
      '[OTP Cleanup Job] Error cleaning up expired OTP records:',
      error
    );
    return 0;
  }
}
