
import { SignSystem, SignEntry, LearningModule, IntentType } from '../types';

/**
 * RÈGLES SYNTAXIQUES LSF (France)
 */
export const LSF_SYNTAX_RULES = [
  "ORDRE : Temps > Lieu > Sujet > Objet > Verbe (très proche de la LSQ).",
  "LE REGARD : Indispensable pour désigner l'action et les personnages.",
  "QUESTIONS : Le signe interrogatif (QUOI, QUI, OÙ) se place presque toujours à la fin de la phrase.",
  "VISAGE : Les expressions faciales portent la fonction d'adverbe (ex: 'manger' + joues gonflées = 'manger beaucoup').",
  "POINTAGE : Utilisation de l'espace pour situer les objets dont on parle."
];

/**
 * Base de connaissance pour l'IA (Patterns visuels LSF)
 */
export const LSF_VISUAL_PATTERNS: Array<{sign: string, pattern: string, intent: IntentType}> = [
  { sign: "Bonjour", pattern: "Main fermée devant la bouche qui s'ouvre vers l'avant (souffle de vie).", intent: "SALUER" },
  { sign: "Merci", pattern: "Main plate partant du menton vers l'avant (geste gracieux).", intent: "REMERCIER" },
  { sign: "S'il vous plaît", pattern: "Main plate frottant le torse verticalement ou jointes.", intent: "DEMANDER_INFO" },
  
  // ALPHABET LSF
  { sign: "A", pattern: "Poing fermé, pouce sur le côté.", intent: "DONNER_INFO" },
  { sign: "B", pattern: "Main plate, doigts serrés, pouce sur la paume.", intent: "DONNER_INFO" },
  { sign: "L", pattern: "Pouce et index forment un angle droit.", intent: "DONNER_INFO" },

  // ÉMOTIONS (Similarité avec LSQ)
  { sign: "Heureux", pattern: "Mains plates frottant le torse vers le haut avec un grand sourire.", intent: "EXPRIMER_SENTIMENT" },
  { sign: "Triste", pattern: "Index descendant de l'œil comme une larme ou mains tombantes sur le visage.", intent: "EXPRIMER_SENTIMENT" },
  { sign: "Colère", pattern: "Main en griffe devant le torse qui remonte avec tension.", intent: "EXPRIMER_SENTIMENT" },

  // QUOTIDIEN ET LIEUX
  { sign: "Maison", pattern: "Mains formant un toit pointu au-dessus de la poitrine.", intent: "LIEUX" },
  { sign: "École", pattern: "Mains plates frottant l'une contre l'autre horizontalement.", intent: "LIEUX" },
  { sign: "Travail", pattern: "Deux mains en 'poings' qui se tapent l'une au-dessus de l'autre alternativement.", intent: "TRAVAIL" },
  { sign: "Toilettes", pattern: "Index et majeur forment un 'V' qui se secoue vers le bas.", intent: "EXPRIMER_BESOIN" },

  // ALIMENTATION
  { sign: "Manger", pattern: "Bout des doigts réunis portés à la bouche (forme de bec).", intent: "ALIMENTATION" },
  { sign: "Boire", pattern: "Main en C mimant de tenir un petit verre et de le vider à la bouche.", intent: "ALIMENTATION" },
  { sign: "Eau", pattern: "Index frottant le côté du menton.", intent: "ALIMENTATION" },
  { sign: "Pain", pattern: "Tranchant de la main mimant de couper des tranches sur l'avant-bras opposé.", intent: "ALIMENTATION" },

  // URGENCE ET BASES
  { sign: "Aide", pattern: "Poing sur main plate qui remonte ensemble.", intent: "URGENCE" },
  { sign: "Oui", pattern: "Poing fermé qui s'incline (comme un hochement de tête).", intent: "CONFIRMER_INFIRMER" },
  { sign: "Non", pattern: "Index et majeur qui pincent le pouce.", intent: "CONFIRMER_INFIRMER" },
  { sign: "Moi", pattern: "Pointer son propre torse.", intent: "DONNER_INFO" },
  { sign: "Toi", pattern: "Pointer la personne en face.", intent: "DONNER_INFO" }
];

export const LSF_DICTIONARY: SignEntry[] = [
  { id: 'lsf-1', name: 'Bonjour', category: 'Salutations', system: SignSystem.LSF, instruction: 'Main au menton vers l\'avant.' },
  { id: 'lsf-2', name: 'Merci', category: 'Salutations', system: SignSystem.LSF, instruction: 'Main du menton vers l\'avant.' },
  { id: 'lsf-3', name: 'Maison', category: 'Lieux', system: SignSystem.LSF, instruction: 'Former un toit avec les mains.' },
  { id: 'lsf-4', name: 'Manger', category: 'Alimentation', system: SignSystem.LSF, instruction: 'Bec de canard à la bouche.' },
  { id: 'lsf-5', name: 'Aide', category: 'Urgences', system: SignSystem.LSF, instruction: 'Poing sur paume montant.' },
  { id: 'lsf-6', name: 'École', category: 'Lieux', system: SignSystem.LSF, instruction: 'Mains frottant horizontalement.' }
];

export const LSF_LEARNING_MODULES: LearningModule[] = [
  { 
    title: "Alphabet et Dactylologie", 
    category: 'ALPHABET',
    source: "IVT (International Visual Theatre)", 
    id: "tBWqxO2xfjc",
    status: "Recommandé", 
    date: "Fondations",
    learned: ["Formes A-Z", "Fluidité"],
    system: SignSystem.LSF
  },
  { 
    title: "Les Bases du Dialogue", 
    category: 'CONVERSATION',
    source: "Signes de France", 
    id: "lsf-conv-1",
    status: "En cours", 
    date: "Indispensable",
    learned: ["Salutations", "Se présenter"],
    system: SignSystem.LSF
  },
  { 
    title: "Vie Quotidienne", 
    category: 'QUOTIDIEN',
    source: "Acad'Sign", 
    id: "lsf-vie-1",
    status: "Recommandé", 
    date: "Utile",
    learned: ["Maison", "Travail", "Heure"],
    system: SignSystem.LSF
  }
];
