import { NextRequest, NextResponse } from "next/server";

/* ============================================
   TRANSLATION API ROUTE
   Uses google-translate-api-x (FREE, no API key)
   Caches results server-side to minimize calls
   ============================================ */

// Server-side translation cache (LRU-style, max 500 entries)
const cache = new Map<string, string>();
const MAX_CACHE = 500;

function getCacheKey(text: string, to: string): string {
  return `${to}:${text.slice(0, 200)}`;
}

function setCache(key: string, value: string) {
  if (cache.size >= MAX_CACHE) {
    // Delete oldest entry
    const firstKey = cache.keys().next().value;
    if (firstKey) cache.delete(firstKey);
  }
  cache.set(key, value);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, texts, to } = body as {
      text?: string;
      texts?: string[];
      to: string;
    };

    if (!to) {
      return NextResponse.json(
        { error: "Missing 'to' language code" },
        { status: 400 }
      );
    }

    // Skip if target is English (source is assumed English)
    if (to === "en") {
      if (texts) {
        return NextResponse.json({ translations: texts });
      }
      return NextResponse.json({ translation: text });
    }

    // Dynamic import to keep it server-side only
    const { translate } = await import("google-translate-api-x");

    // --- Batch mode ---
    if (texts && Array.isArray(texts)) {
      const results: string[] = [];

      for (const t of texts.slice(0, 20)) {
        // Max 20 per batch
        if (!t || t.trim().length === 0) {
          results.push(t || "");
          continue;
        }

        const cacheKey = getCacheKey(t, to);
        const cached = cache.get(cacheKey);
        if (cached) {
          results.push(cached);
          continue;
        }

        try {
          const res = await translate(t, { to, autoCorrect: true });
          const translated = res.text || t;
          setCache(cacheKey, translated);
          results.push(translated);
        } catch {
          results.push(t); // Fallback to original on error
        }
      }

      return NextResponse.json({ translations: results });
    }

    // --- Single text mode ---
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ translation: text || "" });
    }

    const cacheKey = getCacheKey(text, to);
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json({ translation: cached, cached: true });
    }

    const res = await translate(text, { to, autoCorrect: true });
    const translated = res.text || text;
    setCache(cacheKey, translated);

    return NextResponse.json({ translation: translated });
  } catch (err: any) {
    console.error("[translate] Error:", err?.message || err);
    return NextResponse.json(
      { error: "Translation failed", detail: err?.message },
      { status: 500 }
    );
  }
}
