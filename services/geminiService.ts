
import { GoogleGenAI } from "@google/genai";
import { PROMPT_TEMPLATES } from "../constants";
import { PromptType } from "../types";

export const generateMedicalResponse = async (
  query: string,
  type: PromptType,
  temperature: number
): Promise<{ response: string; promptUsed: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const promptTemplate = PROMPT_TEMPLATES[type];
  const finalPrompt = promptTemplate.replace('{{query}}', query);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: finalPrompt,
      config: {
        temperature: temperature,
        topP: 0.95,
        topK: 40,
        // Using a moderate thinking budget for reasoning tasks if supported
        // thinkingConfig: { thinkingBudget: 4000 } 
      },
    });

    return {
      response: response.text || "No response generated.",
      promptUsed: finalPrompt
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate response from Gemini API.");
  }
};
