
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export type AIServiceMode = 
  | 'solve' | 'explain' | 'summarize' | 'quiz' | 'study-plan' 
  | 'coding' | 'debug' | 'code-analysis';

export const queryAI = async (
  content: string, 
  mode: AIServiceMode = 'solve', 
  imageData?: string,
  language?: string,
  options?: { detailed?: boolean }
) => {
  const ai = getAIClient();
  const isCodingTask = ['coding', 'debug', 'code-analysis'].includes(mode);
  
  // Enforce strict language policy for coding
  const targetLanguage = language || 'the code\'s language';
  const isAllowed = ['Python', 'JavaScript', 'HTML/CSS'].some(l => targetLanguage.includes(l));
  const finalLanguage = isCodingTask && !isAllowed ? 'Python' : targetLanguage;

  const modelName = (mode === 'solve' || mode === 'study-plan' || isCodingTask) ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  
  let parts: any[] = [{ text: content }];
  if (imageData) {
    parts.push({
      inlineData: {
        mimeType: 'image/png',
        data: imageData.split(',')[1],
      },
    });
  }

  const detailedSuffix = options?.detailed 
    ? " Provide a detailed logic breakdown, and state the Time/Space Complexity. For HTML/CSS, explain the design choices."
    : "";

  const prompts: Record<AIServiceMode, string> = {
    solve: "Provide a direct, accurate solution to this quest. Be thorough but clear.",
    explain: "Teach me the core mechanics of this problem as if I'm playing a strategy game.",
    summarize: "Create a 'TL;DR' summary and key bullet points for this content.",
    quiz: "Create a 5-question multiple choice quiz to test my mastery.",
    'study-plan': "Create a structured daily quest-line based on the JSON context provided.",
    coding: `STRICT REQUIREMENT: Solve this programming challenge ONLY using ${finalLanguage}. Provide optimized, clean code with expert comments.${detailedSuffix}`,
    debug: `STRICT REQUIREMENT: Debug this ${finalLanguage} code. Identify the 'boss bugs' and provide the fixed script.${detailedSuffix}`,
    'code-analysis': `Analyze this ${finalLanguage} logic. Provide Big O complexity and 3 optimization upgrades.`
  };

  const config: any = {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
  };

  const response = await ai.models.generateContent({
    model: modelName,
    contents: { parts: [...parts, { text: prompts[mode] }] },
    config
  });

  return response.text || "Connection lost... Unable to fetch solution from the Oracle.";
};

export const parseRoutineImage = async (base64Image: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/png',
            data: base64Image.split(',')[1],
          },
        },
        { text: "Extract the class routine from this image." }
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            day: { type: Type.STRING },
            startTime: { type: Type.STRING },
            endTime: { type: Type.STRING },
          },
          required: ["name", "day", "startTime", "endTime"]
        },
      },
    },
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse routine image", e);
    return [];
  }
};
