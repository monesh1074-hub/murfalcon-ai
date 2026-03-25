// client/src/components/Navbar.jsx
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { currentLang, toggleLanguage, screen, setScreen } = useApp() || {};
  const { user, isAuthenticated, logout } = useAuth() || {};
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-2xl border-b border-white/5 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 md:py-4 flex items-center justify-between relative">
        
        {/* LOGO: Neon Glow Hover FX */}
        <div 
          onClick={() => {if(setScreen) setScreen('home'); setMobileMenuOpen(false);}}
          className="flex items-center gap-3 md:gap-4 cursor-pointer group"
        >
          <div className="w-8 h-8 md:w-10 md:h-10 bg-violet-600 rounded-lg md:rounded-xl flex items-center justify-center text-lg md:text-xl shadow-[0_0_15px_rgba(168,85,247,0.5)] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.8)] transition-all">
            🎙️
          </div>
          <span className="text-lg md:text-xl font-black tracking-[0.1em] md:tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
            MURF FALCON
          </span>
        </div>

        {/* NAVIGATION LINKS: Desktop */}
        <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold tracking-[0.15em] text-zinc-400">
          <button 
            onClick={() => setScreen && setScreen('home')} 
            className={`cursor-pointer hover:text-white transition-colors ${screen === 'home' ? 'text-violet-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : ''}`}
          >
            HOME
          </button>
          <button 
            onClick={() => setScreen && setScreen('selection')} 
            className={`cursor-pointer hover:text-white transition-colors ${screen === 'selection' ? 'text-violet-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : ''}`}
          >
            PRACTICE
          </button>
          <button 
            onClick={() => setScreen && setScreen('history')} 
            className={`cursor-pointer hover:text-white transition-colors ${screen === 'history' ? 'text-violet-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : ''}`}
          >
            HISTORY
          </button>
          <button className="cursor-pointer text-cyan-400 hover:text-cyan-300 transition-colors drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
            LIVE DEMO
          </button>
        </div>

        {/* ACTIONS & PROFILE: Desktop */}
        <div className="hidden md:flex items-center gap-4 md:gap-8">
          <button 
            onClick={toggleLanguage}
            className="w-10 h-10 rounded-full border border-white/10 hover:border-violet-500 hover:bg-violet-500/10 flex items-center justify-center text-xs font-bold tracking-widest transition-all"
            title="Toggle Language"
          >
            {currentLang === 'en' ? 'EN' : 'HI'}
          </button>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-6">
              
              {/* Premium User Avatar */}
              <div className="flex items-center gap-3 bg-white/[0.05] border border-white/10 pl-1.5 pr-5 py-1.5 rounded-full backdrop-blur-xl shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all hover:bg-white/10 cursor-default">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center font-black text-sm text-white shadow-[0_0_15px_rgba(168,85,247,0.8)] border border-white/20">
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'M'}
                </div>
                <span className="text-[10px] font-black tracking-[0.15em] hidden md:block text-zinc-200">
                  {user?.fullName ? user.fullName.toUpperCase() : 'FALCON USER'}
                </span>
              </div>
              
              <button 
                onClick={logout}
                className="text-[10px] font-black tracking-[0.2em] text-zinc-500 hover:text-red-400 transition-colors"
              >
                LOGOUT
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setScreen && setScreen('login')}
              className="bg-white text-zinc-950 px-8 py-2.5 rounded-full text-[10px] font-black tracking-[0.2em] hover:bg-zinc-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-all"
            >
              ACCESS SECURE
            </button>
          )}
        </div>

        {/* MOBILE HAMBURGER ICON */}
        <button 
          className="md:hidden text-zinc-400 hover:text-white p-2 transition-colors focus:outline-none z-10 relative"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <i className={`fas ${mobileMenuOpen ? 'fa-times text-red-400' : 'fa-bars'} text-2xl`} />
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div className={`md:hidden absolute top-[100%] left-0 w-full bg-zinc-950/95 backdrop-blur-3xl border-b border-white/10 overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-[500px] opacity-100 border-t border-t-white/5 shadow-2xl' : 'max-h-0 opacity-0 border-transparent'}`}>
        <div className="px-6 py-8 flex flex-col gap-8">
          
          {/* Mobile Profile Block */}
          {isAuthenticated && (
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-3 rounded-2xl mb-2 shadow-inner">
               <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 flex shrink-0 items-center justify-center font-black text-xl text-white shadow-[0_0_20px_rgba(168,85,247,0.8)] border-2 border-white/20">
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'M'}
               </div>
               <div className="flex flex-col">
                 <span className="text-[10px] text-violet-400 font-black tracking-[0.3em]">AUTHENTICATED</span>
                 <span className="text-sm font-black tracking-widest text-white uppercase">{user?.fullName || 'Falcon User'}</span>
               </div>
            </div>
          )}

          <div className="flex flex-col gap-4 text-sm font-black tracking-widest text-zinc-300">
            <button onClick={() => { setScreen('home'); setMobileMenuOpen(false); }} className={`text-left py-3 border-b border-white/5 ${screen === 'home' ? 'text-violet-400' : ''}`}>HOME</button>
            <button onClick={() => { setScreen('selection'); setMobileMenuOpen(false); }} className={`text-left py-3 border-b border-white/5 ${screen === 'selection' ? 'text-violet-400' : ''}`}>PRACTICE</button>
            <button onClick={() => { setScreen('history'); setMobileMenuOpen(false); }} className={`text-left py-3 border-b border-white/5 ${screen === 'history' ? 'text-violet-400' : ''}`}>HISTORY</button>
            <button onClick={() => setMobileMenuOpen(false)} className="text-left py-3 border-b border-white/5 text-cyan-400">LIVE DEMO</button>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <button onClick={toggleLanguage} className="text-[10px] font-black tracking-widest border border-white/20 px-5 py-2.5 rounded-full hover:bg-white/10">
              LANG: {currentLang === 'en' ? 'ENGLISH' : 'HINDI'}
            </button>
            {isAuthenticated ? (
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-[10px] font-black tracking-widest text-red-400 bg-red-500/10 px-6 py-2.5 rounded-full border border-red-500/30">LOGOUT</button>
            ) : (
              <button onClick={() => { setScreen('login'); setMobileMenuOpen(false); }} className="text-[10px] font-black tracking-[0.2em] bg-white text-black px-8 py-2.5 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)]">ACCESS</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}