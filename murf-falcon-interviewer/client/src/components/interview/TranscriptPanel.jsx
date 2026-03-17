import React, { useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function TranscriptPanel() {
  const { transcripts } = useApp();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  return (
    <div className="w-80 bg-zinc-900 border-l border-zinc-800 p-8 hidden lg:flex flex-col">
      <div className="uppercase text-xs font-medium tracking-widest text-zinc-400 mb-6">
        Live Transcript
      </div>
      <div className="flex-1 text-sm text-zinc-300 overflow-y-auto font-light leading-relaxed pr-2">
        {transcripts.map((t) => (
          <div key={t.id} className={`mb-4 ${t.isUser ? 'text-right' : ''}`}>
            <div className="text-[10px] text-zinc-500">{t.isUser ? 'YOU' : 'FALCON'}</div>
            <div className="text-sm">{t.text}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}