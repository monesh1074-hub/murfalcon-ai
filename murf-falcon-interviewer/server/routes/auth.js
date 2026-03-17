import { Router } from 'express';
import { body } from 'express-validator';
import { signup, login, getMe, updateLanguage } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/signup
router.post(
  '/signup',
  [
    body('fullName')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Full name must be 2-100 characters.'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email.'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters.')
      .matches(/\d/)
      .withMessage('Password must contain a number.'),
  ],
  signup
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email.'),
    body('password')
      .notEmpty()
      .withMessage('Password is required.'),
  ],
  login
);

// GET /api/auth/me (protected)
router.get('/me', authenticate, getMe);

// PUT /api/auth/language (protected)
router.put('/language', authenticate, updateLanguage);

export default router;