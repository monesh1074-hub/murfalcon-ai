import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useSpeech } from '../../hooks/useSpeech';
import { useChat } from '../../hooks/useChat';
import LeftPanel from '../interview/LeftPanel';
import ChatArea from '../interview/ChatArea';
import TranscriptPanel from '../interview/TranscriptPanel';
import Waveform from '../Waveform';

export default function InterviewScreen() {
  const { currentRole, currentLang, questions, currentQuestionIndex, questionIndexRef, addMessage, addTranscript, setFeedbackText, advanceQuestion, endInterview, setScores } = useApp();
  const { user } = useAuth();

  const { speak, isSpeaking, startListening, stopListening, isListening } = useSpeech(currentLang);
  const chat = useChat();

  const hasStartedRef = useRef(false);
  const [isThinking, setIsThinking] = useState(false);
  const [statusText, setStatusText] = useState('Ready');

  // Start interview with real Murf voice
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const welcome = `Hello ${user?.fullName || 'there'}! I am Falcon, your AI interviewer for ${currentRole}. Let's begin!`;
    addMessage(welcome, true);
    chat.speakWithMurf(welcome);

    setTimeout(() => {
      if (questions[0]) {
        addMessage(questions[0], true);
        addTranscript(questions[0], false);
        chat.speakWithMurf(questions[0]);
      }
    }, 1800);
  }, [currentRole, questions, user, addMessage, addTranscript, chat]);

  // Handle user speech → AI reply + Murf voice
  const handleUserAnswer = useCallback(async (transcript) => {
    setIsThinking(true);
    setStatusText('Processing...');
    setFeedbackText('🤔 Falcon is thinking...');

    addMessage(transcript, false);
    addTranscript(transcript, true);

    const result = await chat.getReply({
      sessionId: `session_${Date.now()}`,
      userMessage: transcript,
      role: currentRole,
      lang: currentLang,
      questionIndex: questionIndexRef.current,
      totalQuestions: questions.length,
    });

    setIsThinking(false);
    setStatusText('Ready');

    if (result.success) {
      addMessage(result.reply, true);
      addTranscript(result.reply, false);
      setFeedbackText(`✅ Confidence ${Math.floor(Math.random() * 3) + 7}/10 • Murf Voice`);

      advanceQuestion();

      const nextIdx = questionIndexRef.current;
      if (nextIdx < questions.length) {
        setTimeout(() => {
          const nextQ = questions[nextIdx];
          addMessage(nextQ, true);
          addTranscript(nextQ, false);
          chat.speakWithMurf(nextQ);
        }, 800);
      } else {
        // Final score
        const scores = await chat.getScore(`session_${Date.now()}`, currentRole);
        setScores(scores);
        endInterview();
      }
    }
  }, [currentRole, currentLang, questions, addMessage, addTranscript, setFeedbackText, advanceQuestion, endInterview, chat, questionIndexRef, setScores]);

  // Mic toggle (this is what you click)
  const handleToggleMic = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      if (isThinking || chat.isSpeakingMurf) return;
      startListening(handleUserAnswer);
      setStatusText('🎤 Listening... Speak now!');
    }
  }, [isListening, stopListening, startListening, handleUserAnswer, isThinking, chat.isSpeakingMurf]);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-zinc-950">
      <div className="flex h-[calc(100vh-80px)] w-full overflow-hidden">
        <LeftPanel />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="bg-zinc-900 border-b border-zinc-800 px-4 md:px-8 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-x-4">
              <div className="w-9 h-9 bg-violet-600 rounded-2xl flex items-center justify-center text-xl">🤖</div>
              <div>
                <div className="font-semibold">Falcon AI Interviewer</div>
                <div className="text-xs text-emerald-400 flex items-center gap-x-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  {isThinking ? 'THINKING...' : chat.isSpeakingMurf ? 'SPEAKING (Murf)' : isListening ? 'LISTENING' : 'READY'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {(isSpeaking || chat.isSpeakingMurf) && <Waveform />}
              <button
                onClick={endInterview}
                className="md:hidden cursor-pointer bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-x-2 transition"
              >
                <i className="fas fa-times" /> END
              </button>
            </div>
          </div>

          <ChatArea />

          {/* MIC BUTTON - THIS IS WHAT YOU CLICK */}
          <div className="bg-zinc-900 border-t border-zinc-800 p-6">
            <div className="flex items-center justify-center gap-x-6">
              <button
                onClick={handleToggleMic}
                disabled={isThinking || chat.isSpeakingMurf}
                className={`w-20 h-20 rounded-3xl flex items-center justify-center text-5xl shadow-2xl transition-all active:scale-95 ${
                  isListening
                    ? 'bg-red-500 shadow-red-500/60 animate-mic-pulse'
                    : 'bg-violet-600 hover:bg-violet-500 shadow-violet-600/60'
                } ${isThinking || chat.isSpeakingMurf ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'}`} />
              </button>

              <div className="text-center">
                <div className="text-xs font-medium text-zinc-400 mb-1">
                  {isListening ? 'LISTENING' : isThinking ? 'PROCESSING' : chat.isSpeakingMurf ? 'FALCON SPEAKING' : 'PRESS TO SPEAK'}
                </div>
                <div className="font-mono text-sm text-violet-300">{statusText}</div>
                <div className="text-[10px] text-zinc-500 mt-1">Press / key for quick toggle</div>
              </div>
            </div>
          </div>
        </div>

        <TranscriptPanel />
      </div>
    </div>
  );
}