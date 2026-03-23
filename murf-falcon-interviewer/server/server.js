import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { testConnection } from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import interviewRoutes from './routes/interview.js';
import murfRoutes from './routes/murf.js';
import chatRoutes from './routes/chat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security
app.use(helmet());

// CORS
app.use(
  cors({
    origin: [
    'http://localhost:5173',
    'https://murfalcon-ai-2.onrender.com/',
    process.env.CLIENT_URL
  ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Logging
app.use(morgan('dev'));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many attempts. Try again in 15 minutes.' },
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message: { success: false, message: 'Too many requests. Slow down.' },
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Murf Falcon Interviewer API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    aiProvider: process.env.AI_PROVIDER || 'gemini',
    murfConfigured: !!process.env.MURF_API_KEY && process.env.MURF_API_KEY !== 'your_murf_api_key_here',
  });
});

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/interview', apiLimiter, interviewRoutes);
app.use('/api/murf', apiLimiter, murfRoutes);
app.use('/api/chat', apiLimiter, chatRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start
async function startServer() {
  await testConnection();
 const port = process.env.PORT || 4000 
  app.listen(PORT,'0.0.0.0', () => {
    console.log('');
    console.log('🚀 ═══════════════════════════════════════════');
    console.log('   MURF FALCON INTERVIEWER API');
    console.log(`   Server:      http://localhost:${PORT}`);
    console.log(`   Health:      http://localhost:${PORT}/api/health`);
    console.log(`   AI Provider: ${process.env.AI_PROVIDER || 'gemini'}`);
    console.log(`   Murf AI:     ${process.env.MURF_API_KEY ? '✅ Configured' : '⚠️ Not configured (using browser TTS)'}`);
    console.log(`   Gemini:      ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Not set'}`);
    console.log(`   OpenAI:      ${process.env.OPENAI_API_KEY ? '✅ Configured' : '❌ Not set'}`);
    console.log('═══════════════════════════════════════════════');
    console.log('');
    console.log(`Server running on port ${PORT}`)
    console.log(`Render URL: http://0.0.0.0:${PORT}`)
  });
}

startServer();