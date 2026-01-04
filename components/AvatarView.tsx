
import React, { useState, useEffect } from 'react';
import { speechService } from '../services/speechService';

interface AvatarViewProps {
  message: string;
  signInstruction?: string;
  isThinking: boolean;
  isSpeaking: boolean;
}

const AvatarView: React.FC<AvatarViewProps> = ({ message, signInstruction, isThinking, isSpeaking }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (message) {
      setShowDetails(false);
    }
  }, [message]);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    speechService.setMuted(newMuted);
  };

  return (
    <div className="flex flex-col items-center justify-start bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 rounded-[3rem] p-8 shadow-2xl h-full min-h-[500px] text-white overflow-hidden relative border border-white/5">
      {/* Dynamic Aura Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-1/2 bg-blue-500 blur-[150px] rounded-full transition-all duration-1000 ${message ? 'scale-150 opacity-100' : 'scale-100 opacity-20'}`}></div>
      </div>

      {/* Top Bar Actions */}
      <div className="w-full flex justify-between items-center mb-10 z-20">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
           <div className={`w-2 h-2 rounded-full ${isThinking ? 'bg-amber-400 animate-pulse' : 'bg-green-500'}`}></div>
           <span className="text-[10px] font-black uppercase tracking-widest text-white/70">
             Interprète Connecté
           </span>
        </div>
        <button 
          onClick={toggleMute}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border border-white/20 active:scale-90 shadow-xl backdrop-blur-md ${isMuted ? 'bg-red-500/20 text-red-300' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'} text-lg`}></i>
        </button>
      </div>

      <div className="relative mb-14 z-10">
        {/* Pulsating Surround Glow - Activated when signing back to the deaf person */}
        {message && (
          <div className="absolute inset-[-30px] rounded-full bg-blue-400/20 blur-3xl animate-[pulse-ring_2s_ease-in-out_infinite] pointer-events-none"></div>
        )}
        
        {/* Avatar Core */}
        <div className={`relative w-44 h-44 md:w-56 md:h-56 rounded-full bg-slate-800 flex items-center justify-center border-[10px] border-white/5 backdrop-blur-2xl transition-all duration-700 shadow-2xl z-10 ${message ? 'ring-[24px] ring-blue-500/10 border-blue-400/40' : ''}`}>
          
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <img 
              src="https://picsum.photos/seed/sign-interpreter-ai/800/800" 
              alt="AI Interpreter" 
              className={`w-full h-full object-cover transition-all duration-1000 ${message ? 'scale-110' : 'brightness-75 grayscale-[0.2]'}`}
            />
          </div>

          {/* Status Rings */}
          {isThinking && (
            <div className="absolute inset-0 border-4 border-indigo-400/40 rounded-full animate-[spin_4s_linear_infinite]"></div>
          )}
          
          {/* Audio Visualization Overlay (When the interlocutor is speaking) */}
          {isSpeaking && (
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-end justify-center gap-2 h-12 w-full px-8">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i} 
                  className="w-1.5 bg-blue-400 rounded-full animate-[voiceBar_0.6s_ease-in-out_infinite]"
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-lg z-10 space-y-6 flex-1 flex flex-col justify-end pb-4">
        {message ? (
          <>
            {/* Primary Response Card */}
            <div className="bg-white/10 p-7 rounded-[2.5rem] backdrop-blur-3xl border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
              <div className="flex justify-between items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[8px] font-black bg-blue-500 px-2 py-0.5 rounded uppercase">Interprétation en cours</span>
                  </div>
                  <p className="text-xl md:text-2xl font-bold leading-tight text-white/95">
                    {message}
                  </p>
                </div>
                {signInstruction && (
                  <button 
                    onClick={() => setShowDetails(!showDetails)}
                    className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-95 ${showDetails ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
                  >
                    <i className={`fas ${showDetails ? 'fa-info-circle' : 'fa-sign-language'} text-xl`}></i>
                  </button>
                )}
              </div>
            </div>

            {/* Instruction Detail Overlay */}
            {signInstruction && showDetails && (
              <div className="bg-blue-600/20 p-6 rounded-[2.5rem] backdrop-blur-3xl border border-blue-400/30 shadow-2xl animate-in slide-in-from-bottom-6 fade-in duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <i className="fas fa-hand-sparkles text-blue-300 text-lg"></i>
                  <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-200">Description des signes</h4>
                </div>
                <p className="text-sm font-medium text-blue-50/90 leading-relaxed italic border-l-2 border-blue-400/40 pl-4">
                  {signInstruction}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-12 opacity-30">
            <div className="w-12 h-12 rounded-2xl border-2 border-white/20 animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-center px-8">Prêt à interpréter la voix de votre interlocuteur</p>
          </div>
        )}
      </div>

      {/* Footer Connectivity Bar */}
      <div className="w-full pt-6 flex justify-center gap-8 opacity-40 text-[10px] font-black uppercase tracking-widest z-10 border-t border-white/5 mt-4">
        <div className="flex items-center gap-2">
          <i className="fas fa-link"></i>
          PONT TEMPS RÉEL
        </div>
        <div className="flex items-center gap-2">
          <i className="fas fa-shield-alt"></i>
          DÉCRYPTAGE IA
        </div>
      </div>
    </div>
  );
};

export default AvatarView;
