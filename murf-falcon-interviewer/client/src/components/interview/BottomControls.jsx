import React from 'react';

export default function BottomControls({ isListening, onToggle }) {
  return (
    <div className="bg-zinc-900 border-t border-zinc-800 p-6">
      <div className="flex items-center justify-center gap-x-6">
        <button
          onClick={onToggle}
          className={`w-20 h-20 rounded-3xl flex items-center justify-center text-5xl shadow-2xl transition-all active:scale-95 ${
            isListening
              ? 'bg-red-500 shadow-red-500/60 animate-mic-pulse'
              : 'bg-violet-600 hover:bg-violet-500 shadow-violet-600/60 animate-mic-pulse'
          }`}
        >
          <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'}`} />
        </button>

        <div className="text-center">
          <div className="text-xs font-medium text-zinc-400 mb-1">PRESS TO SPEAK</div>
          <div className="font-mono text-sm text-violet-300">
            {isListening ? 'Listening... Speak now!' : 'Ready'}
          </div>
        </div>
      </div>
    </div>
  );
}