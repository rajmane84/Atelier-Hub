import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { savedService } from '@/services/saved.service';
import { handleApiError } from '@/lib/handle-error';
import { toast } from 'sonner';
import type { SavedQueryFilters } from '@/types/saved';

export const SAVED_KEYS = {
  all: ['saved-items'] as const,
  list: (filters?: SavedQueryFilters) => ['saved-items', filters] as const,
  ids: ['saved-ids'] as const,
};

export function useSavedItems(filters?: SavedQueryFilters) {
  return useQuery({
    queryKey: SAVED_KEYS.list(filters),
    queryFn: () => savedService.getSavedItems(filters),
    placeholderData: keepPreviousData,
  });
}

export function useSavedIds() {
  return useQuery({
    queryKey: SAVED_KEYS.ids,
    queryFn: () => savedService.getSavedIds(),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

export function useToggleSaveCreative() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (creativeProfileId: string) =>
      savedService.toggleSaveCreative(creativeProfileId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SAVED_KEYS.all });
      queryClient.invalidateQueries({ queryKey: SAVED_KEYS.ids });
      queryClient.invalidateQueries({ queryKey: ['client-stats'] });

      if (data.isSaved) {
        toast.success('Saved creative to favorites');
      } else {
        toast.success('Removed creative from saved');
      }
    },
    onError: (error) => {
      handleApiError(error, 'Failed to update saved creative');
    },
  });
}

export function useToggleSaveCult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cultId: string) => savedService.toggleSaveCult(cultId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SAVED_KEYS.all });
      queryClient.invalidateQueries({ queryKey: SAVED_KEYS.ids });

      if (data.isSaved) {
        toast.success('Saved cult to favorites');
      } else {
        toast.success('Removed cult from saved');
      }
    },
    onError: (error) => {
      handleApiError(error, 'Failed to update saved cult');
    },
  });
}
