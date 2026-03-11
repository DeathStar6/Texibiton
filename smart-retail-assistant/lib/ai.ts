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
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("API Key present:", !!apiKey, "Length:", apiKey?.length);
    
    const genAI = getGeminiClient();
    // Use gemini-1.5-flash - the fastest and most available model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    console.log("Sending request to Gemini API...");

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
 * Random data pools for generating varied fallback analyses
 */
const RATINGS = [
  "3.2/5", "3.4/5", "3.5/5", "3.6/5", "3.7/5", "3.8/5", 
  "3.9/5", "4.0/5", "4.1/5", "4.2/5", "4.3/5", "4.4/5", 
  "4.5/5", "4.6/5", "4.7/5", "4.8/5"
];

const SENTIMENTS: Array<"Positive" | "Negative" | "Neutral" | "Mixed"> = [
  "Positive", "Positive", "Positive", "Positive",
  "Mixed", "Mixed", "Mixed",
  "Neutral", "Neutral",
  "Negative"
];

const PROS_POOL = [
  "Excellent battery life",
  "Premium build quality",
  "Fast charging capability",
  "Smooth performance",
  "Great display quality",
  "Outstanding value for money",
  "Sleek and modern design",
  "Exceptional camera quality",
  "Blazing fast processor",
  "Lightweight and portable",
  "Intuitive user interface",
  "Durable construction",
  "Responsive customer support",
  "Extended warranty coverage",
  "Wide range of color options",
  "Crystal clear audio quality",
  "Rapid processing speed",
  "Ergonomic design",
  "High-resolution display",
  "Advanced security features",
  "Seamless connectivity",
  "Impressive low-light camera performance",
  "All-day battery endurance",
  "Premium materials used",
  "Compact and stylish",
  "Quick and responsive touch",
  "Superior sound system",
  "Efficient multitasking",
  "Robust build",
  "User-friendly setup process"
];

const CONS_POOL = [
  "Device heats under heavy use",
  "Camera struggles in low light",
  "Limited storage options",
  "Price point is high",
  "Average battery backup",
  "Charging speed could be faster",
  "Build quality feels budget",
  "Occasional software glitches",
  "Speaker output is underwhelming",
  "Heavier than competitors",
  "Settings menu is confusing",
  "Screen scratches easily",
  "Limited customization options",
  "Performance lags during multitasking",
  "No water resistance rating",
  "Fingerprint magnet surface",
  "Average display brightness",
  "Bulky carrying case required",
  "Short cable length included",
  "Complicated initial setup",
  "Mediocre vibration motor",
  "Plastic components visible",
  "Touch responsiveness issues",
  "Network connectivity drops",
  "Audio lag during video calls",
  "Overpriced accessories",
  "Battery degrades quickly",
  "Camera app crashes occasionally",
  "Limited software update support",
  "Charging port loosens over time"
];

const SUMMARIES_POSITIVE = [
  "Overall, users are highly satisfied with this product. The standout features and solid performance make it a great choice for most consumers.",
  "This product receives glowing reviews from users who appreciate its quality construction and reliable performance in daily use.",
  "Customers love this purchase! The combination of features and performance exceeds expectations at this price point.",
  "A well-received product that delivers on its promises. Users particularly praise the attention to detail and user experience.",
  "Highly recommended by the majority of users. This product stands out in its category with impressive capabilities and consistent performance.",
  "Users can't stop raving about this product! From its exceptional quality to its thoughtful design, it checks all the right boxes.",
  "An absolute winner in the market. Users appreciate the premium feel, outstanding functionality, and excellent value proposition.",
  "The overwhelming consensus is positive. This product has won over users with its reliability, innovation, and user-centric features.",
  "Five-star experiences dominate the reviews. Users highlight the exceptional craftsmanship and attention to consumer needs.",
  "A product that truly delivers excellence. Users report high satisfaction levels and frequently recommend it to others."
];

const SUMMARIES_MIXED = [
  "While the product has notable strengths, there are some areas that could be improved. Most users find it decent for the price.",
  "Reviews show mixed reactions. Some users love certain aspects while others point out significant drawbacks that shouldn't be ignored.",
  "The product offers good value but comes with compromises. It works well for specific use cases but may not suit everyone.",
  "A middle-ground product with both advocates and critics. Your satisfaction may depend on your specific needs and expectations.",
  "Users have varied opinions on this one. While some praise its strengths, others feel the weaknesses hold it back from greatness.",
  "It's a tale of two experiences. Some users are delighted while others encounter frustrations. Consider your priorities carefully.",
  "The product shows promise but falls short in key areas. Users appreciate certain features while finding others lacking.",
  "Opinions are divided. The product excels in some departments but disappoints in others. It depends on what you value most.",
  "A product with potential that hasn't quite reached it. Users see both the highs and lows in their experiences.",
  "Balanced feedback from the user community. Good enough for some, but others expected more for the investment."
];

const SUMMARIES_NEUTRAL = [
  "The product performs adequately but doesn't particularly excel in any area. It gets the job done without impressing users.",
  "Neither outstanding nor disappointing, this product serves basic needs. Users have moderate expectations and generally accept what it offers.",
  "An average product that meets standard requirements. Don't expect breakthrough features, but it handles everyday tasks reasonably well.",
  "A functional choice that covers the basics. Users find it acceptable but not remarkable in any particular way.",
  "Middle-of-the-road performance across the board. It satisfies minimum expectations without going above and beyond.",
  "Users describe it as 'just okay'. The product fulfills its purpose but lacks the wow factor that drives enthusiasm.",
  "Competent but unremarkable. This product does what it says, but doesn't inspire strong feelings either way.",
  "A safe, predictable option. Users know what they're getting, and that's exactly what they get—nothing more, nothing less.",
  "Standard fare in a crowded market. It competes on fundamentals but doesn't distinguish itself from alternatives.",
  "Meets baseline expectations without exceeding them. A practical choice for those seeking straightforward functionality."
];

const SUMMARIES_NEGATIVE = [
  "Unfortunately, users have encountered numerous issues with this product. The drawbacks significantly outweigh any benefits offered.",
  "Disappointing performance across multiple areas. Users report frustration with reliability problems and unmet expectations.",
  "The product fails to deliver on its promises. Multiple design flaws and quality concerns have left users dissatisfied.",
  "Widespread complaints plague this product. From poor durability to subpar performance, it misses the mark in critical ways.",
  "Users express regret over this purchase. Quality control issues and inadequate functionality lead to negative experiences overall.",
  "A product that should have been better tested. Users cite fundamental problems that impact daily usability and satisfaction.",
  "Significant shortcomings overshadow the few positives. Most users cannot recommend this product to others.",
  "Customer feedback reveals serious concerns. Build quality, performance, and value all fall below acceptable standards.",
  "The consensus is clear: this product doesn't meet user needs. Multiple failings make it a poor choice in its category.",
  "Users report ongoing problems and disappointment. The product's limitations become apparent quickly after purchase."
];

/**
 * Helper function to randomly select items from an array
 */
function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Generate a random summary based on sentiment
 */
function getRandomSummary(sentiment: string): string {
  switch (sentiment) {
    case "Positive":
      return SUMMARIES_POSITIVE[Math.floor(Math.random() * SUMMARIES_POSITIVE.length)];
    case "Negative":
      return SUMMARIES_NEGATIVE[Math.floor(Math.random() * SUMMARIES_NEGATIVE.length)];
    case "Mixed":
      return SUMMARIES_MIXED[Math.floor(Math.random() * SUMMARIES_MIXED.length)];
    default:
      return SUMMARIES_NEUTRAL[Math.floor(Math.random() * SUMMARIES_NEUTRAL.length)];
  }
}

/**
 * Fallback analysis for when API is unavailable
 * Returns a randomized structured mock response for demo purposes
 */
export function getFallbackAnalysis(): AnalysisResult {
  const rating = RATINGS[Math.floor(Math.random() * RATINGS.length)];
  const sentiment = SENTIMENTS[Math.floor(Math.random() * SENTIMENTS.length)];
  
  // Get 4-6 random pros
  const numPros = Math.floor(Math.random() * 3) + 4; // 4-6 items
  const pros = getRandomItems(PROS_POOL, numPros);
  
  // Get 3-5 random cons
  const numCons = Math.floor(Math.random() * 3) + 3; // 3-5 items
  const cons = getRandomItems(CONS_POOL, numCons);
  
  const summary = getRandomSummary(sentiment);

  return {
    overall_rating: rating,
    sentiment: sentiment,
    pros: pros,
    cons: cons,
    summary: summary
  };
}
