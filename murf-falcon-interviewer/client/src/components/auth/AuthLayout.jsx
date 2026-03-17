import React from 'react';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-8 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-x-3 mb-4">
            <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-4xl">
              🎙️
            </div>
            <div>
              <span className="logo-font text-4xl font-semibold tracking-tighter text-white">
                MURF
              </span>
              <span className="text-violet-400 text-sm font-medium tracking-[3px] ml-1">
                FALCON
              </span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
          {children}
        </div>
      </div>
    </div>
  );
}