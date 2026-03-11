import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Retail Assistant - AI-Powered Review Analysis",
  description: "Analyze product reviews using AI to get instant insights on Pros, Cons, Sentiment, and Summary.",
  keywords: ["product reviews", "AI analysis", "sentiment analysis", "retail assistant"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-gradient-hero">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
