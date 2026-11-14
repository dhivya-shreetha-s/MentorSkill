import express from 'express';
import {
  getMasterSkills,
  getUserSkills,
  addUserSkill,
  updateUserSkill,
  deleteUserSkill,
  batchSaveUserSkills
} from '../controllers/skillsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/master', getMasterSkills);

router.use(authMiddleware);

router.get('/', getUserSkills);
router.post('/', addUserSkill);
router.post('/batch', batchSaveUserSkills);
router.put('/:id', updateUserSkill);
router.delete('/:id', deleteUserSkill);

export default router;
