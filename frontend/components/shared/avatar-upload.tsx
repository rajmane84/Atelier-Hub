'use client';

import { useRef, useState, useEffect } from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { toast } from 'sonner';
import { MAX_AVATAR_SIZE, ALLOWED_AVATAR_TYPES } from '@/constants';

interface AvatarUploadProps {
  name: string;
  image?: string | null;
  isUploading: boolean;
  onUpload: (file: File) => void;
}

export default function AvatarUpload({
  name,
  image,
  isUploading,
  onUpload,
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [displayImage, setDisplayImage] = useState<string | undefined>('');

  // Preload new image to prevent fallback flash
  useEffect(() => {
    if (image !== displayImage) {
      if (image) {
        const img = new Image();
        img.onload = () => setDisplayImage(image);
        img.src = image;
      } else {
        setDisplayImage(undefined);
      }
    }
  }, [image, displayImage]);

  const handleButtonClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      toast.error('Please upload a JPEG, PNG, or WebP image');
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    onUpload(file);
  };

  return (
    <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 sm:-bottom-12 md:-bottom-14 flex flex-col items-center">
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={isUploading}
        aria-busy={isUploading}
        className="group relative block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label="Change profile picture"
      >
        <Avatar className="size-22 sm:size-44 md:size-48 rounded-2xl border-4 border-background shadow-sm transition-opacity group-focus-visible:opacity-90">
          <AvatarImage
            src={displayImage || '/fallback-avatar.webp'}
            alt={name}
          />
        </Avatar>

        <span
          className={cn(
            'absolute -bottom-2 -right-2 z-10 flex size-8 sm:size-7 md:size-8 items-center justify-center rounded-full bg-background shadow-md transition-transform duration-200 ease-out motion-safe:group-hover:scale-110 motion-safe:group-focus-visible:scale-110 group-active:scale-95',
            isUploading && 'motion-safe:group-hover:scale-100'
          )}
        >
          {isUploading ? (
            <Loader2 className="size-4 sm:size-3.5 md:size-4 animate-spin" />
          ) : (
            <Camera className="size-4 sm:size-3.5 md:size-4" />
          )}
        </span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
