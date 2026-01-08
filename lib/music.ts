// Child-friendly background music generator using Web Audio API

class BackgroundMusic {
  private audioContext: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;
  private volume: number = 0.12; // Low volume so it doesn't interfere with speech
  private animationFrameId: number | null = null;
  private startTime: number = 0;

  // Cheerful melody pattern (C major scale frequencies)
  private melody: number[] = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    349.23, // F4
    392.00, // G4
    440.00, // A4
    493.88, // B4
    523.25, // C5
  ];

  // Simple, happy melody pattern
  private pattern: number[] = [0, 2, 4, 2, 4, 5, 4, 2, 0, 2, 4, 2, 0];
  private patternIndex: number = 0;
  private lastNoteTime: number = 0;
  private noteDuration: number = 0.3; // seconds per note

  init(): void {
    if (typeof window === "undefined") return;

    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      
      // Create master gain node
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = this.volume;
      this.gainNode.connect(this.audioContext.destination);
    } catch (error) {
      console.error("AudioContext not supported:", error);
    }
  }

  start(): void {
    if (this.isPlaying || !this.audioContext || !this.gainNode) {
      // If audio context is suspended, resume it (required by browser autoplay policy)
      if (this.audioContext?.state === "suspended") {
        this.audioContext.resume();
      }
      return;
    }

    this.isPlaying = true;
    this.startTime = this.audioContext.currentTime;
    this.lastNoteTime = 0;
    this.patternIndex = 0;

    this.playMelody();
  }

  private playMelody(): void {
    if (!this.audioContext || !this.gainNode || !this.isPlaying) return;

    const currentTime = this.audioContext.currentTime;
    const elapsed = currentTime - this.startTime;
    const noteStartTime = this.patternIndex * this.noteDuration;

    // Play next note when it's time
    if (elapsed >= noteStartTime && elapsed < noteStartTime + 0.1) {
      const noteOffset = this.pattern[this.patternIndex];
      const noteIndex = (4 + noteOffset) % this.melody.length;
      const frequency = this.melody[noteIndex];

      this.playNote(frequency, this.noteDuration);

      this.patternIndex++;
      
      // Loop the pattern
      if (this.patternIndex >= this.pattern.length) {
        this.patternIndex = 0;
        this.startTime = currentTime;
      }
    }

    // Continue playing
    if (this.isPlaying) {
      this.animationFrameId = requestAnimationFrame(() => this.playMelody());
    }
  }

  private playNote(frequency: number, duration: number): void {
    if (!this.audioContext || !this.gainNode) return;

    const now = this.audioContext.currentTime;

    // Create main melody oscillator (sine wave - soft and pleasant)
    const osc1 = this.audioContext.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = frequency;

    // Create harmony oscillator (triangle wave - adds warmth)
    const osc2 = this.audioContext.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.value = frequency * 1.5; // Perfect fifth harmony

    // Create bass note (low octave for depth)
    const osc3 = this.audioContext.createOscillator();
    osc3.type = "sine";
    osc3.frequency.value = frequency * 0.5; // One octave lower

    // Create gain nodes for each oscillator with smooth envelope
    const gain1 = this.audioContext.createGain();
    const gain2 = this.audioContext.createGain();
    const gain3 = this.audioContext.createGain();

    // Smooth fade in/out
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gain1.gain.linearRampToValueAtTime(0.3, now + duration - 0.05);
    gain1.gain.linearRampToValueAtTime(0, now + duration);

    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gain2.gain.linearRampToValueAtTime(0.2, now + duration - 0.05);
    gain2.gain.linearRampToValueAtTime(0, now + duration);

    gain3.gain.setValueAtTime(0, now);
    gain3.gain.linearRampToValueAtTime(0.15, now + 0.05);
    gain3.gain.linearRampToValueAtTime(0.15, now + duration - 0.05);
    gain3.gain.linearRampToValueAtTime(0, now + duration);

    // Connect oscillators
    osc1.connect(gain1);
    osc2.connect(gain2);
    osc3.connect(gain3);
    
    gain1.connect(this.gainNode);
    gain2.connect(this.gainNode);
    gain3.connect(this.gainNode);

    // Start and stop oscillators
    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    
    osc1.stop(now + duration);
    osc2.stop(now + duration);
    osc3.stop(now + duration);

    // Store references for cleanup
    this.oscillators.push(osc1, osc2, osc3);
    
    // Clean up after note finishes
    setTimeout(() => {
      this.oscillators = this.oscillators.filter(
        (osc) => osc !== osc1 && osc !== osc2 && osc !== osc3
      );
    }, duration * 1000 + 100);
  }

  stop(): void {
    this.isPlaying = false;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Stop all oscillators
    this.oscillators.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    this.oscillators = [];

    if (this.gainNode) {
      // Fade out smoothly
      if (this.audioContext) {
        const now = this.audioContext.currentTime;
        this.gainNode.gain.linearRampToValueAtTime(0, now + 0.3);
      }
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.gainNode) {
      this.gainNode.gain.value = this.volume;
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

// Singleton instance
let musicInstance: BackgroundMusic | null = null;

export const getBackgroundMusic = (): BackgroundMusic => {
  if (!musicInstance) {
    musicInstance = new BackgroundMusic();
    if (typeof window !== "undefined") {
      musicInstance.init();
    }
  }
  return musicInstance;
};

