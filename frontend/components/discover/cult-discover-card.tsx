'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { CultDiscoverItem } from './mock-data';
import { Users, Star } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { AvailabilityBadge } from './availability-badge';
import { SaveButton } from '@/components/shared/save-button';

interface CultDiscoverCardProps {
  cult: CultDiscoverItem;
  href?: string;
}

const springTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
} as const;

export function CultDiscoverCard({ cult, href }: CultDiscoverCardProps) {
  const isAvailable = cult.availability === 'AVAILABLE';
  const targetHref = href || `/discover/cult/${cult.slug}`;

  return (
    <motion.div
      layout
      transition={springTransition}
      className="w-full min-w-0 overflow-hidden"
    >
      <Link
        href={targetHref}
        className="group relative border border-border bg-card overflow-hidden hover:border-foreground transition-colors cursor-pointer w-full flex flex-col h-full min-w-0"
      >
        {/* Hero image */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden border-b border-border shrink-0">
          <img
            src={cult.coverImage}
            alt={cult.name}
            className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />

          {/* Top badges — Save button & Availability */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <SaveButton id={cult.id} type="cult" variant="card-badge" />
            <AvailabilityBadge isAvailable={isAvailable} />
          </div>

          <div className="absolute bottom-3 left-3 font-mono text-[10px] uppercase text-white/90">
            📍 {cult.location}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="p-5 space-y-2 flex-1 min-w-0">
            <h3 className="font-editorial text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
              {cult.name}
            </h3>

            <p className="font-body text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {cult.tagline}
            </p>

            {/* Member roster */}
            <div className="pt-2 space-y-1.5 min-w-0">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase text-muted-foreground">
                <span className="flex items-center gap-1 truncate">
                  <Users className="size-3 text-primary shrink-0" />
                  {cult.members.length} Members
                </span>
                <span className="shrink-0 ml-1 tabular-nums">
                  {cult.turnaround}
                </span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex -space-x-2 shrink-0">
                  {cult.members.slice(0, 4).map((m) => (
                    <Avatar key={m.id} className="border border-border size-7">
                      <AvatarImage src={m.avatar} alt={m.name} />
                      <AvatarFallback className="font-mono text-[8px]">
                        {m.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="font-mono text-[10px] text-muted-foreground truncate uppercase">
                  {cult.members
                    .map((m) => m.role)
                    .slice(0, 2)
                    .join(' • ')}
                </span>
              </div>
            </div>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-1 pt-1 min-w-0 overflow-hidden">
              {cult.tags.slice(0, 2).map((t) => (
                <span
                  key={t}
                  className="font-mono text-[9px] uppercase tracking-wider border border-border/80 bg-background px-2 py-0.5 text-foreground font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-border bg-background flex items-center justify-between font-mono text-xs">
            <div className="flex items-baseline gap-1">
              <span className="text-[9px] text-muted-foreground">from</span>
              <span className="font-bold text-primary text-sm font-mono">
                {cult.startingPrice}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="size-3.5 fill-primary text-primary" />
              <span className="font-bold text-foreground">{cult.rating}</span>
              <span className="text-muted-foreground text-[10px]">
                ({cult.reviewCount})
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
