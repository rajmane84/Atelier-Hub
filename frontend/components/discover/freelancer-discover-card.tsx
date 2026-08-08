'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { FreelancerDiscoverItem, formatRate } from './mock-data';
import { Star } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { AvailabilityBadge } from './availability-badge';
import { SaveButton } from '@/components/shared/save-button';

interface FreelancerDiscoverCardProps {
  freelancer: FreelancerDiscoverItem;
  href?: string;
}

const springTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
} as const;

export function FreelancerDiscoverCard({
  freelancer,
  href,
}: FreelancerDiscoverCardProps) {
  const isAvailable = freelancer.availability === 'AVAILABLE';
  const targetHref = href || `/discover/freelancer/${freelancer.username}`;
  const heroImage = freelancer.portfolio[0]?.image ?? null;

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
        {/* Hero image — first portfolio piece, same dimensions as cult card */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden border-b border-border shrink-0">
          {heroImage ? (
            <img
              src={heroImage}
              alt={`${freelancer.name}'s work`}
              className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="size-full bg-muted flex items-center justify-center">
              <Avatar className="size-20 border-2 border-border">
                <AvatarImage src={freelancer.avatarUrl} alt={freelancer.name} />
                <AvatarFallback className="font-mono font-bold">
                  {freelancer.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />

          {/* Top badges — Save button & Availability */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <SaveButton
              id={freelancer.id}
              type="creative"
              variant="card-badge"
            />
            <AvailabilityBadge isAvailable={isAvailable} />
          </div>

          {/* Avatar + location — mirrors cult card's location overlay */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <Avatar className="size-8 border border-white/40 shrink-0">
              <AvatarImage src={freelancer.avatarUrl} alt={freelancer.name} />
              <AvatarFallback className="font-mono text-[9px] bg-background">
                {freelancer.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-mono text-[10px] uppercase text-white/90">
              📍 {freelancer.location}
            </span>
          </div>
        </div>

        {/* Content — same zone layout as cult card */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="p-5 space-y-2 flex-1 min-w-0">
            {/* Name + handle */}
            <div>
              <h3 className="font-editorial text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
                {freelancer.name}
              </h3>
              <p className="font-mono text-[10px] text-muted-foreground">
                @{freelancer.username}
              </p>
            </div>

            {/* Headline — parallel to cult tagline */}
            <p className="font-body text-xs font-medium text-foreground leading-snug line-clamp-2">
              {freelancer.headline}
            </p>

            {/* Portfolio thumbnails — parallel to member roster */}
            <div className="pt-2 space-y-1.5 min-w-0">
              <div className="grid grid-cols-3 gap-1.5">
                {freelancer.portfolio.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="relative h-14 overflow-hidden border border-border group-hover:border-foreground/40 transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Skill tags — same position as discipline tags on cult card */}
            <div className="flex flex-wrap gap-1 pt-1 min-w-0 overflow-hidden">
              {freelancer.skills.slice(0, 2).map((skill) => (
                <span
                  key={skill}
                  className="font-mono text-[9px] uppercase tracking-wider border border-border/80 bg-background px-2 py-0.5 text-foreground font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Footer — identical structure to cult card footer */}
          <div className="px-5 py-3 border-t border-border bg-background flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-primary text-sm font-mono">
              {formatRate(freelancer.rateType, freelancer.rateAmount)}
            </span>
            <div className="flex items-center gap-1">
              <Star className="size-3.5 fill-primary text-primary" />
              <span className="font-bold text-foreground">
                {freelancer.rating !== null ? freelancer.rating : 'New'}
              </span>
              {freelancer.rating !== null && (
                <span className="text-muted-foreground text-[10px]">
                  ({freelancer.reviewCount})
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
