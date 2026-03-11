"use client";

/**
 * ResultCards Component
 * Displays AI analysis results in a card-based layout
 */

import { useState } from "react";
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  FileText, 
  Copy, 
  Check,
  Share2,
  Globe,
  Edit3,
  Database
} from "lucide-react";
import { AnalysisResult } from "@/lib/types";
import SentimentChart from "@/components/SentimentChart";

interface ResultCardsProps {
  result: AnalysisResult;
}

export default function ResultCards({ result }: ResultCardsProps) {
  const [copied, setCopied] = useState(false);

  // Get source badge info
  const getSourceInfo = () => {
    if (result.source === "scraped") {
      return { label: "Web Analysis", icon: Globe, color: "text-green-600 bg-green-100 dark:bg-green-900/30" };
    }
    return { label: "Analysis Complete", icon: Check, color: "text-brand-600 bg-brand-100 dark:bg-brand-900/30" };
  };

  // Get sentiment color based on sentiment value
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return "text-green-500 bg-green-100 dark:bg-green-900/30";
      case "negative":
        return "text-red-500 bg-red-100 dark:bg-red-900/30";
      case "mixed":
        return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30";
      default:
        return "text-blue-500 bg-blue-100 dark:bg-blue-900/30";
    }
  };

  // Get rating value as number for display
  const getRatingValue = (): number => {
    const match = result.overall_rating.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const sourceInfo = getSourceInfo();

  // Copy results to clipboard
  const copyToClipboard = async () => {
    const text = `
Smart Retail Assistant Analysis
================================
Overall Rating: ${result.overall_rating}
Sentiment: ${result.sentiment}

PROS:
${result.pros.map(p => `• ${p}`).join('\n')}

CONS:
${result.cons.map(c => `• ${c}`).join('\n')}

SUMMARY:
${result.summary}
    `.trim();

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Share results
  const shareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Smart Retail Assistant Analysis",
          text: `Rating: ${result.overall_rating} | Sentiment: ${result.sentiment}\n${result.summary}`,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      copyToClipboard();
    }
  };

  const ratingValue = getRatingValue();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Source Badge and Action Buttons */}
      <div className="flex justify-between items-center">
        {/* Source Badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${sourceInfo.color}`}>
          <sourceInfo.icon className="w-4 h-4" />
          {sourceInfo.label}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2 rounded-lg
                       bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300
                       hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Results
            </>
          )}
        </button>
        <button
          onClick={shareResults}
          className="flex items-center gap-2 px-4 py-2 rounded-lg
                     bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300
                     hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
        </div>
      </div>

      {/* Top Row - Score and Sentiment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Score Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft
                        border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-900/30">
              <Star className="w-5 h-5 text-brand-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Overall Score
            </h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-gray-900 dark:text-white">
              {ratingValue.toFixed(1)}
            </span>
            <span className="text-2xl text-gray-400">/5</span>
          </div>
          {/* Star Rating Visual */}
          <div className="flex gap-1 mt-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${
                  star <= Math.round(ratingValue)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Sentiment Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft
                        border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${getSentimentColor(result.sentiment)}`}>
              {result.sentiment === "Positive" ? (
                <ThumbsUp className="w-5 h-5" />
              ) : result.sentiment === "Negative" ? (
                <ThumbsDown className="w-5 h-5" />
              ) : (
                <Star className="w-5 h-5" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Sentiment
            </h3>
          </div>
          <div className={`inline-flex px-4 py-2 rounded-full text-lg font-semibold ${getSentimentColor(result.sentiment)}`}>
            {result.sentiment}
          </div>
          {/* Sentiment Chart */}
          <div className="mt-4">
            <SentimentChart sentiment={result.sentiment} />
          </div>
        </div>
      </div>

      {/* Pros and Cons Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pros Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft
                        border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <ThumbsUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Pros
            </h3>
          </div>
          <ul className="space-y-3">
            {result.pros.map((pro, index) => (
              <li 
                key={index}
                className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 
                               flex items-center justify-center text-green-500 text-sm font-medium">
                  +
                </span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft
                        border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <ThumbsDown className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Cons
            </h3>
          </div>
          <ul className="space-y-3">
            {result.cons.map((con, index) => (
              <li 
                key={index}
                className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 
                               flex items-center justify-center text-red-500 text-sm font-medium">
                  -
                </span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft
                      border border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <FileText className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Summary
          </h3>
        </div>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
          {result.summary}
        </p>
      </div>
    </div>
  );
}
