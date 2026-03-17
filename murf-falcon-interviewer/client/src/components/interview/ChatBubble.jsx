import React from 'react';

export default function ChatBubble({ text, isAI }) {
  if (isAI) {
    return (
      <div className="flex justify-start">
        <div className="flex gap-x-4 max-w-[70%]">
          <div className="w-8 h-8 bg-violet-600 rounded-2xl flex-shrink-0 flex items-center justify-center text-xl mt-1">
            🤖
          </div>
          <div className="chat-bubble-ai px-6 py-4 rounded-3xl rounded-tl-none text-sm leading-relaxed">
            {text}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <div className="chat-bubble-user px-6 py-4 rounded-3xl rounded-tr-none text-sm leading-relaxed text-white">
        {text}
      </div>
    </div>
  );
}