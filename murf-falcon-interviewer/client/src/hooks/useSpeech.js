import { useState, useRef, useCallback, useEffect } from 'react';

export function useSpeech(lang = 'en') {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const onResultRef = useRef(null);

  // TTS
  const speak = useCallback(
    (text) => {
      if (!('speechSynthesis' in window)) return;

      speechSynthesis.cancel();

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

      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
    },
    [lang]
  );

  // STT
  const startListening = useCallback(
    (onResult) => {
      onResultRef.current = onResult;

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Your browser doesn't support voice input. Please use Chrome.");
        return;
      }

      // Create new instance each time
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = lang === 'hi' ? 'hi-IN' : 'en-US';

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        if (onResultRef.current) {
          onResultRef.current(transcript);
        }
      };

      rec.onerror = (e) => {
        console.error('Speech error:', e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;

      try {
        rec.start();
        setIsListening(true);
      } catch (e) {
        alert('Microphone permission needed.');
      }
    },
    [lang]
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  }, []);

  // Load voices
  useEffect(() => {
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      try {
        if (recognitionRef.current) recognitionRef.current.abort();
        speechSynthesis.cancel();
      } catch (e) {}
    };
  }, []);

  return { speak, isSpeaking, startListening, stopListening, isListening };
}