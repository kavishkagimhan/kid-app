// Enhanced kid-friendly speech with improved Web Speech API
// 
// This implementation:
// 1. Automatically selects the best available human-like voice
// 2. Uses optimized parameters for kid-friendly, natural sound
// 3. Prioritizes premium voices (Google, Microsoft, etc.) when available
// 4. Falls back gracefully if premium voices aren't available
//
// For even better voices, you can optionally add ResponsiveVoice.js:
// - Get a free API key from https://responsivevoice.org (free for non-commercial)
// - Update the script src in loadResponsiveVoice() function with your key
// - ResponsiveVoice provides excellent human-like voices

// Declare ResponsiveVoice types
declare global {
  interface Window {
    responsiveVoice?: {
      speak: (
        text: string,
        voice: string,
        options?: {
          pitch?: number;
          rate?: number;
          volume?: number;
          onend?: () => void;
          onerror?: () => void;
        }
      ) => void;
      cancel: () => void;
      isPlaying: () => boolean;
      voiceSupport: () => boolean;
    };
  }
}

let synth: SpeechSynthesis | null = null;
let voices: SpeechSynthesisVoice[] = [];
let voiceCache: SpeechSynthesisVoice | null = null;
let responsiveVoiceLoaded = false;
let useResponsiveVoice = false;

// Load ResponsiveVoice.js (free for non-commercial use)
const loadResponsiveVoice = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window not available"));
      return;
    }

    if (window.responsiveVoice) {
      responsiveVoiceLoaded = true;
      useResponsiveVoice = true;
      resolve();
      return;
    }

    // Load ResponsiveVoice script (free for non-commercial use)
    // Note: For production, get a free key from https://responsivevoice.org
    // For now, we'll use Web Speech API which works without any key
    // ResponsiveVoice can be added later with a free API key
    const script = document.createElement("script");
    // Using a demo/test approach - will fallback to Web Speech API if not available
    script.src = "https://code.responsivevoice.org/responsivevoice.js";
    script.async = true;
    script.onload = () => {
      responsiveVoiceLoaded = true;
      useResponsiveVoice = true;
      resolve();
    };
    script.onerror = () => {
      console.warn("ResponsiveVoice failed to load, using Web Speech API");
      responsiveVoiceLoaded = false;
      useResponsiveVoice = false;
      resolve(); // Fallback to Web Speech API
    };
    document.head.appendChild(script);
  });
};

// Initialize speech synthesis
if (typeof window !== "undefined") {
  synth = window.speechSynthesis;
  
  // Load voices when available
  const loadVoices = () => {
    voices = synth?.getVoices() || [];
    voiceCache = null;
  };
  
  loadVoices();
  if (synth) {
    synth.onvoiceschanged = loadVoices;
  }
  
  // ResponsiveVoice disabled by default (requires API key)
  // To enable: Get free key from https://responsivevoice.org and update loadResponsiveVoice()
  // For now, using optimized Web Speech API which works great with premium voices
  // loadResponsiveVoice().catch(() => {
  //   console.warn("Using Web Speech API fallback");
  // });
}

// Ensure voices are loaded before speaking
const ensureVoicesLoaded = (): Promise<void> => {
  return new Promise((resolve) => {
    if (responsiveVoiceLoaded && useResponsiveVoice) {
      resolve();
      return;
    }

    if (voices.length > 0) {
      resolve();
      return;
    }
    
    if (synth) {
      voices = synth.getVoices();
      if (voices.length > 0) {
        resolve();
        return;
      }
    }
    
    let attempts = 0;
    const checkVoices = () => {
      if (synth) {
        voices = synth.getVoices();
        if (voices.length > 0) {
          resolve();
          return;
        }
      }
      
      attempts++;
      if (attempts < 20) {
        setTimeout(checkVoices, 100);
      } else {
        resolve();
      }
    };
    
    checkVoices();
  });
};

// Score voices for kid-friendly, human-like quality
const scoreVoice = (voice: SpeechSynthesisVoice): number => {
  let score = 0;
  const name = voice.name.toLowerCase();
  
  // Premium voices
  if (
    name.includes("google") ||
    name.includes("microsoft") ||
    name.includes("amazon") ||
    name.includes("neural") ||
    name.includes("premium") ||
    name.includes("enhanced") ||
    name.includes("wave") ||
    name.includes("wavenet")
  ) {
    score += 100;
  }
  
  // Kid-friendly natural voices
  const kidFriendlyVoices = [
    "samantha", "susan", "karen", "anna", "sarah", "victoria",
    "fiona", "kate", "serena", "tessa", "veena", "hazel",
    "heather", "linda", "aria", "jenny", "zira"
  ];
  
  kidFriendlyVoices.forEach((voiceName) => {
    if (name.includes(voiceName)) {
      score += 60;
    }
  });
  
  // Prefer female voices for kid-friendly tone
  if (
    name.includes("female") ||
    name.includes("woman") ||
    name.includes("girl")
  ) {
    score += 40;
  }
  
  // Prefer US English
  if (voice.lang.startsWith("en-US")) {
    score += 30;
  } else if (voice.lang.startsWith("en")) {
    score += 15;
  }
  
  // Avoid robotic voices
  if (
    name.includes("robotic") ||
    name.includes("system") ||
    name.includes("default")
  ) {
    score -= 100;
  }
  
  return score;
};

// Get best Web Speech API voice
const getKidFriendlyVoice = (): SpeechSynthesisVoice | null => {
  if (voices.length === 0) {
    if (synth) {
      voices = synth.getVoices();
    }
    if (voices.length === 0) return null;
  }
  
  if (voiceCache) {
    return voiceCache;
  }
  
  const englishVoices = voices
    .filter((voice) => voice.lang.startsWith("en"))
    .map((voice) => ({
      voice,
      score: scoreVoice(voice),
    }))
    .sort((a, b) => b.score - a.score);
  
  if (englishVoices.length > 0) {
    voiceCache = englishVoices[0].voice;
    return voiceCache;
  }
  
  if (voices.length > 0) {
    voiceCache = voices[0];
    return voiceCache;
  }
  
  return null;
};

// Add natural pauses and kid-friendly phrasing
const processTextForKids = (text: string): string => {
  return text
    .replace(/,/g, ", ")
    .replace(/\./g, ". ")
    .replace(/!/g, "! ")
    .replace(/\?/g, "? ")
    .replace(/\s+/g, " ")
    .trim();
};

// Speak using ResponsiveVoice (preferred - more human-like)
const speakWithResponsiveVoice = (
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
  }
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!window.responsiveVoice || !window.responsiveVoice.voiceSupport()) {
      // Fallback to Web Speech API if ResponsiveVoice not available
      return speakWithWebSpeech(text, options).then(resolve).catch(reject);
    }

    // Cancel any ongoing speech
    if (window.responsiveVoice.isPlaying()) {
      window.responsiveVoice.cancel();
    }

    // Kid-friendly voice options (ResponsiveVoice has excellent child-friendly voices)
    // These voices are very natural and human-like
    const voiceName = "US English Female"; // Warm, natural, kid-friendly
    
    const processedText = processTextForKids(text);
    
    // ResponsiveVoice parameters (0-2 range, 1 is normal)
    const pitch = options?.pitch ?? 1.15; // Higher for friendliness
    const rate = options?.rate ?? 0.85; // Slower for clarity with kids
    const volume = options?.volume ?? 1.0;

    try {
      window.responsiveVoice.speak(processedText, voiceName, {
        pitch: pitch,
        rate: rate,
        volume: volume,
        onend: () => {
          setTimeout(() => resolve(), 100);
        },
        onerror: () => {
          // Fallback to Web Speech API on error
          speakWithWebSpeech(text, options).then(resolve).catch(reject);
        },
      });
    } catch (error) {
      // Fallback to Web Speech API on error
      speakWithWebSpeech(text, options).then(resolve).catch(reject);
    }
  });
};

// Speak using Web Speech API (fallback)
const speakWithWebSpeech = (
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
  }
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    if (!synth) {
      reject(new Error("Speech synthesis not available"));
      return;
    }
    
    await ensureVoicesLoaded();
    
    if (synth.speaking) {
      setTimeout(() => {
        synth.cancel();
        setTimeout(() => speakWithWebSpeech(text, options).then(resolve).catch(reject), 150);
      }, 50);
      return;
    }
    
    synth.cancel();
    
    const processedText = processTextForKids(text);
    const utterance = new SpeechSynthesisUtterance(processedText);
    const voice = getKidFriendlyVoice();
    
    if (voice) {
      utterance.voice = voice;
    }
    
    // More natural, kid-friendly settings - optimized for human-like sound
    utterance.rate = options?.rate ?? 0.85; // Slower for kids to understand
    utterance.pitch = options?.pitch ?? 1.2; // Higher, more cheerful and friendly
    utterance.volume = options?.volume ?? 1.0;
    
    // Add slight variation for more natural sound
    // The voice selection already prioritizes premium voices
    
    utterance.onend = () => {
      setTimeout(() => resolve(), 50);
    };
    
    utterance.onerror = (error) => {
      console.error("Speech error:", error);
      reject(error);
    };
    
    synth.speak(utterance);
  });
};

// Main speak function - tries ResponsiveVoice first, falls back to Web Speech API
export const speak = (
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    natural?: boolean;
  }
): Promise<void> => {
  // Use ResponsiveVoice if available (much more human-like)
  if (useResponsiveVoice && window.responsiveVoice) {
    return speakWithResponsiveVoice(text, options);
  }
  
  // Fallback to Web Speech API
  return speakWithWebSpeech(text, options);
};

// Kid-friendly speech functions with optimized parameters for human-like, friendly tone
export const speakLetter = async (
  letter: string,
  childName?: string
): Promise<void> => {
  const greeting = childName ? `${childName}, ` : "";
  // Pronounce letter 3 times for better learning
  const letterText = `${greeting}this is the letter ${letter}!, ${letter}!`;
  await speak(letterText, {
    rate: 0.82, // Slower for learning - helps kids understand
    pitch: 1.25, // Higher pitch = more friendly and kid-friendly
  });
};

export const speakWord = async (
  word: string,
  letter: string,
  childName?: string
): Promise<void> => {
  const greeting = childName ? `${childName}, ` : "";
  
  // First say the introduction
  await speak(`${greeting}${word} starts with the letter ${letter}! Let's spell it:`, {
    rate: 0.75,
    pitch: 1.3,
  });
  
  // Spell each letter separately with time gaps between them
  const letters = word.toUpperCase().split('');
  for (let i = 0; i < letters.length; i++) {
    // Add a small delay before each letter (except the first)
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 600)); // 600ms gap between letters
    }
    
    // Say each letter individually
    await speak(letters[i], {
      rate: 0.60, // Very slow for each letter
      pitch: 1.3,
    });
  }
  
  // Wait a bit before saying the full word
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Say the full word 2 times
  await speak(`${word}!`, {
    rate: 0.75,
    pitch: 1.3,
  });
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  await speak(`${word}!`, {
    rate: 0.75,
    pitch: 1.3,
  });
};

export const speakCelebration = async (
  childName?: string
): Promise<void> => {
  const celebrations = [
    "Yay",
    "Wow",
    "Good job",
    "You did it",
    "So good",
    "Nice work",
    "Well done",
    "That's right",
    "You're awesome",
    "Keep going",
    "You're learning",
    "You're smart",
    "That's great",
    "I'm proud of you",
    "You're amazing",
    "Good for you",
  ];
  const randomCelebration =
    celebrations[Math.floor(Math.random() * celebrations.length)];
  const greeting = childName ? `${childName}, ` : "";
  // Very enthusiastic and happy
  await speak(`${greeting}${randomCelebration}! You're doing amazing!`, {
    rate: 0.9, // Energetic but still clear
    pitch: 1.35, // Very enthusiastic and happy - kid-friendly excitement
  });
};

export const speakWelcome = async (childName: string): Promise<void> => {
  // Warm, welcoming, and friendly
  await speak(
    `Hi ${childName}! Welcome to alphabet learning! Let's learn letters together!`,
    {
      rate: 0.85, // Warm and welcoming pace
      pitch: 1.25, // Friendly and inviting - like a teacher
    }
  );
};
