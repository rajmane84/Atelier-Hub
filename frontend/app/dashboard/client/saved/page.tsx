'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  Search,
  Users,
  Briefcase,
  Sparkles,
  RefreshCw,
  SearchX,
  Compass,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { useDebounce } from '@/hooks/use-debounce';
import { useSavedItems } from '@/hooks/saved/use-saved';
import { SavedCreativeCard } from '@/components/client/saved/saved-creative-card';
import { SavedCultCard } from '@/components/client/saved/saved-cult-card';
import { LoadingState } from '@/components/loading-state';
import { ErrorState } from '@/components/error-state';
import type { SavedItemType } from '@/types/saved';

const ease = [0.76, 0, 0.24, 1] as const;

export default function SavedPage() {
  const [activeTab, setActiveTab] = useState<SavedItemType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data, isLoading, isError, refetch } = useSavedItems({
    type: activeTab,
    search: debouncedSearchQuery,
  });

  const savedItems = data?.items || [];
  const meta = data?.meta || {
    totalCreatives: savedItems.filter((i) => i.type === 'CREATIVE').length,
    totalCults: savedItems.filter((i) => i.type === 'CULT').length,
  };
  const totalCount = (meta.totalCreatives || 0) + (meta.totalCults || 0);

  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveTab('ALL');
  };

  if (isLoading) {
    return <LoadingState message="Fetching your saved creatives & cults..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Unable to load saved items"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="w-full bg-background min-h-screen">
      <div className="w-full space-y-8 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6 sm:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="space-y-2"
          >
            <div className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <span>/ Dashboard</span>
              <span>/ Saved Items</span>
              <span className="size-1.5 bg-primary selection:text-background selection:bg-primary inline-block" />
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Saved{' '}
              <span className="text-primary selection:text-background selection:bg-primary">
                Talent & Collectives
              </span>
            </h1>

            <p className="font-body text-sm sm:text-base text-muted-foreground max-w-2xl">
              Keep track of bookmarked creative freelancers and cults for your
              upcoming projects.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="shrink-0"
          >
            <Link href="/discover">
              <Button className="cursor-pointer gap-2">
                <Compass className="size-4" />
                <span>Explore Discover</span>
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Quick Overview Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-border bg-card p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Total Saved
              </span>
              <Heart className="size-4 text-primary selection:text-background selection:bg-primary fill-primary/20" />
            </div>
            <p className="font-editorial text-3xl font-bold text-foreground">
              {totalCount}
            </p>
          </div>

          <div className="border border-border bg-card p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Saved Creatives
              </span>
              <Briefcase className="size-4 text-muted-foreground" />
            </div>
            <p className="font-editorial text-3xl font-bold text-foreground">
              {meta.totalCreatives || 0}
            </p>
          </div>

          <div className="border border-border bg-card p-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                Saved Cults
              </span>
              <Users className="size-4 text-muted-foreground" />
            </div>
            <p className="font-editorial text-3xl font-bold text-foreground">
              {meta.totalCults || 0}
            </p>
          </div>
        </div>

        {/* Controls Toolbar: Tabs & Search Input */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 border border-border bg-card p-4">
          {/* Filter Tabs */}
          <div className="flex items-center border border-border bg-card p-1 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('ALL')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors min-h-[38px] cursor-pointer select-none',
                activeTab === 'ALL'
                  ? 'bg-foreground text-background font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <span>All</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 bg-background text-foreground border border-border">
                {totalCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('CREATIVE')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors min-h-[38px] cursor-pointer select-none',
                activeTab === 'CREATIVE'
                  ? 'bg-foreground text-background font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Briefcase className="size-3.5" />
              <span>Creatives</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 bg-background text-foreground border border-border">
                {meta.totalCreatives || 0}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('CULT')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors min-h-[38px] cursor-pointer select-none',
                activeTab === 'CULT'
                  ? 'bg-foreground text-background font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Users className="size-3.5" />
              <span>Cults</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 bg-background text-foreground border border-border">
                {meta.totalCults || 0}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search saved..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 font-body text-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-sm p-0.5 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Clear search"
              >
                <span className="font-mono text-xs">✕</span>
              </button>
            )}
          </div>
        </div>

        {/* Saved Items Grid */}
        {savedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {savedItems.map((entry) => {
                if (entry.type === 'CREATIVE') {
                  return (
                    <SavedCreativeCard
                      key={`creative-${entry.savedId}`}
                      item={entry}
                    />
                  );
                }
                return (
                  <SavedCultCard key={`cult-${entry.savedId}`} item={entry} />
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border border-dashed border-border bg-card/60 p-8 text-center space-y-4 max-w-md mx-auto my-8"
          >
            <SearchX className="size-10 text-muted-foreground mx-auto" />
            <div className="space-y-1">
              <h3 className="font-editorial text-xl font-bold text-foreground">
                {searchQuery ? 'No matching saved items' : 'No saved items yet'}
              </h3>
              <p className="font-mono text-xs text-muted-foreground leading-relaxed">
                {searchQuery
                  ? `No saved creatives or cults matched "${searchQuery}".`
                  : 'Start exploring freelancers and cult collectives on Atelier and click the heart button to save them.'}
              </p>
            </div>

            {searchQuery ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="font-mono text-xs uppercase tracking-wider h-10 px-4 cursor-pointer"
              >
                <RefreshCw className="size-3.5 mr-1.5" />
                Clear Filters
              </Button>
            ) : (
              <Link href="/discover">
                <Button
                  size="sm"
                  className="font-mono text-xs uppercase tracking-wider h-10 px-6 gap-2 cursor-pointer"
                >
                  <Sparkles className="size-4" />
                  <span>Discover Talent</span>
                </Button>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
