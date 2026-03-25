import { generateAIResponse, generateInterviewScore, clearSessionHistory } from '../services/aiService.js';
import { generateMurfSpeech } from '../services/murfService.js';
import { pool } from '../config/db.js';

// POST /api/chat/reply
// User sends their answer, gets AI reply + voice
export async function getChatReply(req, res, next) {
  try {
    const { sessionId, userMessage, role, lang, questionIndex, totalQuestions } = req.body;
    const userId = req.user.id;

    if (!userMessage || userMessage.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty.',
      });
    }

    // Step 1: Get AI text reply
    const aiResult = await generateAIResponse({
      sessionId: sessionId || `temp_${userId}`,
      role: role || 'Software Developer',
      userMessage,
      lang: lang || 'en',
      questionIndex: questionIndex || 0,
      totalQuestions: totalQuestions || 5,
    });

    // Step 2: Generate Murf AI voice for the reply
    const voiceResult = await generateMurfSpeech(
      aiResult.reply,
      lang || 'en',
      'interviewer'
    );

    // Step 3: Save Q&A to database (if session exists)
   // Save only if it's a real numeric session ID from /interview/start
// Save only if it's a real numeric session ID from /interview/start
if (sessionId && !String(sessionId).startsWith('temp_')) {
  try {
    // Save user's answer
    await pool.query(
      'INSERT INTO interview_qa (session_id, question_index, question_text, answer_text, confidence_score) VALUES ($1, $2, $3, $4, $5)',
      [sessionId, questionIndex || 0, 'User Response', userMessage, 7.5]
    );

    // Log Murf voice
    if (voiceResult.success) {
      await pool.query(
        'INSERT INTO murf_voice_logs (user_id, session_id, input_text, voice_id, audio_url, latency_ms) VALUES ($1, $2, $3, $4, $5, $6)',
        [userId, sessionId, aiResult.reply, voiceResult.voiceId || 'fallback', voiceResult.audioUrl || null, voiceResult.latencyMs || 0]
      );
    }
  } catch (dbError) {
    console.error('DB save error (non-critical):', dbError.message);
  }
}

    // Step 4: Send response
    res.json({
      success: true,
      data: {
        reply: aiResult.reply,
        aiProvider: aiResult.provider,
        audio: {
          available: voiceResult.success,
          url: voiceResult.audioUrl || null,
          fallbackToBrowser: voiceResult.fallback || false,
          latencyMs: voiceResult.latencyMs || 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/chat/score
// Generate final interview score
export async function getInterviewScore(req, res, next) {
  try {
    const { sessionId, role } = req.body;
    const userId = req.user.id;

    // Generate AI-powered score
    const scores = await generateInterviewScore(
      sessionId || `temp_${userId}`,
      role || 'Software Developer'
    );

    // Save scores to database
    if (sessionId && !String(sessionId).startsWith('temp_')) {
      try {
        await pool.query(
          `UPDATE interview_sessions 
           SET status = 'completed',
               overall_score = $1,
               confidence_score = $2,
               clarity_score = $3,
               technical_score = $4,
               completed_at = NOW()
           WHERE id = $5 AND user_id = $6`,
          [
            scores.overall,
            scores.confidence,
            scores.clarity,
            scores.technical,
            sessionId,
            userId,
          ]
        );
      } catch (dbError) {
        console.error('Score save error:', dbError.message);
      }
    }

    // Clear conversation history
    clearSessionHistory(sessionId || `temp_${userId}`);

    res.json({
      success: true,
      data: {
        scores,
      },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/chat/speak
// Just convert text to Murf voice (no AI)
export async function speakText(req, res, next) {
  try {
    const { text, lang } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Text is required.',
      });
    }

    const voiceResult = await generateMurfSpeech(text, lang || 'en', 'interviewer');

    res.json({
      success: true,
      data: {
        audio: {
          available: voiceResult.success,
          url: voiceResult.audioUrl || null,
          fallbackToBrowser: voiceResult.fallback || false,
          latencyMs: voiceResult.latencyMs || 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}