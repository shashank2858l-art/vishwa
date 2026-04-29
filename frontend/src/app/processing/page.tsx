"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  ScanSearch,
  BarChart3,
  FileText,
  CheckCircle2,
  Copy,
  ArrowRight,
  Shield,
  ShieldAlert,
  AlertTriangle,
  XCircle,
  Building2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { complaintService } from "@/services/complaintService";
import { adminService } from "@/services/adminService";
import { mapApiComplaintToFrontend } from "@/lib/apiTransformers";
import { getPriorityConfig } from "@/lib/utils";
import { CATEGORIES, DEPARTMENT_ROUTING } from "@/lib/constants";
import type { Complaint } from "@/lib/types";
import { useI18n } from "@/lib/i18n/I18nContext";

/* ============================================
   PROCESSING STEPS — AI Moderation Flow
   ============================================ */

const processingSteps = [
  { id: "spam", label: "Scanning for spam & abuse...", icon: ShieldAlert, duration: 700 },
  { id: "authenticity", label: "Verifying authenticity...", icon: Shield, duration: 600 },
  { id: "category", label: "Classifying category & priority...", icon: ScanSearch, duration: 700 },
  { id: "routing", label: "Routing to department...", icon: Building2, duration: 600 },
  { id: "done", label: "AI Moderation Complete", icon: CheckCircle2, duration: 0 },
];

function ProcessingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const complaintCode = searchParams.get("id");
  const pin = searchParams.get("pin");

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loadError, setLoadError] = useState("");
  const { t } = useI18n();

  /* Load complaint from API */
  useEffect(() => {
    if (!complaintCode) return;

    async function loadComplaint() {
      try {
        const result = await complaintService.track(complaintCode!, pin || undefined);
        if (result?.complaint) {
          const mapped = mapApiComplaintToFrontend(result.complaint, result.timeline);
          if (pin && !mapped.pin) mapped.pin = pin;
          setComplaint(mapped);
        }
      } catch {
        setComplaint({
          id: complaintCode!,
          pin: pin || "",
          rawText: "Processing...",
          category: "other",
          priority: "medium",
          status: "submitted",
          reportingMode: "anonymous",
          summary: "",
          mediaUrls: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          communityVotes: 0,
          validatorEndorsements: 0,
          genuinenessScore: 0,
          timeline: [],
          proofOfAction: [],
          escalationLevel: 0,
          approved: false,
        });
      }
    }

    loadComplaint();
  }, [complaintCode, pin]);

  /* Animate through processing steps */
  useEffect(() => {
    if (!complaint) return;

    let stepIndex = 0;
    const runStep = () => {
      if (stepIndex >= processingSteps.length - 1) {
        setCurrentStep(processingSteps.length - 1);
        setIsComplete(true);

        // Try to trigger AI processing on backend
        if (complaint._apiId) {
          adminService.processComplaintAI(complaint._apiId).then((result) => {
            if (result?.complaint) {
              const updated = mapApiComplaintToFrontend(result.complaint);
              updated.pin = complaint.pin;
              setComplaint(updated);
            }
          }).catch(() => {
            // AI processing may not be available — keep existing data
          });
        }
        return;
      }

      setCurrentStep(stepIndex);
      stepIndex++;
      setTimeout(runStep, processingSteps[stepIndex - 1].duration);
    };

    const timer = setTimeout(runStep, 500);
    return () => clearTimeout(timer);
  }, [complaint?._apiId]);

  /* Copy complaint ID */
  const handleCopy = async () => {
    if (!complaint) return;
    await navigator.clipboard.writeText(`ID: ${complaint.id} | PIN: ${complaint.pin}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!complaint) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-text-muted">Loading complaint...</p>
        </div>
      </div>
    );
  }

  const priorityConfig = getPriorityConfig(complaint.priority);
  const categoryConfig = CATEGORIES.find((c) => c.id === complaint.category);

  // Determine decision display — default to pending if AI hasn't decided yet
  const aiDec = complaint.aiDecision || (complaint.status === 'verified' ? 'auto_publish' : 'pending_review');
  const decisionConfig: Record<string, { label: string; color: string; icon: any; desc: string }> = {
    auto_publish: { label: "Auto Published", color: "bg-success/10 text-success border-success/30", icon: CheckCircle2, desc: "Your complaint has been verified and published to the community feed." },
    pending_review: { label: "Pending Admin Review", color: "bg-warning/10 text-warning border-warning/30", icon: AlertTriangle, desc: "Your complaint is being reviewed. It will be published once verified." },
    rejected: { label: "Rejected — Not a Civic Issue", color: "bg-danger/10 text-danger border-danger/30", icon: XCircle, desc: complaint.aiRejectionReason || "Your submission does not describe a valid civic grievance. Please revise and resubmit with a clear description of the problem." },
    duplicate: { label: "Duplicate Issue", color: "bg-warning/10 text-warning border-warning/30", icon: AlertTriangle, desc: "This seems to be a duplicate of an existing complaint. It will be reviewed by admins." },
  };
  const decision = decisionConfig[aiDec] || decisionConfig.pending_review;
  const DecisionIcon = decision.icon;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-2xl sm:text-3xl font-bold mb-2">
            {isComplete ? t("process.success") : "AI Moderation in Progress"}
          </h1>
          <p className="text-text-secondary">
            {isComplete ? "Your complaint has been analyzed by our AI engine" : "Intelligent moderation is analyzing your report..."}
          </p>
        </motion.div>

        {/* Processing animation */}
        <Card variant="glass" padding="lg" className="mb-6">
          <div className="space-y-4">
            {processingSteps.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === currentStep;
              const isDone = i < currentStep || isComplete;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: i <= currentStep ? 1 : 0.3,
                    x: 0,
                  }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isDone
                        ? "bg-accent/20 text-accent"
                        : isActive
                        ? "bg-accent/10 text-accent"
                        : "bg-bg-elevated text-text-muted"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isDone ? "text-accent" : isActive ? "text-text-primary" : "text-text-muted"
                    }`}
                  >
                    {step.label}
                  </span>
                  {isDone && <CheckCircle2 size={16} className="text-accent ml-auto" />}
                </motion.div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-6 h-1 bg-bg-elevated rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              initial={{ width: "0%" }}
              animate={{
                width: isComplete ? "100%" : `${(currentStep / (processingSteps.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "linear" }}
            />
          </div>
        </Card>

        {/* Result card */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* AI Decision Banner */}
              <Card variant="elevated" padding="lg" className={`mb-4 border ${decision.color}`}>
                <div className="flex items-center gap-3 mb-2">
                  <DecisionIcon size={24} />
                  <h3 className="font-semibold text-lg">{decision.label}</h3>
                </div>
                <p className="text-sm opacity-80">{decision.desc}</p>
              </Card>

              {/* ── REJECTED VIEW: minimal, no credentials ── */}
              {aiDec === "rejected" && (
                <>
                  <Card variant="solid" padding="lg" className="mb-4 border border-danger/20">
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-danger">
                      <XCircle size={20} />
                      Why was this rejected?
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed mb-4">
                      {complaint.summary || complaint.aiRejectionReason || "Your submission did not contain a valid civic grievance."}
                    </p>
                    <div className="p-3 rounded-xl bg-bg-primary border border-border">
                      <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Your submission</p>
                      <p className="text-sm text-text-primary italic">&ldquo;{complaint.rawText}&rdquo;</p>
                    </div>
                  </Card>

                  <Card variant="outline" padding="md" className="mb-4 border-accent/20">
                    <p className="text-sm text-text-secondary">
                      💡 <strong>Tips for a valid complaint:</strong> Describe a real civic problem (water, roads, sanitation, safety, etc.), include your location, and explain how it affects people.
                    </p>
                  </Card>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full bg-accent hover:bg-accent-hover text-white border-transparent"
                    onClick={() => router.push("/submit")}
                    iconRight={<ArrowRight size={18} />}
                  >
                    Revise &amp; Resubmit
                  </Button>
                </>
              )}

              {/* ── APPROVED / PENDING VIEW: full credentials + report ── */}
              {aiDec !== "rejected" && (
                <>
                  {/* Complaint ID card */}
                  <Card variant="elevated" padding="lg" className="mb-4 border-accent/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Shield size={20} className="text-accent" />
                        <span className="font-semibold text-text-primary">Your Complaint Credentials</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Copy size={14} />}
                        onClick={handleCopy}
                      >
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-xl bg-bg-primary border border-border">
                        <p className="text-xs text-text-muted uppercase tracking-wide">Complaint ID</p>
                        <p className="font-mono text-lg font-bold text-accent mt-1">{complaint.id}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-bg-primary border border-border">
                        <p className="text-xs text-text-muted uppercase tracking-wide">PIN</p>
                        <p className="font-mono text-lg font-bold text-warning mt-1">{complaint.pin}</p>
                      </div>
                    </div>
                    <p className="text-xs text-text-muted mt-3">
                      ⚠️ Save these credentials. You need them to track your complaint.
                    </p>
                  </Card>

                  {/* AI Intelligence Summary */}
                  <Card variant="solid" padding="lg" className="mb-4">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Brain size={20} className="text-accent" />
                      AI Intelligence Report
                    </h3>
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={priorityConfig.id === "critical" ? "danger" : priorityConfig.id === "high" ? "warning" : "accent"} size="md" pulse={priorityConfig.id === "critical"}>
                          {priorityConfig.label} Priority
                        </Badge>
                        <Badge variant="default" size="md">
                          {categoryConfig?.label || complaint.category}
                        </Badge>
                        {complaint.department && (
                          <Badge variant="outline" size="md">
                            <Building2 size={12} className="mr-1" />
                            {complaint.department}
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="p-3 rounded-xl bg-bg-primary border border-border">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-xs text-text-muted uppercase">Authenticity</p>
                            <span className="text-sm font-bold text-accent">{complaint.authenticityScore ?? complaint.genuinenessScore}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                            <div className="h-full bg-accent rounded-full transition-all duration-1000" style={{ width: `${complaint.authenticityScore ?? complaint.genuinenessScore}%` }} />
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-bg-primary border border-border">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-xs text-text-muted uppercase">Urgency</p>
                            <span className="text-sm font-bold text-warning">{Math.round((complaint.aiConfidence || 0) * 100)}/100</span>
                          </div>
                          <div className="w-full h-1.5 bg-bg-elevated rounded-full overflow-hidden">
                            <div className="h-full bg-warning rounded-full transition-all duration-1000" style={{ width: `${(complaint.aiConfidence || 0) * 100}%` }} />
                          </div>
                        </div>
                      </div>

                      {complaint.isPublicSafetyRisk && (
                        <div className="p-3 rounded-xl bg-danger/10 border border-danger/30 flex items-center gap-2">
                          <Zap size={18} className="text-danger shrink-0" />
                          <p className="text-sm font-medium text-danger">⚡ Public Safety Risk Detected — Emergency services alerted</p>
                        </div>
                      )}

                      {complaint.location && (
                        <p className="text-sm text-text-secondary">📍 Location: {complaint.location}</p>
                      )}
                      {complaint.summary && (
                        <div className="p-3 rounded-xl bg-bg-primary border border-border">
                          <p className="text-xs text-text-muted uppercase tracking-wide mb-1">AI Summary</p>
                          <p className="text-sm text-text-primary leading-relaxed">{complaint.summary}</p>
                        </div>
                      )}
                      {complaint.aiKeyIssues && complaint.aiKeyIssues.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {complaint.aiKeyIssues.map((issue, i) => (
                            <span key={i} className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded-full font-medium">{issue}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Button 
                      size="lg" 
                      className="flex-1" 
                      iconRight={<ArrowRight size={18} />}
                      onClick={() => router.push(`/track?id=${complaint.id}&pin=${complaint.pin}`)}
                    >
                      {t("process.btn")}
                    </Button>
                    {aiDec === "auto_publish" && (
                      <Button
                        variant="primary"
                        size="lg"
                        className="flex-1 bg-accent hover:bg-accent-hover text-white border-transparent"
                        onClick={() => router.push("/community")}
                        iconRight={<ArrowRight size={18} />}
                      >
                        View in Community
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="lg"
                      className="flex-1"
                      onClick={() => router.push("/submit")}
                    >
                      File Another
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ProcessingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-text-muted">Loading...</p></div>}>
      <ProcessingContent />
    </Suspense>
  );
}
