import { Router } from 'express';
import { generateSpeech, getVoices, getUsage } from '../controllers/murfController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/generate-speech', generateSpeech);
router.get('/voices', getVoices);
router.get('/usage', getUsage);

export default router;