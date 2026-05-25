// Sophisticated synthesized micro-sound effects for interactive learning feedback

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

export function playSuccessSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;
  
  // High pleasant chime
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc1.type = 'sine';
  osc2.type = 'triangle';

  // Double frequency harmony (C5 -> E5 -> G5)
  osc1.frequency.setValueAtTime(523.25, now); // C5
  osc1.frequency.exponentialRampToValueAtTime(880.00, now + 0.15); // A5

  osc2.frequency.setValueAtTime(659.25, now); // E5
  osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15); // C6

  gainNode.gain.setValueAtTime(0.08, now);
  gainNode.gain.exponentialRampToValueAtTime(0.005, now + 0.3);

  osc1.connect(gainNode);
  osc2.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.3);
  osc2.stop(now + 0.3);
}

export function playErrorSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;
  
  // Low gentle buzzer sound
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(120, now);
  osc.frequency.linearRampToValueAtTime(90, now + 0.2);

  gainNode.gain.setValueAtTime(0.06, now);
  gainNode.gain.exponentialRampToValueAtTime(0.005, now + 0.25);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.25);
}

export function playFanfareSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;
  
  // Arpeggio chime sequence
  const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 1046.50]; // C4 -> E4 -> G4 -> C5 -> E5 -> C6
  
  notes.forEach((freq, index) => {
    const noteTime = now + index * 0.08;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, noteTime);
    
    gainNode.gain.setValueAtTime(0.05, noteTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.4);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(noteTime);
    osc.stop(noteTime + 0.4);
  });
}

// Support basic text-to-speech for Spanish words using web speech synthesis
export function speakSpanishWord(word: string) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  
  try {
    // Cancel any ongoing speaking
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'es-ES';
    utterance.rate = 0.85; // Slightly slower for clear learning
    utterance.volume = 0.7;
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.warn('Speech synthesis failed:', error);
  }
}
