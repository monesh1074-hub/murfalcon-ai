import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const MURF_API_KEY = process.env.MURF_API_KEY;
const MURF_API_URL = process.env.MURF_API_URL || 'https://api.murf.ai/v1';

const VOICE_MAP = {
  en: {
    'Evelyn': 'en-US-natalie',
    'Marcus': 'en-US-terrell',
    'Nova': 'en-UK-hazel',
    'Atlas': 'en-US-cooper',
    interviewer: 'en-US-natalie',
  },
  hi: {
    'Evelyn': 'hi-IN-ananya',
    'Marcus': 'hi-IN-arohan',
    'Nova': 'hi-IN-ananya',
    'Atlas': 'hi-IN-arohan',
    interviewer: 'hi-IN-ananya',
  },
};

export async function generateMurfSpeech(text, lang = 'en', voiceType = 'Evelyn', useFalcon = false) {
  if (!MURF_API_KEY || MURF_API_KEY.includes('your_')) {
    console.log('⚠️ No Murf key → browser fallback');
    return { success: false, fallback: true };
  }

  const voiceId = VOICE_MAP[lang]?.[voiceType] || VOICE_MAP[lang]?.['Evelyn'] || 'en-US-natalie';
  const startTime = Date.now();

  try {
    const payload = {
      text,
      voiceId,
      style: 'conversational',     // ← Makes voice more natural & human-like
      format: 'MP3',
      sampleRate: 44100,
      speed: 1.0,
      pitch: 0,
        // ← Use Murf's best voice model for highest quality
    };

    if (useFalcon) payload.model = 'FALCON';

    const response = await axios.post(
      `${MURF_API_URL}/speech/generate`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': MURF_API_KEY,
        },
        timeout: 15000,
      }
    );

    const latency = Date.now() - startTime;

    console.log(`✅ Murf Success | Voice: ${voiceId} | Latency: ${latency}ms`);

    return {
      success: true,
      audioUrl: response.data?.audioFile || response.data?.url,
      voiceId,
      latencyMs: latency,
      model: useFalcon ? 'FALCON' : 'GEN2',
    };
  } catch (error) {
    console.error('Murf API Error:', error.response?.data || error.message);
    return {
      success: false,
      fallback: true,
      latencyMs: Date.now() - startTime,
    };
  }
}