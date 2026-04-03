import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { generatePlan, regeneratePlan } from '../controllers/planController.js';

const router = Router();

router.use(authMiddleware);

router.post('/generate', generatePlan);
router.post('/regenerate', regeneratePlan);

export default router;
