import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import authMiddleware from '../middleware/authMiddleware.js';
import { upsertPreferences, getPreferences } from '../controllers/preferencesController.js';

const router = Router();

const preferencesLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
});

router.use(authMiddleware);

router.post('/', preferencesLimiter, upsertPreferences);
router.get('/', preferencesLimiter, getPreferences);

export default router;
