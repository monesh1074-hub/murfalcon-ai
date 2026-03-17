import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { setScreen, currentLang, toggleLanguage } = useApp();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 px-8 py-5 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div
        className="flex items-center gap-x-3 cursor-pointer"
        onClick={() => setScreen('home')}
      >
        <div className="w-10 h-10 bg-violet-600 rounded-2xl flex items-center justify-center text-3xl">
          🎙️
        </div>
        <div>
          <span className="logo-font text-3xl font-semibold tracking-tighter text-white">
            MURF
          </span>
          <span className="text-violet-400 text-sm font-medium tracking-[3px] ml-1">
            FALCON
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex items-center gap-x-8 text-sm font-medium">
        <button
          onClick={() => setScreen('home')}
          className="hover:text-violet-400 transition-colors"
        >
          Home
        </button>
        {isAuthenticated && (
          <button
            onClick={() => setScreen('selection')}
            className="hover:text-violet-400 transition-colors"
          >
            Practice
          </button>
        )}
        <div className="flex items-center gap-x-2 bg-zinc-800 rounded-3xl px-6 py-2 text-xs font-mono border border-zinc-700">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          LIVE DEMO
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-x-4">
        {/* Language */}
        <div
          onClick={toggleLanguage}
          className="flex items-center bg-zinc-800 rounded-3xl px-2 py-1 cursor-pointer border border-zinc-700 hover:border-violet-400 transition-all"
        >
          <div
            className={`px-5 py-1.5 text-xs font-semibold rounded-3xl transition-all ${
              currentLang === 'en' ? 'bg-violet-600 text-white' : ''
            }`}
          >
            EN
          </div>
          <div
            className={`px-5 py-1.5 text-xs font-semibold rounded-3xl transition-all ${
              currentLang === 'hi' ? 'bg-violet-600 text-white' : ''
            }`}
          >
            हिं
          </div>
        </div>

        {/* Auth */}
        {isAuthenticated ? (
          <div className="flex items-center gap-x-3">
            <div className="bg-zinc-800 rounded-3xl px-5 py-2 text-sm border border-zinc-700 flex items-center gap-x-2">
              <div className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center text-xs font-bold">
                {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="text-zinc-300 text-xs font-medium">
                {user?.fullName || 'User'}
              </span>
            </div>
            <button
              onClick={() => {
                logout();
                setScreen('home');
              }}
              className="flex items-center gap-x-2 bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 px-5 py-3 rounded-3xl text-sm font-medium transition-all border border-zinc-700"
            >
              <i className="fas fa-sign-out-alt text-xs" />
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-x-3">
            <button
              onClick={() => setScreen('login')}
              className="bg-zinc-800 hover:bg-zinc-700 px-5 py-3 rounded-3xl text-sm font-medium transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => setScreen('signup')}
              className="bg-violet-600 hover:bg-violet-500 px-5 py-3 rounded-3xl text-sm font-medium transition-all"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}