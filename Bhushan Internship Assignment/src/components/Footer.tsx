'use client';

import React from 'react';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-12 px-4 sm:px-8 border-t hairline bg-[#050608] z-20">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[#FF5A1F] rounded flex items-center justify-center text-white font-mono font-bold text-xs">
            IF
          </div>
          <div>
            <span className="font-bold text-xs tracking-widest text-white font-mono uppercase">
              ITZFIZZ MOTIONS // PROVING GROUND 2026
            </span>
            <p className="text-[11px] text-slate-500">Scroll-Driven Hero Section Animation Assignment</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <span>NEXT.JS</span>
          <span className="text-slate-600">•</span>
          <span>REACT</span>
          <span className="text-slate-600">•</span>
          <span>GSAP 3.12</span>
          <span className="text-slate-600">•</span>
          <span>TAILWIND CSS</span>
        </div>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 px-4 py-2 rounded-full border hairline hover:border-[#FF5A1F]/50 hover:text-[#FF5A1F] text-xs font-mono text-slate-300 transition-all bg-white/[0.02] cursor-pointer"
        >
          <span>Back to Top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
};
