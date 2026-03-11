/**
 * AI Integration Library
 * Handles Google Gemini API calls for review analysis
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult } from "./types";

// Lazy-load Gemini client to avoid initialization errors
let geminiClient: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiClient) {
    geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  }
  return geminiClient;
}

/**
 * The prompt template for analyzing product reviews
 * Structured to ensure consistent JSON output
 */
const ANALYSIS_PROMPT = `You are a product review analyst. Analyze the following product reviews and generate a structured JSON response.

Your response MUST be a valid JSON object with exactly these fields:
- "overall_rating": A string like "4.2/5" representing the estimated average rating
- "sentiment": Exactly one of: "Positive", "Negative", "Neutral", or "Mixed"
- "pros": An array of strings listing positive points mentioned (3-6 items)
- "cons": An array of strings listing negative points or complaints (3-6 items)
- "summary": A 1-2 sentence summary capturing the overall sentiment

Reviews to analyze:
`;

/**
 * Mock reviews for demo purposes when URL is provided
 * These simulate scraped reviews from a product page
 */
export const MOCK_REVIEWS = `
Review 1: "Absolutely love this product! The battery lasts all day and charges super fast. Build quality is premium. Only downside is it gets a bit warm during heavy gaming." - 5 stars

Review 2: "Good value for money. The display is crisp and colors are vibrant. Camera is decent but struggles in low light. Fast performance overall." - 4 stars

Review 3: "Mixed feelings. Great design and feels solid in hand. However, the camera could be much better for this price range. Also heats up when using multiple apps." - 3 stars

Review 4: "Best purchase I've made! Smooth performance, excellent speakers, and the screen is gorgeous. Minor complaint - could use more storage options." - 5 stars

Review 5: "Decent phone but nothing special. Battery is good, camera is average. Gets the job done but not flagship level despite the price." - 3 stars

Review 6: "Really impressed with the build quality and fast charging. The processor handles everything I throw at it. Camera quality in daylight is fantastic!" - 4 stars
`;

/**
 * Check if input looks like a URL
 */
export function isUrl(input: string): boolean {
  const urlPattern = /^(https?:\/\/|www\.)/i;
  return urlPattern.test(input.trim());
}

/**
 * Analyze product reviews using Google Gemini
 * @param reviews - The review text to analyze
 * @returns Structured analysis result
 */
export async function analyzeReviews(reviews: string): Promise<AnalysisResult> {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = ANALYSIS_PROMPT + reviews + `

Respond ONLY with valid JSON in this exact format:
{
  "overall_rating": "X.X/5",
  "sentiment": "Positive" or "Negative" or "Neutral" or "Mixed",
  "pros": ["pro1", "pro2", ...],
  "cons": ["con1", "con2", ...],
  "summary": "brief summary"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error("No response from AI");
    }

    // Extract JSON from the response (handle markdown code blocks)
    let jsonStr = text;
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    } else {
      // Try to find JSON object directly
      const objectMatch = text.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        jsonStr = objectMatch[0];
      }
    }

    // Parse the JSON response
    const analysisResult = JSON.parse(jsonStr) as AnalysisResult;

    // Validate the response structure
    if (!analysisResult.overall_rating || !analysisResult.sentiment || !analysisResult.pros || !analysisResult.cons || !analysisResult.summary) {
      throw new Error("Invalid response structure from AI");
    }

    return analysisResult;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw error;
  }
}

/**
 * Fallback analysis for when API is unavailable
 * Returns a structured mock response for demo purposes
 */
export function getFallbackAnalysis(): AnalysisResult {
  return {
    overall_rating: "4.0/5",
    sentiment: "Positive",
    pros: [
      "Excellent battery life",
      "Premium build quality",
      "Fast charging capability",
      "Smooth performance",
      "Great display quality"
    ],
    cons: [
      "Device heats under heavy use",
      "Camera struggles in low light",
      "Limited storage options",
      "Price could be lower"
    ],
    summary: "Overall, users are satisfied with the product's performance and build quality. The main complaints center around heating issues and camera performance in certain conditions."
  };
}
