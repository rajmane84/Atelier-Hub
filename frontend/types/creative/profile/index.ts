import {
  AvailabilityStatus,
  SkillExpertiseLevel,
  EmploymentType,
  Degree,
  RateType,
} from '../../index';

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

export interface CreativeProfile {
  id: string;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  availability: AvailabilityStatus;
  onboardingCompleted: boolean;
  coverImage?: string | null;
  resumeUrl?: string | null;
  resumeFileName?: string | null;
  resumeUploadedAt?: string | null;
  rateType?: RateType | null;
  rateAmount?: number | null;
  experienceYears?: number | null;
  tools: string[];
  isVerified: boolean;
  isFeatured: boolean;
  completedProjects: number;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
}

export interface CreativeSkill {
  id: string;
  name: string;
  level?: SkillExpertiseLevel | null;
  skill: Skill;
}

export interface Experience {
  id: string;
  title: string;
  employmentType: EmploymentType;
  companyName?: string | null;
  industry?: string | null;
  startDate: string;
  endDate?: string | null;
  currentlyWorking: boolean;
  description?: string | null;
  skills: string[];
}

export interface Education {
  id: string;
  country: string;
  school: string;
  degree: Degree;
  fieldOfStudy: string;
  yearOfGraduation: string;
}

export interface ProfileCompletion {
  steps: {
    about: boolean;
    skills: boolean;
    experience: boolean;
    education: boolean;
    portfolio: boolean;
  };
  completedSteps: number;
  totalSteps: number;
  percentage: number;
}

export interface ProfileData {
  user: UserProfile;
  creativeProfile: CreativeProfile & {
    skills: CreativeSkill[];
    experiences: Experience[];
    education: Education[];
  };
  completion: ProfileCompletion;
}

export interface UpdateProfileData {
  headline?: string;
  bio?: string;
  availability?: AvailabilityStatus;
  rateType?: RateType | null;
  rateAmount?: number | null;
  experienceYears?: number | null;
  tools?: string[];
}

export interface SetLocationData {
  location: string;
}

export interface UpdateSkillsData {
  skills: Array<{
    name: string;
    expertise?: SkillExpertiseLevel;
  }>;
}

export interface UpdateAvailabilityData {
  availability: AvailabilityStatus;
}

export interface UpdateEducationData {
  education: Array<{
    id?: string;
    school: string;
    degree: Degree;
    fieldOfStudy: string;
    country: string;
    yearOfGraduation: string;
  }>;
}

export interface UpdateExperienceData {
  experiences: Array<{
    id?: string;
    title: string;
    employmentType: EmploymentType;
    companyName?: string;
    industry?: string;
    startDate: string;
    endDate?: string;
    currentlyWorking: boolean;
    description?: string;
    skills: string[];
  }>;
}
