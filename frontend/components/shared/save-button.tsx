'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import {
  useSavedIds,
  useToggleSaveCreative,
  useToggleSaveCult,
} from '@/hooks/saved/use-saved';
import { cn } from '@/lib/cn';

interface SaveButtonProps {
  id: string;
  type: 'creative' | 'cult';
  variant?: 'icon' | 'button' | 'card-badge';
  className?: string;
}

export function SaveButton({
  id,
  type,
  variant = 'icon',
  className,
}: SaveButtonProps) {
  const { data: savedIds } = useSavedIds();
  const toggleCreative = useToggleSaveCreative();
  const toggleCult = useToggleSaveCult();

  const isSaved =
    type === 'creative'
      ? (savedIds?.creativeIds?.includes(id) ?? false)
      : (savedIds?.cultIds?.includes(id) ?? false);

  const isPending =
    type === 'creative' ? toggleCreative.isPending : toggleCult.isPending;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPending) return;

    if (type === 'creative') {
      toggleCreative.mutate(id);
    } else {
      toggleCult.mutate(id);
    }
  };

  if (variant === 'button') {
    return (
      <Button
        variant={isSaved ? 'default' : 'outline'}
        size="sm"
        onClick={handleClick}
        disabled={isPending}
        className={cn(
          'font-mono text-xs uppercase tracking-wider gap-2 cursor-pointer transition-all',
          isSaved
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'hover:border-primary hover:text-primary',
          className
        )}
      >
        <motion.div
          animate={isSaved ? { scale: [1, 1.25, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={cn(
              'size-4 transition-colors',
              isSaved ? 'fill-current text-current' : 'text-muted-foreground'
            )}
          />
        </motion.div>
        <span>{isSaved ? 'Saved' : 'Save'}</span>
      </Button>
    );
  }

  if (variant === 'card-badge') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        aria-label={isSaved ? 'Remove from saved' : 'Save item'}
        className={cn(
          'size-9 rounded-full bg-background/80 backdrop-blur-md border border-border flex items-center justify-center shadow-xs transition-all hover:scale-110 active:scale-95 cursor-pointer z-10',
          isSaved
            ? 'border-primary/50 text-primary'
            : 'text-muted-foreground hover:text-foreground hover:border-foreground/40',
          className
        )}
      >
        <motion.div
          animate={isSaved ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={cn(
              'size-4 transition-colors',
              isSaved ? 'fill-primary text-primary' : ''
            )}
          />
        </motion.div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isSaved ? 'Remove from saved' : 'Save item'}
      className={cn(
        'p-2 rounded-md hover:bg-muted/80 transition-colors cursor-pointer text-muted-foreground hover:text-foreground',
        isSaved &&
          'text-primary selection:text-background selection:bg-primary',
        className
      )}
    >
      <motion.div
        animate={isSaved ? { scale: [1, 1.25, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={cn(
            'size-5 transition-colors',
            isSaved ? 'fill-primary text-primary' : 'text-muted-foreground'
          )}
        />
      </motion.div>
    </button>
  );
}
