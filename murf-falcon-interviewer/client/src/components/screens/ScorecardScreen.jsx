// client/src/components/screens/ScorecardScreen.jsx
import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import ExportPDFButton from '../ExportPDFButton';

export default function ScorecardScreen() {
  const { scores = {}, currentRole = 'Candidate', setScreen } = useApp() || {};
  const { user } = useAuth() || {};
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Delay animation trigger slightly for cinematic entrance effect
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Normalize backend payload structure. If the AI returns out of 10, scale it up to 100 for proper percentage masking.
  const getPct = (val) => (val <= 10 ? Number(val) * 10 : Number(val));

  // Destructure explicitly requested keys alongside fallbacks to prevent undefined UI breaks
  const confVal = Number(scores.confidence || scores.conf || 0).toFixed(1);
  const clarVal = Number(scores.clarity || scores.clar || 0).toFixed(1);
  const techVal = Number(scores.technical || scores.tech || 0).toFixed(1);
  const overallVal = Math.round(Number(scores.overall || 0));

  const bars = [
    { 
      label: 'CONFIDENCE', 
      value: `${confVal} / 10`, 
      pct: getPct(confVal), 
      color: 'from-cyan-500 to-blue-400',
      shadow: 'shadow-[0_0_15px_rgba(34,211,238,0.6)]'
    },
    { 
      label: 'CLARITY & TONE', 
      value: `${clarVal} / 10`, 
      pct: getPct(clarVal), 
      color: 'from-violet-500 to-fuchsia-400',
      shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.6)]'
    },
    { 
      label: 'TECHNICAL DEPTH', 
      value: `${techVal} / 10`, 
      pct: getPct(techVal), 
      color: 'from-emerald-500 to-teal-400',
      shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.6)]'
    },
  ];

  return (
    <div className="min-h-[100dvh] pt-24 pb-12 bg-zinc-950 flex flex-col items-center justify-center px-4 md:px-8 overflow-hidden relative font-sans">
      
      {/* Background Holographic Ambient Lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Main Glassmorphic Wrapper specifically assigned to capture bounds for the PDF builder */}
      <div id="falcon-scorecard-report" className="max-w-[1000px] w-full bg-zinc-950 md:bg-white/[0.02] border border-white/10 rounded-[40px] p-8 md:p-12 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative z-10 flex flex-col">
        
        {/* REPORT HEADER: Beautiful integrated UI that simultaneously validates the generated PDF */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start border-b border-white/10 pb-6 mb-8 gap-4">
           <div>
             <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 tracking-tight">Murf Falcon Interview Report</h1>
             <p className="text-zinc-400 text-sm mt-1 font-medium tracking-wide">Candidate: {user?.fullName || 'Guest Evaluator'}</p>
           </div>
           <div className="text-left md:text-right">
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">Evaluation Date</div>
             <div className="text-sm font-bold text-zinc-300">{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
           </div>
        </div>

        {/* INNER SPLIT WRAPPER */}
        <div className="flex flex-col xl:flex-row gap-12 xl:gap-16 items-center xl:items-stretch w-full">
          
          {/* LEFT COMPONENT: Primary Score Block */}
          <div className="w-full xl:w-1/2 flex flex-col items-center justify-center text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-yellow-400/20 blur-[30px] rounded-full animate-pulse" />
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/5 border border-yellow-500/30 rounded-full flex items-center justify-center text-5xl md:text-6xl relative z-10 shadow-[inset_0_0_20px_rgba(250,204,21,0.2)]">
                🏆
              </div>
            </div>
            
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-400 mb-3 drop-shadow-[0_0_10px_rgba(168,85,247,0.4)]">
              Mission Accomplished
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 tracking-tight leading-tight mb-2">
              {currentRole}
            </h2>
            
            <div className="mt-8 flex flex-col items-center">
               <div className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-700 leading-none tracking-tighter drop-shadow-2xl">
                 {overallVal}
                 <span className="text-4xl md:text-5xl text-zinc-600 ml-1">/100</span>
               </div>
               <div className="text-xs md:text-sm font-bold tracking-widest text-zinc-500 uppercase mt-4">
                 FINAL FALCON RATING
               </div>
            </div>
          </div>

          {/* RIGHT COMPONENT: Telemetry Breakdown */}
          <div className="w-full xl:w-1/2 flex flex-col justify-center">
            
            {/* Progress Bars Matrix */}
            <div className="w-full bg-black/40 border border-white/5 rounded-[30px] p-8 space-y-8 mb-8 shadow-[inset_0_10px_30px_rgba(0,0,0,0.5)]">
              {bars.map((bar, i) => (
                <div key={i} className="w-full">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-[11px] md:text-xs font-black tracking-[0.2em] text-zinc-400">{bar.label}</span>
                    <span className="font-mono text-sm md:text-base font-bold text-white tracking-widest">{bar.value}</span>
                  </div>
                  {/* 3D Track */}
                  <div className="h-2 md:h-2.5 bg-black rounded-full overflow-hidden border border-white/5 relative">
                    {/* Fill Layer */}
                    <div
                      className={`h-full bg-gradient-to-r ${bar.color} ${bar.shadow} transition-all duration-1000 ease-out`}
                      style={{ width: animated ? `${Math.min(Math.max(bar.pct, 0), 100)}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* NLP Feedback Engine */}
            <div className="w-full bg-gradient-to-br from-violet-900/20 to-zinc-900/50 rounded-[30px] p-8 border border-violet-500/20 relative shadow-[0_10px_30px_rgba(0,0,0,0.3)] shrink-0 mb-8">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <i className="fas fa-microchip text-4xl text-violet-400"></i>
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400 mb-4 flex items-center gap-2 drop-shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                AI Synthesized Report
              </div>
              <div className="text-sm md:text-[15px] text-zinc-300 leading-relaxed font-light">
                {scores.tips || (
                  <>
                    <strong className="text-white font-medium">Excellent execution parameters.</strong>
                    <br /><br />
                    Your communication bandwidth analyzing the required parameters was highly effective. Technical bounds were met accurately.
                    <br /><br />
                    <span className="text-zinc-500 text-xs italic">System Log: Try integrating more specialized vocabulary scaling relative to your requested target prompt next time.</span>
                  </>
                )}
              </div>
            </div>

            {/* Action Hub (Ignored explicitly within html2canvas rendering sequence parameters) */}
            <div className="flex flex-col sm:flex-row gap-4 w-full mt-auto" data-html2canvas-ignore="true">
              <button
                onClick={() => setScreen('selection')}
                className="group relative flex-1 bg-violet-600 border border-violet-500 hover:bg-violet-500 py-4 px-6 rounded-2xl transition-all duration-300 text-sm font-bold tracking-widest uppercase overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:-translate-y-0.5"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 text-white flex items-center justify-center gap-2">
                  <i className="fas fa-redo-alt text-xs"></i>
                  Restart
                </span>
              </button>
              
              <ExportPDFButton 
                 elementId="falcon-scorecard-report" 
                 filename={`${user?.fullName || 'Candidate'}_${currentRole.replace(/\s+/g, '_')}_Report`} 
              />

              <button
                onClick={() => setScreen('home')}
                className="group relative flex-1 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 py-4 px-6 rounded-2xl transition-all duration-300 text-sm font-bold tracking-widest text-zinc-300 hover:text-white uppercase shadow-lg hover:-translate-y-0.5"
              >
                 <span className="relative z-10 flex items-center justify-center gap-2">
                  <i className="fas fa-home text-xs"></i>
                  Home
                </span>
              </button>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  );
}