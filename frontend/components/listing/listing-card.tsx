'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Calendar,
  MapPin,
  Banknote,
  Clock,
  MoreVertical,
  Lock,
  CheckCircle2,
  FileEdit,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatDateDDMMYYYY } from '@/lib/format-date';
import {
  LISTING_STATUS_LABELS,
  LOCATION_TYPE_LABELS,
  RATE_TYPE_LABELS,
} from '@/types';
import { ListingStatus, LocationType, RateType, Currency } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { buttonVariants } from '@/components/ui/button';

const ease = [0.76, 0, 0.24, 1] as const;

const STATUS_OPTIONS: { status: ListingStatus; label: string }[] = [
  { status: ListingStatus.ACTIVE, label: 'Mark as Active' },
  { status: ListingStatus.DRAFT, label: 'Mark as Draft' },
  { status: ListingStatus.FILLED, label: 'Mark as Filled' },
  { status: ListingStatus.CLOSED, label: 'Close Listing' },
  { status: ListingStatus.ARCHIVED, label: 'Archive Listing' },
];

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    description: string;
    status: ListingStatus;
    locationType: LocationType;
    location?: string | null;
    budgetMin?: number | null;
    budgetMax?: number | null;
    rateType?: RateType | null;
    currency?: Currency | null;
    skills: string[];
    deadline?: string | null;
    duration?: string | null;
    createdAt: string;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
}

export function ListingCard({
  listing,
  onEdit,
  onDelete,
  onStatusChange,
}: ListingCardProps) {
  const formatDate = (dateString: string) => {
    return formatDateDDMMYYYY(dateString);
  };

  const formatBudget = () => {
    const currencyCode = listing.currency ?? Currency.USD;

    if (listing.rateType === RateType.NEGOTIABLE) {
      return 'Negotiable';
    }
    if (listing.budgetMin && listing.budgetMax) {
      return `${currencyCode} ${listing.budgetMin.toLocaleString()} - ${currencyCode} ${listing.budgetMax.toLocaleString()}`;
    }
    if (listing.budgetMin) {
      return `${currencyCode} ${listing.budgetMin.toLocaleString()}+`;
    }
    if (listing.budgetMax) {
      return `Up to ${currencyCode} ${listing.budgetMax.toLocaleString()}`;
    }
    return 'Budget not specified';
  };

  const getStatusBadge = (status: ListingStatus) => {
    switch (status) {
      case ListingStatus.ACTIVE:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] uppercase font-bold tracking-widest bg-emerald-100/80 text-emerald-800 border border-emerald-300/80 shadow-xs">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            Active
          </span>
        );
      case ListingStatus.DRAFT:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] uppercase font-bold tracking-widest bg-amber-100/80 text-amber-800 border border-amber-300/80">
            Draft
          </span>
        );
      case ListingStatus.FILLED:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] uppercase font-bold tracking-widest bg-blue-100/80 text-blue-800 border border-blue-300/80">
            Filled
          </span>
        );
      case ListingStatus.CLOSED:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] uppercase font-bold tracking-widest bg-red-100/80 text-red-800 border border-red-300/80">
            Closed
          </span>
        );
      case ListingStatus.ARCHIVED:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] uppercase font-bold tracking-widest bg-gray-100/80 text-gray-800 border border-gray-300/80">
            Archived
          </span>
        );
      default:
        return (
          <span className="status-tag status-tag--neutral">
            {LISTING_STATUS_LABELS[status]}
          </span>
        );
    }
  };

  const getContainerStyles = (status: ListingStatus) => {
    switch (status) {
      case ListingStatus.ACTIVE:
        return 'border-l-4 border-l-emerald-500 border-border bg-card hover:border-l-emerald-500  shadow-xs';
      case ListingStatus.CLOSED:
        return 'border-l-4 border-l-red-500 border-red-200/80 bg-red-50/30 opacity-90 hover:border-l-red-600';
      case ListingStatus.DRAFT:
        return 'border-l-4 border-l-amber-500 border-dashed border-amber-300/80 bg-amber-50/20 hover:border-amber-400';
      case ListingStatus.FILLED:
        return 'border-l-4 border-l-indigo-500 border-indigo-200/80 bg-indigo-50/20 hover:border-indigo-400';
      case ListingStatus.ARCHIVED:
        return 'border-l-4 border-l-slate-400 border-slate-200 bg-slate-100/50 opacity-75 grayscale-[20%]';
      default:
        return 'border-border bg-card';
    }
  };

  const getHeaderBanner = (status: ListingStatus) => {
    if (status === ListingStatus.CLOSED) {
      return (
        <div className="w-full bg-red-500/10 border-b border-red-200/80 px-4 py-1.5 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-red-700 font-bold flex items-center gap-1.5">
            <Lock className="size-3" /> Listing Closed &bull; Not accepting new
            applications
          </span>
        </div>
      );
    }
    if (status === ListingStatus.DRAFT) {
      return (
        <div className="w-full bg-amber-500/10 border-b border-amber-200/80 px-4 py-1.5 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-amber-800 font-bold flex items-center gap-1.5">
            <FileEdit className="size-3" /> Draft &bull; Visible only to you
          </span>
        </div>
      );
    }
    if (status === ListingStatus.FILLED) {
      return (
        <div className="w-full bg-indigo-500/10 border-b border-indigo-200/80 px-4 py-1.5 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-800 font-bold flex items-center gap-1.5">
            <CheckCircle2 className="size-3" /> Position Filled &bull; Hiring
            complete
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease }}
      className="w-full"
    >
      <div
        className={cn(
          'group w-full border transition-all duration-300 overflow-hidden',
          getContainerStyles(listing.status)
        )}
      >
        {/* Banner for non-active states */}
        {getHeaderBanner(listing.status)}

        {/* Card Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-border/80">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {getStatusBadge(listing.status)}
            </div>
            <h3
              className={cn(
                'font-editorial text-xl sm:text-2xl font-bold tracking-tight truncate selection:text-background selection:bg-primary',
                listing.status === ListingStatus.CLOSED ||
                  listing.status === ListingStatus.ARCHIVED
                  ? 'text-muted-foreground line-through decoration-red-400/60'
                  : 'text-foreground selection:text-background selection:bg-primary'
              )}
            >
              <Link
                href={`/dashboard/client/listings/${listing.id}`}
                className="hover:text-primary transition-colors duration-300 ease-[cubic-bezier(0.76,0,0.24,1)]"
              >
                {listing.title}
              </Link>
            </h3>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
                'shrink-0 hover:bg-muted ml-2'
              )}
            >
              <MoreVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onClick={() => onEdit?.(listing.id)}>
                Edit Listing
              </DropdownMenuItem>
              {STATUS_OPTIONS.filter(
                (opt) => opt.status !== listing.status
              ).map((opt) => (
                <DropdownMenuItem
                  key={opt.status}
                  onClick={() => onStatusChange?.(listing.id, opt.status)}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => onDelete?.(listing.id)}
                className="text-destructive font-medium"
              >
                Delete Listing
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* Description */}
          <p
            className={cn(
              'font-body text-sm line-clamp-2',
              listing.status === ListingStatus.CLOSED ||
                listing.status === ListingStatus.ARCHIVED
                ? 'text-muted-foreground/80'
                : 'text-muted-foreground'
            )}
          >
            {listing.description}
          </p>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Location */}
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="size-4 text-muted-foreground shrink-0" />
              <span className="font-body text-foreground">
                {LOCATION_TYPE_LABELS[listing.locationType]}
                {listing.location && ` · ${listing.location}`}
              </span>
            </div>

            {/* Budget */}
            <div className="flex items-center gap-2 text-sm">
              <Banknote className="size-4 text-muted-foreground shrink-0" />
              <span className="font-body text-foreground">
                {formatBudget()}
                {listing.rateType &&
                  listing.rateType !== RateType.NEGOTIABLE && (
                    <span className="text-muted-foreground ml-1">
                      /{RATE_TYPE_LABELS[listing.rateType].toLowerCase()}
                    </span>
                  )}
              </span>
            </div>

            {/* Duration */}
            {listing.duration && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="size-4 text-muted-foreground shrink-0" />
                <span className="font-body text-foreground">
                  {listing.duration}
                </span>
              </div>
            )}

            {/* Deadline */}
            {listing.deadline && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="size-4 text-muted-foreground shrink-0" />
                <span className="font-body text-foreground">
                  {formatDate(listing.deadline)}
                </span>
              </div>
            )}
          </div>

          {/* Skills */}
          {listing.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {listing.skills.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 border border-border bg-background text-muted-foreground"
                >
                  {skill}
                </span>
              ))}
              {listing.skills.length > 4 && (
                <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 border border-border bg-background text-muted-foreground">
                  +{listing.skills.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div
          className={cn(
            'px-4 sm:px-6 py-3 sm:py-4 border-t border-border/80 flex items-center justify-between',
            listing.status === ListingStatus.CLOSED
              ? 'bg-red-100/30'
              : listing.status === ListingStatus.DRAFT
                ? 'bg-amber-100/30'
                : listing.status === ListingStatus.FILLED
                  ? 'bg-indigo-100/30'
                  : 'bg-muted/30'
          )}
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Posted {formatDate(listing.createdAt)}
          </span>
          <Link
            href={`/dashboard/client/listings/${listing.id}`}
            className={cn(
              'font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-primary selection:text-background selection:bg-primary transition-colors duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] flex items-center gap-1',
              listing.status === ListingStatus.CLOSED && 'text-red-800'
            )}
          >
            <span>View details</span>
            <ArrowUpRight className="size-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
