"use client";

import { useState, useCallback, useRef, useEffect } from "react";

/* ============================================
   DEMO FALLBACK TRANSCRIPTS
   ============================================ */

const DEMO_TRANSCRIPTS = [
  "There has been no water supply in our ward for the last three days. More than 200 families are affected. We have complained to the local office but nobody is listening. Children are falling sick because of dirty water from the well.",
  "The main road near the government school has a huge pothole. Two people got injured last week. The road was supposed to be repaired three months ago but nothing has happened. It is very dangerous especially at night.",
  "The ration shop owner is asking for fifty rupees extra per card. He says if we don't pay he will mark us absent. This has been happening for three months. Many families are not getting their full ration.",
  "There is garbage piled up near the community hall for over two weeks. It is causing bad smell and mosquitoes. Many children in the area have fever. The sweeper has not come even once.",
  "The BDO office is asking for five hundred rupees bribe for issuing a caste certificate. My father went three times but they keep asking for money. Without the certificate my college admission is stuck.",
];

/* ============================================
   SPEECH RECOGNITION HOOK
   ============================================ */

interface SpeechRecognitionState {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
  isFallback: boolean;
}

interface UseSpeechRecognitionReturn extends SpeechRecognitionState {
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useSpeechRecognition(lang: string = "en-IN"): UseSpeechRecognitionReturn {
  const [state, setState] = useState<SpeechRecognitionState>({
    transcript: "",
    interimTranscript: "",
    isListening: false,
    isSupported: false,
    error: null,
    isFallback: false,
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  /* Check support on mount */
  useEffect(() => {
    const SpeechRecognition =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState((prev) => ({ ...prev, isSupported: !!SpeechRecognition }));
  }, []);

  /* Fallback: simulate recording then fill demo transcript */
  const startFallback = useCallback(() => {
    const randomTranscript =
      DEMO_TRANSCRIPTS[Math.floor(Math.random() * DEMO_TRANSCRIPTS.length)];

    setState((prev) => ({
      ...prev,
      isListening: true,
      isFallback: true,
      error: null,
      interimTranscript: "",
    }));

    // Simulate word-by-word reveal over 3 seconds
    const words = randomTranscript.split(" ");
    let currentIndex = 0;
    const interval = 3000 / words.length;

    fallbackTimerRef.current = setInterval(() => {
      currentIndex++;
      setState((prev) => ({
        ...prev,
        interimTranscript: words.slice(0, currentIndex).join(" "),
      }));

      if (currentIndex >= words.length) {
        if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current);
        setState((prev) => ({
          ...prev,
          transcript: prev.transcript + randomTranscript + " ",
          interimTranscript: "",
          isListening: false,
        }));
      }
    }, interval);
  }, []);

  /* Start listening */
  const startListening = useCallback(() => {
    const SpeechRecognition =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = lang;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let interim = "";
          let final = "";
          for (let i = 0; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              final += result[0].transcript + " ";
            } else {
              interim += result[0].transcript;
            }
          }
          setState((prev) => ({
            ...prev,
            transcript: prev.transcript + final,
            interimTranscript: interim,
          }));
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          if (event.error === "not-allowed" || event.error === "service-not-available") {
            // Fall back to simulated
            startFallback();
          } else {
            setState((prev) => ({
              ...prev,
              error: `Speech recognition error: ${event.error}`,
              isListening: false,
            }));
          }
        };

        recognition.onend = () => {
          setState((prev) => ({ ...prev, isListening: false }));
        };

        recognition.start();
        recognitionRef.current = recognition;
        setState((prev) => ({
          ...prev,
          isListening: true,
          error: null,
          isFallback: false,
        }));
      } catch {
        startFallback();
      }
    } else {
      startFallback();
    }
  }, [lang, startFallback]);

  /* Stop listening */
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (fallbackTimerRef.current) {
      clearInterval(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    setState((prev) => ({
      ...prev,
      isListening: false,
      // Move interim to final on stop
      transcript: prev.interimTranscript
        ? prev.transcript + prev.interimTranscript + " "
        : prev.transcript,
      interimTranscript: "",
    }));
  }, []);

  /* Reset */
  const resetTranscript = useCallback(() => {
    setState((prev) => ({
      ...prev,
      transcript: "",
      interimTranscript: "",
      error: null,
    }));
  }, []);

  /* Cleanup */
  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (fallbackTimerRef.current) clearInterval(fallbackTimerRef.current);
    };
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript,
  };
}
