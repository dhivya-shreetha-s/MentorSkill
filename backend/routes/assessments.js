import express from 'express';
import {
  getAssessments,
  getAssessmentWithQuestions,
  submitAssessment,
  getAssessmentHistory
} from '../controllers/assessmentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getAssessments);
router.get('/history', getAssessmentHistory);
router.get('/:id', getAssessmentWithQuestions);
router.post('/submit', submitAssessment);

export default router;
