import axios from '@/lib/axios';
import type { SuccessResponse, PaginationMeta } from '@/types/api';
import type {
  SavedItemResponse,
  SavedIdsResponse,
  SavedQueryFilters,
  SavedItemsListMeta,
} from '@/types/saved';

export const savedService = {
  getSavedItems: async (
    filters?: SavedQueryFilters
  ): Promise<{
    items: SavedItemResponse[];
    pagination?: PaginationMeta;
    meta?: SavedItemsListMeta;
  }> => {
    const response = await axios.get('/saved', {
      params: filters,
    });
    const body = response.data as SuccessResponse<SavedItemResponse[]>;
    return {
      items: body.data,
      pagination: body.pagination,
      meta: (body as unknown as { meta?: SavedItemsListMeta }).meta,
    };
  },

  getSavedIds: async (): Promise<SavedIdsResponse> => {
    const response = await axios.get('/saved/ids');
    const body = response.data as SuccessResponse<SavedIdsResponse>;
    return body.data;
  },

  toggleSaveCreative: async (
    creativeProfileId: string
  ): Promise<{ isSaved: boolean }> => {
    const response = await axios.post(
      `/saved/creative/${encodeURIComponent(creativeProfileId)}/toggle`
    );
    const body = response.data as SuccessResponse<{ isSaved: boolean }>;
    return body.data;
  },

  toggleSaveCult: async (cultId: string): Promise<{ isSaved: boolean }> => {
    const response = await axios.post(
      `/saved/cult/${encodeURIComponent(cultId)}/toggle`
    );
    const body = response.data as SuccessResponse<{ isSaved: boolean }>;
    return body.data;
  },

  saveCreative: async (creativeProfileId: string): Promise<unknown> => {
    const response = await axios.post(
      `/saved/creative/${encodeURIComponent(creativeProfileId)}`
    );
    return response.data;
  },

  unsaveCreative: async (creativeProfileId: string): Promise<unknown> => {
    const response = await axios.delete(
      `/saved/creative/${encodeURIComponent(creativeProfileId)}`
    );
    return response.data;
  },

  saveCult: async (cultId: string): Promise<unknown> => {
    const response = await axios.post(
      `/saved/cult/${encodeURIComponent(cultId)}`
    );
    return response.data;
  },

  unsaveCult: async (cultId: string): Promise<unknown> => {
    const response = await axios.delete(
      `/saved/cult/${encodeURIComponent(cultId)}`
    );
    return response.data;
  },
};
