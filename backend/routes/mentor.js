import express from 'express';
import { sendMessage, getChatHistory, clearChatHistory } from '../controllers/mentorController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/message', sendMessage);
router.post('/chat', sendMessage);
router.post('/', sendMessage);

router.get('/history', getChatHistory);
router.get('/messages', getChatHistory);
router.get('/chat', getChatHistory);
router.get('/', getChatHistory);

router.delete('/history', clearChatHistory);

export default router;
