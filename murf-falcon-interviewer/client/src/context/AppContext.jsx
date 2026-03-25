// client/src/context/AppContext.jsx
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { questionBanks } from '../data/questionBanks';
import API from '../api/axios';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [screen, setScreen] = useState('home');
  const [currentLang, setCurrentLang] = useState('en');
  const [currentRole, setCurrentRole] = useState('');
  const [currentVoice, setCurrentVoice] = useState('Evelyn');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [transcripts, setTranscripts] = useState([]);
  const [feedbackText, setFeedbackText] = useState('Speak your answer to get feedback...');
  const [toast, setToast] = useState(null);

  // Scores with default values optimized for visually engaging fallback layout
  const [scores, setScores] = useState({
    overall: 84,
    conf: 7.0,
    clar: 8.9,
    tech: 7.2,
    confPct: 70,
    clarPct: 89,
    techPct: 72,
    tips: '',
  });

  const questionIndexRef = useRef(0);

  const addMessage = useCallback((text, isAI = true) => {
    setMessages((prev) => [...prev, { text, isAI, id: Date.now() + Math.random() }]);
  }, []);

  const addTranscript = useCallback((text, isUser = false) => {
    setTranscripts((prev) => [...prev, { text, isUser, id: Date.now() + Math.random() }]);
  }, []);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2200);
  }, []);

  const toggleLanguage = useCallback(() => {
    setCurrentLang((prev) => {
      const next = prev === 'en' ? 'hi' : 'en';
      showToast(next === 'en' ? 'Language switched to English' : 'भाषा हिंदी में बदल गई');
      return next;
    });
  }, [showToast]);

  const startInterview = useCallback(async (role, voice) => {
    const qs = questionBanks[role] || ['Tell me about yourself.'];
    setCurrentRole(role);
    if (voice) setCurrentVoice(voice);
    setQuestions(qs);
    setCurrentQuestionIndex(0);
    questionIndexRef.current = 0;
    setMessages([]);
    setTranscripts([]);
    setFeedbackText('Speak your answer to get feedback...');
    
    // Authentically establish the database session record before permitting interaction tracking
    try {
      const { data } = await API.post('/interview/start', { roleType: role, language: currentLang });
      if (data?.data?.sessionId) {
         setSessionId(data.data.sessionId);
      } else {
         setSessionId(`temp_${Date.now()}`); 
      }
    } catch (e) {
      console.error("Backend Server Error initializing authentic Supabase linkage logic. Resorting to array boundaries.");
      setSessionId(`temp_${Date.now()}`);
    }

    setScreen('interview');
  }, [currentLang]);

  const endInterview = useCallback(() => {
    setScreen('scorecard');
  }, []);

  const advanceQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => {
      const next = prev + 1;
      questionIndexRef.current = next;
      return next;
    });
  }, []);

  const value = {
    screen,
    setScreen,
    currentLang,
    setCurrentLang,
    toggleLanguage,
    currentRole,
    currentVoice,
    questions,
    currentQuestionIndex,
    questionIndexRef,
    messages,
    transcripts,
    feedbackText,
    setFeedbackText,
    scores,
    setScores,
    toast,
    sessionId,
    addMessage,
    addTranscript,
    startInterview,
    endInterview,
    advanceQuestion,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}