
import React, { useState, useEffect, useCallback } from 'react';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
  isProcessing: boolean;
  language: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscription, isProcessing, language }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = language === 'FR-CA' ? 'fr-CA' : 'en-CA';

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscription(transcript);
        }
        setIsListening(false);
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, [language, onTranscription]);

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
      setIsListening(true);
    }
  };

  if (!recognition) {
    return <div className="text-xs text-red-500 font-bold">STT non supporté sur ce navigateur</div>;
  }

  return (
    <button
      onClick={toggleListening}
      disabled={isProcessing}
      className={`relative flex items-center gap-3 px-6 py-3 rounded-full font-bold text-white shadow-lg transition-all active:scale-95 ${
        isListening 
          ? 'bg-red-500 animate-pulse' 
          : 'bg-indigo-600 hover:bg-indigo-700'
      } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <i className={`fas ${isListening ? 'fa-microphone' : 'fa-microphone-slash'}`}></i>
      <span>{isListening ? 'Écoute...' : 'Parler (Micro)'}</span>
      {isListening && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
    </button>
  );
};

export default VoiceInput;
