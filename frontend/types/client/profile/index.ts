import { ClientType, Industry, CompanySize } from '../../index';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: string;
  username?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ClientProfile {
  id: string;
  clientType: ClientType;
  companyName?: string | null;
  industry?: Industry | null;
  companySize?: CompanySize | null;
  foundedYear?: string | null;
  bio?: string | null;
  website?: string | null;
  coverImage?: string | null;
  location?: string | null;
  phoneNumber?: string | null;
  phoneVerified: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientProfileCompletion {
  steps: Record<string, boolean>;
  completedSteps: number;
  totalSteps: number;
  percentage: number;
}

export interface ProfileData {
  user: UserProfile;
  clientProfile: ClientProfile;
  completion: ClientProfileCompletion;
}

export interface UpdateClientProfileData {
  clientType?: ClientType;
  companyName?: string;
  industry?: Industry;
  companySize?: CompanySize;
  foundedYear?: string;
  bio?: string;
  website?: string;
  phoneNumber?: string;
  location?: string;
}

export interface ClientStats {
  activeListings: number;
  totalListings: number;
  closedListings: number;
  applicationsReceived: number;
  savedCreatives: number;
  avgTimeToFirstApp: string;
}

export interface SendPhoneOtpData {
  phoneNumber: string;
}

export interface VerifyPhoneOtpData {
  phoneNumber: string;
  otpCode: string;
}

export interface VerifyPhoneOtpResponse {
  phoneNumber: string;
  phoneVerified: boolean;
}
