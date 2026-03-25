// src/components/screens/HistoryScreen.jsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';

export default function HistoryScreen() {
  const { setScreen } = useApp() || {};
  const { isAuthenticated } = useAuth() || {};
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [qaList, setQaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    // Immediate redirect if manually accessing the screen when completely logged out
    if (!isAuthenticated) {
      if (setScreen) setScreen('home');
      return;
    }
    fetchSessions();
  }, [isAuthenticated, setScreen]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/interview/history');
      if (data?.data?.sessions) {
         setSessions(data.data.sessions);
      }
    } catch(err) {
      console.error("Live History API fetch rejected. Render failed.", err);
    }
    setLoading(false);
  };

  const loadSessionDetails = async (session) => {
    setSelectedSession(session);
    setDetailsLoading(true);
    try {
      const { data } = await API.get(`/interview/${session.id}/details`);
      if (data?.data?.questions) {
         setQaList(data.data.questions);
      }
    } catch(err) {
       console.error("Live Details QA mapping rejected. Render failed.", err);
    }
    setDetailsLoading(false);
  };

  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-white pt-24 pb-12 px-4 md:px-8 overflow-hidden font-sans relative flex flex-col items-center">
      
      {/* Background Holographic Ambient Lights */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-[1200px] w-full relative z-10 flex flex-col min-h-[calc(100vh-150px)]">
        
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <div className="text-[10px] font-black tracking-[0.3em] text-cyan-400 mb-2 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">ARCHIVED TELEMETRY</div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight">Interview History</h1>
          </div>

          <button
            onClick={() => setScreen('home')}
            className="group relative bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-violet-500/10 py-3 px-6 rounded-2xl transition-all duration-300 text-xs font-bold tracking-widest uppercase overflow-hidden backdrop-blur-md shadow-lg"
          >
             <span className="relative z-10 flex items-center justify-center gap-2 text-zinc-300 group-hover:text-white transition-colors">
              <i className="fas fa-arrow-left"></i>
              Back to Home
            </span>
          </button>
        </div>

        {/* Master Split View */}
        <div className="flex flex-col lg:flex-row gap-8 flex-1">
          
          {/* INDEX TILE LISTING */}
          <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-4">
            
            <div className="bg-black/40 border border-white/5 p-4 rounded-2xl mb-2 backdrop-blur-md">
               <div className="text-[10px] font-black tracking-widest text-zinc-500 uppercase flex items-center gap-2">
                 <i className="fas fa-database text-violet-400"></i> Cloud Storage Nodes ({sessions.length})
               </div>
            </div>

            {loading ? (
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center h-[300px] backdrop-blur-md">
                 <div className="w-8 h-8 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-4" />
                 <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-black">Decrypting logs...</span>
              </div>
            ) : sessions.length === 0 ? (
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center h-[300px] backdrop-blur-md text-center">
                 <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-4 text-zinc-600">
                    <i className="fas fa-folder-open"></i>
                 </div>
                 <span className="text-sm font-bold tracking-widest text-zinc-400 uppercase">NO DATA</span>
                 <p className="text-xs text-zinc-500 mt-2">Activate a practice session to begin archiving.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-4 scrollbar-hide max-h-[600px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {sessions.map((session) => {
                  const isSelected = selectedSession?.id === session.id;
                  
                  return (
                    <button
                      key={session.id}
                      onClick={() => loadSessionDetails(session)}
                      className={`text-left w-full relative overflow-hidden transition-all duration-300 rounded-[28px] border p-6 flex flex-col gap-4 ${
                        isSelected 
                          ? 'bg-gradient-to-br from-violet-900/40 to-black/60 border-violet-500/50 shadow-[0_10px_30px_rgba(168,85,247,0.15)]' 
                          : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.05] backdrop-blur-md cursor-pointer'
                      }`}
                    >
                      {/* Active Status Ring */}
                      {isSelected && <div className="absolute top-0 left-0 w-1 h-full bg-violet-400 shadow-[0_0_15px_rgba(168,85,247,1)]" />}

                      <div className="flex justify-between items-start">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                           {new Date(session.started_at || session.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="text-[10px] font-bold text-zinc-600 uppercase border border-zinc-800 px-2 py-0.5 rounded">
                           {session.language === 'en' ? 'ENGLISH' : 'HINDI'}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-black text-white tracking-wide mb-1 transition-colors">{session.role_type}</h3>
                        <div className="flex items-center gap-2">
                           <span className="text-xs text-zinc-500 font-medium">Evaluation Score:</span>
                           <span className={`text-sm font-black ${(session.overall_score || 0) >= 90 ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-cyan-400'}`}>
                             {session.overall_score || 0}/100
                           </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* DETAILED TRANSCRIPT VIEW */}
          <div className="flex-1 bg-white/[0.02] border border-white/10 rounded-[40px] p-6 md:p-10 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col min-h-[500px]">
            {!selectedSession ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-40 text-center p-8">
                 <div className="w-24 h-24 rounded-full border border-dashed border-zinc-600 flex items-center justify-center mb-6">
                   <i className="fas fa-fingerprint text-3xl text-zinc-500"></i>
                 </div>
                 <h2 className="text-xl font-bold text-zinc-400 tracking-tight mb-2">Awaiting Decryption</h2>
                 <p className="text-sm font-light text-zinc-500 max-w-sm">Select an archived telemetry node from the roster to decrypt and visualize its underlying transcript payload.</p>
              </div>
            ) : detailsLoading ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                 <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                 <span className="text-xs font-black tracking-[0.3em] text-cyan-400 animate-pulse">EXTRACTING METADATA...</span>
               </div>
            ) : (
              <div className="h-full flex flex-col space-y-8 overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                
                {/* Header Profile for Transcript */}
                <div className="border-b border-white/5 pb-8 shrink-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                      🤖
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">{selectedSession.role_type}</h2>
                      <div className="text-xs font-bold tracking-widest text-violet-400 uppercase">Simulated Assessment</div>
                    </div>
                  </div>
                  <div className="flex gap-4 flex-wrap">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl text-xs font-bold tracking-widest text-emerald-400">
                      FINAL RATING: {selectedSession.overall_score || 0}/100
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-xl text-xs font-bold tracking-widest text-cyan-400 opacity-80">
                      CONFIDENCE: {selectedSession.confidence_score || 0}/10
                    </div>
                    <div className="bg-zinc-800/50 border border-white/5 px-4 py-2 rounded-xl text-xs font-bold tracking-widest text-zinc-400">
                      QA NODES: {qaList.length}
                    </div>
                  </div>
                </div>

                {/* Question / Answer Bubbles */}
                <div className="flex flex-col gap-6 pt-2">
                  {qaList.map((qa, index) => (
                    <div key={qa.id} className="relative bg-black/40 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md group hover:border-violet-500/30 transition-colors">
                      
                      <div className="absolute top-0 right-8 -translate-y-1/2 bg-zinc-900 border border-violet-500/30 font-mono text-[10px] font-bold text-violet-300 px-3 py-1 rounded-full shadow-lg">
                        Q{qa.question_index + 1}
                      </div>

                      {/* AI Interrogative */}
                      <div className="flex items-start gap-4 mb-8">
                        <div className="w-8 h-8 rounded-full bg-violet-900/50 border border-violet-500/50 flex shrink-0 items-center justify-center text-xs">
                           F
                        </div>
                        <div className="flex-1">
                          <p className="text-sm md:text-[15px] font-medium text-zinc-300 leading-relaxed pt-1 w-full md:max-w-[90%]">
                            {qa.question_text}
                          </p>
                        </div>
                      </div>

                      {/* User Responsive */}
                      <div className="flex items-start pb-4 border-b border-white/5 mb-6 gap-4 pl-4 md:pl-12">
                        <div className="flex-1 flex flex-col items-end">
                          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-[24px] rounded-tr-sm px-5 py-4 text-sm md:text-[15px] leading-relaxed shadow-[0_5px_20px_rgba(168,85,247,0.3)] w-[90%]">
                             {qa.answer_text}
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-cyan-900/50 border border-cyan-500/50 flex shrink-0 items-center justify-center text-[10px] font-black text-cyan-400">
                           U
                        </div>
                      </div>

                      {/* NLP Micro-Feedback */}
                      <div className="flex items-center justify-between px-4 md:px-12 opacity-70 group-hover:opacity-100 transition-opacity">
                        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Node Metric Evaluation</div>
                        <div className="text-xs font-bold font-mono text-cyan-400 drop-shadow-sm">{(qa.confidence_score || 0).toFixed(1)} / 10.0</div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
