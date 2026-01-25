
import { GoogleGenAI, Type } from "@google/genai";
import { TransformationSchema } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Always use process.env.API_KEY directly for initialization as per guidelines
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async transformData(content: string, schema: TransformationSchema) {
    // Use gemini-3-pro-preview for complex tasks like structured data extraction and reasoning
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Transform the following unstructured data into a structured JSON object according to the provided schema. 
      Data: "${content}"
      
      Additional Requirements:
      1. Provide a confidence score (0-1) for the transformation.
      2. Provide a brief explanation of the mapping logic used.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            structuredData: schema.targetJsonSchema,
            confidence: { type: Type.NUMBER, description: 'Score between 0 and 1' },
            explanation: { type: Type.STRING, description: 'Brief mapping logic explanation' }
          },
          required: ['structuredData', 'confidence', 'explanation']
        }
      }
    });

    try {
      // response.text is a property, not a method. Use it to extract the generated string.
      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error("Failed to parse Gemini response", e);
      throw e;
    }
  }
}

export const geminiService = new GeminiService();
