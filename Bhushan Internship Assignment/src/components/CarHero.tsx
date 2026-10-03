'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import { ArrowDown, Play, Volume2, VolumeX } from 'lucide-react';
import { engineAudio } from '@/utils/engineAudio';

interface CarHeroProps {
  headlightsOn: boolean;
  isAutoDriving: boolean;
  setIsAutoDriving: (v: boolean) => void;
  onTelemetryUpdate: (progress: number, speedKmH: number) => void;
}

const STATS_DATA = [
  {
    id: 'box1',
    value: 58,
    unit: '%',
    tag: 'SECTOR 01 // 15%',
    badge: '+SURGE',
    badgeColor: 'bg-[#00E5FF]/15 text-[#00E5FF] border-[#00E5FF]/30',
    title: 'Pick-Up Hub Adoption',
    desc: 'Automated parcel lockers absorb high-density corridor loads with zero human queuing.',
    border: 'border-[#00E5FF]/40',
    accentText: 'text-white',
    position: 'top-[8%] sm:top-[10%] left-[24%] md:left-[30%]',
  },
  {
    id: 'box2',
    value: 23,
    unit: '%',
    tag: 'SECTOR 02 // 35%',
    badge: '-DEFLECTION',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    title: 'Inbound Call Reduction',
    desc: 'Direct vehicle telemetry stream resolves customer parcel status before inquiry.',
    border: 'border-emerald-400/40',
    accentText: 'text-white',
    position: 'bottom-[8%] sm:bottom-[10%] left-[42%] md:left-[48%]',
  },
  {
    id: 'box3',
    value: 27,
    unit: '%',
    tag: 'SECTOR 03 // 55%',
    badge: '+VELOCITY',
    badgeColor: 'bg-white/15 text-white border-white/30',
    title: 'Fleet Dispatch Velocity',
    desc: 'Accelerated transit turnaround with zero bottleneck idling at sorting docks.',
    border: 'border-white/30',
    accentText: 'text-white',
    position: 'top-[8%] sm:top-[10%] right-[16%] md:right-[22%]',
  },
  {
    id: 'box4',
    value: 40,
    unit: '%',
    tag: 'SECTOR 04 // 55%',
    badge: '+OPTIMIZED',
    badgeColor: 'bg-[#FF5500]/20 text-[#FF5500] border-[#FF5500]/40',
    title: 'Route SLA Efficiency',
    desc: 'Comprehensive milestone completion and multi-point route sustainability gain.',
    border: 'border-[#FF5500]/50',
    accentText: 'text-[#FF5500]',
    position: 'bottom-[8%] sm:bottom-[10%] right-[4%] md:right-[8%]',
  },
];

const ROAD_LETTERS = [
  'W', 'E', 'L', 'C', 'O', 'M', 'E',
  ' ',
  'I', 'T', 'Z', 'F', 'I', 'Z', 'Z',
];

export const CarHero: React.FC<CarHeroProps> = ({
  headlightsOn,
  isAutoDriving,
  setIsAutoDriving,
  onTelemetryUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLImageElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Initial load animated counters
  const [initialCount, setInitialCount] = useState({
    pickup: 0,
    calls: 0,
    velocity: 0,
    efficiency: 0,
  });

  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const celebrationTriggered = useRef(false);

  // 1. Initial Load Staggered Animation
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.hero-tag',
        { opacity: 0, y: -15, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.15 }
      );

      tl.fromTo(
        '.hero-title .letter',
        { opacity: 0, y: 45, rotateX: -35 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.85,
          stagger: 0.04,
        },
        '-=0.5'
      );

      tl.fromTo(
        '.hero-subtitle',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.4'
      );

      tl.fromTo(
        '.stat-card',
        { opacity: 0, y: 30, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
        },
        '-=0.4'
      );

      tl.fromTo(
        '.scroll-cue',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.2'
      );

      // Number count-up
      const counterObj = { pickup: 0, calls: 0, velocity: 0, efficiency: 0 };
      gsap.to(counterObj, {
        pickup: 58,
        calls: 23,
        velocity: 27,
        efficiency: 40,
        duration: 2.2,
        ease: 'power2.out',
        delay: 0.4,
        onUpdate: () => {
          setInitialCount({
            pickup: Math.round(counterObj.pickup),
            calls: Math.round(counterObj.calls),
            velocity: Math.round(counterObj.velocity),
            efficiency: Math.round(counterObj.efficiency),
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // 2. Scroll-Based GSAP Native Pinning Animation
  useEffect(() => {
    if (typeof window === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    const car = carRef.current;
    const trail = trailRef.current;
    const road = roadRef.current;
    const textContainer = textContainerRef.current;
    if (!car || !trail || !road || !textContainer) return;

    const letters = textContainer.querySelectorAll<HTMLSpanElement>('.track-letter');

    const updateLetterPositions = () => {
      const roadRect = road.getBoundingClientRect();
      const posMap: { element: HTMLSpanElement; x: number }[] = [];
      letters.forEach((el) => {
        const r = el.getBoundingClientRect();
        posMap.push({
          element: el,
          x: r.left - roadRect.left + r.width / 2,
        });
      });
      return posMap;
    };

    let letterPositions = updateLetterPositions();
    const handleRefresh = () => {
      letterPositions = updateLetterPositions();
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleRefresh);
    window.addEventListener('load', handleRefresh);
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(handleRefresh);
    }
    const t1 = setTimeout(handleRefresh, 150);
    const t2 = setTimeout(handleRefresh, 600);

    const ctx = gsap.context(() => {
      // Ensure no transform interference so flexbox centers the car perfectly
      gsap.set(car, { clearProps: 'y,yPercent,top' });

      const updateCarScene = (p: number) => {
        const roadWidth = road.offsetWidth || window.innerWidth;
        const carWidth = car.offsetWidth || 345;
        const totalTravel = Math.max(0, roadWidth - carWidth);
        const currentX = p * totalTravel;
        const carNoseX = currentX + carWidth * 0.85;

        // Update trail width
        if (trail) {
          trail.style.width = `${currentX + carWidth * 0.18}px`;
        }

        // Letter Illumination as car passes
        letterPositions.forEach((item) => {
          if (carNoseX >= item.x) {
            item.element.style.opacity = '1';
            item.element.style.color = '#FFFFFF';
            item.element.style.textShadow = '0 0 25px rgba(255, 90, 31, 0.9), 0 0 10px rgba(255, 184, 0, 0.7)';
            item.element.style.transform = 'scale(1.05) translateY(-2px)';
          } else {
            item.element.style.opacity = '0.15';
            item.element.style.color = '#374151';
            item.element.style.textShadow = 'none';
            item.element.style.transform = 'scale(1) translateY(0px)';
          }
        });

        // Telemetry update
        const speed = Math.round(p * 341);
        onTelemetryUpdate(p, speed);

        // Rev engine audio
        engineAudio.resume();
        engineAudio.updateRPM(p);

        // Finish line confetti trigger at 96%
        if (p >= 0.96 && !celebrationTriggered.current) {
          celebrationTriggered.current = true;
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF5A1F', '#FFB800', '#00E5FF', '#10B981', '#FFFFFF'],
          });
        } else if (p < 0.9) {
          celebrationTriggered.current = false;
        }
      };

      // Master Pinned Kinetic Timeline
      const trackTl = gsap.timeline({
        scrollTrigger: {
          trigger: trackRef.current || containerRef.current,
          pin: true,
          start: 'top top',
          end: '+=2500',
          scrub: 1.1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            updateCarScene(self.progress);
          },
          onLeave: () => {
            engineAudio.idle();
          },
          onLeaveBack: () => {
            engineAudio.idle();
          },
          onEnter: () => {
            engineAudio.resume();
          },
          onEnterBack: () => {
            engineAudio.resume();
          },
        },
      });

      // 1. Car smooth glide across the runway - Centered 100% via flexbox
      trackTl.to(car, {
        x: () => Math.max(0, (road.offsetWidth || window.innerWidth) - (car.offsetWidth || 345)),
        ease: 'none',
        duration: 1,
      }, 0);

      // 2. Box 1 (58% Pickup) appears at 15%
      trackTl.fromTo(
        '#box1',
        { opacity: 0, scale: 0.8, y: -25, filter: 'blur(8px)' },
        { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 0.12, ease: 'power2.out' },
        0.15
      );

      // 3. Box 2 (23% Call Deflection) appears at 35%
      trackTl.fromTo(
        '#box2',
        { opacity: 0, scale: 0.8, y: 25, filter: 'blur(8px)' },
        { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 0.12, ease: 'power2.out' },
        0.35
      );

      // 4. Box 3 (27% Velocity) and Box 4 (40% Orange Efficiency) appear TOGETHER at 55%!
      trackTl.fromTo(
        '#box3',
        { opacity: 0, scale: 0.8, y: -25, filter: 'blur(8px)' },
        { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 0.12, ease: 'power2.out' },
        0.55
      );
      trackTl.fromTo(
        '#box4',
        { opacity: 0, scale: 0.8, y: 25, filter: 'blur(8px)' },
        { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 0.12, ease: 'power2.out' },
        0.55
      );
    }, trackRef);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', handleRefresh);
      window.removeEventListener('load', handleRefresh);
      ctx.revert();
    };
  }, [onTelemetryUpdate]);

  // Auto-Cruise Handler
  useEffect(() => {
    let animId: number;

    if (isAutoDriving) {
      engineAudio.resume();
      const track = trackRef.current;
      if (!track) return;

      const targetScroll = track.offsetTop + 2500;
      const startScroll = window.scrollY;
      const duration = 6500;
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        window.scrollTo(0, startScroll + (targetScroll - startScroll) * ease);

        if (t < 1 && isAutoDriving) {
          animId = requestAnimationFrame(step);
        } else {
          setIsAutoDriving(false);
          engineAudio.updateRPM(1.0);
        }
      };

      animId = requestAnimationFrame(step);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isAutoDriving, setIsAutoDriving]);

  const scrollToTrack = useCallback(() => {
    engineAudio.resume();
    if (trackRef.current) {
      window.scrollTo({ top: trackRef.current.offsetTop, behavior: 'smooth' });
    }
  }, []);

  return (
    <div id="hero" className="relative w-full" ref={containerRef}>
      
      {/* 
        ========================================================================
        1. FIRST SCREEN: ABOVE THE FOLD HERO INTRO (Requirement 1 & 2)
        ========================================================================
      */}
      <section className="relative min-h-screen w-full flex flex-col justify-between pt-6 sm:pt-8 md:pt-10 pb-8 px-4 sm:px-8 max-w-7xl mx-auto z-20">
        
        {/* Minimalist Editorial Top Header */}
        <header className="w-full flex items-center justify-between border-b hairline pb-4 mb-2">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF5500] to-[#FFB800] flex items-center justify-center text-black font-mono font-bold text-xs shadow-[0_0_18px_rgba(255,85,0,0.35)]">
              IF
            </div>
            <div>
              <span className="font-display font-extrabold text-sm sm:text-base tracking-wider text-white uppercase block leading-none">
                ITZFIZZ MOTIONS
              </span>
              <span className="font-mono text-[10px] text-slate-400 tracking-widest uppercase mt-0.5 block">
                Grand Prix Proving Ground // 2026
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 text-slate-400 font-mono text-xs tracking-wider">
            <span className="px-2.5 py-0.5 rounded-full bg-white/5 border hairline text-white text-[10px] font-semibold">TEST BED</span>
            <span className="text-white font-medium">MCLAREN 720S</span>
            <span className="text-slate-600 hidden sm:inline">/</span>
            <span className="text-[#FFB800] hidden sm:inline">4.0L V8</span>
            <span className="text-slate-600 hidden md:inline">/</span>
            <span className="hidden md:inline">710 BHP</span>
          </div>
        </header>

        {/* Hero Title & Statement */}
        <div className="my-auto py-6 sm:py-10 flex flex-col items-center text-center">
          
          <div className="hero-tag inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border hairline bg-white/[0.02] text-xs font-mono tracking-widest text-slate-300 uppercase mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse" />
            <span>KINETIC CHOREOGRAPHY & TELEMETRY</span>
          </div>

          {/* Headline: WELCOME ITZFIZZ (Proper Proportional Font Scale) */}
          <h1 className="hero-title flex flex-wrap justify-center items-center gap-x-5 sm:gap-x-8 md:gap-x-10 gap-y-2 text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black font-display uppercase select-none drop-shadow-2xl">
            <span className="flex tracking-[0.14em] sm:tracking-[0.18em] md:tracking-[0.22em] text-white">
              {['W', 'E', 'L', 'C', 'O', 'M', 'E'].map((char, idx) => (
                <span
                  key={`welcome-${idx}`}
                  className="letter inline-block transition-transform hover:scale-110 hover:text-[#FF5500] cursor-default"
                >
                  {char}
                </span>
              ))}
            </span>
            <span className="flex tracking-[0.14em] sm:tracking-[0.18em] md:tracking-[0.22em] bg-gradient-to-r from-[#FF5500] via-[#FF7A1A] to-[#FFB800] bg-clip-text text-transparent">
              {['I', 'T', 'Z', 'F', 'I', 'Z', 'Z'].map((char, idx) => (
                <span
                  key={`itzfizz-${idx}`}
                  className="letter inline-block transition-transform hover:scale-110 cursor-default"
                >
                  {char}
                </span>
              ))}
            </span>
          </h1>

          <p className="hero-subtitle mt-5 sm:mt-7 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
            Glide the McLaren 720S across the kinetic proving ground. Physical momentum, continuous scrub interpolation, and real-time operational metrics.
          </p>
        </div>

        {/* Architectural Impact Metrics (Requirement 1 & 2) */}
        <div id="heroMetrics" className="w-full mt-2 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Metric 01 */}
            <div className="stat-card group telemetry-card p-5 sm:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 mb-3">
                <span className="tracking-widest font-semibold text-slate-400">01 // ADOPTION</span>
                <span className="px-2 py-0.5 rounded font-bold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 text-[10px]">+SURGE</span>
              </div>
              <div className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight leading-none group-hover:text-[#00E5FF] transition-colors">
                {initialCount.pickup}%
              </div>
              <h4 className="mt-3 text-sm sm:text-base font-bold text-white tracking-tight font-sans">Hub Network Routing</h4>
              <p className="mt-1 text-xs sm:text-[13px] text-slate-400 leading-relaxed font-normal">
                Autonomous locker and metro pickup node distribution absorbing peak corridor volume.
              </p>
            </div>

            {/* Metric 02 */}
            <div className="stat-card group telemetry-card p-5 sm:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 mb-3">
                <span className="tracking-widest font-semibold text-slate-400">02 // DEFLECTION</span>
                <span className="px-2 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">-REDUCED</span>
              </div>
              <div className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight leading-none group-hover:text-emerald-400 transition-colors">
                {initialCount.calls}%
              </div>
              <h4 className="mt-3 text-sm sm:text-base font-bold text-white tracking-tight font-sans">Support Queue Drop</h4>
              <p className="mt-1 text-xs sm:text-[13px] text-slate-400 leading-relaxed font-normal">
                Proactive dispatch telemetry stream resolves customer parcel status before inquiry.
              </p>
            </div>

            {/* Metric 03 */}
            <div className="stat-card group telemetry-card p-5 sm:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 mb-3">
                <span className="tracking-widest font-semibold text-slate-400">03 // VELOCITY</span>
                <span className="px-2 py-0.5 rounded font-bold bg-white/10 text-white border border-white/20 text-[10px]">+SPEED</span>
              </div>
              <div className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight leading-none group-hover:text-slate-300 transition-colors">
                {initialCount.velocity}%
              </div>
              <h4 className="mt-3 text-sm sm:text-base font-bold text-white tracking-tight font-sans">Terminal Dispatch</h4>
              <p className="mt-1 text-xs sm:text-[13px] text-slate-400 leading-relaxed font-normal">
                Accelerated loading dock turnaround with synchronized dynamic carrier assignment.
              </p>
            </div>

            {/* Metric 04 */}
            <div className="stat-card group telemetry-card p-5 sm:p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 mb-3">
                <span className="tracking-widest font-semibold text-slate-400">04 // EFFICIENCY</span>
                <span className="px-2 py-0.5 rounded font-bold bg-[#FF5500]/15 text-[#FF5500] border border-[#FF5500]/30 text-[10px]">+OPTIMIZED</span>
              </div>
              <div className="text-4xl sm:text-5xl font-black font-display text-[#FF5500] tracking-tight leading-none group-hover:text-[#FF7A1A] transition-colors">
                {initialCount.efficiency}%
              </div>
              <h4 className="mt-3 text-sm sm:text-base font-bold text-white tracking-tight font-sans">Peak Route Throughput</h4>
              <p className="mt-1 text-xs sm:text-[13px] text-slate-400 leading-relaxed font-normal">
                Net operational SLA achievement and fuel sustainability across urban delivery routes.
              </p>
            </div>

          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-cue flex items-center justify-center pt-2">
          <button
            onClick={scrollToTrack}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border hairline bg-white/[0.02] hover:border-[#FF5500]/50 text-xs font-mono uppercase tracking-widest text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <span>Scroll to Accelerate Runway</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#FF5500] animate-bounce" />
          </button>
        </div>

      </section>

      {/* 
        ========================================================================
        2. PINNED GRAND PRIX KINETIC TRACK (Requirement 3 & 4)
        ========================================================================
      */}
      <div
        className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden bg-[#07090E]"
        ref={trackRef}
      >
        {/* Top Track Instrumentation Bar */}
        <div className="absolute top-8 left-0 right-0 z-20 px-6 max-w-7xl mx-auto flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2.5 font-mono text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-[#FF5500] animate-ping" />
            <span className="tracking-widest uppercase font-semibold text-white">GRAND PRIX PROVING CIRCUIT</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400 hidden sm:inline">DISTANCE: 1,000M</span>
          </div>

          <div className="font-mono text-xs text-slate-400">
            <span className="text-[#FF5500] font-bold">MCLAREN 720S</span> • TWIN-TURBO 4.0L V8
          </div>
        </div>

        {/* Distance Telemetry Markers */}
        <div className="absolute top-[26%] sm:top-[24%] left-0 right-0 z-10 px-8 max-w-7xl mx-auto flex justify-between font-mono text-[11px] text-slate-400 uppercase tracking-widest pointer-events-none">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-600" />000M // GRID BOX 01</span>
          <span className="hidden sm:flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-600" />250M // APEX</span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-600" />500M // MID-SECTOR</span>
          <span className="hidden sm:flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-600" />750M // DRS ZONE</span>
          <span className="text-[#FFB800] font-bold flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]" />1000M // CHECKERED FINISH</span>
        </div>

        {/* Floating Milestone Telemetry Cards */}
        {STATS_DATA.map((box) => (
          <div
            key={box.id}
            id={box.id}
            className={`floating-box absolute z-30 ${box.position} p-5 sm:p-6 rounded-2xl telemetry-card border ${box.border} max-w-[280px] sm:max-w-[320px] transition-all duration-300 opacity-0 pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.9)]`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`font-mono text-[11px] font-bold uppercase tracking-wider ${box.id === 'box4' ? 'text-[#FF5500]' : box.id === 'box2' ? 'text-emerald-400' : box.id === 'box1' ? 'text-[#00E5FF]' : 'text-slate-300'}`}>
                {box.tag}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${box.badgeColor}`}>
                {box.badge}
              </span>
            </div>
            <div className={`text-4xl sm:text-5xl font-black font-display tracking-tight leading-none ${box.accentText}`}>
              {box.value}%
            </div>
            <h4 className="mt-2.5 text-sm sm:text-base font-bold text-white font-sans">
              {box.title}
            </h4>
            <p className="mt-1 text-xs sm:text-[13px] text-slate-300 leading-relaxed font-normal">
              {box.desc}
            </p>
          </div>
        ))}

        {/* Runway Road Surface */}
        <div
          id="roadRunway"
          ref={roadRef}
          className="circuit-asphalt relative w-full h-[240px] sm:h-[270px] md:h-[300px] shadow-[0_0_100px_rgba(0,0,0,0.95)] flex items-center"
        >
          {/* Top F1 Rumble Curb Strip */}
          <div className="rumble-curb absolute top-0 left-0 right-0 z-10" />

          {/* Circuit Centerline */}
          <div className="circuit-centerline" />

          {/* Aerodynamic Slipstream Wake */}
          <div id="roadTrail" ref={trailRef} className="solar-wake" />

          {/* Checkered Finish Line Strip */}
          <div
            className="absolute right-0 top-0 bottom-0 w-14 z-10 flex flex-col justify-between opacity-95"
            style={{
              backgroundImage: 'repeating-conic-gradient(#FFFFFF 0% 25%, #0B0D12 0% 50%) 50% / 22px 22px',
              borderLeft: '4px solid #FFB800',
              boxShadow: '-5px 0 25px rgba(255, 184, 0, 0.4)',
            }}
          >
            <div className="absolute -left-16 top-2 text-[10px] font-mono font-bold text-[#FFB800] uppercase tracking-wider rotate-90 origin-right">
              FINISH LINE
            </div>
          </div>

          {/* Kinetic Road Letters: WELCOME ITZFIZZ */}
          <div
            id="roadTextContainer"
            ref={textContainerRef}
            className="absolute inset-0 flex items-center justify-start pl-8 md:pl-16 z-20 pointer-events-none select-none overflow-hidden"
          >
            <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 font-extrabold font-display text-3xl sm:text-5xl md:text-7xl tracking-[0.16em] sm:tracking-[0.24em]">
              {ROAD_LETTERS.map((char, idx) => (
                <span
                  key={`road-letter-${idx}`}
                  className="track-letter uppercase transition-all duration-150"
                  style={{ opacity: 0.15, color: '#374151' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </div>
          </div>

          {/* The McLaren 720S Visual Element (Pure Flexbox Vertical Centering - 100% Fail-Proof) */}
          <div
            id="carVehicle"
            className="absolute top-0 bottom-0 left-0 h-full z-30 flex items-center cursor-grab will-change-transform pointer-events-none"
            style={{ width: 'max-content' }}
          >
            <div className="relative flex items-center">
              <img
                ref={carRef}
                src="car.png"
                alt="McLaren 720S Top View"
                className="h-[125px] sm:h-[145px] md:h-[165px] w-auto object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.95)] select-none pointer-events-none"
                style={{ aspectRatio: '3981 / 1901' }}
                draggable={false}
              />
              {/* Xenon Projector Beam */}
              <div
                id="headlightBeam"
                className="xenon-beam"
                style={{ opacity: headlightsOn ? 1 : 0 }}
              />
            </div>
          </div>

          {/* Bottom F1 Rumble Curb Strip */}
          <div className="rumble-curb absolute bottom-0 left-0 right-0 z-10" />

        </div>

        {/* Bottom Track Footer Markers */}
        <div className="absolute bottom-8 left-0 right-0 z-20 px-8 max-w-7xl mx-auto flex items-center justify-between text-xs font-mono text-slate-500 pointer-events-none">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
              <span>LAUNCH LAUNCHPAD</span>
            </span>
            <span className="hidden sm:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>APEX DYNAMICS</span>
            </span>
            <span className="hidden sm:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
              <span>MAX VELOCITY</span>
            </span>
          </div>

          <div>
            <span>INTERPOLATION: 1.1S FLUID SCRUB</span>
          </div>
        </div>

      </div>

    </div>
  );
};
