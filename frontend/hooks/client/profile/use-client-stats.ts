import { useQuery } from '@tanstack/react-query';
import { clientProfileService } from '@/services/client/profile';
import { ApiError } from '@/types/api';

export function useClientStats() {
  return useQuery({
    queryKey: ['client-stats'],
    queryFn: () => clientProfileService.getStats(),
    retry: (failureCount, error) => {
      if (
        error instanceof ApiError &&
        (error.statusCode === 401 || error.statusCode === 404)
      ) {
        return false;
      }
      return failureCount < 2;
    },
  });
}
