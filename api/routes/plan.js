import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import authMiddleware from '../middleware/authMiddleware.js';
import { generatePlan, regeneratePlan } from '../controllers/planController.js';

const router = Router();

const planLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
});

router.use(authMiddleware);

router.post('/generate', planLimiter, generatePlan);
router.post('/regenerate', planLimiter, regeneratePlan);

export default router;
