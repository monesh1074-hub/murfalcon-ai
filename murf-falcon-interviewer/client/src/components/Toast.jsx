import React from 'react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-[100px] left-1/2 -translate-x-1/2 bg-zinc-800 px-6 py-3 rounded-full text-sm shadow-xl z-[999]">
      {toast}
    </div>
  );
}