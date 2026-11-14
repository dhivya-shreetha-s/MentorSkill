import express from 'express';
import { getCareers, getCareerById, selectCareer } from '../controllers/careersController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', (req, res, next) => {
  if (req.headers.authorization) {
    return authMiddleware(req, res, () => getCareers(req, res, next));
  }
  return getCareers(req, res, next);
});

router.get('/:id', (req, res, next) => {
  if (req.headers.authorization) {
    return authMiddleware(req, res, () => getCareerById(req, res, next));
  }
  return getCareerById(req, res, next);
});

router.post('/select', authMiddleware, selectCareer);

export default router;
