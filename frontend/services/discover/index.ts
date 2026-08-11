import axios from '@/lib/axios';
import { ApiError, type SuccessResponse } from '@/types/api';
import { RateType } from '@/types';
import type { FreelancerDiscoverItem } from '@/components/discover/mock-data';

// Shape returned by GET /discover/freelancers and /discover/freelancers/:username
// — see backend/src/controllers/discover.controller.ts `toFreelancerDiscoverItem`.
interface RawFreelancer {
  id: string;
  type: 'freelancer';
  name: string;
  username: string | null;
  headline: string | null;
  bio: string | null;
  avatarUrl: string | null;
  coverImage: string | null;
  location: string | null;
  skills: string[];
  rateType: RateType | null;
  rateAmount: number | null;
  experienceYears: number | null;
  completedProjects: number;
  rating: number | null;
  reviewCount: number;
  isVerified: boolean;
  availability: 'AVAILABLE' | 'BUSY' | 'NOT_AVAILABLE';
  isFeatured: boolean;
  portfolio: {
    id: string;
    title: string;
    image: string | null;
    category: string | null;
  }[];
  tools: string[];
}

// Maps the backend response onto the shape every discover UI component was
// already built against (FreelancerDiscoverItem in mock-data.ts), so the
// existing cards/spotlight/detail view work unchanged with real data.
// Fields the backend can leave unset (headline, bio, location, avatarUrl,
// coverImage) fall back to '' — none of the discover components have a
// distinct "not set" treatment for these today (unlike rating/rateType,
// which do), so this is a display simplification, not a data loss.
function transformFreelancer(raw: RawFreelancer): FreelancerDiscoverItem {
  return {
    id: raw.id,
    type: 'freelancer',
    name: raw.name,
    username: raw.username ?? '',
    headline: raw.headline ?? '',
    bio: raw.bio ?? '',
    avatarUrl: raw.avatarUrl ?? '',
    coverImage: raw.coverImage ?? '',
    location: raw.location ?? '',
    skills: raw.skills,
    rateType: raw.rateType,
    rateAmount: raw.rateAmount,
    experienceYears: raw.experienceYears ?? 0,
    completedProjects: raw.completedProjects,
    rating: raw.rating,
    reviewCount: raw.reviewCount,
    isVerified: raw.isVerified,
    availability: raw.availability,
    isFeatured: raw.isFeatured,
    portfolio: raw.portfolio.map((p) => ({
      id: p.id,
      title: p.title,
      image: p.image ?? '',
      category: p.category ?? 'Uncategorized',
    })),
    tools: raw.tools,
  };
}

export const discoverService = {
  // Fetches the full freelancer roster (high limit) so the existing
  // client-side search/filter/sort in discover-view.tsx — written against a
  // static mock array — keeps working unchanged against real data.
  getFreelancers: async (): Promise<FreelancerDiscoverItem[]> => {
    const response = await axios.get('/discover/freelancers', {
      params: { limit: 100 },
    });
    const body = response.data as SuccessResponse<RawFreelancer[]>;
    return body.data.map(transformFreelancer);
  },

  getFreelancerByUsername: async (
    username: string
  ): Promise<FreelancerDiscoverItem | null> => {
    try {
      const response = await axios.get(
        `/discover/freelancers/${encodeURIComponent(username)}`
      );
      const body = response.data as SuccessResponse<RawFreelancer>;
      return transformFreelancer(body.data);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  },
};
