'use client';

import { useState } from 'react';
import {
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  ShieldAlert,
  Edit2,
  Loader2,
  X,
  Share2,
  Building2,
  User as UserIcon,
  Smartphone,
} from 'lucide-react';
import { PhoneVerificationModal } from './phone-verification-modal';
import { AvatarUpload, CoverImageUpload, StatusTag } from '@/components/shared';
import { ClientType } from '@/types';
import { cn } from '@/lib/cn';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  useUpdateClientProfile,
  useUpdateAvatar,
  useUpdateCoverImage,
} from '@/hooks/client/profile';
import { handleApiError } from '@/lib/handle-error';
import { COVER_IMAGE_ASPECT_RATIO } from '@/constants';
import { profileHeaderSchema } from '@/validations/client/profile';

interface ProfileHeaderProps {
  user: {
    name: string;
    username: string;
    email: string;
    emailVerified?: boolean;
    image?: string | null;
  };
  profile: {
    clientType: ClientType | string;
    companyName?: string | null;
    bio: string;
    location: string;
    phoneNumber?: string | null;
    phoneVerified?: boolean;
    coverImage?: string | null;
  };
}

export default function ProfileHeader({ user, profile }: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const [localBio, setLocalBio] = useState(profile.bio);
  const [localLocation, setLocalLocation] = useState(profile.location);
  const { updateProfileMutation } = useUpdateClientProfile();
  const { updateAvatarMutation } = useUpdateAvatar();
  const { updateCoverImageMutation } = useUpdateCoverImage();

  const displayName =
    profile.clientType === ClientType.COMPANY && profile.companyName
      ? profile.companyName
      : user.name;

  const handleEditProfile = () => {
    setLocalBio(profile.bio);
    setLocalLocation(profile.location);
    setIsEditing(true);
  };

  const handleSave = () => {
    const validationResult = profileHeaderSchema.safeParse({
      bio: localBio || undefined,
      location: localLocation || undefined,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      if (errors.bio) {
        toast.error(errors.bio[0]);
        return;
      }
      if (errors.location) {
        toast.error(errors.location[0]);
        return;
      }
      return;
    }

    updateProfileMutation.mutate(
      { bio: localBio, location: localLocation },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success('Profile updated successfully');
        },
        onError: (error) => {
          handleApiError(error, 'Failed to update profile');
        },
      }
    );
  };

  const handleCancel = () => {
    setLocalBio(profile.bio);
    setLocalLocation(profile.location);
    setIsEditing(false);
  };

  const handleShareProfile = () => {
    toast('Share profile — coming soon');
  };

  return (
    <div>
      {/* Banner */}
      <div
        className="group relative w-full bg-muted"
        style={{ aspectRatio: COVER_IMAGE_ASPECT_RATIO }}
      >
        <CoverImageUpload
          coverImage={profile.coverImage}
          isUploading={updateCoverImageMutation.isPending}
          onUpload={(file) => updateCoverImageMutation.mutateAsync(file)}
        />

        <div className="absolute top-3 right-3 sm:top-4 sm:right-6 hidden sm:block">
          <StatusTag
            label={
              profile.clientType === ClientType.COMPANY
                ? 'Company'
                : 'Individual'
            }
            icon={
              profile.clientType === ClientType.COMPANY ? Building2 : UserIcon
            }
            variant="neutral"
            className="bg-background/95 backdrop-blur-sm"
          />
        </div>

        <AvatarUpload
          name={user.name}
          image={user.image}
          isUploading={updateAvatarMutation.isPending}
          onUpload={(file) => updateAvatarMutation.mutate(file)}
        />
      </div>

      {/* Content below banner - centered */}
      <div className="flex flex-col items-center bg-background pt-8 pb-6 sm:pt-14 sm:pb-8 md:pt-16 md:pb-10 px-4 sm:px-10 md:px-12 text-center">
        <div className="mb-4 sm:hidden">
          <StatusTag
            label={
              profile.clientType === ClientType.COMPANY
                ? 'Company'
                : 'Individual'
            }
            icon={
              profile.clientType === ClientType.COMPANY ? Building2 : UserIcon
            }
            variant="neutral"
            className="bg-background/95 backdrop-blur-sm"
          />
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-bold text-foreground leading-tight">
          {displayName}
        </h1>
        {user.username && (
          <span className="mt-1 text-sm font-mono text-muted-foreground">
            @{user.username}
          </span>
        )}

        {isEditing ? (
          <div
            className={cn(
              'mt-4 w-full max-w-2xl space-y-4 p-6 rounded-none border border-border bg-background',
              'animate-in fade-in slide-in-from-top-4 duration-300 ease-out',
              'transition-all duration-300 ease-out',
              'motion-reduce:animate-none motion-reduce:transition-none'
            )}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="bio"
                  className="font-mono text-[11px] uppercase tracking-widest text-foreground block mb-2"
                >
                  Bio
                </Label>
                <span
                  className={cn(
                    'font-mono text-[10px]',
                    localBio.length >= 450
                      ? 'text-amber-600'
                      : 'text-muted-foreground',
                    localBio.length >= 500 ? 'text-red-600' : ''
                  )}
                >
                  {localBio.length}/500
                </span>
              </div>
              <Textarea
                id="bio"
                placeholder="Tell creatives about yourself or your business..."
                rows={4}
                value={localBio}
                onChange={(e) => setLocalBio(e.target.value.slice(0, 500))}
                maxLength={500}
                className={cn(
                  'rounded-none border-border focus-visible:ring-0 focus-visible:border-primary resize-none transition-colors duration-200 ease-out',
                  localBio.length >= 500 &&
                    'border-red-500 focus-visible:border-red-500'
                )}
              />
            </div>

            <div className="space-y-4">
              <Label
                htmlFor="location"
                className="font-mono text-[11px] uppercase tracking-widest text-foreground block mb-2"
              >
                Location
              </Label>
              <Input
                id="location"
                type="text"
                placeholder="e.g., Mumbai, India"
                value={localLocation}
                onChange={(e) => setLocalLocation(e.target.value.slice(0, 100))}
                maxLength={100}
                className="rounded-none border-border focus-visible:ring-0 focus-visible:border-primary transition-colors duration-200 ease-out"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={updateProfileMutation.isPending}
                className="flex-1 h-10 transition-all duration-200 ease-out hover:bg-muted/80 motion-reduce:transition-none"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={updateProfileMutation.isPending}
                className="flex-1 h-10 gap-1.5 transition-all duration-200 ease-out hover:bg-primary/90 motion-reduce:transition-none"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>Save Changes</>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <>
            {profile.bio ? (
              <div className="mt-4 font-editorial text-base sm:text-lg leading-relaxed opacity-90 max-w-2xl animate-in fade-in duration-500 ease-out motion-reduce:animate-none">
                {profile.bio.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm sm:text-base md:text-lg font-body font-medium italic text-muted-foreground max-w-2xl">
                Add a bio to introduce yourself
              </p>
            )}
          </>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-6 gap-y-2">
          {profile.location ? (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5 text-primary" />
              <span>{profile.location}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleEditProfile}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <MapPin className="size-3.5 text-primary" />
              Add location
            </button>
          )}

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="size-3.5 text-primary" />
            <span className="hidden sm:inline">{user.email}</span>
            <span className="sm:hidden">{user.email.split('@')[0]}@...</span>
            {user.emailVerified ? (
              <StatusTag
                label="Verified"
                icon={CheckCircle2}
                variant="positive"
              />
            ) : (
              <StatusTag
                label="Not Verified"
                icon={ShieldAlert}
                variant="attention"
              />
            )}
          </div>

          {profile.phoneNumber && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1.5">
                <Phone className="size-3.5 text-primary" />
                <span>{profile.phoneNumber}</span>
              </div>
              {profile.phoneVerified ? (
                <StatusTag
                  label="Verified"
                  icon={CheckCircle2}
                  variant="positive"
                />
              ) : (
                <StatusTag
                  label="Not Verified"
                  icon={ShieldAlert}
                  variant="attention"
                />
              )}
            </div>
          )}
        </div>

        <PhoneVerificationModal
          isOpen={isPhoneModalOpen}
          onClose={() => setIsPhoneModalOpen(false)}
          initialPhoneNumber={profile.phoneNumber}
        />

        <div className="mt-5 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant={'outline'}
            onClick={isEditing ? handleCancel : handleEditProfile}
            size={'sm'}
            className="w-full sm:w-auto transition-all duration-200 ease-out hover:bg-muted/80 motion-reduce:transition-none"
          >
            {isEditing ? (
              <>
                <X className="size-3 mr-1.5" />
                Cancel
              </>
            ) : (
              <>
                <Edit2 className="size-3 mr-1.5" />
                Edit Profile
              </>
            )}
          </Button>

          {!profile.phoneVerified && (
            <Button
              type="button"
              variant={'secondary'}
              onClick={() => setIsPhoneModalOpen(true)}
              size={'sm'}
              className="w-full sm:w-auto transition-all duration-200 ease-out motion-reduce:transition-none"
            >
              <Smartphone className="size-3 mr-1.5" />
              Verify Phone
            </Button>
          )}

          <Button
            type="button"
            variant={'default'}
            onClick={handleShareProfile}
            size={'sm'}
            className="w-full sm:w-auto"
          >
            <Share2 className="size-3 mr-1.5" />
            Share Profile
          </Button>
        </div>
      </div>
    </div>
  );
}
