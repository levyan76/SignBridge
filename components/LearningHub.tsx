
import React, { useState } from 'react';
import { SignSystem, ModuleCategory, LearningModule } from '../types';
import { LSQ_LEARNING_MODULES, LSQ_SYNTAX_RULES } from '../data/lsqData';
import { ASL_LEARNING_MODULES } from '../data/aslData';
import { LSF_LEARNING_MODULES } from '../data/lsfData';

const ALL_MODULES: LearningModule[] = [
  ...LSQ_LEARNING_MODULES,
  ...ASL_LEARNING_MODULES,
  ...LSF_LEARNING_MODULES
];

interface LearningHubProps {
  isOpen: boolean;
  onClose: () => void;
  signSystem: SignSystem;
}

const LearningHub: React.FC<LearningHubProps> = ({ isOpen, onClose, signSystem }) => {
  const [activeTab, setActiveTab] = useState<ModuleCategory | 'TOUS' | 'SYNTAXE'>('TOUS');

  const filteredBySystem = ALL_MODULES.filter(m => m.system === signSystem);

  const finalModules = activeTab === 'TOUS' 
    ? filteredBySystem 
    : activeTab === 'SYNTAXE' ? [] : filteredBySystem.filter(m => m.category === activeTab);

  const categories: { id: ModuleCategory | 'TOUS' | 'SYNTAXE', label: string, icon: string }[] = [
    { id: 'TOUS', label: 'Tous', icon: 'fa-th-large' },
    { id: 'SYNTAXE', label: 'Grammaire', icon: 'fa-project-diagram' },
    { id: 'ALPHABET', label: 'Alphabet', icon: 'fa-font' },
    { id: 'EMOTIONS', label: 'Sentiments', icon: 'fa-grin-beam' },
    { id: 'ALIMENTATION', label: 'Manger', icon: 'fa-utensils' },
    { id: 'LIEUX', label: 'Lieux', icon: 'fa-map-marker-alt' },
    { id: 'QUOTIDIEN', label: 'Vie', icon: 'fa-home' },
  ];

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] w-full max-w-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        <div className={`px-10 py-8 text-white relative bg-gradient-to-br ${
          signSystem === SignSystem.LSQ ? 'from-blue-600 via-blue-700 to-blue-800' : 'from-indigo-600 to-indigo-800'
        }`}>
          <div className="flex items-center gap-5 mb-6">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <i className="fas fa-graduation-cap text-2xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-black">Apprendre la {signSystem}</h2>
              <p className="text-xs font-bold text-blue-100 uppercase tracking-widest opacity-80">Ressources & Lexique</p>
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === cat.id ? 'bg-white text-blue-700 shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <i className={`fas ${cat.icon}`}></i>
                {cat.label}
              </button>
            ))}
          </div>

          <button onClick={onClose} className="absolute top-8 right-8 text-white/60 hover:text-white">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-6 bg-slate-50">
          {signSystem === SignSystem.LSQ && (
            <div className="mb-8 p-6 bg-blue-50 border-2 border-blue-100 rounded-3xl">
              <div className="flex items-center gap-3 mb-2 text-blue-700">
                <i className="fas fa-info-circle"></i>
                <h4 className="font-black text-xs uppercase tracking-widest">Note sur les ressources LSQ</h4>
              </div>
              <p className="text-xs text-slate-600 font-bold leading-relaxed">
                Les ressources vidéo LSQ sont précieuses. Pour compenser leur rareté, notre IA intègre des descriptions textuelles détaillées issues des répertoires du SIVET et de la Fondation des Sourds du Québec.
              </p>
            </div>
          )}

          {activeTab === 'SYNTAXE' && signSystem === SignSystem.LSQ && (
            <div className="space-y-4">
              <h3 className="text-xl font-black text-slate-800 mb-6">La Structure de la Phrase</h3>
              {LSQ_SYNTAX_RULES.map((rule, i) => (
                <div key={i} className="flex gap-4 p-5 bg-white rounded-2xl border-2 border-blue-50 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black flex-shrink-0">{i+1}</div>
                  <p className="text-sm font-bold text-slate-600 leading-relaxed">{rule}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab !== 'SYNTAXE' && finalModules.length > 0 ? (
            finalModules.map((m, idx) => (
              <div key={idx} className="p-6 rounded-[2.5rem] bg-white border-2 border-slate-100 shadow-sm group hover:border-blue-200 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-800">{m.title}</h3>
                    <p className="text-[10px] text-blue-500 font-bold uppercase">{m.source}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                    m.id.startsWith('external') ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {m.id.startsWith('external') ? 'Ressource' : 'Vidéo'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {m.learned.map((l, i) => (
                    <span key={i} className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-600">
                      {l}
                    </span>
                  ))}
                </div>
                {m.id.startsWith('external') && (
                  <button className="mt-4 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                    Ouvrir le lien externe
                  </button>
                )}
              </div>
            ))
          ) : (
             activeTab !== 'SYNTAXE' && (
              <div className="py-20 text-center opacity-30">
                <i className="fas fa-layer-group text-4xl mb-4"></i>
                <p className="font-black text-xs uppercase tracking-widest">Base de données en expansion</p>
              </div>
             )
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningHub;
