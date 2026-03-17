import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const roles = [
  {
    key: 'Software Developer',
    emoji: '💻',
    title: 'Software Developer',
    desc: 'Technical deep-dive • Coding • System Design',
    color: 'violet',
  },
  {
    key: 'Marketing',
    emoji: '📣',
    title: 'Marketing Executive',
    desc: 'Campaigns • Branding • Analytics',
    color: 'pink',
  },
  {
    key: 'HR',
    emoji: '👥',
    title: 'HR Interview',
    desc: 'Behavioral • Culture Fit • Leadership',
    color: 'emerald',
  },
  {
    key: 'Startup Founder',
    emoji: '🚀',
    title: 'Startup Founder',
    desc: 'Pitching • Fundraising • Vision',
    color: 'amber',
  },
];

export default function SelectionScreen() {
  const { startInterview } = useApp();

  const [selectedVoice, setSelectedVoice] = useState('Natalie');
  const [difficulty, setDifficulty] = useState('Medium');
  const [duration, setDuration] = useState('5');

  const handleStart = (role) => {
    startInterview(role, selectedVoice, difficulty, duration);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] px-8 py-12 bg-gradient-to-b from-zinc-950 to-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-6xl font-bold logo-font tracking-tighter text-center mb-3">
          Choose Your Interview
        </h2>
        <p className="text-zinc-400 text-xl text-center mb-12">
          Customize voice, difficulty & length
        </p>

        {/* Controls - Voice + Difficulty + Duration */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          {/* Voice */}
          <div className="glass px-8 py-5 rounded-3xl flex items-center gap-4">
            <span className="text-sm font-medium text-zinc-400">Voice:</span>
            {['Natalie', 'Matthew', 'Terrell'].map((v) => (
              <button
                key={v}
                onClick={() => setSelectedVoice(v)}
                className={`px-7 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                  selectedVoice === v
                    ? 'bg-violet-600 text-white neon-glow'
                    : 'hover:bg-zinc-800'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Difficulty */}
          <div className="glass px-8 py-5 rounded-3xl flex items-center gap-4">
            <span className="text-sm font-medium text-zinc-400">Difficulty:</span>
            {['Easy', 'Medium', 'Hard'].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-7 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                  difficulty === d
                    ? 'bg-violet-600 text-white neon-glow'
                    : 'hover:bg-zinc-800'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Duration */}
          <div className="glass px-8 py-5 rounded-3xl flex items-center gap-4">
            <span className="text-sm font-medium text-zinc-400">Duration:</span>
            {[5, 10, 15].map((min) => (
              <button
                key={min}
                onClick={() => setDuration(min.toString())}
                className={`px-7 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                  duration === min.toString()
                    ? 'bg-violet-600 text-white neon-glow'
                    : 'hover:bg-zinc-800'
                }`}
              >
                {min} min
              </button>
            ))}
          </div>
        </div>

        {/* Role Cards - Eye Catching */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {roles.map((role) => (
            <div
              key={role.key}
              onClick={() => handleStart(role.key)}
              className="glass group hover:neon-glow border border-white/10 hover:border-violet-400 rounded-3xl p-8 cursor-pointer transition-all hover:-translate-y-4 hover:scale-[1.03]"
            >
              <div className={`w-16 h-16 bg-${role.color}-500/10 text-${role.color}-400 rounded-2xl flex items-center justify-center text-5xl mb-6 group-hover:scale-110 transition`}>
                {role.emoji}
              </div>
              <h3 className="text-2xl font-semibold mb-3">{role.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8">{role.desc}</p>

              <div className="flex items-center justify-between text-xs font-mono text-violet-400">
                <div>5 QUESTIONS</div>
                <div className="group-hover:translate-x-2 transition">→ START NOW</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}