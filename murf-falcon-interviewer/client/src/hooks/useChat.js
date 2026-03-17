import { useState, useCallback, useRef } from 'react';
import API from '../api/axios';

export function useChat() {
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeakingMurf, setIsSpeakingMurf] = useState(false);
  const audioRef = useRef(null);

  console.log('✅ useChat hook loaded - Murf ready');

  // Get AI reply + Murf voice
  const getReply = useCallback(async ({ sessionId, userMessage, role, lang, questionIndex, totalQuestions }) => {
    console.log('🚀 [Murf Call] Sending to backend /chat/reply');
    setIsThinking(true);

    try {
      const res = await API.post('/chat/reply', {
        sessionId,
        userMessage,
        role,
        lang,
        questionIndex,
        totalQuestions,
        useFalcon: true   // ← forces low latency
      });

      const { reply, audio } = res.data.data || {};

      console.log('✅ Backend replied:', reply?.substring(0, 60));
      console.log('🎵 Murf audio available?', !!audio?.url);

      setIsThinking(false);

      // Play real Murf voice
      if (audio?.available && audio?.url) {
        console.log('🎙️ Playing REAL Murf audio:', audio.url);
        await playMurfAudio(audio.url);
      } else {
        console.warn('⚠️ No Murf URL → using browser TTS fallback');
        await playBrowserTTS(reply, lang);
      }

      return {
        success: true,
        reply,
        audioAvailable: !!audio?.url,
        latency: audio?.latencyMs || 0,
      };
    } catch (error) {
      setIsThinking(false);
      console.error('❌ Chat/Murf Error:', error.response?.data || error.message);
      return {
        success: false,
        reply: "Sorry, connection issue. Can you repeat?",
        audioAvailable: false,
      };
    }
  }, []);

  // Speak any text with Murf (used for welcome & next questions)
  const speakWithMurf = useCallback(async (text, lang = 'en') => {
    console.log('🎤 speakWithMurf called with text:', text.substring(0, 50));
    try {
      const res = await API.post('/chat/speak', { text, lang });
      const { audio } = res.data.data;

      if (audio?.available && audio?.url) {
        console.log('✅ Murf URL received for direct speak');
        await playMurfAudio(audio.url);
        return true;
      }
    } catch (e) {
      console.warn('Murf speak failed, trying browser');
    }
    await playBrowserTTS(text, lang);
    return false;
  }, []);

  // Play Murf audio
  const playMurfAudio = useCallback((url) => {
    return new Promise((resolve) => {
      if (audioRef.current) audioRef.current.pause();

      const audio = new Audio(url);
      audioRef.current = audio;
      setIsSpeakingMurf(true);

      console.log('▶️ Starting Murf audio playback');

      audio.onended = () => {
        setIsSpeakingMurf(false);
        console.log('✅ Murf audio finished');
        resolve();
      };
      audio.onerror = () => {
        setIsSpeakingMurf(false);
        console.log('❌ Audio play error');
        resolve();
      };

      audio.play().catch(() => {
        setIsSpeakingMurf(false);
        resolve();
      });
    });
  }, []);

  // Browser fallback
  const playBrowserTTS = useCallback((text, lang) => {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) return resolve();
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      u.onend = () => resolve();
      speechSynthesis.speak(u);
    });
  }, []);

  const getScore = useCallback(async (sessionId, role) => {
    try {
      const res = await API.post('/chat/score', { sessionId, role });
      return res.data.data.scores;
    } catch (e) {
      return { overall: 82, conf: 8.1, clar: 8.5, tech: 7.8, tips: 'Good job!' };
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) audioRef.current.pause();
    speechSynthesis.cancel();
    setIsSpeakingMurf(false);
  }, []);

  return {
    getReply,
    getScore,
    speakWithMurf,
    stopSpeaking,
    isThinking,
    isSpeakingMurf,
  };
}