"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Type,
  ImagePlus,
  X,
  EyeOff,
  User,
  Users,
  ArrowRight,
  ArrowLeft,
  Send,
  AlertCircle,
  Droplets,
  Construction,
  Trash2,
  ShieldAlert,
  Scale,
  Wheat,
  Siren,
  HeartCrack,
  MessageCircleQuestion,
  Volume2,
  Bot,
  MapPin,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Input";
import { AIVoiceAssistant } from "@/components/voice/AIVoiceAssistant";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";
import { useI18n } from "@/lib/i18n/I18nContext";
import { useAuth } from "@/lib/auth/AuthContext";
import { complaintService } from "@/services/complaintService";
import { mapFrontendComplaintToApi } from "@/lib/apiTransformers";
import type { ComplaintCategory, ReportingMode, ProxyReporter } from "@/lib/types";

/* ============================================
   ICON MAP
   ============================================ */

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Droplets, Construction, Trash2, ShieldAlert, Scale, Wheat, Siren, HeartCrack, MessageCircleQuestion,
};

/* ============================================
   SUBMISSION PAGE — API Connected
   ============================================ */

type Step = "input" | "category" | "details" | "funding" | "review";

export default function SubmitPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  /* State */
  const [step, setStep] = useState<Step>("input");
  const [inputMode, setInputMode] = useState<"voice" | "text" | "ai_voice">("voice");
  const [complaintText, setComplaintText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ComplaintCategory | null>(null);
  const [reportingMode, setReportingMode] = useState<ReportingMode>("self");
  const [proxyDetails, setProxyDetails] = useState<ProxyReporter>({
    name: "",
    relationship: "",
    organization: "",
    contact: "",
  });
  const [locationData, setLocationData] = useState("");

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { t } = useI18n();

  /* Pre-fill from URL */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const textParam = params.get('text');
      if (textParam) {
        setComplaintText(textParam);
        setInputMode('text');
      }
    }
  }, []);

  /* Speech recognition */
  const speech = useSpeechRecognition("en-IN");
  
  /* Text to Speech */
  const tts = useTextToSpeech("en-IN");

  /* Combined transcript text */
  const fullText = speech.transcript + speech.interimTranscript;

  /* Sync speech to complaint text */
  const handleToggleRecording = useCallback(() => {
    if (speech.isListening) {
      speech.stopListening();
      setComplaintText((prev) => prev + speech.transcript + speech.interimTranscript);
    } else {
      speech.resetTranscript();
      speech.startListening();
    }
  }, [speech]);

  const handleSwitchToText = () => {
    if (speech.isListening) speech.stopListening();
    if (fullText) setComplaintText((prev) => prev || fullText.trim());
    setInputMode("text");
  };

  /* Navigation */
  const canProceedToCategory = complaintText.trim().length > 10 || fullText.trim().length > 10;
  const canProceedToDetails = !!selectedCategory;
  const canSubmit = canProceedToCategory && canProceedToDetails;

  const goNext = () => {
    if (step === "input") {
      if (inputMode === "voice" && fullText) setComplaintText(fullText.trim());
      setStep("category");
    } else if (step === "category") setStep("details");
    else if (step === "details") setStep("review");
  };

  const goBack = () => {
    if (step === "category") setStep("input");
    else if (step === "details") setStep("category");
    else if (step === "review") setStep("details");
  };

  /* Submit — API Connected */
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      let rawText = complaintText.trim();
      const category = selectedCategory || "other";

      // Build API payload
      const payload = mapFrontendComplaintToApi({
        rawText,
        category,
        reportingMode,
        location: locationData,
        proxyReporter: reportingMode === "proxy" ? proxyDetails : undefined,
      });

      let result: { id?: string; complaint_code?: string; pin_code?: string } | undefined;
      if (isAuthenticated && reportingMode !== "anonymous") {
        // Authenticated submission
        result = await complaintService.create(payload);
      } else {
        // Anonymous/unauthenticated submission — use public endpoint
        const { default: api } = await import("@/services/api");
        const res = await api.post("/complaints/submit-anonymous", payload);
        // api interceptor unwraps to response.data, which is { success, data, message }
        const body = res as unknown as { data?: typeof result; success?: boolean };
        result = body?.data ?? (body as typeof result);
      }

      // Upload media files if any
      if (selectedFiles.length > 0 && result?.id) {
        try {
          await complaintService.uploadProof(result.id, selectedFiles);
        } catch {
          // Non-critical — complaint is already created
          console.warn("Media upload failed, complaint was still submitted");
        }
      }

      // Navigate to processing page with complaint code
      const complaintCode = result?.complaint_code || result?.id || "";
      router.push(`/processing?id=${complaintCode}&pin=${result?.pin_code || ""}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* Steps indicator */
  const steps: { key: Step; label: string }[] = [
    { key: "input", label: t("submit.step.speak") },
    { key: "category", label: t("submit.step.category") },
    { key: "details", label: t("submit.step.details") },
    { key: "review", label: t("submit.step.submit") },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  const getStepInstructions = () => {
    switch (step) {
      case "input":
        return "Please speak or type your complaint. Tap the microphone button to start recording.";
      case "category":
        return "Please select the category that best matches your issue.";
      case "details":
        return "Please tell us if you are reporting for yourself, for someone else, or anonymously.";
      case "funding":
        return "Would you like to enable community funding to raise money for this issue?";
      case "review":
        return "Please review your complaint details. If everything is correct, tap submit.";
      default:
        return "";
    }
  };

  const handleReadAloud = () => {
    if (tts.isSpeaking) {
      tts.stop();
    } else {
      tts.speak(getStepInstructions());
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 relative"
        >
          {tts.isSupported && (
            <div className="absolute right-0 top-0">
              <Button
                variant={tts.isSpeaking ? "primary" : "secondary"}
                size="lg"
                icon={<Volume2 size={24} className={tts.isSpeaking ? "animate-pulse" : ""} />}
                onClick={handleReadAloud}
                className="rounded-full shadow-md"
              >
                {tts.isSpeaking ? "Stop" : "Read"}
              </Button>
            </div>
          )}
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">
            {t("submit.title")}
          </h1>
          <p className="text-text-secondary">
            {t("submit.subtitle")}
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  i <= currentStepIndex
                    ? "bg-accent text-text-inverse"
                    : "bg-bg-elevated text-text-muted"
                )}
              >
                {i + 1}
              </div>
              <span
                className={cn(
                  "text-sm hidden sm:inline",
                  i <= currentStepIndex ? "text-text-primary" : "text-text-muted"
                )}
              >
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "w-8 h-0.5",
                    i < currentStepIndex ? "bg-accent" : "bg-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          {/* ===== STEP 1: INPUT ===== */}
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Input mode toggle */}
              <div className="flex items-center justify-center gap-2 mb-8">
                <Button
                  variant={inputMode === "ai_voice" ? "primary" : "secondary"}
                  size="md"
                  icon={<Bot size={18} />}
                  onClick={() => setInputMode("ai_voice")}
                  className={inputMode === "ai_voice" ? "shadow-lg shadow-accent/20" : ""}
                >
                  AI Assistant
                </Button>
                <Button
                  variant={inputMode === "voice" ? "primary" : "secondary"}
                  size="md"
                  icon={<Mic size={18} />}
                  onClick={() => setInputMode("voice")}
                >
                  {t("submit.input.voice")}
                </Button>
                <Button
                  variant={inputMode === "text" ? "primary" : "secondary"}
                  size="md"
                  icon={<Type size={18} />}
                  onClick={handleSwitchToText}
                >
                  {t("submit.input.text")}
                </Button>
              </div>

              {inputMode === "ai_voice" ? (
                <AIVoiceAssistant
                  onComplete={(result: any) => {
                    // LLMs sometimes capitalize JSON keys, so we check both
                    const text = result.translated_text || result.Translated_Text || 
                               result.summary || result.Summary || 
                               result.original_text || result.Original_Text || 
                               "Issue reported via Voice Assistant.";
                    setComplaintText(text);
                    
                    const cat = String(result.category || result.Category || "other").toLowerCase();
                    if (["water","roads","sanitation","harassment","corruption","ration","safety","abuse","other"].includes(cat)) {
                      setSelectedCategory(cat as ComplaintCategory);
                    } else {
                      setSelectedCategory("other");
                    }
                    setStep("category");
                  }}
                  onCancel={() => setInputMode("voice")}
                />
              ) : inputMode === "voice" ? (
                <Card variant="glass" padding="lg" className="text-center">
                  {/* Mic button */}
                  <div className="flex justify-center mb-6">
                    <button
                      onClick={handleToggleRecording}
                      className={cn(
                        "w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer",
                        speech.isListening
                          ? "bg-danger animate-mic-pulse"
                          : "bg-accent/10 border-2 border-accent/30 hover:bg-accent/15"
                      )}
                    >
                      {speech.isListening ? (
                        <MicOff size={40} className="text-white" />
                      ) : (
                        <Mic size={40} className="text-accent" />
                      )}
                    </button>
                  </div>

                  <p className="text-xl font-bold mb-2 text-text-primary">
                    {speech.isListening ? "Listening... Tap to stop" : "Tap the mic and speak"}
                  </p>
                  <p className="text-base text-text-secondary mb-4 font-medium">
                    Speak in any language. Your voice is not stored.
                  </p>

                  {speech.isFallback && (
                    <Badge variant="warning" size="sm" className="mb-4">
                      Demo mode — simulated transcript
                    </Badge>
                  )}

                  {/* Transcript preview */}
                  {(speech.transcript || speech.interimTranscript) && (
                    <div className="mt-4 p-4 rounded-xl bg-bg-primary border border-border text-left">
                      <p className="text-sm text-text-secondary mb-1 font-medium">Transcript:</p>
                      <p className="text-text-primary leading-relaxed">
                        {speech.transcript}
                        <span className="text-text-muted">{speech.interimTranscript}</span>
                      </p>
                    </div>
                  )}

                  {speech.error && (
                    <div className="mt-4 flex items-center gap-2 text-danger text-sm">
                      <AlertCircle size={16} />
                      {speech.error}
                    </div>
                  )}
                </Card>
              ) : (
                <Card variant="glass" padding="lg">
                  <Textarea
                    label={t("submit.input.placeholder")}
                    placeholder="Tell us what happened. Include location, people affected, and how long this has been going on..."
                    value={complaintText}
                    onChange={(e) => setComplaintText(e.target.value)}
                    className="min-h-[200px]"
                    hint={`${complaintText.length} characters`}
                  />
                </Card>
              )}

              {/* Media upload */}
              <div className="relative mt-4">
                <Card variant="outline" padding="md" className="hover:border-accent transition-colors cursor-pointer">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*,video/*" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => {
                      if (e.target.files) {
                        setSelectedFiles(Array.from(e.target.files));
                      }
                    }}
                  />
                  <div className="flex items-center justify-between relative z-0">
                    <div className="flex items-center gap-3 text-text-secondary">
                      <ImagePlus size={20} className={selectedFiles.length > 0 ? "text-accent" : ""} />
                      <div>
                        <p className={`text-sm font-medium ${selectedFiles.length > 0 ? "text-accent" : ""}`}>
                          {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : t("submit.upload.title")}
                        </p>
                        <p className="text-xs text-text-muted truncate max-w-[200px] sm:max-w-[300px]">
                          {selectedFiles.length > 0 ? selectedFiles.map(f => f.name).join(", ") : t("submit.upload.subtitle")}
                        </p>
                      </div>
                    </div>
                    {selectedFiles.length > 0 && (
                      <button 
                        className="p-1 rounded-md hover:bg-bg-elevated text-text-muted hover:text-danger relative z-20"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedFiles([]);
                        }}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </Card>
              </div>

              {/* Next button */}
              <div className="flex justify-end mt-8">
                <Button 
                  size="xl" 
                  onClick={goNext} 
                  disabled={!canProceedToCategory}
                  icon={<ArrowRight size={24} />}
                  className="w-full sm:w-auto shadow-lg"
                >
                  Next Step
                </Button>
              </div>
            </motion.div>
          )}

          {/* ===== STEP 2: CATEGORY ===== */}
          {step === "category" && (
            <motion.div
              key="category"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-semibold mb-4 text-center">{t("submit.category.title")}</h2>
              <div className="grid grid-cols-3 gap-3">
                {CATEGORIES.map((cat) => {
                  const IconComponent = ICON_MAP[cat.icon];
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer",
                        isSelected
                          ? "border-accent bg-accent/10"
                          : "border-border bg-bg-surface hover:border-border-hover hover:bg-bg-elevated"
                      )}
                    >
                      {IconComponent && (
                        <IconComponent
                          size={28}
                          className={isSelected ? "text-accent" : cat.color}
                        />
                      )}
                      <span className={cn(
                        "text-sm font-medium",
                        isSelected ? "text-accent" : "text-text-primary"
                      )}>
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="ghost" size="lg" onClick={goBack} icon={<ArrowLeft size={18} />}>
                  {t("submit.btn.back")}
                </Button>
                <Button
                  size="lg"
                  disabled={!canProceedToDetails}
                  onClick={goNext}
                  iconRight={<ArrowRight size={18} />}
                >
                  {t("submit.btn.continue")}
                </Button>
              </div>
            </motion.div>
          )}

          {/* ===== STEP 3: DETAILS ===== */}
          {step === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-semibold mb-6 text-center">How would you like to report?</h2>

              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { mode: "self" as ReportingMode, icon: User, label: "Self", desc: "Your own identity" },
                  { mode: "anonymous" as ReportingMode, icon: EyeOff, label: "Anonymous", desc: "Identity hidden" },
                  { mode: "proxy" as ReportingMode, icon: Users, label: "Proxy", desc: "Report for someone" },
                ].map((opt) => (
                  <button
                    key={opt.mode}
                    onClick={() => setReportingMode(opt.mode)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer",
                      reportingMode === opt.mode
                        ? "border-accent bg-accent/10"
                        : "border-border bg-bg-surface hover:border-border-hover"
                    )}
                  >
                    <opt.icon size={24} className={reportingMode === opt.mode ? "text-accent" : "text-text-secondary"} />
                    <span className="text-sm font-medium">{opt.label}</span>
                    <span className="text-xs text-text-muted">{opt.desc}</span>
                  </button>
                ))}
              </div>

              {reportingMode === "anonymous" && (
                <Card variant="outline" padding="md" className="mb-6">
                  <div className="flex items-center gap-2 text-accent">
                    <EyeOff size={18} />
                    <p className="text-sm font-medium">Your identity will be completely hidden</p>
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    Only the complaint ID and PIN will be generated. No personal information is stored.
                  </p>
                </Card>
              )}

              {reportingMode === "proxy" && (
                <Card variant="outline" padding="md" className="mb-6 space-y-3">
                  <p className="text-sm font-medium text-text-primary mb-2">Proxy Reporter Details</p>
                  <Input
                    inputSize="lg"
                    label="Your Name"
                    placeholder="Name of the person filing"
                    value={proxyDetails.name}
                    onChange={(e) => setProxyDetails({ ...proxyDetails, name: e.target.value })}
                  />
                  <Input
                    inputSize="lg"
                    label="Relationship"
                    placeholder="e.g. NGO volunteer, family member"
                    value={proxyDetails.relationship}
                    onChange={(e) => setProxyDetails({ ...proxyDetails, relationship: e.target.value })}
                  />
                  <Input
                    inputSize="lg"
                    label="Organization (Optional)"
                    placeholder="e.g. Local NGO name"
                    value={proxyDetails.organization || ""}
                    onChange={(e) => setProxyDetails({ ...proxyDetails, organization: e.target.value })}
                  />
                </Card>
              )}

              <Card variant="outline" padding="md" className="mb-6 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-text-primary flex items-center gap-2">
                    <MapPin size={18} className="text-accent" /> Incident Location
                  </p>
                  {reportingMode === "anonymous" && (
                    <Badge variant="warning" size="sm">Privacy Protected</Badge>
                  )}
                </div>
                <p className="text-xs text-text-secondary mb-3">
                  {reportingMode === "anonymous" 
                    ? "Providing the location helps authorities find the issue. Your identity remains 100% hidden."
                    : "Please provide the exact address or landmark where the issue is located."}
                </p>
                <div className="relative">
                  <Input
                    inputSize="lg"
                    placeholder="Search for an address or area..."
                    value={locationData}
                    onChange={(e) => setLocationData(e.target.value)}
                    icon={<Search size={16} />}
                  />
                  {/* Mock Google Maps / Places Autocomplete visual indicator */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted font-medium bg-bg-surface px-1 pointer-events-none">
                    Map Search
                  </div>
                </div>
              </Card>

              <div className="mt-8 flex justify-between">
                <Button variant="ghost" size="lg" onClick={goBack} icon={<ArrowLeft size={18} />}>
                  Back
                </Button>
                <Button size="lg" onClick={goNext} iconRight={<ArrowRight size={18} />}>
                  Continue
                </Button>
              </div>
            </motion.div>
          )}



          {/* ===== STEP 4: REVIEW & SUBMIT ===== */}
          {step === "review" && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-semibold mb-6 text-center">Review & Submit</h2>

              <Card variant="glass" padding="lg" className="space-y-4">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide">Your Complaint</p>
                  <p className="text-text-primary mt-1 leading-relaxed">{complaintText}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wide">Category</p>
                    <Badge variant="accent" size="md" className="mt-1">
                      {CATEGORIES.find((c) => c.id === selectedCategory)?.label || "Other"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wide">Reporting As</p>
                    <Badge
                      variant={reportingMode === "anonymous" ? "warning" : "default"}
                      size="md"
                      className="mt-1"
                    >
                      {reportingMode === "anonymous" ? "🔒 Anonymous" : reportingMode === "proxy" ? `Proxy: ${proxyDetails.name}` : "Self"}
                    </Badge>
                  </div>
                </div>

                {reportingMode === "proxy" && proxyDetails.organization && (
                  <div>
                    <p className="text-xs text-text-muted">Organization: {proxyDetails.organization}</p>
                  </div>
                )}

              </Card>

              {!isAuthenticated && reportingMode !== "anonymous" && (
                <div className="mt-4 p-4 rounded-xl border border-warning/30 bg-warning/5">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={16} className="text-warning mt-0.5 shrink-0" />
                    <p className="text-sm text-text-secondary">
                      You are not logged in. Your complaint will be submitted anonymously.{" "}
                      <a href="/login" className="text-accent font-medium hover:underline">Log in</a> for a personalized experience.
                    </p>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="mt-4 p-3 rounded-xl bg-danger/10 border border-danger/20 flex items-center gap-2">
                  <AlertCircle size={16} className="text-danger shrink-0" />
                  <p className="text-sm text-danger">{submitError}</p>
                </div>
              )}

              <div className="mt-6 p-4 rounded-xl border border-accent/20 bg-accent/5">
                <div className="flex items-start gap-2">
                  <ShieldAlert size={18} className="text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-accent">After submission</p>
                    <p className="text-xs text-text-secondary mt-1">
                      You will receive a Complaint ID and PIN. Save them to track your complaint later. Your complaint will be processed by AI and routed to the appropriate authority.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <Button variant="ghost" size="lg" onClick={goBack} icon={<ArrowLeft size={18} />}>
                  Back
                </Button>
                <Button
                  size="lg"
                  loading={isSubmitting}
                  disabled={!canSubmit}
                  onClick={handleSubmit}
                  icon={<Send size={18} />}
                >
                  Submit Complaint
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
