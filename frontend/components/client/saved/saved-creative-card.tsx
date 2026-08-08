'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Star, MapPin, ExternalLink } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SaveButton } from '@/components/shared/save-button';
import type { SavedCreativeItemResponse } from '@/types/saved';
import { formatRate, type RateType } from '@/components/discover/mock-data';

interface SavedCreativeCardProps {
  item: SavedCreativeItemResponse;
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function SavedCreativeCard({ item }: SavedCreativeCardProps) {
  const { creative } = { creative: item.item };
  const targetHref = creative.username
    ? `/discover/freelancer/${creative.username}`
    : `/discover`;
  const savedDate = formatDate(item.savedAt);
  const heroImage = creative.portfolio[0]?.image || null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className="group relative border border-border bg-card overflow-hidden hover:border-foreground/60 hover:shadow-sm transition-all duration-200 flex flex-col h-full min-w-0"
    >
      {/* Top Banner / Hero Portfolio Image */}
      <div className="relative h-44 w-full overflow-hidden border-b border-border bg-muted shrink-0">
        {heroImage ? (
          <img
            src={heroImage}
            alt={`${creative.name}'s work`}
            className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="size-full bg-linear-to-br from-muted via-background to-muted flex items-center justify-center">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Atelier Creative
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="font-mono text-[10px] uppercase tracking-wider bg-background/90 backdrop-blur-md px-2 py-0.5 border border-border text-foreground font-semibold">
            {creative.availability === 'AVAILABLE' ? '🟢 Available' : '🔴 Busy'}
          </span>
          <SaveButton id={creative.id} type="creative" variant="card-badge" />
        </div>

        {/* Bottom Hero Info Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white z-10">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="size-9 border-2 border-white/60 shrink-0">
              <AvatarImage src={creative.avatarUrl || ''} alt={creative.name} />
              <AvatarFallback className="font-mono text-xs bg-background text-foreground">
                {creative.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-editorial text-lg font-bold tracking-tight text-white line-clamp-1">
                {creative.name}
              </p>
              {creative.location && (
                <p className="font-mono text-[10px] text-white/80 flex items-center gap-1">
                  <MapPin className="size-3 shrink-0" />
                  <span className="truncate">{creative.location}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 min-w-0">
        <div className="space-y-2 min-w-0">
          {creative.username && (
            <p className="font-mono text-[10px] text-muted-foreground">
              @{creative.username}
            </p>
          )}

          {creative.headline ? (
            <p className="font-body text-xs font-medium text-foreground line-clamp-2 leading-relaxed">
              {creative.headline}
            </p>
          ) : (
            <p className="font-body text-xs text-muted-foreground italic">
              No headline provided
            </p>
          )}

          {/* Skill tags */}
          {creative.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {creative.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="font-mono text-[10px] uppercase tracking-wider border border-border/80 bg-background px-2 py-0.5 text-foreground font-medium"
                >
                  {skill}
                </span>
              ))}
              {creative.skills.length > 3 && (
                <span className="font-mono text-[10px] text-muted-foreground py-0.5">
                  +{creative.skills.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Portfolio thumbnails preview */}
        {creative.portfolio.length > 1 && (
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {creative.portfolio.slice(0, 3).map((p) => (
              <div
                key={p.id}
                className="h-12 border border-border overflow-hidden bg-muted"
              >
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="size-full object-cover hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="size-full bg-muted/50" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Saved Date & Rate/Rating Summary */}
        <div className="pt-3 border-t border-border flex items-center justify-between font-mono text-xs">
          <div className="space-y-0.5">
            <span className="font-bold text-primary selection:text-background selection:bg-primary text-sm">
              {formatRate(
                creative.rateType as RateType | null,
                creative.rateAmount
              )}
            </span>
            {savedDate && (
              <p className="text-[11px] text-muted-foreground">
                Saved on {savedDate}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Star className="size-3.5 fill-primary text-primary selection:text-background selection:bg-primary" />
            <span className="font-bold text-foreground">
              {creative.rating !== null ? creative.rating : 'New'}
            </span>
            {creative.rating !== null && (
              <span className="text-muted-foreground text-[11px]">
                ({creative.reviewCount})
              </span>
            )}
          </div>
        </div>

        {/* Quick View Link Button */}
        <Link href={targetHref} className="w-full">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 cursor-pointer"
          >
            <span>View Profile</span>
            <ExternalLink className="size-3.5" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
