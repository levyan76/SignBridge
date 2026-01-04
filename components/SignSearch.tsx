
import React, { useState, useMemo } from 'react';
import { Language, SignSystem, SignEntry } from '../types';
import { LSQ_DICTIONARY } from '../data/lsqData';
import { ASL_DICTIONARY } from '../data/aslData';
import { LSF_DICTIONARY } from '../data/lsfData';

const FULL_SIGN_DATABASE: SignEntry[] = [
  ...LSQ_DICTIONARY,
  ...ASL_DICTIONARY,
  ...LSF_DICTIONARY
];

interface SignSearchProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  signSystem: SignSystem;
  onSelectSign: (sign: SignEntry) => void;
}

const SignSearch: React.FC<SignSearchProps> = ({ isOpen, onClose, language, signSystem, onSelectSign }) => {
  const [query, setQuery] = useState('');

  const filteredSigns = useMemo(() => {
    return FULL_SIGN_DATABASE.filter(sign => 
      sign.system === signSystem && 
      (sign.name.toLowerCase().includes(query.toLowerCase()) || 
       sign.category.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query, signSystem]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 bg-slate-50 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <i className="fas fa-search text-white text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800">Dictionnaire</h2>
              <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">{signSystem}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-gray-200 flex items-center justify-center transition-colors">
            <i className="fas fa-times text-lg text-slate-400"></i>
          </button>
        </div>

        <div className="px-8 py-4">
          <input 
            type="text" 
            placeholder="Rechercher dans le lexique..."
            className="w-full bg-gray-100 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-8 max-h-[60vh] custom-scrollbar">
          {filteredSigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSigns.map(sign => (
                <button
                  key={sign.id}
                  onClick={() => onSelectSign(sign)}
                  className="group flex flex-col p-4 bg-slate-50 border border-gray-100 rounded-2xl hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                >
                  <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full uppercase mb-2 inline-block w-fit">
                    {sign.category}
                  </span>
                  <h4 className="text-lg font-extrabold text-slate-800 mb-1">{sign.name}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{sign.instruction}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-gray-400">
              <i className="fas fa-folder-open text-5xl mb-4 opacity-20"></i>
              <p className="font-bold uppercase tracking-widest text-sm">Aucun résultat pour {signSystem}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignSearch;
