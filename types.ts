
export enum Language {
  FR_CA = 'FR-CA',
  EN_CA = 'EN-CA',
  FR_FR = 'FR-FR'
}

export enum SignSystem {
  LSQ = 'LSQ', // Langue des signes québécoise
  ASL = 'ASL', // American Sign Language
  LSF = 'LSF'  // Langue des signes française
}

export type ModuleCategory = 'ALPHABET' | 'GRAMMAIRE' | 'STRUCTURE' | 'CONVERSATION' | 'QUOTIDIEN' | 'EMOTIONS' | 'TEMPS' | 'TRAVAIL' | 'SANTE' | 'METEO' | 'LIEUX' | 'SPORTS_LOISIRS' | 'ALIMENTATION' | 'ANIMAUX' | 'TRANSPORTS' | 'VETEMENTS' | 'MAISON' | 'COULEURS' | 'CHIFFRES';

export type IntentType = 
  | 'SALUER' 
  | 'SE_PRESENTAER' 
  | 'ATTIRER_ATTENTION' 
  | 'COMPRENDRE' 
  | 'CONFIRMER_INFIRMER'
  | 'QUESTION_GENERALE' 
  | 'DEMANDER_INFO' 
  | 'DONNER_INFO' 
  | 'DEMANDER_CLARIFICATION'
  | 'REMERCIER' 
  | 'S_EXCUSER' 
  | 'SOUHAIT_POSITIF' 
  | 'EXPRIMER_SENTIMENT' 
  | 'EXPRIMER_BESOIN'
  | 'DEMANDER_DIRECTION' 
  | 'TEMPS_MOMENT' 
  | 'PRIX_QUANTITE' 
  | 'SANTE' 
  | 'URGENCE' 
  | 'STOP'
  | 'METEO'
  | 'LIEUX'
  | 'SPORTS_LOISIRS'
  | 'ALIMENTATION'
  | 'ANIMAUX'
  | 'TRANSPORTS'
  | 'VETEMENTS'
  | 'MAISON'
  | 'COULEURS'
  | 'CHIFFRES'
  // Added TRAVAIL to fix compilation errors in data/lsqData.ts
  | 'TRAVAIL'
  | 'UNKNOWN';

export interface Message {
  id: string;
  sender: 'user' | 'ai' | 'interlocutor';
  text: string;
  gloss?: string[]; 
  intent?: IntentType;
  slots?: Record<string, string>;
  signDescription?: string;
  timestamp: Date;
}

export interface InterpretationResult {
  gloss: string[];
  translation: string;
  intent: IntentType;
  slots: Record<string, string>;
  confidence: number;
}

export interface SignEntry {
  id: string;
  name: string;
  category: string;
  instruction: string;
  system: SignSystem;
}

export interface LearningModule {
  title: string;
  category: ModuleCategory;
  source: string;
  id: string;
  status: 'Appris' | 'En cours' | 'Recommandé';
  date: string;
  learned: string[];
  system?: SignSystem;
}
