import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function ScorecardScreen() {
  const { scores, currentRole, setScreen } = useApp();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const bars = [
    { label: 'Confidence', value: scores.conf, pct: scores.confPct },
    { label: 'Clarity', value: scores.clar, pct: scores.clarPct },
    { label: 'Technical Depth', value: scores.tech, pct: scores.techPct },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-zinc-950 flex items-center justify-center px-8">
      <div className="max-w-2xl w-full bg-zinc-900 rounded-3xl p-6 md:p-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-emerald-500/10 rounded-full text-5xl md:text-6xl mb-6">
            🏆
          </div>
          <h2 className="text-3xl md:text-5xl font-bold logo-font">Interview Complete!</h2>
          <div className="text-5xl md:text-7xl font-bold text-violet-400 mt-2">{scores.overall}</div>
          <div className="text-zinc-400 text-sm md:text-base mt-2">Overall Score (AI-Evaluated)</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6 md:space-y-8">
            {bars.map((bar) => (
              <div key={bar.label}>
                <div className="flex justify-between text-sm mb-3">
                  <span>{bar.label}</span>
                  <span className="font-mono text-emerald-400">{bar.value}</span>
                </div>
                <div className="h-3 bg-zinc-800 rounded-full">
                  <div
                    className="score-bar h-3 bg-emerald-400 rounded-full"
                    style={{ width: animated ? `${bar.pct}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-zinc-800 rounded-3xl p-8 flex flex-col justify-center">
            <div className="text-xs uppercase font-medium mb-6 text-violet-400">
              🤖 AI-Generated Feedback
            </div>
            <div className="text-sm text-zinc-300 leading-relaxed">
              {scores.tips || (
                <>
                  Excellent work!
                  <br /><br />
                  You handled {currentRole} questions really well.
                  <br />
                  Try mixing Hindi &amp; English next time – Falcon supports it seamlessly.
                </>
              )}
            </div>

            <div className="flex gap-3 mt-10">
              <button
                onClick={() => setScreen('selection')}
                className="flex-1 bg-violet-600 hover:bg-violet-500 text-white font-semibold py-4 rounded-2xl transition"
              >
                PRACTICE AGAIN
              </button>
              <button
                onClick={() => setScreen('home')}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-4 rounded-2xl transition"
              >
                HOME
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}