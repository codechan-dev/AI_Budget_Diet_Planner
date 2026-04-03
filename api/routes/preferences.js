import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { upsertPreferences, getPreferences } from '../controllers/preferencesController.js';

const router = Router();

router.use(authMiddleware);

router.post('/', upsertPreferences);
router.get('/', getPreferences);

export default router;
