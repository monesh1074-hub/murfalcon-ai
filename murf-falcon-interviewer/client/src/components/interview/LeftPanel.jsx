import React from 'react';
import { useApp } from '../../context/AppContext';

export default function LeftPanel() {
  const { currentRole, currentQuestionIndex, questions, feedbackText, endInterview, currentLang } = useApp();
  const total = questions.length || 5;
  const current = currentQuestionIndex + 1;
  const pct = (current / total) * 100;

  return (
    <div className="w-80 bg-zinc-900 border-r border-zinc-800 p-8 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-xs font-mono text-zinc-400">CURRENT ROLE</div>
          <div className="text-2xl font-semibold text-white">{currentRole}</div>
        </div>
        <div
          onClick={endInterview}
          className="cursor-pointer bg-red-500/10 hover:bg-red-500/20 text-red-400 px-5 py-2 rounded-2xl text-sm font-medium flex items-center gap-x-2 transition"
        >
          <i className="fas fa-times" /> END
        </div>
      </div>

      <div className="bg-zinc-800 rounded-3xl p-6 mb-8">
        <div className="flex justify-between text-xs mb-3">
          <div className="font-medium">PROGRESS</div>
          <div className="font-mono text-violet-400">
            {Math.min(current, total)} / {total}
          </div>
        </div>
        <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-2 bg-violet-500 transition-all"
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="text-xs font-medium text-zinc-400 mb-4">QUICK TIPS</div>
        <div className="space-y-4 text-xs text-zinc-400">
          <div className="flex gap-3">
            <i className="fas fa-volume-up text-violet-400 mt-0.5" />
            <div>Speak clearly. Murf Falcon listens in real-time.</div>
          </div>
          <div className="flex gap-3">
            <i className="fas fa-language text-violet-400 mt-0.5" />
            <div>Switch to हिंदी anytime. Falcon supports mixed language.</div>
          </div>
        </div>
      </div>

      <div className="mt-auto bg-zinc-800 rounded-3xl p-6 text-xs">
        <div className="font-medium mb-4 flex items-center gap-2">
          <i className="fas fa-chart-bar" /> INSTANT FEEDBACK
        </div>
        <div className="text-zinc-400">
          {feedbackText.includes('/10') ? (
            <div className="flex items-center gap-x-2 text-emerald-400">
              <i className="fas fa-check-circle" />
              <span className="font-medium">{feedbackText}</span>
            </div>
          ) : (
            feedbackText
          )}
        </div>
      </div>
    </div>
  );
}