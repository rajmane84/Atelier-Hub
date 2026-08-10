import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { clientProfileService } from '@/services/client/profile';
import { handleApiError } from '@/lib/handle-error';
import type {
  SendPhoneOtpData,
  VerifyPhoneOtpData,
} from '@/types/client/profile';

export function useSendPhoneOtp() {
  const sendOtpMutation = useMutation({
    mutationFn: (data: SendPhoneOtpData) =>
      clientProfileService.sendPhoneOtp(data),
    onSuccess: (res) => {
      toast.success(res.message || 'Verification code sent to your phone');
    },
    onError: (error) => {
      handleApiError(error, 'Failed to send verification code');
    },
  });

  return { sendOtpMutation };
}

export function useVerifyPhoneOtp() {
  const queryClient = useQueryClient();

  const verifyOtpMutation = useMutation({
    mutationFn: (data: VerifyPhoneOtpData) =>
      clientProfileService.verifyPhoneOtp(data),
    onSuccess: (res) => {
      toast.success(res.message || 'Phone number verified successfully!');
      queryClient.invalidateQueries({ queryKey: ['client-profile'] });
    },
    onError: (error) => {
      handleApiError(error, 'Failed to verify phone number');
    },
  });

  return { verifyOtpMutation };
}
