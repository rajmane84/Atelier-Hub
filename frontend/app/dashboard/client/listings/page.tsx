'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/loading-state';
import { ErrorState } from '@/components/error-state';
import { ListingCard } from '@/components/listing/listing-card';
import { ListingEmptyState } from '@/components/listing/listing-empty-state';
import { ListingFilters } from '@/components/listing/listing-filters';
import { DeleteListingDialog } from '@/components/listing';
import { useListings } from '@/hooks/listing';
import { useDeleteListing, useUpdateListingStatus } from '@/hooks/listing';
import { ListingStatus } from '@/types';
import { cn } from '@/lib/cn';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

const ease = [0.76, 0, 0.24, 1] as const;

export default function ClientListingsPage() {
  const router = useRouter();
  const { data: sessionData } = authClient.useSession();
  const isEmailVerified = Boolean(sessionData?.user?.emailVerified);

  const [statusFilter, setStatusFilter] = useState<ListingStatus | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const handleCreateListingClick = (e: React.MouseEvent) => {
    if (!isEmailVerified) {
      e.preventDefault();
      toast.error(
        'Email verification required. Please verify your email address before proceeding.'
      );
    }
  };

  const { data: totalListingsData } = useListings();
  const {
    data: listingsData,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useListings({
    status: statusFilter,
  });

  const { deleteListingMutation } = useDeleteListing({
    onSuccess: () => {
      toast.success('Listing deleted successfully');
    },
  });

  const { updateListingStatusMutation } = useUpdateListingStatus({
    onSuccess: () => {
      toast.success('Listing status updated');
    },
  });

  const handleDelete = (id: string, title: string) => {
    setListingToDelete({ id, title });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (listingToDelete) {
      deleteListingMutation.mutate(listingToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setListingToDelete(null);
        },
      });
    }
  };

  const handleStatusChange = (id: string, status: string) => {
    updateListingStatusMutation.mutate({ id, status });
  };

  const handleClearFilters = () => {
    setStatusFilter(undefined);
  };

  const hasActiveFilters = statusFilter !== undefined;
  const listings = listingsData?.data || [];
  const hasTotalListings = (totalListingsData?.data?.length ?? 0) > 0;

  if (isLoading && !listingsData) {
    return <LoadingState message="Loading listings..." />;
  }

  if (error && !listingsData) {
    return (
      <ErrorState
        title="Couldn't load your listings"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="w-full bg-background">
      <div className="w-full space-y-6 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border pb-6 sm:pb-8"
        >
          <div className="space-y-2">
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <span>/ Client Dashboard</span>
              <span className="size-1.5 bg-primary selection:text-background selection:bg-primary inline-block" />
              <span>/ Listings</span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Your{' '}
              <span className="text-primary selection:text-background selection:bg-primary">
                Listings
              </span>
            </h1>

            <p className="font-body text-sm sm:text-base text-muted-foreground">
              Manage your job postings and connect with creatives
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="flex flex-col items-start sm:items-end gap-1.5 shrink-0"
          >
            <Link
              href="/dashboard/client/listings/new"
              onClick={handleCreateListingClick}
              className="w-full sm:w-auto"
            >
              <Button className="w-full sm:w-auto cursor-pointer gap-2">
                <Plus className="size-4" />
                <span>Create New Listing</span>
              </Button>
            </Link>
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              Post a new opportunity
            </span>
          </motion.div>
        </motion.div>

        {/* Filters (only displayed if user has total listings) */}
        {hasTotalListings && (
          <ListingFilters
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        )}

        {/* Listings Grid with Smooth In-Place Updates */}
        <div className="relative min-h-[200px]">
          {isFetching && (
            <div className="absolute top-2 right-2 flex items-center gap-2 px-3 py-1 bg-background/90 border border-border shadow-sm text-xs font-mono text-muted-foreground z-20 backdrop-blur">
              <Loader2 className="size-3.5 animate-spin text-primary" />
              <span>Filtering...</span>
            </div>
          )}

          <div
            className={cn(
              'space-y-4 transition-opacity duration-300',
              isFetching && 'opacity-60 pointer-events-none'
            )}
          >
            <AnimatePresence mode="popLayout">
              {listings.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                >
                  <ListingEmptyState />
                </motion.div>
              ) : (
                <motion.div
                  key="listings-grid"
                  className="grid grid-cols-1 gap-4"
                >
                  {listings.map((listing) => (
                    <motion.div
                      key={listing.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.25, ease }}
                    >
                      <ListingCard
                        listing={listing}
                        onEdit={(id) => {
                          router.push(`/dashboard/client/listings/${id}/edit`);
                        }}
                        onDelete={(id) => handleDelete(id, listing.title)}
                        onStatusChange={handleStatusChange}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Results Count */}
        {listings.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="pt-4 border-t border-border"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Showing {listings.length} listing
              {listings.length !== 1 ? 's' : ''}
              {hasActiveFilters && ' (filtered)'}
            </p>
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteListingDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteListingMutation.isPending}
        listingTitle={listingToDelete?.title}
      />
    </div>
  );
}
