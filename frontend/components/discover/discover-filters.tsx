'use client';

import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { CATEGORIES } from './mock-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type TabType = 'ALL' | 'CULTS' | 'FREELANCERS';
export type SortOption =
  'FEATURED' | 'RATING' | 'PRICE_LOW' | 'PRICE_HIGH' | 'PROJECTS';

interface DiscoverFiltersProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  availabilityFilter: string;
  setAvailabilityFilter: (status: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  totalCultsCount: number;
  totalFreelancersCount: number;
  onClearFilters: () => void;
}

export function DiscoverFilters({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  availabilityFilter,
  setAvailabilityFilter,
  sortBy,
  setSortBy,
  totalCultsCount,
  totalFreelancersCount,
  onClearFilters,
}: DiscoverFiltersProps) {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All Skills' ||
    availabilityFilter !== 'ALL';

  return (
    <div
      className="space-y-6 border-b border-border bg-card px-4 sm:px-6 md:px-10 lg:px-12 py-6 w-full"
      style={{ borderTop: '2px solid var(--primary)' }}
    >
      <div className="w-full space-y-5">
        {/* Main Bar: Tabs, Search & Sort Controls */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Tab Switcher */}
          <div className="flex items-center border border-border bg-card p-1">
            <button
              onClick={() => setActiveTab('ALL')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors min-h-[38px]',
                activeTab === 'ALL'
                  ? 'bg-foreground text-background font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <span>All</span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 bg-background text-foreground border border-border">
                {totalCultsCount + totalFreelancersCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('CULTS')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors min-h-[38px]',
                activeTab === 'CULTS'
                  ? 'bg-foreground text-background font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <span>Collectives</span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 bg-background text-foreground border border-border">
                {totalCultsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('FREELANCERS')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors min-h-[38px]',
                activeTab === 'FREELANCERS'
                  ? 'bg-foreground text-background font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <span>Freelancers</span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 bg-background text-foreground border border-border">
                {totalFreelancersCount}
              </span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, skill, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-9 h-11 border border-border bg-card text-foreground font-mono text-xs uppercase tracking-wider placeholder:text-muted-foreground placeholder:normal-case focus-visible:ring-primary focus-visible:border-primary rounded-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="w-56">
              <Select
                value={sortBy}
                onValueChange={(val) => setSortBy(val as SortOption)}
              >
                <SelectTrigger className="h-11 w-full border border-border bg-card font-mono text-xs uppercase tracking-wider rounded-none">
                  <div className="flex items-center gap-1.5 truncate">
                    <ArrowUpDown className="size-3.5 text-primary selection:text-background selection:bg-primary shrink-0" />
                    <SelectValue placeholder="Sort By" />
                  </div>
                </SelectTrigger>
                <SelectContent className="border border-border bg-card font-mono text-xs uppercase rounded-none z-50 shadow-lg min-w-56">
                  <SelectItem value="FEATURED">Featured First</SelectItem>
                  <SelectItem value="RATING">Highest Rating</SelectItem>
                  <SelectItem value="PROJECTS">Most Projects</SelectItem>
                  <SelectItem value="PRICE_LOW">
                    Starting Price: Low to High
                  </SelectItem>
                  <SelectItem value="PRICE_HIGH">
                    Starting Price: High to Low
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Category Pills & Availability Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3 border-t border-border/50">
          {/* Category Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="font-mono text-[10px] uppercase text-muted-foreground shrink-0 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="size-3 text-primary selection:text-background selection:bg-primary" />
              Category:
            </span>

            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    'font-mono text-[11px] uppercase tracking-wider whitespace-nowrap px-3 py-1.5 border transition-all shrink-0 min-h-[32px]',
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground font-bold selection:text-background selection:bg-primary'
                      : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground'
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Availability Pills */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-mono text-[10px] uppercase text-muted-foreground">
              Availability:
            </span>
            <div className="flex items-center border border-border bg-card p-0.5">
              {[
                { id: 'ALL', label: 'All' },
                { id: 'AVAILABLE', label: 'Available Now' },
                { id: 'BUSY', label: 'Busy' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setAvailabilityFilter(st.id)}
                  className={cn(
                    'font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 transition-colors min-h-[28px]',
                    availabilityFilter === st.id
                      ? 'bg-foreground text-background font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters Summary Row */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 pt-2 border-t border-border/40 font-mono text-xs">
            <span className="text-muted-foreground uppercase text-[10px]">
              Active Filters:
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {searchQuery && (
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] uppercase tracking-wider gap-1 border-primary text-primary selection:text-background selection:bg-primary"
                >
                  <span>Search: &ldquo;{searchQuery}&rdquo;</span>
                  <X
                    className="size-3 cursor-pointer"
                    onClick={() => setSearchQuery('')}
                  />
                </Badge>
              )}

              {selectedCategory !== 'All Skills' && (
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] uppercase tracking-wider gap-1 border-primary text-primary selection:text-background selection:bg-primary"
                >
                  <span>Skill: {selectedCategory}</span>
                  <X
                    className="size-3 cursor-pointer"
                    onClick={() => setSelectedCategory('All Skills')}
                  />
                </Badge>
              )}

              {availabilityFilter !== 'ALL' && (
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] uppercase tracking-wider gap-1 border-primary text-primary selection:text-background selection:bg-primary"
                >
                  <span>Status: {availabilityFilter}</span>
                  <X
                    className="size-3 cursor-pointer"
                    onClick={() => setAvailabilityFilter('ALL')}
                  />
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-6 font-mono text-[10px] uppercase tracking-wider text-destructive hover:text-destructive hover:bg-destructive/10 px-2"
              >
                Clear All
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
