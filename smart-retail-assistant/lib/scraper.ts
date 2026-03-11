/**
 * Web Scraping Utility
 * Attempts to extract product reviews from various e-commerce websites
 */

import * as cheerio from "cheerio";

// Common selectors for reviews on popular e-commerce sites
const REVIEW_SELECTORS = [
  // Amazon
  '[data-hook="review-body"]',
  '.review-text-content',
  '.review-text',
  '#cm_cr-review_list .review',
  
  // Flipkart
  '._6K-7Co',
  '.t-ZTKy',
  '[class*="review"]',
  
  // Generic selectors
  '.review-content',
  '.review-body',
  '.customer-review',
  '.user-review',
  '[class*="review-text"]',
  '[class*="reviewText"]',
  '[class*="ReviewText"]',
  '.product-review',
  '[itemprop="reviewBody"]',
  '.comment-content',
  '.feedback-text',
];

// Rating selectors
const RATING_SELECTORS = [
  '[data-hook="review-star-rating"]',
  '.review-rating',
  '[class*="rating"]',
  '[class*="star"]',
  '[itemprop="ratingValue"]',
];

/**
 * Scrape reviews from a product URL
 * @param url - The product page URL
 * @returns Array of review texts or null if scraping fails
 */
export async function scrapeReviews(url: string): Promise<string | null> {
  try {
    console.log("Attempting to scrape reviews from:", url);

    // Fetch the page with a browser-like user agent
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Cache-Control": "no-cache",
      },
      // Set a timeout
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.log("Failed to fetch page:", response.status);
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const reviews: string[] = [];

    // Try each selector to find reviews
    for (const selector of REVIEW_SELECTORS) {
      $(selector).each((_, element) => {
        const text = $(element).text().trim();
        // Only add if it looks like a review (has reasonable length)
        if (text && text.length > 20 && text.length < 2000) {
          // Clean up the text
          const cleanText = text
            .replace(/\s+/g, " ")
            .replace(/Read more/gi, "")
            .replace(/Helpful/gi, "")
            .trim();
          
          if (cleanText.length > 20 && !reviews.includes(cleanText)) {
            reviews.push(cleanText);
          }
        }
      });

      // If we found enough reviews, stop searching
      if (reviews.length >= 5) break;
    }

    // If we found reviews, format them
    if (reviews.length > 0) {
      console.log(`Successfully scraped ${reviews.length} reviews`);
      
      const formattedReviews = reviews
        .slice(0, 10) // Limit to 10 reviews
        .map((review, index) => `Review ${index + 1}: "${review}"`)
        .join("\n\n");
      
      return formattedReviews;
    }

    // Try to find any text that might be reviews in a broader search
    const bodyText = $("body").text();
    const reviewMatches = bodyText.match(/(?:review|Rating|stars?)[:\s]*["']?([^"'\n]{50,500})["']?/gi);
    
    if (reviewMatches && reviewMatches.length > 0) {
      console.log(`Found ${reviewMatches.length} potential reviews from text patterns`);
      const formattedReviews = reviewMatches
        .slice(0, 5)
        .map((review, index) => `Review ${index + 1}: "${review.trim()}"`)
        .join("\n\n");
      return formattedReviews;
    }

    console.log("No reviews found on page");
    return null;
  } catch (error) {
    console.error("Scraping error:", error);
    return null;
  }
}

/**
 * Check if a URL is from a supported e-commerce site
 */
export function getSiteType(url: string): string {
  const urlLower = url.toLowerCase();
  
  if (urlLower.includes("amazon")) return "amazon";
  if (urlLower.includes("flipkart")) return "flipkart";
  if (urlLower.includes("walmart")) return "walmart";
  if (urlLower.includes("ebay")) return "ebay";
  if (urlLower.includes("bestbuy")) return "bestbuy";
  
  return "unknown";
}
