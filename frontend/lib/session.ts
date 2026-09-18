import 'server-only';
import { cookies } from 'next/headers';
import { authClient } from './auth-client';
import type { User } from '@/types';

/**
 * Server-side session verification
 * This function should be used in Server Components and Server Actions
 * to verify the user's session without client-side useSession calls
 */
export async function verifySession() {
  try {
    const cookieStore = await cookies();
    const session = await authClient.getSession({
      fetchOptions: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    });

    if (!session.data) {
      return null;
    }

    // better-auth's inferred session type is not shared across the
    // frontend/backend package boundary (separate node_modules installs),
    // so we type `user` against our own local `User` shape here instead of
    // relying on cross-package type inference.
    return { ...session.data, user: session.data.user as User };
  } catch (error) {
    // Next.js throws this internally during static-render attempts when a
    // dynamic API (cookies, headers, etc.) is accessed — it's not a real
    // auth failure, it's Next telling itself to bail out of static rendering.
    // Let it propagate so Next can handle it correctly.
    if (
      error instanceof Error &&
      (error as { digest?: string }).digest === 'DYNAMIC_SERVER_USAGE'
    ) {
      throw error;
    }

    console.error('Failed to verify session:', error);
    return null;
  }
}

/**
 * Get the current user from the session
 * Returns null if the user is not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await verifySession();
  return session?.user || null;
}

/**
 * Check if the current user has a specific role
 */
export async function hasRole(role: string): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === role;
}

/**
 * Require authentication - redirects to login if not authenticated
 * This should be used in Server Components
 */
export async function requireAuth() {
  const session = await verifySession();

  if (!session) {
    // This will be handled by the component that calls this function
    // They should redirect based on the null return
    return null;
  }

  return session;
}

/**
 * Require a specific role - returns null if user doesn't have the required role
 */
export async function requireRole(role: string) {
  const session = await verifySession();

  if (!session) {
    return null;
  }

  if (session.user?.role !== role) {
    return null;
  }

  return session;
}
