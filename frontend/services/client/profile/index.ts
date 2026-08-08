import axios from '@/lib/axios';
import type { SuccessResponse } from '@/types/api';
import type {
  ProfileData,
  UpdateClientProfileData,
  ClientStats,
} from '@/types/client/profile';

export const clientProfileService = {
  getProfile: async (): Promise<SuccessResponse<ProfileData>> => {
    const response = await axios.get('/client-profile');
    return response.data as SuccessResponse<ProfileData>;
  },

  getStats: async (): Promise<SuccessResponse<ClientStats>> => {
    const response = await axios.get('/client-profile/stats');
    return response.data as SuccessResponse<ClientStats>;
  },

  updateProfile: async (
    data: UpdateClientProfileData
  ): Promise<SuccessResponse<ProfileData['clientProfile']>> => {
    const response = await axios.patch('/client-profile', data);
    return response.data as SuccessResponse<ProfileData['clientProfile']>;
  },

  updateAvatar: async (
    file: File
  ): Promise<SuccessResponse<ProfileData['user']>> => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await axios.patch('/client-profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data as SuccessResponse<ProfileData['user']>;
  },

  updateCoverImage: async (
    file: File
  ): Promise<SuccessResponse<ProfileData['clientProfile']>> => {
    const formData = new FormData();
    formData.append('coverImage', file);

    const response = await axios.patch(
      '/client-profile/cover-image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data as SuccessResponse<ProfileData['clientProfile']>;
  },
};
