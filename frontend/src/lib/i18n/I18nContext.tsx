"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { translations, LanguageCode } from "./translations";

/* ============================================
   I18N CONTEXT — with Auto-Translation
   
   How it works:
   1. t(key) first checks hardcoded translations
   2. If a key falls back to English for a non-English language,
      it queues a background translation via /api/translate
   3. Once translated, it triggers a re-render with the result
   4. Results are cached globally so each string is only
      translated once per session
   ============================================ */

type I18nContextType = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Global auto-translation cache: "lang:englishText" -> translatedText
const autoTranslateCache = new Map<string, string>();

// Track in-flight translations to avoid duplicates
const pendingTranslations = new Set<string>();

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  // Counter to force re-renders when background translations arrive
  const [, setTranslationVersion] = useState(0);
  const batchQueueRef = useRef<{ key: string; text: string }[]>([]);
  const batchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("vishwas_lang") as LanguageCode;
    if (saved && translations[saved]) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem("vishwas_lang", lang);
  };

  // Process batch of queued translations
  const processBatch = useCallback(async () => {
    const batch = [...batchQueueRef.current];
    batchQueueRef.current = [];

    if (batch.length === 0) return;

    const uniqueTexts = [...new Map(batch.map((b) => [b.text, b])).values()];
    const textsToTranslate = uniqueTexts.map((b) => b.text);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: textsToTranslate, to: language }),
      });

      if (!res.ok) return;

      const data = await res.json();
      const results: string[] = data.translations || [];

      results.forEach((translated, i) => {
        const original = textsToTranslate[i];
        if (translated && translated !== original) {
          const cacheKey = `${language}:${original}`;
          autoTranslateCache.set(cacheKey, translated);
          pendingTranslations.delete(cacheKey);
        }
      });

      // Trigger re-render so t() picks up new translations
      setTranslationVersion((v) => v + 1);
    } catch {
      // Silently fail — fallback to English is fine
      batch.forEach((b) => pendingTranslations.delete(`${language}:${b.text}`));
    }
  }, [language]);

  // Queue a text for background translation (batched)
  const queueTranslation = useCallback(
    (englishText: string) => {
      const cacheKey = `${language}:${englishText}`;
      if (
        autoTranslateCache.has(cacheKey) ||
        pendingTranslations.has(cacheKey)
      ) {
        return;
      }

      pendingTranslations.add(cacheKey);
      batchQueueRef.current.push({ key: cacheKey, text: englishText });

      // Debounce: wait 100ms to batch multiple calls together
      if (batchTimerRef.current) clearTimeout(batchTimerRef.current);
      batchTimerRef.current = setTimeout(processBatch, 100);
    },
    [language, processBatch]
  );

  const t = useCallback(
    (key: string): string => {
      const localizedValue = translations[language]?.[key];
      const englishValue = translations["en"]?.[key] || key;

      // Language is English — return directly
      if (language === "en") return englishValue;

      // Has a hardcoded translation that differs from English — use it
      if (localizedValue && localizedValue !== englishValue) {
        return localizedValue;
      }

      // Check auto-translation cache
      const cacheKey = `${language}:${englishValue}`;
      const cached = autoTranslateCache.get(cacheKey);
      if (cached) return cached;

      // Queue background translation, return English as interim
      queueTranslation(englishValue);
      return englishValue;
    },
    [language, queueTranslation]
  );

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
