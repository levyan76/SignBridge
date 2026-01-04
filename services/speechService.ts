
import { Language } from "../types";

export interface SpeechCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
}

class SpeechService {
  private synthesis: SpeechSynthesis;
  private isMuted: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private checkInterval: number | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.cancel();
    }
  }

  speak(text: string, language: Language, callbacks?: SpeechCallbacks) {
    if (this.isMuted || !text) {
      callbacks?.onEnd?.();
      return;
    }

    // Cancel any ongoing speech
    this.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;
    
    // Set language and voice
    utterance.lang = language === Language.FR_CA ? 'fr-CA' : 'en-CA';
    const voices = this.synthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith(utterance.lang) && (v.name.includes('Google') || v.localService));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.1; // Slightly higher pitch for more clarity

    // Standard event handlers
    utterance.onstart = () => {
      callbacks?.onStart?.();
      this.startSafetyCheck(callbacks);
    };

    const handleEnd = () => {
      if (this.currentUtterance === utterance) {
        this.stopSafetyCheck();
        callbacks?.onEnd?.();
        this.currentUtterance = null;
      }
    };

    utterance.onend = handleEnd;
    utterance.onerror = handleEnd;

    this.synthesis.speak(utterance);
  }

  // Fallback check to ensure state sync
  private startSafetyCheck(callbacks?: SpeechCallbacks) {
    this.stopSafetyCheck();
    this.checkInterval = window.setInterval(() => {
      if (!this.synthesis.speaking && this.currentUtterance) {
        this.stopSafetyCheck();
        callbacks?.onEnd?.();
        this.currentUtterance = null;
      }
    }, 50);
  }

  private stopSafetyCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  cancel() {
    this.stopSafetyCheck();
    this.synthesis.cancel();
    this.currentUtterance = null;
  }
}

export const speechService = new SpeechService();
