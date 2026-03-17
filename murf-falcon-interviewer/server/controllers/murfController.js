import axios from 'axios';
import { pool } from '../config/db.js';
import { generateMurfSpeech } from '../services/murfService.js';

const MURF_API_URL = process.env.MURF_API_URL || 'https://api.murf.ai/v1';
const MURF_API_KEY = process.env.MURF_API_KEY;

// POST /api/murf/generate-speech
export async function generateSpeech(req, res, next) {
  try {
    const { text, sessionId, useFalcon = false } = req.body;
    const userId = req.user.id;

    const result = await generateMurfSpeech(text, 'en', 'interviewer', useFalcon);

    if (!result.success) {
      return res.status(502).json({ success: false, fallback: true });
    }

    // Call Murf AI API
    const murfResponse = await axios.post(
      `${MURF_API_URL}/speech/generate`,
      {
        text: text,
        voiceId: voiceId || 'en-US-natalie',
        style: 'conversational',
        format: 'MP3',
        sampleRate: 48000,
        speed: 1.0,
        pitch: 0,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': MURF_API_KEY,
          Accept: 'application/json',
        },
        timeout: 30000,
      }
    );

    const latency = Date.now() - startTime;
    const audioUrl = murfResponse.data?.audioFile || murfResponse.data?.url || null;

    // Log to database
    await pool.execute(
      'INSERT INTO murf_voice_logs (user_id, session_id, input_text, voice_id, audio_url, latency_ms) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, sessionId || null, text, voiceId || 'en-US-natalie', audioUrl, latency]
    );

    res.json({
      success: true,
      data: {
        audioUrl,
        audioData: murfResponse.data,
        latencyMs: latency,
      },
    });
  } catch (error) {
    // If Murf API fails, return fallback info
    if (error.response) {
      console.error('Murf API Error:', error.response.status, error.response.data);
      return res.status(502).json({
        success: false,
        message: 'Murf AI service error. Using browser TTS as fallback.',
        fallback: true,
        murfError: error.response.data,
      });
    }
    next(error);
  }
}

// GET /api/murf/voices
export async function getVoices(req, res, next) {
  try {
    const murfResponse = await axios.get(`${MURF_API_URL}/speech/voices`, {
      headers: {
        'api-key': MURF_API_KEY,
        Accept: 'application/json',
      },
      timeout: 10000,
    });

    res.json({
      success: true,
      data: murfResponse.data,
    });
  } catch (error) {
    if (error.response) {
      return res.status(502).json({
        success: false,
        message: 'Could not fetch Murf voices.',
      });
    }
    next(error);
  }
}

// GET /api/murf/usage
export async function getUsage(req, res, next) {
  try {
    const userId = req.user.id;

    const [logs] = await pool.execute(
      `SELECT COUNT(*) as total_requests, 
              AVG(latency_ms) as avg_latency,
              SUM(CHAR_LENGTH(input_text)) as total_characters
       FROM murf_voice_logs 
       WHERE user_id = ?`,
      [userId]
    );

    res.json({
      success: true,
      data: logs[0],
    });
  } catch (error) {
    next(error);
  }
}