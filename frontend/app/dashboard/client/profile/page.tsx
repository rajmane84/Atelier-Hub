'use client';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { useClientProfile } from '@/hooks/client/profile';
import {
  ProfileHeader,
  ProfileBusinessDetails,
} from '@/components/client/profile';
import { EmailVerificationCard } from '@/components/auth/email-verification-card';

export default function ClientProfilePage() {
  const { data: profileData, isLoading, error, refetch } = useClientProfile();

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

  const { user, clientProfile } = profileData.data;

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
          clientType: clientProfile.clientType,
          companyName: clientProfile.companyName,
          bio: clientProfile.bio || '',
          location: clientProfile.location || '',
          phoneNumber: clientProfile.phoneNumber,
          phoneVerified: clientProfile.phoneVerified,
          coverImage: clientProfile.coverImage,
        }}
      />

      <div className="py-12 px-4 sm:px-6 lg:px-8 space-y-10">
        <EmailVerificationCard
          email={user.email}
          isVerified={user.emailVerified ?? false}
        />

        <div className="space-y-12 md:space-y-16">
          <ProfileBusinessDetails
            clientType={clientProfile.clientType}
            companyName={clientProfile.companyName}
            industry={clientProfile.industry}
            companySize={clientProfile.companySize}
            foundedYear={clientProfile.foundedYear}
            website={clientProfile.website}
            phoneNumber={clientProfile.phoneNumber}
            phoneVerified={clientProfile.phoneVerified}
          />
        </div>
      </div>
    </div>
  );
}
