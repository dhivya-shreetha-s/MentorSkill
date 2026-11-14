import express from 'express';
import { getRoadmap, updateMilestoneStatus, getRoadmapHistory } from '../controllers/roadmapController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getRoadmap);
router.get('/current', getRoadmap);
router.get('/history', getRoadmapHistory);
router.put('/milestones/:milestoneId', updateMilestoneStatus);

export default router;
