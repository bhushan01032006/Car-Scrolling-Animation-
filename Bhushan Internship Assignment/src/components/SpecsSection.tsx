'use client';

import React from 'react';
import { Cpu } from 'lucide-react';

export const SpecsSection: React.FC = () => {
  return (
    <section id="engineering" className="relative py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto z-20 border-t hairline">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border hairline bg-white/[0.02] text-xs font-mono text-[#FF5A1F] mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>SYSTEM DESIGN & EXECUTION</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight uppercase">
            Engineering Behind the Motion
          </h2>
        </div>
        <p className="text-slate-400 max-w-md text-sm font-normal leading-relaxed">
          Crafted without bloated animation dependencies. Powered by GSAP ScrollTrigger hardware-accelerated transforms, pre-cached spatial coordinates, and real-time procedural Web Audio synthesis.
        </p>
      </div>

      {/* 3-Column Architectural Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        
        {/* Architecture Card 01 */}
        <div className="telemetry-card p-8 rounded-3xl transition-all duration-300">
          <div className="font-mono text-xs text-[#00E5FF] mb-6">01 // KINETIC PINNING</div>
          <h3 className="text-xl font-bold font-display text-white mb-3">Scroll-Bound Scrub Physics</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal mb-6">
            The track section pins natively using GSAP ScrollTrigger (<code className="text-[#00E5FF]">pin: true</code>) across a 2,500px scroll distance, eliminating CSS sticky viewport desynchronization on mobile and web hosting platforms.
          </p>
          <div className="pt-4 border-t hairline flex items-center justify-between font-mono text-xs text-slate-400">
            <span>GSAP ScrollTrigger</span>
            <span className="text-[#00E5FF]">60-120 FPS</span>
          </div>
        </div>

        {/* Architecture Card 02 */}
        <div className="telemetry-card p-8 rounded-3xl transition-all duration-300">
          <div className="font-mono text-xs text-emerald-400 mb-6">02 // COLLISION GEOMETRY</div>
          <h3 className="text-xl font-bold font-display text-white mb-3">Spatial Letter Lighting</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal mb-6">
            Each character coordinate within <code className="text-emerald-400">WELCOME ITZFIZZ</code> is pre-calculated on layout refresh. As the vehicle's nose crosses each letter's X-axis, inline styles update with zero DOM reflows.
          </p>
          <div className="pt-4 border-t hairline flex items-center justify-between font-mono text-xs text-slate-400">
            <span>Cached Bounding Boxes</span>
            <span className="text-emerald-400">0ms Layout Thrash</span>
          </div>
        </div>

        {/* Architecture Card 03 */}
        <div className="telemetry-card p-8 rounded-3xl transition-all duration-300">
          <div className="font-mono text-xs text-[#FF5A1F] mb-6">03 // REAL-TIME SYNTHESIS</div>
          <h3 className="text-xl font-bold font-display text-white mb-3">Procedural V8 Exhaust Audio</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal mb-6">
            Zero external audio file overhead. Built with five Web Audio API oscillators (sawtooth firing, harmonic body, sub-bass thump, turbo whistle) and soft-clip wave distortion that dynamically tracks scroll velocity.
          </p>
          <div className="pt-4 border-t hairline flex items-center justify-between font-mono text-xs text-slate-400">
            <span>Web Audio API</span>
            <span className="text-[#FF5A1F]">0 KB Asset Size</span>
          </div>
        </div>

      </div>

      {/* Vehicle Technical Telemetry Strip */}
      <div className="telemetry-card p-6 sm:p-8 rounded-3xl flex flex-wrap items-center justify-between gap-6">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#FFB800]">Proving Benchmark</span>
          <h4 className="text-xl font-bold font-display text-white mt-1">McLaren 720S Technical Telemetry</h4>
        </div>

        <div className="flex flex-wrap items-center gap-8 sm:gap-12 font-mono">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Engine</span>
            <span className="text-sm font-bold text-white">4.0L M840T V8</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Power</span>
            <span className="text-sm font-bold text-white">710 BHP / 770 Nm</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">0 - 100 KM/H</span>
            <span className="text-sm font-bold text-[#FF5A1F]">2.8 Seconds</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Terminal Velocity</span>
            <span className="text-sm font-bold text-white">341 KM/H</span>
          </div>
        </div>
      </div>

    </section>
  );
};
