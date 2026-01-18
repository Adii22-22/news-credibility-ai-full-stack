import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeContent = async (text: string): Promise<AnalysisResult> => {
  // Define the schema for the JSON response
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      trustScore: {
        type: Type.INTEGER,
        description: "A score from 0 to 100 indicating credibility.",
      },
      factualAccuracy: {
        type: Type.STRING,
        description: "Level of accuracy: High, Medium, Low.",
      },
      biasRating: {
        type: Type.STRING,
        description: "Political bias: Left, Right, Neutral, Mixed.",
      },
      headline: {
        type: Type.STRING,
        description: "A concise headline summarizing the analyzed content.",
      },
      summary: {
        type: Type.STRING,
        description:
          "A 2-3 sentence analysis of the content's credibility and key claims.",
      },
      tags: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "3 relevant topic tags.",
      },
      crossReferences: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            source: { type: Type.STRING },
            sourceInitials: {
              type: Type.STRING,
              description: "Max 2 characters",
            },
            timeAgo: { type: Type.STRING, description: "e.g., '2 hours ago'" },
            trustColor: {
              type: Type.STRING,
              enum: ["primary", "yellow", "red", "gray"],
            },
          },
        },
      },
    },
    required: [
      "trustScore",
      "factualAccuracy",
      "biasRating",
      "headline",
      "summary",
      "tags",
      "crossReferences",
    ],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview",
      contents: `Analyze the following news headline, URL, or topic for credibility, bias, and factual accuracy. 
      If it is a URL, infer the likely content based on the domain and structure or common knowledge if it's a major story. 
      If it is a general topic, analyze the current consensus.
      
      Input: "${text}"
      
      Provide a realistic trust score and analysis.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const result = response.text;
    if (!result) throw new Error("No response from AI");

    return JSON.parse(result) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback mock data in case of error or rate limit
    return {
      trustScore: 75,
      factualAccuracy: "Unknown",
      biasRating: "Unknown",
      headline: "Analysis Unavailable",
      summary:
        "We could not analyze this content at the moment. Please try again.",
      tags: ["Error"],
      crossReferences: [],
    };
  }
};
