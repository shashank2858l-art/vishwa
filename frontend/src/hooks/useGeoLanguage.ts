"use client";

import { useState, useEffect } from "react";

/* ============================================
   INDIAN STATE → LANGUAGE MAP (Offline)
   ============================================ */

interface StateLanguage {
  state: string;
  language: string;
  langCode: string;
  greeting: string;
}

const STATE_LANGUAGE_MAP: Record<string, StateLanguage> = {
  karnataka: { state: "Karnataka", language: "Kannada", langCode: "kn-IN", greeting: "ನಮಸ್ಕಾರ, ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಹೇಳಿ." },
  "tamil nadu": { state: "Tamil Nadu", language: "Tamil", langCode: "ta-IN", greeting: "வணக்கம், உங்கள் பிரச்சினையை சொல்லுங்கள்." },
  kerala: { state: "Kerala", language: "Malayalam", langCode: "ml-IN", greeting: "നമസ്കാരം, നിങ്ങളുടെ പ്രശ്നം പറയൂ." },
  "andhra pradesh": { state: "Andhra Pradesh", language: "Telugu", langCode: "te-IN", greeting: "నమస్కారం, మీ సమస్యను చెప్పండి." },
  telangana: { state: "Telangana", language: "Telugu", langCode: "te-IN", greeting: "నమస్కారం, మీ సమస్యను చెప్పండి." },
  maharashtra: { state: "Maharashtra", language: "Marathi", langCode: "mr-IN", greeting: "नमस्कार, तुमची समस्या सांगा." },
  "west bengal": { state: "West Bengal", language: "Bengali", langCode: "bn-IN", greeting: "নমস্কার, আপনার সমস্যা বলুন।" },
  gujarat: { state: "Gujarat", language: "Gujarati", langCode: "gu-IN", greeting: "નમસ્તે, તમારી સમસ્યા જણાવો." },
  punjab: { state: "Punjab", language: "Punjabi", langCode: "pa-IN", greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਆਪਣੀ ਸਮੱਸਿਆ ਦੱਸੋ।" },
  odisha: { state: "Odisha", language: "Odia", langCode: "or-IN", greeting: "ନମସ୍କାର, ଆପଣଙ୍କ ସମସ୍ୟା କୁହନ୍ତୁ।" },
  assam: { state: "Assam", language: "Assamese", langCode: "as-IN", greeting: "নমস্কাৰ, আপোনাৰ সমস্যা কওক।" },
  rajasthan: { state: "Rajasthan", language: "Hindi", langCode: "hi-IN", greeting: "नमस्ते, अपनी समस्या बताइए।" },
  "uttar pradesh": { state: "Uttar Pradesh", language: "Hindi", langCode: "hi-IN", greeting: "नमस्ते, अपनी समस्या बताइए।" },
  "madhya pradesh": { state: "Madhya Pradesh", language: "Hindi", langCode: "hi-IN", greeting: "नमस्ते, अपनी समस्या बताइए।" },
  bihar: { state: "Bihar", language: "Hindi", langCode: "hi-IN", greeting: "नमस्ते, अपनी समस्या बताइए।" },
  jharkhand: { state: "Jharkhand", language: "Hindi", langCode: "hi-IN", greeting: "नमस्ते, अपनी समस्या बताइए।" },
  chhattisgarh: { state: "Chhattisgarh", language: "Hindi", langCode: "hi-IN", greeting: "नमस्ते, अपनी समस्या बताइए।" },
  uttarakhand: { state: "Uttarakhand", language: "Hindi", langCode: "hi-IN", greeting: "नमस्ते, अपनी समस्या बताइए।" },
  haryana: { state: "Haryana", language: "Hindi", langCode: "hi-IN", greeting: "नमस्ते, अपनी समस्या बताइए।" },
  "himachal pradesh": { state: "Himachal Pradesh", language: "Hindi", langCode: "hi-IN", greeting: "नमस्ते, अपनी समस्या बताइए।" },
  delhi: { state: "Delhi", language: "Hindi", langCode: "hi-IN", greeting: "नमस्ते, अपनी समस्या बताइए।" },
  goa: { state: "Goa", language: "Konkani", langCode: "hi-IN", greeting: "नमस्कार, तुमची समस्या सांगा." },
};

/* Rough bounding boxes for major Indian states (lat/lng) */
interface BBox { minLat: number; maxLat: number; minLng: number; maxLng: number; state: string }

const STATE_BBOXES: BBox[] = [
  { state: "karnataka", minLat: 11.5, maxLat: 18.5, minLng: 74.0, maxLng: 78.5 },
  { state: "tamil nadu", minLat: 8.0, maxLat: 13.6, minLng: 76.2, maxLng: 80.4 },
  { state: "kerala", minLat: 8.2, maxLat: 12.8, minLng: 74.8, maxLng: 77.4 },
  { state: "andhra pradesh", minLat: 12.6, maxLat: 19.9, minLng: 76.7, maxLng: 84.8 },
  { state: "telangana", minLat: 15.8, maxLat: 19.9, minLng: 77.2, maxLng: 81.3 },
  { state: "maharashtra", minLat: 15.6, maxLat: 22.1, minLng: 72.6, maxLng: 80.9 },
  { state: "west bengal", minLat: 21.5, maxLat: 27.2, minLng: 85.8, maxLng: 89.9 },
  { state: "gujarat", minLat: 20.1, maxLat: 24.7, minLng: 68.1, maxLng: 74.5 },
  { state: "punjab", minLat: 29.5, maxLat: 32.5, minLng: 73.8, maxLng: 76.9 },
  { state: "odisha", minLat: 17.8, maxLat: 22.6, minLng: 81.3, maxLng: 87.5 },
  { state: "rajasthan", minLat: 23.0, maxLat: 30.2, minLng: 69.5, maxLng: 78.3 },
  { state: "uttar pradesh", minLat: 23.8, maxLat: 30.4, minLng: 77.0, maxLng: 84.6 },
  { state: "madhya pradesh", minLat: 21.0, maxLat: 26.9, minLng: 74.0, maxLng: 82.8 },
  { state: "bihar", minLat: 24.2, maxLat: 27.5, minLng: 83.3, maxLng: 88.2 },
  { state: "delhi", minLat: 28.4, maxLat: 28.9, minLng: 76.8, maxLng: 77.4 },
  { state: "assam", minLat: 24.1, maxLat: 28.0, minLng: 89.7, maxLng: 96.0 },
  { state: "haryana", minLat: 27.6, maxLat: 30.9, minLng: 74.5, maxLng: 77.6 },
];

const HINDI_DEFAULT: StateLanguage = {
  state: "India",
  language: "Hindi",
  langCode: "hi-IN",
  greeting: "नमस्ते, अपनी समस्या बताइए।",
};

const ENGLISH_FALLBACK: StateLanguage = {
  state: "Unknown",
  language: "English",
  langCode: "en-IN",
  greeting: "Hello! Please describe your issue.",
};

function detectStateFromCoords(lat: number, lng: number): string | null {
  for (const bbox of STATE_BBOXES) {
    if (lat >= bbox.minLat && lat <= bbox.maxLat && lng >= bbox.minLng && lng <= bbox.maxLng) {
      return bbox.state;
    }
  }
  return null;
}

export interface GeoLanguageResult {
  state: string;
  language: string;
  langCode: string;
  greeting: string;
  isLoading: boolean;
  error: string | null;
}

export function useGeoLanguage(): GeoLanguageResult {
  const [result, setResult] = useState<GeoLanguageResult>(() => ({
    ...HINDI_DEFAULT,
    isLoading: typeof window !== "undefined" && !!navigator.geolocation,
    error: typeof window !== "undefined" && !navigator.geolocation ? "Geolocation not supported" : null,
  }));

  useEffect(() => {
    if (!navigator.geolocation) return;

    let cancelled = false;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (cancelled) return;
        const { latitude, longitude } = position.coords;
        const stateKey = detectStateFromCoords(latitude, longitude);
        if (stateKey && STATE_LANGUAGE_MAP[stateKey]) {
          setResult({ ...STATE_LANGUAGE_MAP[stateKey], isLoading: false, error: null });
        } else {
          setResult({ ...HINDI_DEFAULT, isLoading: false, error: null });
        }
      },
      () => {
        if (cancelled) return;
        setResult({ ...HINDI_DEFAULT, isLoading: false, error: "Location access denied, using Hindi" });
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
    );

    return () => { cancelled = true; };
  }, []);

  return result;
}

/* Re-export for use in system prompt construction */
export { ENGLISH_FALLBACK };
