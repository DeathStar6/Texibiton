"use client";

/**
 * SentimentChart Component
 * Visual sentiment indicator with animated bar
 */

interface SentimentChartProps {
  sentiment: "Positive" | "Negative" | "Neutral" | "Mixed";
}

export default function SentimentChart({ sentiment }: SentimentChartProps) {
  // Get percentage and color based on sentiment
  const getSentimentData = () => {
    switch (sentiment.toLowerCase()) {
      case "positive":
        return { percentage: 85, color: "bg-green-500", label: "85% Positive" };
      case "negative":
        return { percentage: 25, color: "bg-red-500", label: "25% Positive" };
      case "mixed":
        return { percentage: 55, color: "bg-yellow-500", label: "55% Positive" };
      default:
        return { percentage: 50, color: "bg-blue-500", label: "50% Neutral" };
    }
  };

  const { percentage, color, label } = getSentimentData();

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
        {/* Gradient overlay for polish */}
        <div 
          className="absolute left-0 top-0 h-full rounded-full opacity-30"
          style={{ 
            width: `${percentage}%`,
            background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)"
          }}
        />
      </div>
      
      {/* Label */}
      <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
        <span>Negative</span>
        <span className="font-medium">{label}</span>
        <span>Positive</span>
      </div>
    </div>
  );
}
