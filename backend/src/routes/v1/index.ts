import { Router } from 'express';
import { env } from '../../util/env';
import { ApiResponse } from '../../util/response/ApiResponse';

// Routes
import userRouter from './user.route';
import creativeRouter from './creative.route';
import waitlistRouter from './waitlist.route';
import resumeRouter from './resume.route';
import profileRouter from './profile.route';
import clientProfileRouter from './client-profile.route';
import cultRouter from './cult.route';
import portfolioRouter from './portfolio.route';
import discoverRouter from './discover.route';
import reviewRouter from './review.route';
import listingRouter from './listing.route';
import savedRouter from './saved.route';

const router = Router();

router.use('/user', userRouter);
router.use('/creative', creativeRouter);
router.use('/waitlist', waitlistRouter);
router.use('/resume', resumeRouter);
router.use('/profile', profileRouter);
router.use('/client-profile', clientProfileRouter);
router.use('/cult', cultRouter);
router.use('/portfolio', portfolioRouter);
router.use('/discover', discoverRouter);
router.use('/reviews', reviewRouter);
router.use('/listings', listingRouter);
router.use('/saved', savedRouter);

router.get('/health', (_, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
  };

  return ApiResponse.success(res, healthCheck, 'Health check successful');
});

export default router;
