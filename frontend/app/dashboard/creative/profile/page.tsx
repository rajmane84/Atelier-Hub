'use client';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { useProfile } from '@/hooks/creative/profile';
import {
  ProfileHeader,
  ProfileSkills,
  ProfileExperience,
  ProfileEducation,
  ProfilePortfolio,
  ProfileRateDetails,
} from '@/components/creative/profile';
import { EmailVerificationCard } from '@/components/auth/email-verification-card';

export default function CreativeProfilePage() {
  const { data: profileData, isLoading, error, refetch } = useProfile();

  if (isLoading) {
    return <LoadingState message="Loading profile details..." />;
  }

  if (error || !profileData) {
    return (
      <ErrorState
        title="Couldn't load your profile"
        onRetry={() => refetch()}
      />
    );
  }

  const { user, creativeProfile } = profileData.data;

  // Transform skills data to match component expectations
  const skills = creativeProfile.skills.map((skill) => ({
    id: skill.id,
    name: skill.name,
    level: skill.level ?? 'INTERMEDIATE',
  }));

  return (
    <div className="w-full">
      <ProfileHeader
        user={{
          name: user.name,
          username: user.username || '',
          email: user.email,
          emailVerified: user.emailVerified ?? false,
          image: user.image ?? undefined,
        }}
        profile={{
          headline: creativeProfile.headline || '',
          bio: creativeProfile.bio || '',
          location: creativeProfile.location || '',
          availability: creativeProfile.availability,
          coverImage: creativeProfile.coverImage,
        }}
      />

      <div className="py-12 px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Email Verification Section */}
        <EmailVerificationCard
          email={user.email}
          isVerified={user.emailVerified ?? false}
        />

        <div className="space-y-12 md:space-y-16">
          <ProfileSkills skills={skills} />
          <ProfileRateDetails
            rateType={creativeProfile.rateType}
            rateAmount={creativeProfile.rateAmount}
            experienceYears={creativeProfile.experienceYears}
            tools={creativeProfile.tools}
          />
          <ProfileExperience experiences={creativeProfile.experiences} />
          <ProfileEducation education={creativeProfile.education} />
          <ProfilePortfolio />
        </div>
      </div>
    </div>
  );
}
