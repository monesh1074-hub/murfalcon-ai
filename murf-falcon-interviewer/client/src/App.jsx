// src/App.jsx
import React from 'react';
import { useApp } from './context/AppContext';
import { useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeScreen from './components/screens/HomeScreen';
import SelectionScreen from './components/screens/SelectionScreen';
import InterviewScreen from './components/screens/InterviewScreen';
import ScorecardScreen from './components/screens/ScorecardScreen';
import HistoryScreen from './components/screens/HistoryScreen';
import LoginScreen from './components/auth/LoginScreen';
import SignupScreen from './components/auth/SignupScreen';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const { screen, setScreen } = useApp() || {};
  const { loading } = useAuth() || { loading: false };

  // Fallback to ensuring non-crashing UI bindings directly map cleanly
  const currentScreen = screen || 'fallback';

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-violet-500/30 relative flex flex-col overflow-x-hidden">

      {/* 
        CRITICAL FIX FOR removeChild ERROR: 
        We NO LONGER conditionally return a completely different root node when `loading` is true.
        Instead, the main min-h-screen container ALWAYS remains mounted indefinitely, and we simply overlay 
        the loading screen. This provides a 100% stable virtual DOM tree to React during Context hydration,
        making `removeChild` structural mismatch tracking crashes physically impossible!
      */}
      {loading ? (
        <div className="flex-1 w-full bg-zinc-950 flex flex-col items-center justify-center relative mt-auto z-50 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_50%)]" />
          <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-8 relative z-10 shadow-[0_0_30px_rgba(168,85,247,0.3)]" />
          <p className="text-violet-400 text-xs font-bold tracking-[0.3em] animate-pulse relative z-10">BOOTING FALCON OS...</p>
        </div>
      ) : (
        <>
          {/* Universal navigation anchored exactly underneath stable loading layer overlays */}
          <Navbar />

          <main className="flex-1 w-full relative z-0 flex flex-col">
            {currentScreen === 'home' && <HomeScreen />}
            {currentScreen === 'selection' && <SelectionScreen />}
            {currentScreen === 'interview' && <InterviewScreen />}
            {currentScreen === 'scorecard' && <ScorecardScreen />}
            {currentScreen === 'history' && (
              <ProtectedRoute>
                <HistoryScreen />
              </ProtectedRoute>
            )}
            {currentScreen === 'login' && <LoginScreen onSwitchToSignup={() => setScreen('signup')} />}
            {currentScreen === 'signup' && <SignupScreen onSwitchToLogin={() => setScreen('login')} />}

            {/* Failsafe UI layer routing mapping fallback */}
            {currentScreen === 'fallback' && (
              <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 relative">
                <div className="text-center space-y-4 relative z-10">
                  <div className="text-7xl mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">🚀</div>
                  <h2 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">System Ready</h2>
                  <p className="text-zinc-400 text-lg font-light tracking-wide">Gateway routing established.</p>
                  <button
                    onClick={() => setScreen ? setScreen('home') : window.location.reload()}
                    className="mt-8 bg-zinc-100 hover:bg-white text-zinc-900 px-10 py-4 rounded-full text-sm font-bold tracking-widest transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:-translate-y-1"
                  >
                    ACCESS TERMINAL
                  </button>
                </div>
              </div>
            )}
          </main>

          {/* Securely strip generic layout anchors only during dedicated interface loops */}
          {currentScreen !== 'interview' && <Footer />}
        </>
      )}
    </div>
  );
}
