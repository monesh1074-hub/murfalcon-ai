import React, { useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import ChatBubble from './ChatBubble';

export default function ChatArea() {
  const { messages } = useApp();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 dot-bg">
      {messages.map((msg) => (
        <ChatBubble key={msg.id} text={msg.text} isAI={msg.isAI} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}