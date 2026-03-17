import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';


export default function HomeScreen() {
  const { setScreen } = useApp();
  const { isAuthenticated } = useAuth();

  // Test Supabase connection (you can remove this later)
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error, count } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.error('Supabase test error:', error.message);
        } else {
          console.log('Supabase connected successfully!');
          console.log('Total users in DB:', count);
        }
      } catch (err) {
        console.error('Supabase connection failed:', err);
      }
    };

    testConnection();
  }, []);

  const handleStart = () => {
    if (isAuthenticated) {
      setScreen('selection');
    } else {
      setScreen('signup');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="dot-bg absolute inset-0 z-0" />

      <div className="relative z-10 max-w-5xl text-center px-8">
        <div className="inline-flex items-center gap-3 bg-zinc-900/80 glass px-8 py-3 rounded-3xl mb-8 border border-violet-500/30">
          <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
          POWERED BY MURF FALCON • REAL-TIME VOICE AI
        </div>

        <h1 className="text-7xl font-bold logo-font tracking-tighter leading-none mb-6">
          Practice Interviews<br />
          That <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400">Sound Real</span>
        </h1>

        <p className="text-2xl text-zinc-400 max-w-2xl mx-auto mb-12">
          Talk to Falcon — the most natural AI interviewer.<br />
          Real Murf voice • Smart follow-ups • Instant scorecard
        </p>

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={handleStart}
            className="group bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 px-14 py-7 rounded-3xl text-2xl font-semibold flex items-center gap-4 shadow-2xl neon-glow transition-all hover:scale-105"
          >
            START INTERVIEW
            <span className="text-4xl group-hover:rotate-12 transition">🎙️</span>
          </button>

          <button
            onClick={() => window.open('https://youtu.be/EQ3IYVbyVmc', '_blank')}
            className="glass px-10 py-7 rounded-3xl text-xl font-medium border border-white/20 hover:border-white/40 transition-all flex items-center gap-3"
          >
            Watch 60s Demo
          </button>
        </div>

        <div className="mt-20 flex justify-center gap-12 text-sm text-zinc-400">
          {['Real Murf Voice', 'Smart AI Replies', 'Instant Scoring', 'Hindi + English'].map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-emerald-400">✔</span> {f}
            </div>
          ))}
        </div>
      </div>

      {/* Floating Mic */}
      <div className="absolute bottom-20 right-20 text-8xl animate-float opacity-30 pointer-events-none">
        🎤
      </div>
    </div>
  );
}