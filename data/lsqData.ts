
import { SignSystem, SignEntry, LearningModule, IntentType } from '../types';

/**
 * RÈGLES SYNTAXIQUES LSQ
 */
export const LSQ_SYNTAX_RULES = [
  "STRUCTURE DE BASE : Temps > Lieu > Sujet > Objet > Verbe (ex: DEMAIN ÉCOLE MOI ALLER).",
  "TOPISATION : On place le sujet principal au début (le Topique), puis on donne l'information (le Commentaire).",
  "QUESTIONS : Les sourcils sont relevés pour les questions fermées (Oui/Non) et froncés pour les questions ouvertes (Qui, Quoi, Où).",
  "NÉGATION : La négation se place généralement à la fin de la phrase.",
  "PRONOMS : Le pointage (index) sert de pronom. Pointer vers soi = MOI, vers l'autre = TOI.",
  "VERBES : Beaucoup de verbes ne se conjuguent pas mais changent de direction (ex: DONNER de moi vers toi)."
];

/**
 * Base de connaissance pour l'IA (Patterns visuels LSQ)
 */
export const LSQ_VISUAL_PATTERNS: Array<{sign: string, pattern: string, intent: IntentType}> = [
  { sign: "Bonjour", pattern: "Main plate, bout des doigts vers le front, éloignement.", intent: "SALUER" },
  { sign: "Merci", pattern: "Main du menton vers l'avant.", intent: "REMERCIER" },
  { sign: "S'il vous plaît", pattern: "Main plate frottant circulairement le torse.", intent: "DEMANDER_INFO" },
  
  // ALPHABET LSQ
  { sign: "A", pattern: "Poing fermé, pouce sur le côté de l'index.", intent: "DONNER_INFO" },
  { sign: "B", pattern: "Main ouverte, doigts serrés vers le haut, pouce replié sur la paume.", intent: "DONNER_INFO" },
  { sign: "C", pattern: "Main en forme de griffe arquée mimant la lettre C.", intent: "DONNER_INFO" },
  
  // ÉMOTIONS (Vidéo R7qMNfgPczE)
  { sign: "Heureux / Content", pattern: "Mains plates sur la poitrine, mouvement circulaire ascendant avec sourire.", intent: "EXPRIMER_SENTIMENT" },
  { sign: "Triste", pattern: "Mains plates, doigts vers le bas, descendant le long du visage.", intent: "EXPRIMER_SENTIMENT" },
  { sign: "Peur", pattern: "Mains ouvertes devant la poitrine, paumes vers soi, petit tremblement.", intent: "EXPRIMER_SENTIMENT" },

  // ALIMENTATION (Nouveau)
  { sign: "Manger", pattern: "Bout des doigts réunis (bec de canard) tapotant la bouche.", intent: "ALIMENTATION" },
  { sign: "Boire", pattern: "Main en forme de C portée à la bouche.", intent: "ALIMENTATION" },
  { sign: "Pomme", pattern: "Poing fermé, l'index plié (phalange) frotte la joue dans un mouvement de rotation.", intent: "ALIMENTATION" },
  { sign: "Lait", pattern: "Main mimant la traite (ouvrir/fermer le poing à hauteur de poitrine).", intent: "ALIMENTATION" },
  { sign: "Pain", pattern: "Main non-dominante plate, main dominante mimes de trancher le bord de la main.", intent: "ALIMENTATION" },

  // LIEUX ET QUOTIDIEN
  { sign: "Maison", pattern: "Deux mains plates formant un toit (V inversé).", intent: "LIEUX" },
  { sign: "École", pattern: "Mains plates tapant l'une contre l'autre deux fois (applaudissement discret).", intent: "LIEUX" },
  { sign: "Travail", pattern: "Deux poings fermés tapotant l'un contre l'autre.", intent: "TRAVAIL" },
  { sign: "Toilettes", pattern: "Main en configuration 'T' (pouce entre index et majeur) secouée légèrement.", intent: "EXPRIMER_BESOIN" },

  // URGENCE ET SANTÉ
  { sign: "Aide", pattern: "Main dominante en poing sur la paume de la main non-dominante, le tout remontant.", intent: "URGENCE" },
  { sign: "Hôpital", pattern: "Index et majeur dessinent une croix sur le haut du bras opposé.", intent: "SANTE" },
  { sign: "Mal", pattern: "Index pointés face à face tournant l'un autour de l'autre près de la zone douloureuse.", intent: "SANTE" },
  
  // MÉTÉO
  { sign: "Soleil", pattern: "Main en 'C' au-dessus de la tête s'ouvrant en '5'.", intent: "METEO" },
  { sign: "Pluie", pattern: "Mains qui descendent en tapotant l'air.", intent: "METEO" },

  // PRONOMS ET BASES
  { sign: "Moi", pattern: "Pointer son torse.", intent: "DONNER_INFO" },
  { sign: "Toi", pattern: "Pointer l'autre.", intent: "DONNER_INFO" },
  { sign: "Oui", pattern: "Poing fermé qui s'incline d'avant en arrière (mouvement de tête).", intent: "CONFIRMER_INFIRMER" },
  { sign: "Non", pattern: "Index et majeur qui claquent contre le pouce.", intent: "CONFIRMER_INFIRMER" }
];

export const LSQ_DICTIONARY: SignEntry[] = [
  { id: 'lsq-1', name: 'Bonjour', category: 'Salutations', system: SignSystem.LSQ, instruction: 'Main au front.' },
  { id: 'lsq-2', name: 'Merci', category: 'Salutations', system: SignSystem.LSQ, instruction: 'Main du menton vers l\'avant.' },
  { id: 'lsq-3', name: 'S\'il vous plaît', category: 'Salutations', system: SignSystem.LSQ, instruction: 'Frotter le torse.' },
  { id: 'lsq-pomme', name: 'Pomme', category: 'Alimentation', system: SignSystem.LSQ, instruction: 'Frotter la joue avec l\'index plié.' },
  { id: 'lsq-maison', name: 'Maison', category: 'Lieux', system: SignSystem.LSQ, instruction: 'Former un toit avec les mains.' },
  { id: 'lsq-ecole', name: 'École', category: 'Lieux', system: SignSystem.LSQ, instruction: 'Taper des mains deux fois.' },
  { id: 'lsq-aide', name: 'Aide', category: 'Urgences', system: SignSystem.LSQ, instruction: 'Poing sur paume qui monte.' },
  { id: 'lsq-toilettes', name: 'Toilettes', category: 'Besoins', system: SignSystem.LSQ, instruction: 'Secouer le signe T.' },
  { id: 'lsq-v-manger', name: 'Manger', category: 'Alimentation', system: SignSystem.LSQ, instruction: 'Bout des doigts à la bouche.' }
];

export const LSQ_LEARNING_MODULES: LearningModule[] = [
  { 
    title: "Vocabulaire : Sentiments", 
    category: 'EMOTIONS',
    source: "Fondation des Sourds du Québec", 
    id: "R7qMNfgPczE",
    status: "Recommandé", 
    date: "Nouveau",
    learned: ["Heureux", "Triste", "Peur"],
    system: SignSystem.LSQ
  },
  { 
    title: "Vocabulaire : Météo", 
    category: 'METEO',
    source: "Fondation des Sourds du Québec", 
    id: "-BzPGlWwO-0",
    status: "Recommandé", 
    date: "Nouveau",
    learned: ["Soleil", "Pluie"],
    system: SignSystem.LSQ
  },
  { 
    title: "Ressources : Dictionnaire SIVET", 
    category: 'STRUCTURE',
    source: "SIVET.ca", 
    id: "external-sivet",
    status: "Recommandé", 
    date: "Référence",
    learned: ["Répertoire complet", "Vidéos professionnelles"],
    system: SignSystem.LSQ
  },
  { 
    title: "Ressources : Aide-mémoire LSQ", 
    category: 'QUOTIDIEN',
    source: "Association des Sourds du Canada", 
    id: "external-asc",
    status: "Recommandé", 
    date: "Référence",
    learned: ["Signes d'urgence", "Droits"],
    system: SignSystem.LSQ
  }
];
