export type SavedItemType = 'ALL' | 'CREATIVE' | 'CULT';

export interface SavedCreativeData {
  id: string;
  userId: string;
  name: string;
  username: string | null;
  avatarUrl: string | null;
  headline: string | null;
  bio: string | null;
  location: string | null;
  availability: 'AVAILABLE' | 'UNAVAILABLE' | 'BUSY';
  rateType: string | null;
  rateAmount: number | null;
  skills: string[];
  rating: number | null;
  reviewCount: number;
  portfolio: Array<{
    id: string;
    title: string;
    image: string;
  }>;
}

export interface SavedCultData {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  bio: string | null;
  avatarUrl: string | null;
  coverImage: string | null;
  memberCount: number;
  startingPrice: string | null;
  startingPriceNum: number | null;
  turnaround: string | null;
  rating: number | null;
  reviewCount: number;
  location: string | null;
  members: Array<{
    id: string;
    name: string;
    role: string;
    avatar: string | null;
  }>;
}

export interface SavedCreativeItemResponse {
  savedId: string;
  savedAt: string;
  type: 'CREATIVE';
  item: SavedCreativeData;
}

export interface SavedCultItemResponse {
  savedId: string;
  savedAt: string;
  type: 'CULT';
  item: SavedCultData;
}

export type SavedItemResponse =
  SavedCreativeItemResponse | SavedCultItemResponse;

export interface SavedItemsListMeta {
  totalCreatives: number;
  totalCults: number;
}

export interface SavedIdsResponse {
  creativeIds: string[];
  cultIds: string[];
}

export interface SavedQueryFilters {
  type?: SavedItemType;
  search?: string;
  page?: number;
  limit?: number;
}
