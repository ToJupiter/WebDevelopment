import { GoogleGenAI, Type } from "@google/genai";
import { InterviewFeedback } from "../types";

export const generateInterviewFeedback = async (question: string, answer: string): Promise<InterviewFeedback> => {
  const apiKey = process.env.API_KEY || '';
  
  if (!apiKey) {
    // Mock response if no key is present for demo purposes
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          score: 85,
          summary: "Good answer, but could be more specific about technical implementation details.",
          strengths: ["Clear communication", "Addressed the core problem"],
          improvements: ["Mention specific libraries", "Discuss edge cases"]
        });
      }, 1500);
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-2.5-flash";
    const prompt = `
      You are an expert technical interviewer.
      Question: "${question}"
      Candidate Answer: "${answer}"
      
      Provide feedback in JSON format with the following schema:
      - score: integer (0-100)
      - summary: string (brief overview)
      - strengths: array of strings
      - improvements: array of strings
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            strengths: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as InterviewFeedback;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      score: 0,
      summary: "Failed to generate feedback. Please try again.",
      strengths: [],
      improvements: []
    };
  }
};

export const getChatResponse = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) return "I'm a demo AI. Please configure your API key to chat for real!";
    
    try {
        const ai = new GoogleGenAI({ apiKey });
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: history
        });
        const result = await chat.sendMessage({ message });
        return result.text;
    } catch (e) {
        console.error(e);
        return "Sorry, I encountered an error.";
    }
}