import crypto from 'node:crypto';

export function hashOtp(otpCode: string): string {
  return crypto.createHash('sha256').update(otpCode).digest('hex');
}

export function verifyOtpHash(otpCode: string, storedHash: string): boolean {
  const inputHash = hashOtp(otpCode);
  const inputBuffer = Buffer.from(inputHash, 'hex');
  const storedBuffer = Buffer.from(storedHash, 'hex');

  if (inputBuffer.length !== storedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(inputBuffer, storedBuffer);
}
