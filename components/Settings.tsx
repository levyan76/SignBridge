
import React from 'react';
import { Language, SignSystem } from '../types';

interface SettingsProps {
  language: Language;
  signSystem: SignSystem;
  onLanguageChange: (lang: Language) => void;
  onSignSystemChange: (system: SignSystem) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  language, 
  signSystem, 
  onLanguageChange, 
  onSignSystemChange 
}) => {
  return (
    <div className="glass p-6 rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
        {/* Language Selection */}
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Sortie Vocale / Texte</span>
          <div className="flex flex-wrap gap-2 bg-slate-100 p-1 rounded-2xl">
            {[
              { id: Language.FR_CA, label: '🇫🇷 FR-CA' },
              { id: Language.FR_FR, label: '🇫🇷 FR-FR' },
              { id: Language.EN_CA, label: '🇨🇦 EN-CA' }
            ].map(lang => (
              <button
                key={lang.id}
                onClick={() => onLanguageChange(lang.id)}
                className={`flex-1 px-4 py-2.5 rounded-xl text-[11px] font-black transition-all ${
                  language === lang.id ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:bg-slate-200'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sign System Selection */}
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Système de signes (Détection)</span>
          <div className="flex flex-wrap gap-2 bg-slate-100 p-1 rounded-2xl">
            {[
              { id: SignSystem.LSQ, label: 'LSQ (Québec)', color: 'bg-blue-600' },
              { id: SignSystem.LSF, label: 'LSF (France)', color: 'bg-indigo-600' },
              { id: SignSystem.ASL, label: 'ASL (USA/CA)', color: 'bg-slate-700' }
            ].map(system => (
              <button
                key={system.id}
                onClick={() => onSignSystemChange(system.id)}
                className={`flex-1 px-5 py-2.5 rounded-xl text-[11px] font-black transition-all ${
                  signSystem === system.id 
                    ? `${system.color} text-white shadow-lg` 
                    : 'text-slate-500 hover:bg-slate-200'
                }`}
              >
                {system.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Fix: Changed logical AND to logical OR because signSystem cannot be both LSQ and LSF at the same time */}
      {(signSystem === SignSystem.LSQ || signSystem === SignSystem.LSF) && (
        <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex items-center gap-3">
          <i className="fas fa-exclamation-circle text-amber-500"></i>
          <p className="text-[10px] font-bold text-amber-700 uppercase leading-tight">
            Distinction stricte active : L'IA ignore les faux-amis entre LSQ et LSF.
          </p>
        </div>
      )}
    </div>
  );
};

export default Settings;
