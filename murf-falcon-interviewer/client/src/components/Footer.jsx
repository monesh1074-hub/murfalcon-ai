import React from 'react';

export default function Footer() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 py-4 px-8 text-xs text-zinc-400 flex justify-between items-center z-50">
      <div>Demo for Murf AI Hackathon • Voice AI Interview Platform</div>
      <div className="flex gap-x-6">
        <a href="https://murf.ai" target="_blank" rel="noreferrer" className="hover:text-white">
          Murf AI
        </a>
      </div>
    </div>
  );
}