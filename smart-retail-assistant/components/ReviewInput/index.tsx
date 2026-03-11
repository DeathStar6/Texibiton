"use client";

/**
 * ReviewInput Component
 * Handles user input for reviews (text or URL)
 */

import { useState } from "react";
import { Link2, FileText, Loader2, Sparkles } from "lucide-react";

interface ReviewInputProps {
  onSubmit: (reviews: string) => void;
  isLoading: boolean;
}

export default function ReviewInput({ onSubmit, isLoading }: ReviewInputProps) {
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [inputType, setInputType] = useState<"text" | "url">("text");
  const [error, setError] = useState("");

  // Get current input value based on mode
  const currentInput = inputType === "text" ? textInput : urlInput;
  const setCurrentInput = inputType === "text" ? setTextInput : setUrlInput;

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedInput = currentInput.trim();

    if (!trimmedInput) {
      setError(inputType === "url" ? "Please enter a product URL" : "Please enter product reviews");
      return;
    }

    if (inputType === "url" && !isValidUrl(trimmedInput)) {
      setError("Please enter a valid URL (starting with http:// or https://)");
      return;
    }

    onSubmit(trimmedInput);
  };

  // Validate URL format
  const isValidUrl = (str: string): boolean => {
    try {
      const url = new URL(str);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  // Sample reviews for demo
  const loadSampleReviews = () => {
    setTextInput(`Review 1: "Love this product! Great battery life and the screen is amazing. Only issue is it gets warm sometimes." - 5 stars

Review 2: "Decent purchase. Fast shipping and good build quality. Camera could be better in low light." - 4 stars

Review 3: "Not worth the price. Too expensive for what you get. Performance is okay but nothing special." - 2 stars

Review 4: "Absolutely fantastic! Best purchase I've made this year. Highly recommend to everyone." - 5 stars

Review 5: "Good value overall. Some minor bugs but nothing deal-breaking. Customer support was helpful." - 4 stars`);
    setInputType("text");
    setError("");
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Input Type Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => {
            setInputType("text");
            setError("");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            inputType === "text"
              ? "bg-brand-500 text-white shadow-md"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <FileText className="w-4 h-4" />
          Paste Reviews
        </button>
        <button
          type="button"
          onClick={() => {
            setInputType("url");
            setError("");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            inputType === "url"
              ? "bg-brand-500 text-white shadow-md"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          <Link2 className="w-4 h-4" />
          Product URL
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {inputType === "text" ? (
          <div className="relative">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste product reviews here...&#10;&#10;Example:&#10;Review 1: &quot;Great product! Love the features...&quot; - 5 stars&#10;Review 2: &quot;Good but could be better...&quot; - 3 stars"
              className="w-full h-48 p-4 rounded-xl border border-gray-200 dark:border-gray-700 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         placeholder-gray-400 dark:placeholder-gray-500
                         focus:ring-2 focus:ring-brand-500 focus:border-transparent
                         transition-all resize-none"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={loadSampleReviews}
              className="absolute bottom-3 right-3 text-xs px-3 py-1.5 rounded-lg
                         bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300
                         hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Load Sample
            </button>
          </div>
        ) : (
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://amazon.com/product/... or any product URL"
            className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       placeholder-gray-400 dark:placeholder-gray-500
                       focus:ring-2 focus:ring-brand-500 focus:border-transparent
                       transition-all"
            disabled={isLoading}
          />
        )}

        {/* Error Message */}
        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm flex items-center gap-2">
            <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
            {error}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !currentInput.trim()}
          className="w-full py-4 px-6 rounded-xl font-semibold text-white
                     bg-gradient-to-r from-brand-500 to-brand-600
                     hover:from-brand-600 hover:to-brand-700
                     disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
                     shadow-lg hover:shadow-xl disabled:shadow-none
                     transition-all duration-200 flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing Reviews...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Analyze with AI
            </>
          )}
        </button>
      </form>

      {/* Info Text */}
      <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        {inputType === "url"
          ? "For demo purposes, we'll use sample reviews for any URL"
          : "Paste multiple reviews for better analysis accuracy"}
      </p>
    </div>
  );
}
