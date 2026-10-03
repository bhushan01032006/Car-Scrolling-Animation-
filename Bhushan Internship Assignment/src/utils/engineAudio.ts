'use client';

class EngineAudioController {
  private ctx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null; // Main cylinder saw
  private osc2: OscillatorNode | null = null; // Harmonic triangle
  private osc3: OscillatorNode | null = null; // Mid-high cylinder bite
  private subOsc: OscillatorNode | null = null; // Deep rumble
  private turboOsc: OscillatorNode | null = null; // Twin-turbo spool
  private turboGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private shaper: WaveShaperNode | null = null;
  private masterGain: GainNode | null = null;
  private isRunning: boolean = false;
  private isMuted: boolean = false;
  private listenersAttached: boolean = false;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch (e) {
      console.warn('AudioContext initialization error:', e);
    }
  }

  // Create soft-clip exhaust distortion curve
  private makeDistortionCurve(amount: number = 18): Float32Array {
    const k = amount;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  public resume() {
    this.init();
    if (!this.isRunning) {
      this.start();
    } else if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public start() {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    if (this.isRunning) return;

    try {
      const now = this.ctx.currentTime;

      // Master Volume Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.22, now);

      // Lowpass Filter for exhaust chamber resonance
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(480, now);
      this.filter.Q.setValueAtTime(3.2, now);

      // WaveShaper for realistic mechanical exhaust grit
      this.shaper = this.ctx.createWaveShaper();
      this.shaper.curve = this.makeDistortionCurve(16) as any;
      this.shaper.oversample = '2x';

      // 1. Primary V8 Cylinder Firing (Sawtooth - rich harmonics)
      this.osc1 = this.ctx.createOscillator();
      this.osc1.type = 'sawtooth';
      this.osc1.frequency.setValueAtTime(70, now);

      // 2. Harmonic Body Layer (Triangle - clear audible tone)
      this.osc2 = this.ctx.createOscillator();
      this.osc2.type = 'triangle';
      this.osc2.frequency.setValueAtTime(140, now);

      // 3. Cylinder High Bite (Sawtooth - aggressive supercar rasp)
      this.osc3 = this.ctx.createOscillator();
      this.osc3.type = 'sawtooth';
      this.osc3.frequency.setValueAtTime(210, now);

      // 4. Sub-bass Thump (Sine - chest vibration on headphones)
      this.subOsc = this.ctx.createOscillator();
      this.subOsc.type = 'sine';
      this.subOsc.frequency.setValueAtTime(50, now);

      // 5. Twin-Turbocharger Whistle
      this.turboOsc = this.ctx.createOscillator();
      this.turboOsc.type = 'sine';
      this.turboOsc.frequency.setValueAtTime(1400, now);

      this.turboGain = this.ctx.createGain();
      this.turboGain.gain.setValueAtTime(0.015, now);
      this.turboOsc.connect(this.turboGain);
      this.turboGain.connect(this.masterGain);

      // Connect cylinders into shaper -> filter -> master gain -> destination
      const cylinderGain = this.ctx.createGain();
      cylinderGain.gain.setValueAtTime(0.35, now);

      this.osc1.connect(cylinderGain);
      this.osc2.connect(cylinderGain);
      this.osc3.connect(cylinderGain);
      this.subOsc.connect(cylinderGain);

      cylinderGain.connect(this.shaper);
      this.shaper.connect(this.filter);
      this.filter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.osc1.start();
      this.osc2.start();
      this.osc3.start();
      this.subOsc.start();
      this.turboOsc.start();
      this.isRunning = true;
    } catch (e) {
      console.warn('Engine audio start error:', e);
    }

    this.attachAutoUnlockListeners();
  }

  public attachAutoUnlockListeners() {
    if (this.listenersAttached || typeof window === 'undefined') return;
    this.listenersAttached = true;

    const wakeAudio = () => {
      this.resume();
      if (this.ctx && this.ctx.state === 'running') {
        // Once successfully running, we don't need all event listeners
        events.forEach((evt) => window.removeEventListener(evt, wakeAudio));
        this.listenersAttached = false;
      }
    };

    const events = ['click', 'pointerdown', 'mousedown', 'touchstart', 'touchend', 'keydown', 'wheel', 'scroll'];
    events.forEach((evt) => {
      window.addEventListener(evt, wakeAudio, { passive: true });
    });
  }

  public fadeOut(duration = 0.08) {
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setTargetAtTime(0, now, duration);
    }
  }

  public updateRPM(speedFactor: number) {
    if (!this.ctx || !this.isRunning) {
      this.start();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (
      !this.ctx ||
      !this.isRunning ||
      !this.osc1 ||
      !this.osc2 ||
      !this.osc3 ||
      !this.filter ||
      !this.masterGain
    )
      return;

    const clamped = Math.max(0, Math.min(1, speedFactor));
    const now = this.ctx.currentTime;

    // McLaren V8 RPM curve: 70 Hz idle up to 260 Hz redline
    const baseFreq = 70 + clamped * 190;
    this.osc1.frequency.setTargetAtTime(baseFreq, now, 0.04);
    this.osc2.frequency.setTargetAtTime(baseFreq * 2, now, 0.04);
    this.osc3.frequency.setTargetAtTime(baseFreq * 3, now, 0.04);

    if (this.subOsc) {
      this.subOsc.frequency.setTargetAtTime(Math.max(45, baseFreq * 0.65), now, 0.04);
    }

    // Turbo spool: 1400 Hz idle up to 3800 Hz high boost
    if (this.turboOsc && this.turboGain) {
      const turboFreq = 1400 + clamped * 2400;
      this.turboOsc.frequency.setTargetAtTime(turboFreq, now, 0.05);
      const turboVol = 0.01 + clamped * 0.06;
      this.turboGain.gain.setTargetAtTime(turboVol, now, 0.05);
    }

    // Exhaust resonance cutoff opens up from 480 Hz to 2800 Hz
    const cutoff = 480 + clamped * 2320;
    this.filter.frequency.setTargetAtTime(cutoff, now, 0.04);

    // Throttle volume swell: 0.20 idle up to 0.45 full throttle
    if (!this.isMuted) {
      const vol = 0.20 + clamped * 0.25;
      this.masterGain.gain.setTargetAtTime(vol, now, 0.04);
    }
  }

  public idle() {
    if (!this.isRunning || !this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    this.updateRPM(0);
    if (!this.isMuted) {
      this.masterGain.gain.setTargetAtTime(0.10, now, 0.25);
    }
  }

  public toggleMute(): boolean {
    this.resume();
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.25, now, 0.05);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public isAudioActive(): boolean {
    return !!(this.ctx && this.ctx.state === 'running' && this.isRunning);
  }

  public stop() {
    if (!this.ctx || !this.isRunning) return;
    try {
      this.osc1?.stop();
      this.osc2?.stop();
      this.osc3?.stop();
      this.subOsc?.stop();
      this.turboOsc?.stop();
      this.osc1?.disconnect();
      this.osc2?.disconnect();
      this.osc3?.disconnect();
      this.subOsc?.disconnect();
      this.turboOsc?.disconnect();
      this.turboGain?.disconnect();
      this.shaper?.disconnect();
      this.filter?.disconnect();
      this.masterGain?.disconnect();
    } catch {
      // safe cleanup
    }
    this.osc1 = null;
    this.osc2 = null;
    this.osc3 = null;
    this.subOsc = null;
    this.turboOsc = null;
    this.turboGain = null;
    this.shaper = null;
    this.filter = null;
    this.masterGain = null;
    this.isRunning = false;
  }
}

export const engineAudio = new EngineAudioController();

if (typeof window !== 'undefined') {
  engineAudio.attachAutoUnlockListeners();
}
