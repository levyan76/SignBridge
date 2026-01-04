
import React, { useState, useCallback, useEffect, useRef } from 'react';
import CameraView from './components/CameraView';
import AvatarView from './components/AvatarView';
import Settings from './components/Settings';
import VoiceInput from './components/VoiceInput';
import Notification, { NotificationType } from './components/Notification';
import SignSearch from './components/SignSearch';
import LearningHub from './components/LearningHub';
import { Language, SignSystem, Message, InterpretationResult, IntentType } from './types';
import { translateSignLanguage, getAvatarResponse } from './services/geminiService';
import { speechService } from './services/speechService';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(Language.FR_CA);
  const [signSystem, setSignSystem] = useState<SignSystem>(SignSystem.LSQ);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [lastAiResponse, setLastAiResponse] = useState<{ text: string; signInstruction: string } | null>(null);
  const [activeGloss, setActiveGloss] = useState<string[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showLearning, setShowLearning] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);
  
  const logoPressTimer = useRef<number | null>(null);

  const showNotification = (message: string, type: NotificationType = 'info') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    const saved = localStorage.getItem('signbridge_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
        setMessages(parsed);
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('signbridge_history', JSON.stringify(messages));
  }, [messages]);

  const processInterpretation = useCallback(async (result: InterpretationResult, sender: 'user' | 'interlocutor' = 'user') => {
    setIsProcessing(true);
    try {
      if (sender === 'user') {
        setActiveGloss(result.gloss);
        const userMsg: Message = {
          id: Date.now().toString(),
          sender: 'user', 
          text: result.translation,
          gloss: result.gloss,
          intent: result.intent,
          slots: result.slots,
          timestamp: new Date()
        };
        setMessages(prev => [userMsg, ...prev]);

        speechService.speak(result.translation, language, {
          onStart: () => setIsSpeaking(true),
          onEnd: () => setIsSpeaking(false)
        });
      } else {
        const response = await getAvatarResponse(result.translation, language, signSystem);
        setLastAiResponse(response);
        
        const aiMsg: Message = {
          id: Date.now().toString(),
          sender: 'interlocutor',
          text: result.translation,
          signDescription: response.signInstruction,
          timestamp: new Date()
        };
        setMessages(prev => [aiMsg, ...prev]);
      }
    } catch (error) {
      showNotification("Erreur d'interprétation linguistique.", "error");
    } finally {
      setIsProcessing(false);
    }
  }, [language, signSystem]);

  const handleFrameCapture = useCallback(async (base64: string) => {
    setIsProcessing(true);
    try {
      const result = await translateSignLanguage(base64, language, signSystem, messages);
      if (result.translation && result.translation !== '...') {
        await processInterpretation(result, 'user');
      }
    } catch (error) {
      showNotification("L'IA n'a pas pu décoder la structure du signe.", "error");
    } finally {
      setIsProcessing(false);
    }
  }, [processInterpretation, language, signSystem, messages]);

  const handleLogoTouchStart = () => {
    logoPressTimer.current = window.setTimeout(() => {
      setShowLearning(true);
      showNotification("Accès au référentiel LSQ activé", "info");
    }, 2000);
  };

  const handleLogoTouchEnd = () => {
    if (logoPressTimer.current) {
      clearTimeout(logoPressTimer.current);
    }
  };

  const getIntentColor = (intent?: IntentType) => {
    if (!intent) return 'bg-slate-500';
    const red = ['URGENCE', 'STOP', 'SANTE'];
    const amber = ['ATTIRER_ATTENTION', 'EXPRIMER_BESOIN', 'PRIX_QUANTITE'];
    const green = ['SALUER', 'REMERCIER', 'SOUHAIT_POSITIF'];
    const indigo = ['CONFIRMER_INFIRMER', 'COMPRENDRE', 'SE_PRESENTAER'];
    
    if (red.includes(intent)) return 'bg-red-600';
    if (amber.includes(intent)) return 'bg-amber-500';
    if (green.includes(intent)) return 'bg-emerald-500';
    if (indigo.includes(intent)) return 'bg-indigo-600';
    return 'bg-blue-600';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      
      <SignSearch isOpen={showSearch} onClose={() => setShowSearch(false)} language={language} signSystem={signSystem} onSelectSign={(s) => {
        setLastAiResponse({ text: s.name, signInstruction: s.instruction });
        setShowSearch(false);
      }} />

      <LearningHub isOpen={showLearning} onClose={() => setShowLearning(false)} signSystem={signSystem} />

      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div 
          className="flex items-center gap-3 cursor-help"
          onMouseDown={handleLogoTouchStart}
          onMouseUp={handleLogoTouchEnd}
          onTouchStart={handleLogoTouchStart}
          onTouchEnd={handleLogoTouchEnd}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg transition-transform active:scale-90">
            <i className="fas fa-hands-helping text-white"></i>
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight select-none">SignBridge</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsCameraOff(!isCameraOff)} 
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isCameraOff ? 'bg-red-50 text-red-600 ring-2 ring-red-100' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
          >
            <i className={`fas ${isCameraOff ? 'fa-video-slash' : 'fa-video'}`}></i>
          </button>
          <button onClick={() => setShowSearch(true)} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs uppercase tracking-widest border border-blue-100 transition-colors hover:bg-blue-100">
            Lexique
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Analyse Linguistique (Vue Entendant)</h2>
          <CameraView 
            onFrameCapture={handleFrameCapture} 
            isProcessing={isProcessing} 
            activeGloss={activeGloss} 
            isCameraOff={isCameraOff} 
          />
          <Settings language={language} signSystem={signSystem} onLanguageChange={setLanguage} onSignSystemChange={setSignSystem} />
          <div className="bg-white rounded-[2.5rem] border p-6 flex-1 flex flex-col overflow-hidden max-h-[350px] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Interprétation Contextuelle</h3>
              {messages.length > 0 && (
                <button onClick={() => setShowClearConfirm(true)} className="text-red-400 hover:text-red-600 text-xs font-bold uppercase">Reset</button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 px-2 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 py-10">
                  <i className="fas fa-language text-4xl mb-4"></i>
                  <p className="font-black text-[10px] uppercase tracking-widest text-center">IA sémantique prête</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1 px-2">
                       {msg.intent && (
                         <span className={`text-[8px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-widest ${getIntentColor(msg.intent)}`}>
                           {msg.intent}
                         </span>
                       )}
                       <span className="text-[8px] font-bold text-slate-300">{msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className={`max-w-[90%] rounded-[1.5rem] px-5 py-3 shadow-sm border ${
                      msg.sender === 'user' ? 'bg-white text-slate-800 border-blue-100 rounded-tr-none' : 'bg-indigo-600 text-white border-indigo-500 rounded-tl-none'
                    }`}>
                      {msg.gloss && msg.gloss.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2 border-b pb-2 border-slate-100">
                          {msg.gloss.map((g, idx) => (
                            <span key={idx} className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-black uppercase">{g}</span>
                          ))}
                        </div>
                      )}
                      <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Avatar Virtuel Sourd (Vue Sourd)</h2>
          <AvatarView 
            message={lastAiResponse?.text || ''} 
            signInstruction={lastAiResponse?.signInstruction} 
            isThinking={isProcessing} 
            isSpeaking={isSpeaking} 
          />
          <div className="bg-white border p-6 rounded-[2.5rem] shadow-sm border-blue-50 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Traduction Vocale -> Signes</h3>
              <i className="fas fa-microphone-alt text-blue-400"></i>
            </div>
            <VoiceInput 
              onTranscription={(text) => processInterpretation({ gloss: ["VOCAL"], translation: text, intent: 'DONNER_INFO', confidence: 1, slots: {} }, 'interlocutor')} 
              isProcessing={isProcessing} 
              language={language} 
            />
          </div>
        </div>
      </main>

      {showClearConfirm && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-black text-center mb-6">Réinitialiser ?</h3>
            <div className="flex flex-col gap-3">
              <button onClick={() => { setMessages([]); setLastAiResponse(null); setShowClearConfirm(false); localStorage.removeItem('signbridge_history'); }} className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl">Effacer la session</button>
              <button onClick={() => setShowClearConfirm(false)} className="w-full bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl">Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
