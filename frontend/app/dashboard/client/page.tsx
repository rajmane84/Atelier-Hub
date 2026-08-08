'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import {
  ProfileCompletionCard,
  ClientStatsCards,
} from '@/components/client/dashboard';
import { EmailVerificationCard } from '@/components/auth/email-verification-card';
import { LoadingState } from '@/components/loading-state';
import { ErrorState } from '@/components/error-state';
import { useClientProfile, useClientStats } from '@/hooks/client/profile';
import { useListings } from '@/hooks/listing';
import { ListingCard } from '@/components/listing/listing-card';
import { toast } from 'sonner';

const ease = [0.76, 0, 0.24, 1] as const;

export default function ClientDashboard() {
  const { data: sessionData, isPending } = authClient.useSession();
  const {
    data: profileData,
    isPending: isProfileDataPending,
    error: profileError,
    refetch: refetchProfile,
  } = useClientProfile();
  const { data: statsData } = useClientStats();
  const { data: listingsData } = useListings();
  const user = sessionData?.user;

  if (isPending || isProfileDataPending || !user) {
    return <LoadingState message="Loading dashboard..." />;
  }

  if (profileError || !profileData) {
    return (
      <ErrorState
        title="Couldn't load your dashboard"
        onRetry={() => refetchProfile()}
      />
    );
  }

  const completion = profileData.data.completion;
  const isProfileComplete = completion.completedSteps >= completion.totalSteps;

  const fullName = user.name;
  const displayName = fullName ? fullName.split(' ')[0] : 'Client';
  const userEmail = user.email;
  const isEmailVerified = Boolean(user.emailVerified);

  const handleCreateListingClick = (e: React.MouseEvent) => {
    if (!isEmailVerified) {
      e.preventDefault();
      toast.error(
        'Email verification required. Please verify your email address before proceeding.'
      );
    }
  };

  const listings = listingsData?.data || [];
  const activeListingsCount = listings.filter(
    (l) => !l.status || l.status === 'ACTIVE'
  ).length;
  const recentListings = listings.slice(0, 3);
  const stats = statsData?.data;

  return (
    <div className="w-full bg-background">
      <div className="w-full space-y-8 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Top Welcome Header & Action */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border pb-6 sm:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="space-y-2"
          >
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <span>/ Client Dashboard</span>
              <span className="size-1.5 bg-primary selection:text-background selection:bg-primary inline-block" />
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Welcome back,{' '}
              <span className="text-primary selection:text-background selection:bg-primary">
                {displayName}!
              </span>
            </h1>

            <p className="font-body text-sm sm:text-base text-muted-foreground">
              Let&apos;s get your first listing live.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="flex flex-col items-start sm:items-end gap-1.5 shrink-0"
          >
            <Link
              href="/dashboard/client/listings"
              className="w-full sm:w-auto"
            >
              <Button className="w-full sm:w-auto cursor-pointer gap-2">
                <Plus className="size-4" />
                <span>Manage Listings</span>
              </Button>
            </Link>
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              View and create job postings
            </span>
          </motion.div>
        </div>

        {/* Dynamic Responsive Notice Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {!isProfileComplete && (
              <motion.div
                key="profile-completion-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: -10,
                  transition: { duration: 0.2 },
                }}
                transition={{ duration: 0.3 }}
                className={cn('w-full', isEmailVerified && 'lg:col-span-2')}
              >
                <ProfileCompletionCard
                  completedSteps={completion.completedSteps}
                  totalSteps={completion.totalSteps}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!isEmailVerified && (
              <motion.div
                key="email-verification-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: -10,
                  transition: { duration: 0.2 },
                }}
                transition={{ duration: 0.3 }}
                className={cn('w-full', isProfileComplete && 'lg:col-span-2')}
              >
                <EmailVerificationCard email={userEmail} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Section 2: Key Metrics & Stat Cards */}
        <ClientStatsCards
          activeListings={stats?.activeListings ?? activeListingsCount}
          applicationsReceived={stats?.applicationsReceived ?? 0}
          savedCreatives={stats?.savedCreatives ?? 0}
          avgTimeToFirstApp={stats?.avgTimeToFirstApp ?? '—'}
        />

        {/* Section 3: Recent Listings Preview */}
        <div className="border-t border-border pt-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-editorial text-2xl font-bold text-foreground tracking-tight">
                Recent Listings
              </h2>
              <p className="font-body text-sm text-muted-foreground mt-1">
                Your latest job postings
              </p>
            </div>
            <Link href="/dashboard/client/listings">
              <Button
                variant="ghost"
                size="sm"
                className="font-mono text-[11px] uppercase tracking-widest"
              >
                View All ({listings.length})
              </Button>
            </Link>
          </div>
          {recentListings.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {recentListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed border-border bg-muted/20">
              <p className="font-body text-sm text-muted-foreground mb-4">
                No active listings. Create your first one to get started.
              </p>
              <Link
                href="/dashboard/client/listings/new"
                onClick={handleCreateListingClick}
              >
                <Button size="sm" className="gap-2">
                  <Plus className="size-4" />
                  <span>Create Listing</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
