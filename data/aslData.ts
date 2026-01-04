
import { SignSystem, SignEntry, LearningModule, IntentType } from '../types';

export const ASL_VISUAL_PATTERNS: Array<{sign: string, pattern: string, intent: IntentType}> = [
  { sign: "Hello", pattern: "Salute motion from forehead.", intent: "SALUER" },
  { sign: "Thank you", pattern: "Flat hand from chin forward.", intent: "REMERCIER" }
];

export const ASL_DICTIONARY: SignEntry[] = [
  { id: 'asl-1', name: 'Hello', category: 'Greetings', system: SignSystem.ASL, instruction: 'Hand flat near forehead, move forward.' }
];

export const ASL_LEARNING_MODULES: LearningModule[] = [];
