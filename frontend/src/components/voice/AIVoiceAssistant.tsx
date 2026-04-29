"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Loader2,
  X,
  CheckCircle2,
  Globe,
  MessageSquare,
  Bot,
  User,
  Send,
  Volume2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useGeminiLive, type GeminiLiveStatus, type TranscriptEntry, type StructuredComplaint } from "@/hooks/useGeminiLive";
import { useGeoLanguage } from "@/hooks/useGeoLanguage";

/* ============================================
   AI LANGUAGE OPTIONS
   Available languages for the AI Voice Assistant.
   Location tracking (useGeoLanguage) is NOT modified.
   This only overrides the language sent to Gemini.
   ============================================ */

interface AILanguageOption {
  language: string;
  langCode: string;
  greeting: string;
  localName: string;
}

const AI_LANGUAGES: AILanguageOption[] = [
  { language: "English", langCode: "en-IN", greeting: "Hello! Please describe your issue.", localName: "English" },
  { language: "Hindi", langCode: "hi-IN", greeting: "नमस्ते, अपनी समस्या बताइए।", localName: "हिंदी" },
  { language: "Kannada", langCode: "kn-IN", greeting: "ನಮಸ್ಕಾರ, ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಹೇಳಿ.", localName: "ಕನ್ನಡ" },
  { language: "Telugu", langCode: "te-IN", greeting: "నమస్కారం, మీ సమస్యను చెప్పండి.", localName: "తెలుగు" },
  { language: "Tamil", langCode: "ta-IN", greeting: "வணக்கம், உங்கள் பிரச்சினையை சொல்லுங்கள்.", localName: "தமிழ்" },
  { language: "Malayalam", langCode: "ml-IN", greeting: "നമസ്കാരം, നിങ്ങളുടെ പ്രശ്നം പറയൂ.", localName: "മലയാളം" },
  { language: "Marathi", langCode: "mr-IN", greeting: "नमस्कार, तुमची समस्या सांगा.", localName: "मराठी" },
  { language: "Gujarati", langCode: "gu-IN", greeting: "નમસ્તે, તમારી સમસ્યા જણાવો.", localName: "ગુજરાતી" },
  { language: "Bengali", langCode: "bn-IN", greeting: "নমস্কার, আপনার সমস্যা বলুন।", localName: "বাংলা" },
  { language: "Punjabi", langCode: "pa-IN", greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਆਪਣੀ ਸਮੱਸਿਆ ਦੱਸੋ।", localName: "ਪੰਜਾਬੀ" },
  { language: "Odia", langCode: "or-IN", greeting: "ନମସ୍କାର, ଆପଣଙ୍କ ସମସ୍ୟା କୁହନ୍ତୁ।", localName: "ଓଡ଼ିଆ" },
];

/* ============================================
   STATUS LABEL MAP
   ============================================ */

const STATUS_LABELS: Record<GeminiLiveStatus, string> = {
  idle: "Ready to listen",
  connecting: "Connecting to AI...",
  greeting: "AI is greeting you...",
  listening: "Listening... Speak now",
  ai_speaking: "AI is speaking...",
  processing: "Processing your complaint...",
  done: "Complaint ready!",
  error: "Something went wrong",
};

const STATUS_COLORS: Record<GeminiLiveStatus, string> = {
  idle: "text-text-muted",
  connecting: "text-warning",
  greeting: "text-accent",
  listening: "text-success",
  ai_speaking: "text-accent",
  processing: "text-warning",
  done: "text-success",
  error: "text-danger",
};

/* ============================================
/* Pre-computed wave seed values (deterministic — no Math.random) */
const WAVE_SEEDS = [
  { heightMid: 24, dur: 0.60 },
  { heightMid: 30, dur: 0.68 },
  { heightMid: 20, dur: 0.76 },
  { heightMid: 34, dur: 0.84 },
  { heightMid: 26, dur: 0.72 },
];

function VoiceWaves({ active }: { active: boolean }) {
  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {WAVE_SEEDS.map((seed, i) => (
        <motion.div
          key={i}
          className="w-1 bg-accent rounded-full"
          animate={
            active
              ? {
                  height: [8, seed.heightMid, 8],
                  opacity: [0.4, 1, 0.4],
                }
              : { height: 4, opacity: 0.2 }
          }
          transition={
            active
              ? {
                  duration: seed.dur,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: i * 0.1,
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}

/* ============================================
   TRANSCRIPT BUBBLE
   ============================================ */

function TranscriptBubble({ entry }: { entry: TranscriptEntry }) {
  const isAI = entry.role === "ai";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn("flex gap-3 max-w-[90%]", isAI ? "self-start" : "self-end flex-row-reverse")}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
          isAI ? "bg-accent/10" : "bg-bg-elevated"
        )}
      >
        {isAI ? <Bot size={16} className="text-accent" /> : <User size={16} className="text-text-secondary" />}
      </div>
      <div
        className={cn(
          "px-4 py-3 rounded-2xl text-sm leading-relaxed",
          isAI
            ? "bg-accent/10 border border-accent/20 text-text-primary rounded-tl-sm"
            : "bg-bg-elevated border border-border text-text-primary rounded-tr-sm"
        )}
      >
        {entry.text}
      </div>
    </motion.div>
  );
}

/* ============================================
   STRUCTURED RESULT PREVIEW
   ============================================ */

function ResultPreview({ result }: { result: StructuredComplaint }) {
  const priorityColors: Record<string, string> = {
    critical: "text-danger bg-danger/10",
    high: "text-warning bg-warning/10",
    medium: "text-accent bg-accent/10",
    low: "text-text-muted bg-bg-elevated",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 mt-4"
    >
      <div className="flex items-center gap-2">
        <CheckCircle2 size={20} className="text-success" />
        <span className="font-bold text-text-primary">Complaint Captured Successfully</span>
      </div>
      <Card variant="outline" padding="md" className="space-y-3 border-success/30 bg-success/5">
        <div className="flex flex-wrap gap-2">
          <Badge variant="accent" size="sm" className="capitalize">{result.category}</Badge>
          <Badge variant="outline" size="sm" className={cn("capitalize", priorityColors[result.priority] || "")}>
            {result.priority} Priority
          </Badge>
        </div>
        <p className="text-sm text-text-primary leading-relaxed font-medium">{result.summary}</p>
        {result.location && (
          <p className="text-xs text-text-secondary">📍 {result.location}</p>
        )}
        {result.translated_text && (
          <div className="mt-2 p-3 bg-bg-primary rounded-lg border border-border">
            <p className="text-xs text-text-muted mb-1">English Translation:</p>
            <p className="text-sm text-text-secondary">{result.translated_text}</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

/* ============================================
   LANGUAGE SELECTOR DROPDOWN
   ============================================ */

function LanguageSelector({
  selected,
  onSelect,
  disabled,
}: {
  selected: AILanguageOption;
  onSelect: (lang: AILanguageOption) => void;
  disabled: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
          disabled
            ? "opacity-50 cursor-not-allowed bg-bg-surface border-border text-text-muted"
            : "bg-bg-surface border-border hover:border-accent hover:bg-accent/5 cursor-pointer text-text-primary"
        )}
      >
        <Globe size={12} className="text-accent" />
        <span>{selected.language}</span>
        {!disabled && <ChevronDown size={12} className={cn("transition-transform", isOpen && "rotate-180")} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-56 bg-white border border-border rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="py-1 max-h-64 overflow-y-auto">
              {AI_LANGUAGES.map((lang) => (
                <button
                  key={lang.langCode}
                  onClick={() => {
                    onSelect(lang);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors cursor-pointer",
                    selected.langCode === lang.langCode
                      ? "bg-accent/10 text-accent font-medium"
                      : "text-text-primary hover:bg-bg-elevated"
                  )}
                >
                  <span>{lang.language}</span>
                  <span className="text-xs text-text-muted">{lang.localName}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================
   MAIN COMPONENT: AIVoiceAssistant
   ============================================ */

interface AIVoiceAssistantProps {
  onComplete: (result: StructuredComplaint) => void;
  onCancel: () => void;
}

export function AIVoiceAssistant({ onComplete, onCancel }: AIVoiceAssistantProps) {
  const geo = useGeoLanguage();
  const gemini = useGeminiLive();
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  // Language override — defaults to geo-detected, user can change
  const [selectedLang, setSelectedLang] = useState<AILanguageOption | null>(null);

  // Sync geo detection to selected language (only on initial load)
  useEffect(() => {
    if (!geo.isLoading && !selectedLang) {
      const matched = AI_LANGUAGES.find((l) => l.langCode === geo.langCode);
      setSelectedLang(matched || AI_LANGUAGES.find((l) => l.language === geo.language) || AI_LANGUAGES[0]);
    }
  }, [geo.isLoading, geo.langCode, geo.language, selectedLang]);

  // Effective language values (use override if set, else geo)
  const effectiveLang = selectedLang || {
    language: geo.language,
    langCode: geo.langCode,
    greeting: geo.greeting,
    localName: geo.language,
  };

  /* Auto-scroll transcript container only */
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [gemini.transcript]);

  /* Start session handler — uses overridden language */
  const handleStart = () => {
    gemini.start(effectiveLang.language, effectiveLang.langCode, effectiveLang.greeting);
  };

  /* Use result automatically when ready */
  useEffect(() => {
    if (gemini.status === "done" && gemini.structuredResult) {
      onComplete(gemini.structuredResult);
    }
  }, [gemini.status, gemini.structuredResult, onComplete]);

  /* Manual Use result (fallback) */
  const handleUseResult = () => {
    if (gemini.structuredResult) {
      onComplete(gemini.structuredResult);
    }
  };

  const isActive = !["idle", "done", "error"].includes(gemini.status);
  const canChangeLang = gemini.status === "idle";

  return (
    <Card variant="glass" padding="lg" className="relative overflow-hidden">
      {/* Ambient glow */}
      {isActive && (
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <Bot size={20} className="text-accent" />
          </div>
          <div>
            <p className="font-bold text-text-primary">AI Voice Assistant</p>
            <p className={cn("text-xs font-medium", STATUS_COLORS[gemini.status])}>
              {STATUS_LABELS[gemini.status]}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Language selector — editable only in idle state */}
          <LanguageSelector
            selected={effectiveLang}
            onSelect={setSelectedLang}
            disabled={!canChangeLang}
          />
          {/* Close button */}
          {gemini.status !== "idle" && (
            <button
              onClick={() => { gemini.cancel(); onCancel(); }}
              className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center hover:bg-danger/10 transition-colors cursor-pointer"
            >
              <X size={16} className="text-text-muted" />
            </button>
          )}
        </div>
      </div>

      {/* ===== IDLE STATE — Big Start Button ===== */}
      {gemini.status === "idle" && (
        <div className="text-center py-8">
          <motion.button
            onClick={handleStart}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-accent to-accent/70 text-white flex items-center justify-center mx-auto shadow-[0_0_60px_rgba(var(--accent-rgb),0.3)] hover:shadow-[0_0_80px_rgba(var(--accent-rgb),0.5)] transition-all cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mic size={48} />
          </motion.button>
          <p className="mt-6 text-lg font-bold text-text-primary">
            Speak Your Complaint
          </p>
          <p className="text-sm text-text-secondary mt-1">
            AI will talk with you in <span className="font-semibold text-accent">{effectiveLang.language}</span>
          </p>
          <p className="text-xs text-text-muted mt-4">
            📍 {geo.state} • 🔒 Anonymous • 🎤 Voice not stored
          </p>
        </div>
      )}

      {/* ===== ACTIVE CONVERSATION ===== */}
      {isActive && (
        <div className="space-y-4">
          {/* Voice waves */}
          <div className="flex flex-col items-center gap-2">
            <motion.div
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center",
                gemini.status === "listening"
                  ? "bg-success/10 border-2 border-success/30"
                  : gemini.status === "ai_speaking"
                  ? "bg-accent/10 border-2 border-accent/30"
                  : "bg-warning/10 border-2 border-warning/30"
              )}
              animate={
                gemini.status === "listening"
                  ? { boxShadow: ["0 0 0 0 rgba(34,197,94,0)", "0 0 0 20px rgba(34,197,94,0)"] }
                  : {}
              }
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {gemini.status === "connecting" || gemini.status === "processing" ? (
                <Loader2 size={28} className="text-warning animate-spin" />
              ) : gemini.status === "ai_speaking" || gemini.status === "greeting" ? (
                <Volume2 size={28} className="text-accent animate-pulse" />
              ) : (
                <Mic size={28} className="text-success" />
              )}
            </motion.div>
            <VoiceWaves active={gemini.status === "listening" || gemini.status === "ai_speaking"} />
          </div>

          {/* Transcript area */}
          <div 
            ref={transcriptContainerRef}
            className="max-h-60 overflow-y-auto space-y-3 flex flex-col p-3 rounded-xl bg-bg-primary border border-border"
          >
            {gemini.transcript.length === 0 && (
              <p className="text-center text-sm text-text-muted py-4">
                <MessageSquare size={16} className="inline mr-1" />
                Conversation will appear here...
              </p>
            )}
            <AnimatePresence>
              {gemini.transcript.map((entry, idx) => (
                <TranscriptBubble key={idx} entry={entry} />
              ))}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="danger"
              size="md"
              icon={<X size={16} />}
              onClick={() => { gemini.cancel(); onCancel(); }}
              disabled={gemini.status === "processing"}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={gemini.status === "processing" ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              onClick={gemini.stop}
              disabled={gemini.status === "processing"}
            >
              {gemini.status === "processing" ? "Processing..." : "End & Submit"}
            </Button>
          </div>
        </div>
      )}

      {/* ===== DONE STATE — Show Result ===== */}
      {gemini.status === "done" && gemini.structuredResult && (
        <div>
          <ResultPreview result={gemini.structuredResult} />
          <div className="flex items-center justify-center gap-3 mt-6">
            <Button variant="secondary" size="md" onClick={() => { gemini.cancel(); onCancel(); }}>
              Discard
            </Button>
            <Button variant="primary" size="lg" icon={<CheckCircle2 size={18} />} onClick={handleUseResult}>
              Use This & Submit
            </Button>
          </div>
        </div>
      )}

      {/* ===== DONE BUT NO RESULT — fallback ===== */}
      {gemini.status === "done" && !gemini.structuredResult && gemini.transcript.length > 0 && (
        <div className="text-center py-6">
          <p className="text-sm text-text-secondary mb-4">
            AI could not extract a structured complaint. The conversation transcript is available.
          </p>
          <Button variant="primary" size="md" onClick={() => {
            const userTexts = gemini.transcript.filter(t => t.role === "user").map(t => t.text).join(" ");
            onComplete({
              category: "other",
              priority: "medium",
              summary: userTexts.slice(0, 500),
              location: "",
              original_text: userTexts,
              translated_text: userTexts,
              affected_people: 1,
            });
          }}>
            Use Transcript Anyway
          </Button>
        </div>
      )}

      {/* ===== ERROR STATE ===== */}
      {gemini.status === "error" && (
        <div className="text-center py-6">
          <p className="text-sm text-danger mb-4">{gemini.error}</p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="secondary" size="md" onClick={onCancel}>Go Back</Button>
            <Button variant="primary" size="md" onClick={handleStart}>Retry</Button>
          </div>
        </div>
      )}
    </Card>
  );
}
