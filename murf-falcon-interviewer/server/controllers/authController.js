import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

// Generate JWT token
function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

// POST /api/auth/signup
export async function signup(req, res, next) {
  try {
    // ... your existing validation and checks ...

    const { fullName, email, password } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists.' });
    }

    const user = await User.create({ fullName, email, password });

    // ← ADD THIS LINE (log login right after create)
    await User.logLogin(user.id, req.ip || 'unknown', req.headers['user-agent'] || 'unknown');

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}
// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check password
    const isMatch = await User.comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Log login
    await User.logLogin(user.id, req.ip, req.headers['user-agent']);

    res.json({
      success: true,
      message: 'Login successful!',
      data: {
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          preferredLang: user.preferred_lang,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/auth/me
export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          preferredLang: user.preferred_lang,
          createdAt: user.created_at,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/auth/language
export async function updateLanguage(req, res, next) {
  try {
    const { lang } = req.body;

    if (!['en', 'hi'].includes(lang)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid language. Use "en" or "hi".',
      });
    }

    await User.updateLanguage(req.user.id, lang);

    res.json({
      success: true,
      message: `Language updated to ${lang === 'en' ? 'English' : 'Hindi'}`,
    });
  } catch (error) {
    next(error);
  }
}