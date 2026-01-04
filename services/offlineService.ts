
import { Language, SignSystem } from "../types";

/**
 * Simulates a local "lite" model for offline use.
 * In a production app, this could interface with TensorFlow.js or a WASM-based local model.
 */
export const localTranslateSign = async (
  base64Image: string,
  language: Language,
  signSystem: SignSystem
): Promise<string> => {
  // Simulate processing delay for "local model"
  await new Promise(resolve => setTimeout(resolve, 800));

  // Heuristic: If we are offline, we provide a generic interpretation or look for pre-cached common signs
  // This is a placeholder for real local vision logic.
  const commonSigns = language === Language.FR_CA 
    ? ["Bonjour", "Merci", "Aide", "Oui", "Non"] 
    : ["Hello", "Thank you", "Help", "Yes", "No"];
  
  // Return a random common sign to simulate detection, or a generic placeholder
  return commonSigns[Math.floor(Math.random() * commonSigns.length)];
};

export const localGetAvatarResponse = async (
  userInput: string,
  language: Language
): Promise<{ text: string; signInstruction: string }> => {
  const isFr = language === Language.FR_CA;
  return {
    text: isFr 
      ? `(Mode Hors-ligne) Reçu : "${userInput}". Je ne peux pas raisonner sans connexion, mais je reste à votre écoute.` 
      : `(Offline Mode) Received: "${userInput}". I cannot process complex requests without a connection, but I am still active.`,
    signInstruction: isFr 
      ? "L'avatar hoche la tête avec empathie." 
      : "The avatar nods with empathy."
  };
};
