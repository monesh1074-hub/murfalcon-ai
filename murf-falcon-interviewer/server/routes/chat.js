import { Router } from 'express';
import { getChatReply, getInterviewScore, speakText } from '../controllers/chatController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All routes need authentication
router.use(authenticate);

// Get AI reply to user's answer
router.post('/reply', getChatReply);

// Generate final score
router.post('/score', getInterviewScore);

// Text-to-speech only
router.post('/speak', speakText);

export default router;