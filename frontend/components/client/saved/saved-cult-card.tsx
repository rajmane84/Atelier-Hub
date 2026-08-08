'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Users, ExternalLink, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SaveButton } from '@/components/shared/save-button';
import type { SavedCultItemResponse } from '@/types/saved';

interface SavedCultCardProps {
  item: SavedCultItemResponse;
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

export function SavedCultCard({ item }: SavedCultCardProps) {
  const cult = item.item;
  const targetHref = `/discover/cult/${cult.slug}`;
  const savedDate = formatDate(item.savedAt);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      className="group relative border border-border bg-card overflow-hidden hover:border-foreground/60 hover:shadow-sm transition-all duration-200 flex flex-col h-full min-w-0"
    >
      {/* Hero Banner Header */}
      <div className="relative h-44 w-full overflow-hidden border-b border-border bg-muted shrink-0">
        {cult.coverImage || cult.avatarUrl ? (
          <img
            src={cult.coverImage || cult.avatarUrl || ''}
            alt={cult.name}
            className="size-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="size-full bg-linear-to-br from-neutral-800 via-neutral-900 to-black flex items-center justify-center">
            <span className="font-editorial text-2xl font-bold text-white/80 tracking-wider uppercase">
              {cult.name.slice(0, 3)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="font-mono text-[10px] uppercase tracking-wider bg-background/90 backdrop-blur-md px-2 py-0.5 border border-border text-foreground font-semibold flex items-center gap-1">
            <ShieldCheck className="size-3 text-primary selection:text-background selection:bg-primary" />
            Verified Collective
          </span>
          <SaveButton id={cult.id} type="cult" variant="card-badge" />
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white z-10 space-y-1">
          <h3 className="font-editorial text-xl font-bold tracking-tight text-white line-clamp-1">
            {cult.name}
          </h3>
          {cult.tagline && (
            <p className="font-body text-xs text-white/80 line-clamp-1">
              {cult.tagline}
            </p>
          )}
        </div>
      </div>

      {/* Body Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 min-w-0">
        <div className="space-y-3 min-w-0">
          {cult.bio ? (
            <p className="font-body text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {cult.bio}
            </p>
          ) : (
            <p className="font-body text-xs text-muted-foreground italic">
              No detailed bio available
            </p>
          )}

          {/* Members Roster */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between font-mono text-[11px] uppercase text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="size-3 text-primary selection:text-background selection:bg-primary shrink-0" />
                {cult.members.length} Active Member
                {cult.members.length === 1 ? '' : 's'}
              </span>
            </div>
            {cult.members.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 shrink-0">
                  {cult.members.slice(0, 4).map((m) => (
                    <Avatar key={m.id} className="border border-border size-7">
                      <AvatarImage src={m.avatar || ''} alt={m.name} />
                      <AvatarFallback className="font-mono text-[10px] bg-background">
                        {m.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="font-mono text-[11px] text-muted-foreground truncate uppercase">
                  {cult.members
                    .map((m) => m.role)
                    .slice(0, 2)
                    .join(' • ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer info & saved date */}
        <div className="pt-3 border-t border-border flex items-center justify-between font-mono text-xs">
          <div>
            <span className="font-bold text-primary selection:text-background selection:bg-primary text-xs uppercase tracking-widest">
              COLLECTIVE
            </span>
            {savedDate && (
              <p className="text-[11px] text-muted-foreground">
                Saved on {savedDate}
              </p>
            )}
          </div>

          <div className="font-mono text-[11px] uppercase text-muted-foreground">
            @{cult.slug}
          </div>
        </div>

        {/* Action Link */}
        <Link href={targetHref} className="w-full">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 cursor-pointer"
          >
            <span>View Cult Profile</span>
            <ExternalLink className="size-3.5" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
