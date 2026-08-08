import { Router } from 'express';
import { authenticate } from '../../middlewares/authMiddleware';
import { validate } from '../../middlewares/validate';
import {
  savedQuerySchema,
  savedCreativeParamsSchema,
  savedCultParamsSchema,
} from '../../validations/saved';
import {
  handleGetSavedItems,
  handleGetSavedIds,
  handleSaveCreative,
  handleUnsaveCreative,
  handleToggleSaveCreative,
  handleSaveCult,
  handleUnsaveCult,
  handleToggleSaveCult,
} from '../../controllers/saved.controller';

const router = Router();

router.use(authenticate);

// Get list of saved items (creatives and cults) with filtering
router.get('/', validate(savedQuerySchema, 'query'), handleGetSavedItems);

// Get list of saved item IDs (for fast client-side active status checks)
router.get('/ids', handleGetSavedIds);

// Saved Creative endpoints
router.post(
  '/creative/:creativeProfileId',
  validate(savedCreativeParamsSchema, 'params'),
  handleSaveCreative
);
router.delete(
  '/creative/:creativeProfileId',
  validate(savedCreativeParamsSchema, 'params'),
  handleUnsaveCreative
);
router.post(
  '/creative/:creativeProfileId/toggle',
  validate(savedCreativeParamsSchema, 'params'),
  handleToggleSaveCreative
);

// Saved Cult endpoints
router.post(
  '/cult/:cultId',
  validate(savedCultParamsSchema, 'params'),
  handleSaveCult
);
router.delete(
  '/cult/:cultId',
  validate(savedCultParamsSchema, 'params'),
  handleUnsaveCult
);
router.post(
  '/cult/:cultId/toggle',
  validate(savedCultParamsSchema, 'params'),
  handleToggleSaveCult
);

export default router;
