import express from 'express';
import { getResources, getResourceById } from '../controllers/resourcesController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return authMiddleware(req, res, next);
  }
  next();
};

router.get('/', optionalAuth, getResources);
router.get('/:id', optionalAuth, getResourceById);

export default router;
