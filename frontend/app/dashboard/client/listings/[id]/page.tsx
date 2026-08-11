'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/loading-state';
import { ErrorState } from '@/components/error-state';
import {
  useListing,
  useDeleteListing,
  useUpdateListingStatus,
} from '@/hooks/listing';
import DeleteListingDialog from '@/components/listing/delete-listing-dialog';
import {
  ListingStatus,
  LOCATION_TYPE_LABELS,
  RATE_TYPE_LABELS,
  EMPLOYMENT_TYPE_LABELS,
} from '@/types';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Sparkles,
} from 'lucide-react';
import { formatToDDMMYYYY } from '@/components/ui/date-picker';

export default function ListingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || '';

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: listingResponse, isLoading, error, refetch } = useListing(id);
  const listing = listingResponse?.data;

  const { deleteListingMutation } = useDeleteListing({
    onSuccess: () => {
      toast.success('Listing deleted successfully');
      router.push('/dashboard/client/listings');
    },
  });

  const { updateListingStatusMutation } = useUpdateListingStatus({
    onSuccess: () => {
      toast.success('Listing status updated');
    },
  });

  const handleDeleteConfirm = () => {
    deleteListingMutation.mutate(id);
  };

  const handleStatusChange = (newStatus: ListingStatus) => {
    updateListingStatusMutation.mutate({ id, status: newStatus });
  };

  if (isLoading) {
    return <LoadingState message="Loading listing details..." />;
  }

  if (error || !listing) {
    return (
      <div className="w-full bg-background min-h-screen py-12 px-4 sm:px-6">
        <div className="max-w-xl mx-auto space-y-6">
          <ErrorState
            title="Listing not found"
            message={
              error?.message ||
              "The listing you are looking for does not exist or you don't have permission to view it."
            }
            onRetry={refetch}
          />
          <div className="text-center">
            <Link href="/dashboard/client/listings">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="size-4" />
                Back to Listings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: ListingStatus) => {
    switch (status) {
      case ListingStatus.ACTIVE:
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-mono uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active
          </span>
        );
      case ListingStatus.DRAFT:
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-mono uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-200">
            Draft
          </span>
        );
      case ListingStatus.CLOSED:
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-mono uppercase tracking-widest bg-slate-100 text-slate-700 border border-slate-200">
            Closed
          </span>
        );
      case ListingStatus.FILLED:
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-mono uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-200">
            Filled
          </span>
        );
      case ListingStatus.ARCHIVED:
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-mono uppercase tracking-widest bg-rose-50 text-rose-700 border border-rose-200">
            Archived
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-background min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 max-w-4xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="space-y-4 border-b border-border pb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {getStatusBadge(listing.status)}
              </div>
              <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight text-foreground selection:text-background selection:bg-primary">
                {listing.title}
              </h1>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link href={`/dashboard/client/listings/${listing.id}/edit`}>
                <Button variant="default" className="gap-2">
                  <Edit2 className="size-4" />
                  Edit Listing
                </Button>
              </Link>
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
                className="gap-2 shrink-0"
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Primary Meta Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border border-border bg-card space-y-1">
            <div className="flex items-center text-xs font-mono uppercase tracking-widest text-muted-foreground gap-1.5">
              <MapPin className="size-3.5 text-primary selection:text-background selection:bg-primary" />
              Location
            </div>
            <p className="font-editorial text-base font-semibold text-foreground">
              {LOCATION_TYPE_LABELS[listing.locationType] ||
                listing.locationType}
            </p>
            {listing.location && (
              <p className="font-body text-xs text-muted-foreground truncate">
                {listing.location}
              </p>
            )}
          </div>

          <div className="p-4 border border-border bg-card space-y-1">
            <div className="flex items-center text-xs font-mono uppercase tracking-widest text-muted-foreground gap-1.5">
              <DollarSign className="size-3.5 text-primary selection:text-background selection:bg-primary" />
              Compensation
            </div>
            <p className="font-editorial text-base font-semibold text-foreground">
              {listing.budgetMin || listing.budgetMax ? (
                <>
                  {listing.currency || '$'}
                  {listing.budgetMin ? listing.budgetMin.toLocaleString() : '0'}
                  {listing.budgetMax
                    ? ` - ${listing.currency || '$'}${listing.budgetMax.toLocaleString()}`
                    : '+'}
                </>
              ) : (
                'Negotiable'
              )}
            </p>
            {listing.rateType && (
              <p className="font-body text-xs text-muted-foreground">
                {RATE_TYPE_LABELS[listing.rateType] || listing.rateType}
              </p>
            )}
          </div>

          <div className="p-4 border border-border bg-card space-y-1">
            <div className="flex items-center text-xs font-mono uppercase tracking-widest text-muted-foreground gap-1.5">
              <Clock className="size-3.5 text-primary selection:text-background selection:bg-primary" />
              Duration
            </div>
            <p className="font-editorial text-base font-semibold text-foreground">
              {listing.duration || 'Not specified'}
            </p>
            {listing.employmentType && (
              <p className="font-body text-xs text-muted-foreground">
                {EMPLOYMENT_TYPE_LABELS[listing.employmentType] ||
                  listing.employmentType}
              </p>
            )}
          </div>

          <div className="p-4 border border-border bg-card space-y-1">
            <div className="flex items-center text-xs font-mono uppercase tracking-widest text-muted-foreground gap-1.5">
              <Calendar className="size-3.5 text-primary selection:text-background selection:bg-primary" />
              Dates
            </div>
            <p className="font-editorial text-base font-semibold text-foreground">
              {listing.startDate
                ? formatToDDMMYYYY(listing.startDate)
                : 'Immediate'}
            </p>
            {listing.deadline && (
              <p className="font-body text-xs text-muted-foreground">
                Apply by {formatToDDMMYYYY(listing.deadline)}
              </p>
            )}
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6">
          {/* Description */}
          <div className="border border-border bg-card p-6 space-y-4">
            <h2 className="font-editorial text-xl font-bold text-foreground">
              Description
            </h2>
            <div className="font-body text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {listing.description}
            </div>
          </div>

          {/* Required Skills */}
          {listing.skills && listing.skills.length > 0 && (
            <div className="border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary selection:text-background selection:bg-primary" />
                <h2 className="font-editorial text-xl font-bold text-foreground">
                  Required Skills & Stack
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {listing.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="font-mono text-xs bg-muted/80 text-foreground px-3 py-1 border border-border/80"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Status Management */}
          <div className="border border-border bg-card p-6 space-y-4">
            <h2 className="font-editorial text-xl font-bold text-foreground">
              Manage Listing Status
            </h2>
            <p className="font-body text-xs text-muted-foreground">
              Change status to pause applications or mark the position as
              filled.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {[
                ListingStatus.ACTIVE,
                ListingStatus.DRAFT,
                ListingStatus.CLOSED,
                ListingStatus.FILLED,
                ListingStatus.ARCHIVED,
              ].map((st) => (
                <Button
                  key={st}
                  type="button"
                  variant={listing.status === st ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStatusChange(st)}
                  disabled={updateListingStatusMutation.isPending}
                  className="font-mono text-xs uppercase tracking-wider"
                >
                  {st}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Delete Modal */}
        <DeleteListingDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          isDeleting={deleteListingMutation.isPending}
          listingTitle={listing.title}
        />
      </div>
    </div>
  );
}
