import express from 'express';
import { triggerAnalysis, getLatestAnalysis, getAgentLogs, changeCareerGoal } from '../controllers/analysisController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/trigger', triggerAnalysis);
router.post('/run', triggerAnalysis);
router.get('/latest', getLatestAnalysis);
router.get('/', getLatestAnalysis);
router.get('/logs', getAgentLogs);
router.post('/change-goal', changeCareerGoal);

export default router;
