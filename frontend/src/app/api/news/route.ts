import { NextResponse } from "next/server";
import Parser from "rss-parser";

// Define the custom fields we want to extract if any
type CustomFeed = { title: string; link: string };
type CustomItem = { title: string; link: string; pubDate: string; contentSnippet: string; source: string };

const parser = new Parser<CustomFeed, CustomItem>({
  customFields: {
    item: [
      ['source', 'source'],
    ]
  }
});

// Cache in memory for 15 minutes to avoid excessive fetching
let cachedNews: any[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export async function GET() {
  const now = Date.now();

  // Return cached version if valid
  if (cachedNews.length > 0 && now - lastFetchTime < CACHE_DURATION) {
    return NextResponse.json({ news: cachedNews, cached: true });
  }

  try {
    // Google News RSS Feed for India (English)
    // hl=en-IN (Language=English, Country=India)
    // gl=IN (Geolocation=India)
    // ceid=IN:en (Edition=India in English)
    const feed = await parser.parseURL("https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en");

    // Format and limit to top 15 news items
    const newsItems = feed.items.slice(0, 15).map(item => ({
      title: item.title || "",
      link: item.link || "",
      publishedAt: item.pubDate || new Date().toISOString(),
      source: item.source || "Google News",
      // Clean up snippet if needed
      snippet: item.contentSnippet ? item.contentSnippet.split("...")[0] + "..." : "",
    }));

    // Update cache
    cachedNews = newsItems;
    lastFetchTime = now;

    return NextResponse.json({ news: newsItems, cached: false });
  } catch (error) {
    console.error("Error fetching news:", error);
    // If error occurs but we have old cache, return old cache
    if (cachedNews.length > 0) {
      return NextResponse.json({ news: cachedNews, cached: true, error: "Using stale cache due to fetch error" });
    }
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
