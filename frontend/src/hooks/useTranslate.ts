"use client";

import { useState, useCallback, useRef } from "react";
import { useI18n } from "@/lib/i18n/I18nContext";

/* ============================================
   useTranslate — Client-side Translation Hook
   
   Uses the free /api/translate route (no credits)
   with aggressive in-memory caching.
   
   Usage:
     const { translate, translateBatch } = useTranslate();
     const translated = await translate("Hello world");
   ============================================ */

// Global client-side cache (persists across re-renders and component instances)
const translationCache = new Map<string, string>();

function cacheKey(text: string, lang: string): string {
  return `${lang}:${text.slice(0, 200)}`;
}

export function useTranslate() {
  const { language } = useI18n();
  const [isTranslating, setIsTranslating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  /**
   * Translate a single text string to the current language.
   * Returns original text if language is English or translation fails.
   */
  const translate = useCallback(
    async (text: string): Promise<string> => {
      if (!text || language === "en") return text;

      const key = cacheKey(text, language);
      const cached = translationCache.get(key);
      if (cached) return cached;

      try {
        setIsTranslating(true);
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, to: language }),
        });

        if (!res.ok) return text;

        const data = await res.json();
        const translated = data.translation || text;
        translationCache.set(key, translated);
        return translated;
      } catch {
        return text;
      } finally {
        setIsTranslating(false);
      }
    },
    [language]
  );

  /**
   * Translate an array of texts in a single API call.
   * Returns array of translated strings (same order).
   */
  const translateBatch = useCallback(
    async (texts: string[]): Promise<string[]> => {
      if (language === "en") return texts;

      // Check cache first, identify which texts need translation
      const results: (string | null)[] = texts.map((t) => {
        if (!t) return t;
        const key = cacheKey(t, language);
        return translationCache.get(key) || null;
      });

      const uncached = texts
        .map((t, i) => (results[i] === null ? { text: t, index: i } : null))
        .filter(Boolean) as { text: string; index: number }[];

      // All cached — return immediately
      if (uncached.length === 0) return results as string[];

      try {
        setIsTranslating(true);

        // Cancel previous batch if still running
        abortRef.current?.abort();
        abortRef.current = new AbortController();

        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            texts: uncached.map((u) => u.text),
            to: language,
          }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) return texts;

        const data = await res.json();
        const translations: string[] = data.translations || [];

        // Merge translated texts back into results
        uncached.forEach((u, i) => {
          const translated = translations[i] || u.text;
          results[u.index] = translated;
          translationCache.set(cacheKey(u.text, language), translated);
        });

        return results as string[];
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return texts; // Aborted, return original
        }
        return texts;
      } finally {
        setIsTranslating(false);
      }
    },
    [language]
  );

  /**
   * Clear the translation cache (useful for debugging)
   */
  const clearCache = useCallback(() => {
    translationCache.clear();
  }, []);

  return {
    translate,
    translateBatch,
    isTranslating,
    clearCache,
    currentLanguage: language,
    isEnglish: language === "en",
  };
}
