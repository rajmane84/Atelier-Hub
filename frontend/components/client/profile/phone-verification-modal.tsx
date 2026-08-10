'use client';

import { useState, useEffect } from 'react';
import {
  Smartphone,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/ui/phone-input';
import { useSendPhoneOtp, useVerifyPhoneOtp } from '@/hooks/client/profile';

interface PhoneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPhoneNumber?: string | null;
  onSuccess?: () => void;
}

export function PhoneVerificationModal({
  isOpen,
  onClose,
  initialPhoneNumber,
  onSuccess,
}: PhoneVerificationModalProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState(initialPhoneNumber || '');
  const [otpCode, setOtpCode] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const { sendOtpMutation } = useSendPhoneOtp();
  const { verifyOtpMutation } = useVerifyPhoneOtp();

  useEffect(() => {
    if (isOpen) {
      setPhone(initialPhoneNumber || '');
      setOtpCode('');
      setStep('phone');
    }
  }, [isOpen, initialPhoneNumber]);

  // Resend timer countdown effect
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOtp = () => {
    const cleanPhone = phone.trim();
    if (!cleanPhone) {
      return;
    }

    sendOtpMutation.mutate(
      { phoneNumber: cleanPhone },
      {
        onSuccess: () => {
          setStep('otp');
          setResendTimer(60);
        },
      }
    );
  };

  const handleVerifyOtp = () => {
    const cleanOtp = otpCode.trim();
    if (cleanOtp.length !== 6) {
      return;
    }

    verifyOtpMutation.mutate(
      {
        phoneNumber: phone.trim(),
        otpCode: cleanOtp,
      },
      {
        onSuccess: () => {
          onSuccess?.();
          onClose();
        },
      }
    );
  };

  const handleResendCode = () => {
    if (resendTimer > 0) return;
    sendOtpMutation.mutate(
      { phoneNumber: phone.trim() },
      {
        onSuccess: () => {
          setResendTimer(60);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md rounded-none border border-border bg-background p-6 shadow-xl">
        <DialogHeader className="space-y-2">
          <div className="flex size-10 items-center justify-between rounded-none bg-primary/10 text-primary mb-2">
            <ShieldCheck className="size-5 mx-auto selection:text-background selection:bg-primary" />
          </div>
          <DialogTitle className="font-editorial text-xl font-normal text-foreground">
            {step === 'phone'
              ? 'Verify Mobile Number'
              : 'Enter Verification Code'}
          </DialogTitle>
          <DialogDescription className="text-xs font-body text-muted-foreground">
            {step === 'phone'
              ? 'Select your country code and enter your mobile number to receive a 6-digit verification code.'
              : `Enter the 6-digit code sent via SMS to ${phone}.`}
          </DialogDescription>
        </DialogHeader>

        {step === 'phone' ? (
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label
                htmlFor="verification-phone"
                className="font-mono text-[11px] uppercase tracking-widest text-foreground block"
              >
                Phone Number
              </Label>
              <PhoneInput
                id="verification-phone"
                value={phone}
                onChange={(val) => setPhone(val)}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={sendOtpMutation.isPending}
                className="flex-1 h-10 rounded-none transition-all duration-200 ease-out hover:bg-muted/80"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSendOtp}
                disabled={!phone.trim() || sendOtpMutation.isPending}
                className="flex-1 h-10 gap-1.5 rounded-none"
              >
                {sendOtpMutation.isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  <>
                    <Smartphone className="size-3.5" />
                    Send Code
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <Label
                htmlFor="otp-input"
                className="font-mono text-[11px] uppercase tracking-widest text-foreground block"
              >
                6-Digit Verification Code
              </Label>
              <Input
                id="otp-input"
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className="h-12 text-center font-mono text-lg tracking-[0.5em] rounded-none border-border focus-visible:ring-0 focus-visible:border-primary"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="font-mono hover:text-foreground underline underline-offset-4 transition-colors"
              >
                Change Number
              </button>

              {resendTimer > 0 ? (
                <span className="font-mono text-[11px]">
                  Resend in{' '}
                  <strong className="text-foreground">{resendTimer}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={sendOtpMutation.isPending}
                  className="flex items-center gap-1 font-mono text-primary hover:underline underline-offset-4 transition-colors selection:text-background selection:bg-primary"
                >
                  {sendOtpMutation.isPending ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <RefreshCw className="size-3" />
                  )}
                  Resend Code
                </button>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('phone')}
                disabled={verifyOtpMutation.isPending}
                className="flex-1 h-10 rounded-none transition-all duration-200 ease-out hover:bg-muted/80"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otpCode.length !== 6 || verifyOtpMutation.isPending}
                className="flex-1 h-10 gap-1.5 rounded-none"
              >
                {verifyOtpMutation.isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-3.5" />
                    Verify Phone
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
