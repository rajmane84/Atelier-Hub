import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './util/prisma';
import { env } from './util/env';
import { customSession } from 'better-auth/plugins';
import { emailService } from './services/email/email.service';

const isProd = env.NODE_ENV === 'production';

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL, // Your backend url
  secret: env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  emailVerification: {
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await emailService.sendVerificationEmail({
        to: user.email,
        name: user.name,
        url,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  trustedOrigins: env.CORS_ORIGINS, // Your frontend urls
  advanced: {
    useSecureCookies: isProd,
    crossSubDomainCookies: isProd
      ? {
          enabled: true,
          domain: 'rajmane.dev',
        }
      : undefined,
    defaultCookieAttributes: {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
      },
      username: {
        type: 'string',
        required: false,
      },
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const creativeProfile = await prisma.creativeProfile.findUnique({
        where: { userId: user.id },
      });
      const typedUser = user as typeof user & {
        role?: string;
        username?: string;
      };
      return {
        user: { ...typedUser, creativeProfile },
        session,
      };
    }),
  ],
});
