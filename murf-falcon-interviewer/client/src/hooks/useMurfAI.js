import { useState, useCallback } from 'react';
import API from '../api/axios';

export function useMurfAI() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [murfAvailable, setMurfAvailable] = useState(true);

  const generateSpeech = useCallback(async (text, voiceId = 'en-US-natalie', sessionId = null) => {
    setIsGenerating(true);

    try {
      const res = await API.post('/murf/generate-speech', {
        text,
        voiceId,
        sessionId,
      });

      setIsGenerating(false);

      if (res.data.success && res.data.data.audioUrl) {
        // Play audio from Murf
        const audio = new Audio(res.data.data.audioUrl);
        audio.play();
        return {
          success: true,
          audioUrl: res.data.data.audioUrl,
          latency: res.data.data.latencyMs,
        };
      }

      // No audio URL — use browser fallback
      return { success: false, fallback: true };
    } catch (error) {
      setIsGenerating(false);
      console.warn('Murf AI unavailable, using browser TTS fallback');
      setMurfAvailable(false);
      return { success: false, fallback: true };
    }
  }, []);

  // Fallback to browser TTS
  const speakWithFallback = useCallback(
    async (text, lang = 'en', voiceId, sessionId) => {
      if (murfAvailable) {
        const result = await generateSpeech(text, voiceId, sessionId);
        if (result.success) return result;
      }

      // Browser TTS fallback
      return new Promise((resolve) => {
        if (!('speechSynthesis' in window)) {
          resolve({ success: false });
          return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
        utterance.rate = 1.05;
        utterance.pitch = 1.0;

        const voices = speechSynthesis.getVoices();
        const selected = voices.find((v) =>
          lang === 'hi'
            ? v.lang.includes('hi')
            : v.name.includes('Google') || v.name.includes('Samantha')
        );
        if (selected) utterance.voice = selected;

        utterance.onend = () => resolve({ success: true, fallback: true });
        utterance.onerror = () => resolve({ success: false });

        speechSynthesis.speak(utterance);
      });
    },
    [murfAvailable, generateSpeech]
  );

  return {
    generateSpeech,
    speakWithFallback,
    isGenerating,
    murfAvailable,
  };
}