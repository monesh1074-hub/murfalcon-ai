// client/src/components/screens/SelectionScreen.jsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext'; // Extracted to grab dynamic User Data

const roles = [
  { title: "Software Engineer", emoji: "💻", color: "violet" },
  { title: "Marketing Executive", emoji: "📣", color: "pink" },
  { title: "HR Leadership", emoji: "👥", color: "emerald" },
  { title: "Startup Founder", emoji: "🚀", color: "amber" },
];

export default function SelectionScreen() {
  const appCtx = useApp() || {};
  const { startInterview = () => {} } = appCtx;
  const { user } = useAuth() || {}; 
  
  const [voice, setVoice] = useState("Evelyn");
  const [difficulty, setDifficulty] = useState(70);

  // Dynamic profile letter extraction logic ensuring smooth fallback if no fullName exists
  const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'M';

  return (
    <div className="min-h-[100dvh] pt-32 pb-16 px-4 md:px-8 flex flex-col items-center relative overflow-x-hidden bg-zinc-950 font-sans selection:bg-violet-500/30">
      
      {/* Deep Space Background Ambient Glow Matrix */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1400px] relative z-10 flex flex-col items-center">
        
        {/* TITULAR HEADER Section */}
        <div className="text-center mb-16 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600">
            Choose Your Gateway.
          </h1>
          <p className="text-zinc-400 text-sm md:text-base font-light tracking-[0.2em] uppercase leading-relaxed drop-shadow-sm">
            Select an industry-specific profile or customize your simulation parameters to begin the sequence.
          </p>
        </div>

        {/* MASSIVE CENTRAL AVATAR NODE */}
        <div className="relative mb-20 group flex flex-col items-center">
          
          {/* Pulsing Backlit Cyber Rings */}
          <div className="absolute inset-0 bg-cyan-500/20 blur-[50px] rounded-full scale-[1.6] animate-[pulse_3s_infinite] pointer-events-none" />
          <div className="absolute inset-0 bg-violet-600/40 blur-[40px] rounded-full scale-[1.2] pointer-events-none transition-transform duration-1000 group-hover:scale-[1.35] group-hover:bg-violet-500/40" />
          
          {/* Main Circular Profile Avatar Node - 220px Diameter */}
          <div className="relative w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-full flex items-center justify-center border-[4px] border-zinc-950 shadow-[0_0_60px_rgba(168,85,247,0.7)] z-10 overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-400 group-hover:shadow-[0_0_100px_rgba(34,211,238,0.8)] transition-all duration-700">
            {/* Inner dynamic aesthetic ring */}
            <div className="absolute inset-0 rounded-full border-[3px] border-white/30 mix-blend-overlay" />
            
            {/* The Huge Dynamic User Initial */}
            <span className="text-7xl md:text-8xl font-black text-white drop-shadow-[0_8px_15px_rgba(0,0,0,0.4)]">
              {initial}
            </span>
          </div>

          {/* Connected SYSTEM ONLINE Pill Badge directly overlapping the bottom of circular avatar */}
          <div className="relative z-20 -mt-6 bg-zinc-900 border border-white/20 px-6 py-2.5 rounded-full flex items-center gap-3 shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
             <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_12px_rgba(34,197,94,1)] animate-pulse" />
             <span className="text-[10px] md:text-[11px] font-black tracking-[0.25em] text-zinc-300 uppercase">System Online</span>
          </div>
        </div>

        {/* CONFIGURATION CONTROLS (Floating Glassmorphism Dashboard) */}
        <div className="w-full max-w-5xl bg-white/[0.02] border border-white/10 backdrop-blur-2xl rounded-[40px] p-10 md:p-14 mb-24 shadow-[0_30px_80px_rgba(0,0,0,0.7)] flex flex-col gap-12">
          
          {/* Centralized Voice Selection System */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4 mb-8">
              <span className="h-[1px] w-12 md:w-24 bg-violet-500/30" />
              <span className="text-[10px] font-black tracking-[0.3em] text-violet-400 uppercase">Voice Templates</span>
              <span className="h-[1px] w-12 md:w-24 bg-violet-500/30" />
            </div>
            
            <div className="flex flex-wrap justify-center gap-5">
              {["Evelyn", "Marcus", "Nova", "Atlas"].map(v => (
                <button 
                  key={v} 
                  onClick={() => setVoice(v)} 
                  className={`px-10 py-3.5 rounded-full text-xs font-bold tracking-[0.1em] transition-all duration-300 border-[2px] ${
                    voice === v 
                      ? 'bg-violet-600 text-white shadow-[0_0_30px_rgba(168,85,247,0.7)] border-violet-400 scale-105' 
                      : 'bg-black/40 text-zinc-400 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/20 hover:scale-105'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Intense Gradient Difficulty Slider */}
          <div className="flex flex-col items-center px-2 md:px-16 w-full mt-4">
            <div className="w-full flex justify-between items-end mb-6">
              <span className="text-[10px] font-black tracking-[0.25em] text-cyan-400 uppercase">Simulation Intensity</span>
              <span className={`text-[10px] font-black tracking-[0.2em] transition-all duration-300 px-4 py-1.5 rounded-full border ${
                difficulty > 80 ? 'text-red-400 border-red-500/40 bg-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 
                difficulty > 40 ? 'text-zinc-200 border-white/10 bg-white/5 shadow-inner' : 'text-zinc-500 border-transparent'
              }`}>
                {difficulty > 80 ? 'HARDCORE' : difficulty > 40 ? 'STANDARD' : 'CASUAL'}
              </span>
            </div>
            
            {/* The Custom Range Visualizer Track */}
            <div className="relative w-full h-4 bg-black/60 rounded-full border border-white/10 overflow-hidden shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)]">
              {/* Invisible native input drives logic */}
              <input 
                type="range" 
                min="0" max="100" 
                value={difficulty} 
                onChange={e => setDifficulty(e.target.value)} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              {/* Stunning animated gradient fill layer */}
              <div 
                className={`absolute top-0 left-0 h-full transition-all duration-200 ease-out ${
                  difficulty > 80 ? 'bg-gradient-to-r from-violet-600 via-red-500 to-orange-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]' : 'bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]'
                }`}
                style={{ width: `${difficulty}%` }}
              />
            </div>
          </div>

        </div>

        {/* 4 ROLES / TARGET GATEWAY MATRICES */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-2">
          {roles.map((role, i) => (
            <div
              key={i}
              onClick={() => startInterview(role.title, voice)}
              className="group relative bg-black/40 border border-white/10 hover:border-violet-500/60 rounded-[32px] p-8 md:p-10 cursor-pointer transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_30px_60px_rgba(168,85,247,0.2)] overflow-hidden backdrop-blur-xl"
            >
              {/* Internal Card Hover Glow Matrix */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-violet-600/30 blur-[60px] group-hover:bg-cyan-500/30 group-hover:scale-150 transition-all duration-700 pointer-events-none" />
              
              <div className="text-5xl md:text-6xl mb-10 relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform origin-bottom-left duration-300">
                {role.emoji}
              </div>
              <h3 className="text-2xl font-black text-white mb-4 relative z-10 tracking-wide">{role.title}</h3>
              <p className="text-[13px] text-zinc-500 mb-12 relative z-10 font-light leading-relaxed">
                Execute target specific logic sequences and predictive behavioral analysis protocols.
              </p>
              
              {/* Holographic interactive Initiate Link */}
              <button className="absolute bottom-8 left-10 text-violet-400 text-[10px] font-black tracking-[0.25em] flex items-center gap-3 group-hover:text-cyan-400 transition-colors z-10 uppercase">
                INITIATE ALGORITHM <span className="text-xl leading-none group-hover:translate-x-4 transition-transform">→</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}