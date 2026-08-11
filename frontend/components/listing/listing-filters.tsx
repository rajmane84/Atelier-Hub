'use client';

import { motion } from 'motion/react';
import { Filter, X } from 'lucide-react';
import { LISTING_STATUS_LABELS } from '@/types';
import { ListingStatus } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ease = [0.76, 0, 0.24, 1] as const;

interface ListingFiltersProps {
  statusFilter?: ListingStatus;
  onStatusChange: (status: ListingStatus | undefined) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function ListingFilters({
  statusFilter,
  onStatusChange,
  onClearFilters,
  hasActiveFilters,
}: ListingFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease }}
      className="w-full"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border bg-card">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <span className="font-mono text-[11px] uppercase tracking-widest text-foreground">
            Filters
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <Select
            value={statusFilter || 'all'}
            onValueChange={(value) =>
              onStatusChange(
                value === 'all' ? undefined : (value as ListingStatus)
              )
            }
          >
            <SelectTrigger className="w-[140px] h-8 font-mono text-[11px] uppercase tracking-wider">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.entries(LISTING_STATUS_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="size-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
