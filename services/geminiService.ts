
import { GoogleGenAI, Type } from "@google/genai";
import { Language, SignSystem, InterpretationResult, IntentType, Message } from "../types";
import { LSQ_VISUAL_PATTERNS, LSQ_SYNTAX_RULES } from "../data/lsqData";
import { ASL_VISUAL_PATTERNS } from "../data/aslData";
import { LSF_VISUAL_PATTERNS, LSF_SYNTAX_RULES } from "../data/lsfData";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const VISUAL_KNOWLEDGE_BASE: Record<SignSystem, Array<{sign: string, pattern: string, intent: IntentType}>> = {
  [SignSystem.LSQ]: LSQ_VISUAL_PATTERNS,
  [SignSystem.ASL]: ASL_VISUAL_PATTERNS,
  [SignSystem.LSF]: LSF_VISUAL_PATTERNS
};

const SYNTAX_KNOWLEDGE_BASE: Record<SignSystem, string[]> = {
  [SignSystem.LSQ]: LSQ_SYNTAX_RULES,
  [SignSystem.LSF]: LSF_SYNTAX_RULES,
  [SignSystem.ASL]: ["Standard ASL grammar (Time > Topic > Comment)."]
};

export const translateSignLanguage = async (
  base64Image: string,
  language: Language,
  signSystem: SignSystem,
  history: Message[] = []
): Promise<InterpretationResult> => {
  const model = "gemini-3-flash-preview";
  const referenceRules = VISUAL_KNOWLEDGE_BASE[signSystem] || [];
  const visualDirectives = referenceRules.map(r => `- RÉFÉRENCE "${r.sign}": ${r.pattern}`).join("\n");
  
  const syntaxRules = (SYNTAX_KNOWLEDGE_BASE[signSystem] || []).join("\n");

  const systemInstruction = `Tu es l'IA interprète linguistique de SignBridge. 
  SYSTÈME ACTUEL : ${signSystem}.
  
  CONTEXTE CULTUREL : 
  La LSQ (Québec) et la LSF (France) partagent environ 60% de signes communs, mais l'ordre des mots et certaines expressions faciales diffèrent. Respecte scrupuleusement le système sélectionné par l'utilisateur.
  
  RÈGLES GRAMMATICALES POUR ${signSystem} :
  ${syntaxRules}
  
  DOMAINES MAÎTRISÉS :
  - ALIMENTATION (Manger, Boire, Pain, Eau)
  - LIEUX (Maison, École, Travail, Toilettes)
  - URGENCE ET SANTÉ (Aide, Hôpital, Mal)
  - SENTIMENTS ET ÉMOTIONS
  - ALPHABET, COULEURS, MÉTÉO
  
  BIBLIOTHÈQUE VISUELLE DE RÉFÉRENCE :
  ${visualDirectives}
  
  MÉTHODE :
  1. Analyse l'image pour trouver le pattern visuel correspondant au signe.
  2. Combine avec l'historique des signes pour former une phrase sémantiquement correcte.
  3. Traduis vers un français fluide adapté à la région (${language}).
  
  RÉPONDS EN JSON :
  {
    "gloss": ["CONCEPT_DÉTECTÉ"],
    "intent": "INTENTION",
    "translation": "Phrase fluide en ${language}",
    "confidence": 0.95
  }`;

  try {
    const recentHistory = history.slice(0, 5).map(m => m.text).reverse().join(" -> ");
    
    const response = await ai.models.generateContent({
      model,
      contents: { 
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } }, 
          { text: `Historique : ${recentHistory}. Quel est ce nouveau signe ?` }
        ] 
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            gloss: { type: Type.ARRAY, items: { type: Type.STRING } },
            intent: { type: Type.STRING },
            translation: { type: Type.STRING },
            confidence: { type: Type.NUMBER }
          },
          required: ["gloss", "intent", "translation", "confidence"]
        }
      },
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return { gloss: [], translation: "Erreur", intent: 'UNKNOWN', slots: {}, confidence: 0 };
  }
};

export const getAvatarResponse = async (
  userInput: string,
  language: Language,
  signSystem: SignSystem
): Promise<{ text: string; signInstruction: string }> => {
  const model = "gemini-3-flash-preview";
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Voix : "${userInput}"`,
      config: {
        systemInstruction: `Tu es un avatar virtuel Sourd. Traduis la phrase vocale vers la syntaxe ${signSystem}.
        Explique les mouvements des mains de manière très pédagogique car l'utilisateur apprend.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            signInstruction: { type: Type.STRING }
          },
          required: ["text", "signInstruction"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { text: userInput, signInstruction: "Adaptation syntaxique..." };
  }
};
