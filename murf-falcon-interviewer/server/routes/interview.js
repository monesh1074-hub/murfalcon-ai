import { Router } from 'express';
import {
  startSession,
  saveAnswer,
  completeSession,
  getHistory,
  getSessionDetails,
} from '../controllers/interviewController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/start', startSession);
router.post('/answer', saveAnswer);
router.post('/complete', completeSession);
router.get('/history', getHistory);
router.get('/:sessionId/details', getSessionDetails);

export default router;