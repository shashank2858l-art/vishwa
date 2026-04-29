"use client";

import { useState, useCallback, useRef, useEffect } from "react";

/* ============================================
   GEMINI LIVE API — WebSocket Voice Hook
   Real-time bidirectional audio conversation
   ============================================ */

export interface TranscriptEntry {
  role: "user" | "ai";
  text: string;
}

export interface StructuredComplaint {
  category: string;
  priority: string;
  summary: string;
  location: string;
  original_text: string;
  translated_text: string;
  affected_people: number;
}

export type GeminiLiveStatus =
  | "idle"
  | "connecting"
  | "greeting"
  | "listening"
  | "ai_speaking"
  | "processing"
  | "done"
  | "error";

interface UseGeminiLiveReturn {
  status: GeminiLiveStatus;
  transcript: TranscriptEntry[];
  structuredResult: StructuredComplaint | null;
  detectedLanguage: string;
  error: string | null;
  start: (language: string, langCode: string, greeting: string) => void;
  stop: () => void;
  cancel: () => void;
}

/* Convert Float32 PCM to 16-bit PCM base64 */
function float32ToBase64PCM16(float32: Float32Array): string {
  const int16 = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const bytes = new Uint8Array(int16.buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/* Decode base64 PCM16 to Float32 for playback */
function base64PCM16ToFloat32(base64: string): Float32Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const int16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / (int16[i] < 0 ? 0x8000 : 0x7fff);
  }
  return float32;
}

const SYSTEM_PROMPT = (language: string) => `You are a civic complaint assistant for a government grievance platform called VISHWAS in India.

CRITICAL RULES:
1. ALWAYS speak in ${language}. Every word you say must be in ${language}.
2. You are collecting details about a civic issue (water, roads, sanitation, etc).
3. Be warm, fast, and empathetic. Do NOT ask too many questions. 
4. Just ask for the core problem and the location. That is enough. 
5. DO NOT output any JSON formatting. DO NOT output backticks or structured data. Just converse naturally.
6. Keep your responses VERY SHORT (1-2 sentences maximum).
7. If the user mixes languages, still understand and respond in ${language}.`;

export function useGeminiLive(): UseGeminiLiveReturn {
  const [status, setStatus] = useState<GeminiLiveStatus>("idle");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [structuredResult, setStructuredResult] = useState<StructuredComplaint | null>(null);
  const [detectedLanguage, setDetectedLanguage] = useState<string>("Hindi");
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const playbackCtxRef = useRef<AudioContext | null>(null);
  const nextPlayTimeRef = useRef(0);
  const aiTextBuffer = useRef<string>("");
  const isStoppedRef = useRef(false);

  /* Cleanup all resources */
  const cleanup = useCallback(() => {
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      wsRef.current = null;
    }
  }, []);

  /* Play AI audio response */
  const playAudioChunk = useCallback((base64Audio: string) => {
    try {
      if (!playbackCtxRef.current || playbackCtxRef.current.state === "closed") {
        playbackCtxRef.current = new AudioContext({ sampleRate: 24000 });
        nextPlayTimeRef.current = playbackCtxRef.current.currentTime;
      }
      const ctx = playbackCtxRef.current;
      const float32 = base64PCM16ToFloat32(base64Audio);
      const buffer = ctx.createBuffer(1, float32.length, 24000);
      buffer.copyToChannel(new Float32Array(float32), 0);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      
      if (nextPlayTimeRef.current < ctx.currentTime) {
        nextPlayTimeRef.current = ctx.currentTime;
      }
      source.start(nextPlayTimeRef.current);
      nextPlayTimeRef.current += buffer.duration;
    } catch {
      // Audio playback errors are non-critical
    }
  }, []);



  /* Parse structured result from AI text */
  const tryParseStructured = useCallback((text: string) => {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        setStructuredResult(parsed as StructuredComplaint);
        setStatus("done");
        cleanup();
        return true;
      } catch {
        // JSON parse failed, continue conversation
      }
    }
    return false;
  }, [cleanup]);

  /* Start microphone capture — stored as ref to avoid hook dep issues */
  const startMicrophoneRef = useRef(async (ws: WebSocket) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { sampleRate: 16000, channelCount: 1, echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;

      const audioCtx = new AudioContext({ sampleRate: 16000 });
      audioCtxRef.current = audioCtx;

      await audioCtx.audioWorklet.addModule("/pcm-processor.js");

      const source = audioCtx.createMediaStreamSource(stream);
      const workletNode = new AudioWorkletNode(audioCtx, "pcm-processor");
      workletNodeRef.current = workletNode;

      workletNode.port.onmessage = (event: MessageEvent) => {
        if (event.data.type === "pcm_data" && ws.readyState === WebSocket.OPEN && !isStoppedRef.current) {
          const base64 = float32ToBase64PCM16(event.data.data);
          ws.send(JSON.stringify({
            realtimeInput: {
              mediaChunks: [{ mimeType: "audio/pcm;rate=16000", data: base64 }],
            },
          }));
        }
      };

      source.connect(workletNode);
      workletNode.connect(audioCtx.destination);
      setStatus("listening");
    } catch {
      setError("Microphone access denied. You can still type your complaint.");
    }
  });

  /* Start a session */
  const start = useCallback(async (language: string, _langCode: string, greeting: string) => {
    isStoppedRef.current = false;
    setStatus("connecting");
    setError(null);
    setTranscript([]);
    setStructuredResult(null);
    setDetectedLanguage(language);
    aiTextBuffer.current = "";

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      setError("Gemini API key not configured. Add NEXT_PUBLIC_GEMINI_API_KEY to .env.local");
      setStatus("error");
      return;
    }

    try {
      const model = "gemini-2.5-flash-native-audio-preview-12-2025";
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket opened, sending setup...");
        ws.send(JSON.stringify({
          setup: {
            model: `models/${model}`,
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: "Aoede" }
                }
              }
            },
            systemInstruction: {
              parts: [{ text: SYSTEM_PROMPT(language) }],
            },
          },
        }));
      };

      ws.onmessage = async (event) => {
        if (isStoppedRef.current) return; // Prevent state overrides if already stopped
        try {
          let rawText = "";
          if (event.data instanceof Blob) {
            rawText = await event.data.text();
          } else if (typeof event.data === "string") {
            rawText = event.data;
          } else {
            return; // Unknown data type
          }

          const msg = JSON.parse(rawText);

          if (msg.setupComplete) {
            setStatus("greeting");
            ws.send(JSON.stringify({
              clientContent: {
                turns: [{ role: "user", parts: [{ text: `Say EXACTLY this phrase in ${language} and absolutely nothing else: "${greeting}". Then wait for me.` }] }],
                turnComplete: true,
              },
            }));
            setTimeout(() => startMicrophoneRef.current(ws), 500);
            return;
          }

          if (msg.serverContent) {
            const parts = msg.serverContent?.modelTurn?.parts;
            if (parts) {
              for (const part of parts) {
                if (part.text) {
                  aiTextBuffer.current += part.text;
                  const cleanText = part.text.replace(/```json[\s\S]*?```/gi, "").trim();
                  if (cleanText) {
                    setTranscript((prev) => {
                      const last = prev[prev.length - 1];
                      if (last && last.role === "ai") {
                        return [...prev.slice(0, -1), { role: "ai", text: last.text + cleanText }];
                      }
                      return [...prev, { role: "ai", text: cleanText }];
                    });
                  }
                  setStatus("ai_speaking");
                }
                if (part.inlineData?.data) {
                  playAudioChunk(part.inlineData.data);
                  setStatus("ai_speaking");
                }
              }
            }

            if (msg.serverContent?.turnComplete) {
              aiTextBuffer.current = "";
              if (!isStoppedRef.current) {
                setStatus("listening");
              }
            }
          }
        } catch {
          // Message parse error, non-critical
        }
      };

      ws.onerror = () => {
        setError("Connection to AI failed. Please check your internet and try again.");
        setStatus("error");
        cleanup();
      };

      ws.onclose = (event) => {
        console.log(`Gemini WebSocket closed: code=${event.code}, reason=${event.reason}`);
        if (!isStoppedRef.current) {
          if (event.code !== 1000) {
            setError(`Connection closed (${event.code}). Please try again.`);
            setStatus("error");
          } else {
            setStatus("idle");
          }
        }
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start AI session");
      setStatus("error");
    }
  }, [cleanup]);

  /* Stop session — triggers JSON generation via REST API for reliability */
  const stop = useCallback(async () => {
    if (isStoppedRef.current) return;
    isStoppedRef.current = true;
    setStatus("processing");
    
    // 1. Close the WebSocket immediately to stop audio
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }

    // 2. Format the transcript for the REST API
    const conversationHistory = transcript.map(t => `${t.role === "user" ? "Citizen" : "Assistant"}: ${t.text}`).join("\n");
    
    if (!conversationHistory.trim()) {
      cleanup();
      setStatus("done");
      return;
    }

    // 3. Call standard Gemini 2.5 Flash via REST for reliable JSON extraction
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    try {
      const requestBody = JSON.stringify({
        systemInstruction: {
          parts: [{ text: "You are an expert civic data extractor. Read the transcript and output a JSON block matching the requested schema. Do NOT output anything outside the JSON block. Crucially, you must heavily optimize the 'translated_text' field to be a perfectly structured, highly professional, grammatically correct English sentence that clearly states the Citizen's exact problem and request." }]
        },
        contents: [{
          role: "user",
          parts: [{ text: `Analyze this conversation between a citizen and a civic assistant:\n\n${conversationHistory}\n\nOutput EXACTLY this JSON block:\n\`\`\`json\n{ "category": "<one of: water, roads, sanitation, harassment, corruption, ration, safety, abuse, other>", "priority": "<one of: low, medium, high, critical>", "summary": "<2-3 sentence English summary>", "location": "<location mentioned, or unknown>", "original_text": "<citizen's problem in original language>", "translated_text": "<A highly professional, well-structured English sentence formally describing the citizen's problem and request. Optimise the input heavily.>", "affected_people": <estimated number or 1> }\n\`\`\`` }]
        }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json"
        }
      });

      // Retry with exponential backoff and fallback model for high-demand (503) / rate-limit (429) errors
      const MAX_RETRIES = 5;
      let response: Response | null = null;
      let data: Record<string, unknown> | null = null;

      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        // Fallback to 2.5-flash-lite if 2.5-flash is consistently busy/rate-limited
        const modelToUse = attempt >= 2 ? "gemini-2.5-flash-lite" : "gemini-2.5-flash";
        
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody
        });

        data = await response.json();

        if (response.ok) break; // Success — exit retry loop

        if ((response.status === 503 || response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
          const backoffMs = Math.pow(2, attempt + 1) * 1000; // 2s, 4s, 8s, 16s, 32s
          console.warn(`Gemini API error (${response.status}) with ${modelToUse}. Retrying in ${backoffMs / 1000}s... (attempt ${attempt + 1}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, backoffMs));
          continue;
        }
        
        break; // Non-retryable error or retries exhausted
      }

      if (!response?.ok) {
        const errorMessage = (data as { error?: { message?: string } })?.error?.message || `API request failed with status ${response?.status}`;
        setError(`Failed to generate final report: ${errorMessage}`);
        setStatus("error");
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const textResponse = (data as any)?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (!textResponse) {
        setError("Empty response from AI. Possible safety block.");
        setStatus("error");
        return;
      }
      
      let parsed: unknown;
      try {
        // Handle both plain JSON and markdown-wrapped JSON
        const cleanText = textResponse.replace(/```(?:json)?\s*([\s\S]*?)\s*```/g, '$1').trim();
        parsed = JSON.parse(cleanText);
        setStructuredResult(parsed as StructuredComplaint);
        setStatus("done");
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, textResponse);
        setError("AI output was not valid JSON");
        setStatus("error");
      }
    } catch (e) {
      console.error("Network Error:", e);
      setError("Network error while generating report.");
      setStatus("error");
    } finally {
      cleanup();
    }
  }, [transcript, cleanup]);

  /* Cancel — discard everything */
  const cancel = useCallback(() => {
    isStoppedRef.current = true;
    cleanup();
    setStatus("idle");
    setTranscript([]);
    setStructuredResult(null);
    setError(null);
  }, [cleanup]);

  /* Cleanup on unmount */
  useEffect(() => {
    return () => {
      isStoppedRef.current = true;
      cleanup();
    };
  }, [cleanup]);

  return {
    status,
    transcript,
    structuredResult,
    detectedLanguage,
    error,
    start,
    stop,
    cancel,
  };
}
