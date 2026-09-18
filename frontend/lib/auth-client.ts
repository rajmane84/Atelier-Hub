import { createAuthClient } from 'better-auth/react';
import {
  customSessionClient,
  inferAdditionalFields,
} from 'better-auth/client/plugins';
import type { auth } from '../../backend/src/auth';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:5000', // Your backend url
  fetchOptions: {
    credentials: 'include',
  },
  plugins: [
    inferAdditionalFields<typeof auth>(),
    // Intentionally called without <typeof auth> — that generic pulls in
    // better-auth's Prisma-adapter-typed `Auth` shape, which isn't
    // structurally compatible across the frontend/backend package boundary
    // (each has its own node_modules install). We type the resulting
    // session/user shape locally instead (see lib/session.ts).
    customSessionClient(),
  ],
});
