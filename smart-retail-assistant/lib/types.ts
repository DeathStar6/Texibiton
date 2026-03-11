/**
 * Type definitions for Smart Retail Assistant
 */

// Analysis result returned by the AI
export interface AnalysisResult {
  overall_rating: string;
  sentiment: "Positive" | "Negative" | "Neutral" | "Mixed";
  pros: string[];
  cons: string[];
  summary: string;
  source?: "scraped" | "manual" | "demo"; // Indicates where reviews came from
}

// API request body
export interface AnalyzeRequest {
  reviews: string;
}

// API response
export interface AnalyzeResponse extends AnalysisResult {}

// Error response from API
export interface ErrorResponse {
  error: string;
  details?: string;
}
