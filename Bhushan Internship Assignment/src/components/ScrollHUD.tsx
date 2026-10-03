'use client';

import React, { useState } from 'react';
import { Gauge, Volume2, VolumeX, Sun } from 'lucide-react';
import { engineAudio } from '@/utils/engineAudio';

interface ScrollHUDProps {
  progress: number; // 0 to 1
  speedKmH: number; // 0 to 341
}

export const ScrollHUD: React.FC<ScrollHUDProps> = ({ progress, speedKmH }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [headlightsOn, setHeadlightsOn] = useState(true);
  
  // Calculate gear based on speed
  let gear = 'N';
  if (speedKmH === 0) gear = 'P';
  else if (speedKmH < 40) gear = '1';
  else if (speedKmH < 90) gear = '2';
  else if (speedKmH < 150) gear = '3';
  else if (speedKmH < 210) gear = '4';
  else if (speedKmH < 270) gear = '5';
  else if (speedKmH < 320) gear = '6';
  else gear = '7';

  // RPM from 900 to 8200
  const rpm = Math.round(900 + (progress * 7300));

  return (
    <div className="fixed bottom-6 right-6 z-40 hidden sm:flex items-center gap-3">
      {/* Telemetry dock */}
      <div className="telemetry-card rounded-2xl px-5 py-3 flex items-center gap-5 shadow-2xl">
        
        {/* Speedometer */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-slate-400">
            <Gauge className="w-3.5 h-3.5 text-[#FF5500]" />
            <span>Velocity</span>
          </div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-black font-display text-white tracking-tight leading-none">
              {Math.round(speedKmH)}
            </span>
            <span className="text-[11px] font-bold text-slate-400 font-mono">KM/H</span>
          </div>
        </div>

        <div className="w-[1px] h-8 bg-white/10" />

        {/* Gear Box */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Gear</span>
          <div className="mt-0.5 w-7 h-7 rounded-lg bg-white/5 border hairline flex items-center justify-center font-mono font-black text-sm text-[#FF5500]">
            {gear}
          </div>
        </div>

        <div className="w-[1px] h-8 bg-white/10" />

        {/* RPM Meter */}
        <div className="flex flex-col w-28">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span>RPM</span>
            <span className="text-white font-bold">{rpm}</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00E5FF] via-[#FFB800] to-[#FF5500] rounded-full transition-all duration-75"
              style={{ width: `${Math.min(100, Math.max(5, progress * 100))}%` }}
            />
          </div>
        </div>

        <div className="w-[1px] h-8 bg-white/10" />

        {/* Sound Toggle */}
        <button
          onClick={() => {
            const muted = engineAudio.toggleMute();
            setIsMuted(muted);
          }}
          title="Toggle V8 Audio"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border hairline text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-red-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-[#FF5500]" />
          )}
        </button>

        {/* Headlights Toggle */}
        <button
          onClick={() => {
            setHeadlightsOn(!headlightsOn);
            const beam = document.getElementById('headlightBeam');
            if (beam) beam.style.opacity = !headlightsOn ? '1' : '0';
          }}
          title="Toggle Headlights"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border hairline text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <Sun className={`w-4 h-4 ${headlightsOn ? 'text-[#00E5FF]' : 'text-slate-500'}`} />
        </button>

      </div>
    </div>
  );
};
