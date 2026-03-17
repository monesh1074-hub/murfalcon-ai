import React from 'react';

export default function Waveform() {
  return (
    <div className="flex items-end gap-1 h-12">
      {[0, 0.1, 0.3, 0.2, 0.4].map((delay, i) => (
        <div
          key={i}
          className="w-1.5 rounded-full"
          style={{
            background: '#735DFF',
            animation: `speak 1.2s infinite ease-in-out`,
            animationDelay: `${delay}s`,
            height: ['45%', '35%', '65%', '45%', '80%'][i],
          }}
        />
      ))}
    </div>
  );
}