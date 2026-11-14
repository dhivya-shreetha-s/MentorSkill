import express from 'express';
import { getAgentLogs, getAgentStats } from '../controllers/agentsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/logs', getAgentLogs);
router.get('/stats', getAgentStats);

export default router;
