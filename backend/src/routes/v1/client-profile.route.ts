import { Router } from 'express';
import { authenticate } from '../../middlewares/authMiddleware';
import { requireClient } from '../../middlewares/roleMiddleware';
import { validate } from '../../middlewares/validate';
import { uploadAvatar, uploadProfileCoverImage } from '../../util/multer';
import { updateClientProfileSchema } from '../../validations/client-profile';
import {
  handleGetClientProfile,
  handleUpdateClientProfile,
  handleUpdateClientCoverImage,
  handleGetClientStats,
} from '../../controllers/client-profile.controller';
import { handleUpdateAvatar } from '../../controllers/profile.controller';
import { otpRateLimiter } from '../../util/rateLimiter';
import {
  sendPhoneOtpSchema,
  verifyPhoneOtpSchema,
} from '../../validations/phone-verification';
import {
  handleSendPhoneOtp,
  handleVerifyPhoneOtp,
} from '../../controllers/phone-verification.controller';

const router = Router();

// All client profile routes require authentication and the CLIENT role
router.use(authenticate, requireClient);

router.get('/', handleGetClientProfile);
router.get('/stats', handleGetClientStats);
router.patch(
  '/',
  validate(updateClientProfileSchema),
  handleUpdateClientProfile
);
router.patch('/avatar', uploadAvatar, handleUpdateAvatar);
router.patch(
  '/cover-image',
  uploadProfileCoverImage,
  handleUpdateClientCoverImage
);
router.post(
  '/phone/send-otp',
  otpRateLimiter,
  validate(sendPhoneOtpSchema),
  handleSendPhoneOtp
);
router.post(
  '/phone/verify-otp',
  validate(verifyPhoneOtpSchema),
  handleVerifyPhoneOtp
);

export default router;
