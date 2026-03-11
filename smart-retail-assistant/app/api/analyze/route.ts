/**
 * API Route: /api/analyze
 * Handles POST requests to analyze product reviews
 */

import { NextRequest, NextResponse } from "next/server";
import { analyzeReviews, isUrl, MOCK_REVIEWS, getFallbackAnalysis } from "@/lib/ai";
import { AnalyzeRequest } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: AnalyzeRequest = await request.json();

    // Validate input
    if (!body.reviews || typeof body.reviews !== "string") {
      return NextResponse.json(
        { error: "Reviews text is required" },
        { status: 400 }
      );
    }

    const input = body.reviews.trim();

    if (input.length === 0) {
      return NextResponse.json(
        { error: "Reviews text cannot be empty" },
        { status: 400 }
      );
    }

    // Determine the reviews to analyze
    let reviewsToAnalyze: string;

    if (isUrl(input)) {
      // If URL is provided, use mock reviews for demo
      // In production, this would scrape the actual page
      console.log("URL detected, using mock reviews for demo:", input);
      reviewsToAnalyze = MOCK_REVIEWS;
    } else {
      // Use the provided reviews directly
      reviewsToAnalyze = input;
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.warn("Gemini API key not configured, using fallback analysis");
      const fallbackResult = getFallbackAnalysis();
      return NextResponse.json(fallbackResult);
    }

    // Analyze reviews using AI
    const result = await analyzeReviews(reviewsToAnalyze);

    return NextResponse.json(result);
  } catch (error) {
    console.error("API Error:", error);

    // Check for specific error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // For demo purposes, return fallback analysis on any error
    console.warn("Using fallback analysis due to error");
    const fallbackResult = getFallbackAnalysis();
    return NextResponse.json(fallbackResult);
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to analyze reviews." },
    { status: 405 }
  );
}
