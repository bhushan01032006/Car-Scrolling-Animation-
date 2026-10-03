'use client';

import React, { useState, useCallback } from 'react';
import { CarHero } from '@/components/CarHero';
import { ScrollHUD } from '@/components/ScrollHUD';
import { SpecsSection } from '@/components/SpecsSection';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [headlightsOn, setHeadlightsOn] = useState(true);
  const [isAutoDriving, setIsAutoDriving] = useState(false);
  const [telemetry, setTelemetry] = useState({ progress: 0, speedKmH: 0 });

  const handleTelemetryUpdate = useCallback((progress: number, speedKmH: number) => {
    setTelemetry({ progress, speedKmH });
  }, []);

  const handleAutoDriveToggle = useCallback(() => {
    setIsAutoDriving((prev) => !prev);
  }, []);

  return (
    <main className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col relative selection:bg-[#def54f] selection:text-black">
      {/* Hero Section & Scroll-Driven Kinetic Runway */}
      <CarHero
        headlightsOn={headlightsOn}
        isAutoDriving={isAutoDriving}
        setIsAutoDriving={setIsAutoDriving}
        onTelemetryUpdate={handleTelemetryUpdate}
      />

      {/* Supercar Specs & Frontend Architecture Breakdown */}
      <SpecsSection />

      {/* Footer */}
      <Footer />

      {/* Fixed Telemetry HUD */}
      <ScrollHUD progress={telemetry.progress} speedKmH={telemetry.speedKmH} />
    </main>
  );
}
