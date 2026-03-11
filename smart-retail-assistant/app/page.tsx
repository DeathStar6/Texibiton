"use client";

/**
 * Home Page
 * Main landing page with review input and results display
 */

import { useState } from "react";
import { ShoppingBag, Sparkles, Zap, Shield } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import ReviewInput from "@/components/ReviewInput";
import ResultCards from "@/components/ResultCards";
import { AnalysisResult } from "@/lib/types";

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle review analysis submission
  const handleAnalyze = async (reviews: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reviews }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze reviews");
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to start over
  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Smart Retail Assistant
              </span>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {!result && (
        <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              AI-Powered{" "}
              <span className="gradient-text">Review Analysis</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Paste product reviews or a URL and let AI instantly analyze sentiment, 
              extract pros and cons, and generate actionable insights.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                AI-Powered Analysis
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
                <Zap className="w-4 h-4" />
                Instant Results
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium">
                <Shield className="w-4 h-4" />
                Structured Insights
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Show input form when no results */}
          {!result && (
            <>
              <ReviewInput onSubmit={handleAnalyze} isLoading={isLoading} />

              {/* Error Message */}
              {error && (
                <div className="mt-6 p-4 rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                  <p className="text-red-700 dark:text-red-300 text-center">
                    {error}. Please try again.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="mt-12 space-y-6">
              <div className="flex items-center justify-center gap-3 text-brand-500">
                <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span className="text-lg font-medium">Analyzing reviews with AI...</span>
              </div>
              
              {/* Skeleton Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft border border-gray-100 dark:border-gray-700">
                    <div className="skeleton h-6 w-1/3 mb-4" />
                    <div className="skeleton h-10 w-1/2 mb-4" />
                    <div className="space-y-2">
                      <div className="skeleton h-4 w-full" />
                      <div className="skeleton h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {result && !isLoading && (
            <div className="space-y-8">
              {/* Back Button */}
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <span className="text-lg">←</span>
                <span>Analyze another product</span>
              </button>

              {/* Result Cards */}
              <ResultCards result={result} />
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Built with Next.js, TailwindCSS, and Google Gemini
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
            Smart Retail Assistant - Hackathon Project
          </p>
        </div>
      </footer>
    </main>
  );
}
