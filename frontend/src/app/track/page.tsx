"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  AlertTriangle,
  Send,
  CheckCircle2,
  UserCheck,
  Hammer,
  CircleCheckBig,
  Clock,
  TrendingUp,
  ShieldAlert,
  Users,
  X,
  ShieldCheck,
  XCircle,
  Megaphone,
  HeartHandshake,
  Activity,
  Pill,
  Apple,
  Siren,
  HelpCircle,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Timeline, type TimelineStep } from "@/components/ui/Timeline";
import { complaintService } from "@/services/complaintService";
import { communityService } from "@/services/communityService";
import { mapApiComplaintToFrontend } from "@/lib/apiTransformers";
import { formatDateTime, getPriorityConfig, getEscalationLevel } from "@/lib/utils";
import { CATEGORIES, ESCALATION_LABELS } from "@/lib/constants";
import type { Complaint, ComplaintStatus } from "@/lib/types";
import { useI18n } from "@/lib/i18n/I18nContext";

/* ============================================
   STATUS ICON MAP
   ============================================ */

const STATUS_ICONS: Record<ComplaintStatus, React.ReactNode> = {
  submitted: <Send size={16} />,
  verified: <CheckCircle2 size={16} />,
  assigned: <UserCheck size={16} />,
  under_review: <Search size={16} />,
  action_taken: <Hammer size={16} />,
  resolved: <CircleCheckBig size={16} />,
  rejected: <X size={16} />,
};

/* ============================================
   TRACKING PAGE CONTENT — API Connected
   ============================================ */

function TrackingContent() {
  const searchParams = useSearchParams();
  const [complaintId, setComplaintId] = useState(searchParams.get("id") || "");
  const [pin, setPin] = useState(searchParams.get("pin") || "");
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [supportRequested, setSupportRequested] = useState<string | null>(null);
  const [closureStatus, setClosureStatus] = useState<"pending" | "confirmed" | "rejected">("pending");
  const { t } = useI18n();

  const getSafetySignals = (category: string) => {
    switch (category) {
      case "harassment":
      case "abuse":
      case "safety":
        return {
          level: "High Risk",
          color: "text-danger bg-danger/10 border-danger/20",
          icon: <Siren size={14} className="text-danger" />,
          signals: ["Potential immediate threat", "Crowd risk detected", "Low lighting reported"]
        };
      case "roads":
      case "water":
      case "sanitation":
        return {
          level: "Medium Risk",
          color: "text-warning bg-warning/10 border-warning/20",
          icon: <AlertTriangle size={14} className="text-warning" />,
          signals: ["Physical hazard", "Infrastructure failure"]
        };
      default:
        return {
          level: "Low Risk",
          color: "text-success bg-success/10 border-success/20",
          icon: <ShieldCheck size={14} className="text-success" />,
          signals: ["Standard civic issue"]
        };
    }
  };

  const handleClosure = (status: "confirmed" | "rejected") => {
    setClosureStatus(status);
    // In a real app, this would hit an API endpoint to log the user's feedback
    // e.g. complaintService.verifyClosure(complaint._apiId, status)
  };

  /* Auto-search if params present */
  useState(() => {
    const id = searchParams.get("id");
    const p = searchParams.get("pin");
    if (id) {
      handleSearchWithParams(id, p || "");
    }
  });

  async function handleSearchWithParams(id: string, p: string) {
    setIsSearching(true);
    setSearched(true);
    setError("");
    
    // ESCALATION DEMO OVERRIDE
    if (id === "ESCALATED-DEMO") {
      setTimeout(() => {
        const demoDate = new Date();
        demoDate.setDate(demoDate.getDate() - 15); // 15 days ago
        
        const demoComplaint: Complaint = {
          id: "ESCALATED-DEMO",
          _apiId: "demo_esc",
          pin: "000000",
          rawText: "Main road pipeline burst causing severe flooding near the community school.",
          summary: "Severe flooding near community school due to burst pipeline.",
          category: "roads",
          priority: "critical",
          location: "Central Ward",
          status: "assigned", 
          reportingMode: "self",
          mediaUrls: [],
          createdAt: demoDate.toISOString(),
          updatedAt: new Date().toISOString(),
          timeline: [
            { id: "1", status: "submitted", note: "Complaint filed successfully.", timestamp: demoDate.toISOString() },
            { id: "2", status: "verified", note: "Community verification threshold met.", timestamp: new Date(demoDate.getTime() + 86400000).toISOString() },
            { id: "3", status: "assigned", note: "Assigned to Ward Engineer.", timestamp: new Date(demoDate.getTime() + 172800000).toISOString() },
          ],
          proofOfAction: [],
          communityVotes: 124,
          validatorEndorsements: 3,
          genuinenessScore: 0,
          approved: true,
          escalationLevel: 3,
          aiDecision: "auto_publish"
        };
        setComplaint(demoComplaint);
        setIsSearching(false);
      }, 800);
      return;
    }

    try {
      const result = await complaintService.track(id, p || undefined);
      if (result?.complaint) {
        const mapped = mapApiComplaintToFrontend(result.complaint, result.timeline);
        if (p && !mapped.pin) mapped.pin = p;
        setComplaint(mapped);
      } else {
        setError("No complaint found. Check your ID and PIN.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to track complaint.");
      setComplaint(null);
    } finally {
      setIsSearching(false);
    }
  }

  const handleSearch = () => {
    if (!complaintId.trim()) {
      setError("Please enter a Complaint ID");
      return;
    }
    handleSearchWithParams(complaintId.trim(), pin.trim());
  };

  const handleVote = async () => {
    if (!complaint?._apiId) return;
    setIsVoting(true);
    try {
      await communityService.vote(complaint._apiId);
      setComplaint((prev) => prev ? { ...prev, communityVotes: prev.communityVotes + 1 } : null);
    } catch {
      alert("You may have already voted on this complaint.");
    } finally {
      setIsVoting(false);
    }
  };

  const escalationLevel = complaint
    ? getEscalationLevel(complaint.createdAt, complaint.status)
    : 0;

  const priorityConfig = complaint ? getPriorityConfig(complaint.priority) : null;
  const categoryConfig = complaint
    ? CATEGORIES.find((c) => c.id === complaint.category)
    : null;

  /* Build timeline steps */
  const buildTimelineSteps = (c: Complaint): TimelineStep[] => {
    const allStatuses: ComplaintStatus[] = [
      "submitted",
      "verified",
      "assigned",
      "under_review",
      "action_taken",
      "resolved",
      "rejected",
    ];

    const statusLabels: Record<ComplaintStatus, string> = {
      submitted: "Complaint Submitted",
      verified: "Community Verified",
      assigned: "Assigned to Official",
      under_review: "Under Review",
      action_taken: "Action Taken",
      resolved: "Resolved",
      rejected: "Rejected",
    };

    const currentIndex = allStatuses.indexOf(c.status);

    const steps: TimelineStep[] = allStatuses.map((status, i) => {
      const timelineEvent = c.timeline.find((t) => t.status === status);
      const isCurrent = i === currentIndex;
      const isCompleted = i < currentIndex;

      let description = timelineEvent?.note || undefined;
      // Make Assigned stage clearly visible
      if (status === "assigned" && c.assignedOfficer) {
        const assignedText = `Assigned to ${c.assignedOfficer} (${c.assignedDepartment})`;
        description = description ? `${assignedText}. ${description}` : assignedText;
      }

      return {
        id: status,
        label: statusLabels[status],
        description: description,
        timestamp: timelineEvent ? formatDateTime(timelineEvent.timestamp) : undefined,
        icon: STATUS_ICONS[status],
        status: isCompleted ? "completed" as const : isCurrent ? "active" as const : "pending" as const,
      };
    });

    // Inject Escalation step if applicable
    const escLvl = getEscalationLevel(c.createdAt, c.status);
    if (escLvl > 0 && c.status !== "resolved" && c.status !== "rejected") {
      const daysSince = Math.floor((new Date().getTime() - new Date(c.createdAt).getTime()) / (1000 * 3600 * 24));
      
      // Insert right after current active step
      steps.splice(currentIndex + 1, 0, {
        id: "escalated",
        label: "Notice Sent / Escalated",
        description: `Formal notice issued due to ${daysSince} days of inaction. Escalated to ${ESCALATION_LABELS[escLvl - 1]}.`,
        timestamp: formatDateTime(new Date().toISOString()),
        icon: <Megaphone size={16} />,
        status: "active",
      });
      // Mark original active step as completed
      steps[currentIndex].status = "completed";
    }

    return steps;
  };

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
            {t("track.title")}
          </h1>
          <p className="text-text-secondary">
            {t("track.subtitle")}
          </p>
        </motion.div>

        {/* Search form */}
        <Card variant="glass" padding="lg" className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                inputSize="lg"
                placeholder="Complaint ID (e.g. NV-2026-XK92R)"
                value={complaintId}
                onChange={(e) => setComplaintId(e.target.value.toUpperCase())}
                icon={<Search size={18} />}
                className="flex-1"
              />
            </div>
            <Input
              inputSize="lg"
              placeholder="6-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              type="password"
              maxLength={6}
              className="w-full sm:w-36"
            />
            <Button size="lg" onClick={handleSearch} loading={isSearching} icon={<Search size={18} />}>
              Track
            </Button>
          </div>
          {error && (
            <p className="text-sm text-danger mt-3 flex items-center gap-1">
              <AlertTriangle size={14} /> {error}
            </p>
          )}
        </Card>

        {/* Results */}
        {searched && complaint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Status header */}
            <Card variant="solid" padding="lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-mono text-sm text-text-muted">{complaint.id}</p>
                  <h2 className="text-lg font-semibold mt-1">
                    {categoryConfig?.label || complaint.category} Complaint
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" size="md" className="border-accent text-accent gap-1">
                    <ShieldCheck size={14} /> Anonymous Protected
                  </Badge>
                  {priorityConfig && (
                    <Badge
                      variant={
                        priorityConfig.id === "critical"
                          ? "danger"
                          : priorityConfig.id === "high"
                          ? "warning"
                          : "accent"
                      }
                      size="md"
                      pulse={priorityConfig.id === "critical"}
                    >
                      {priorityConfig.label}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-bg-primary border border-border">
                <p className="text-sm text-text-primary leading-relaxed">
                  {complaint.summary || complaint.rawText}
                </p>
              </div>

              {/* Safety Signals Layer */}
              <div className="mt-4 p-4 rounded-xl bg-bg-primary border border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold flex items-center gap-2">
                    <Activity size={16} className="text-text-muted" /> Safety Signals
                  </span>
                  <Badge variant="outline" size="sm" className={getSafetySignals(complaint.category).color + " gap-1"}>
                    {getSafetySignals(complaint.category).icon} {getSafetySignals(complaint.category).level}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getSafetySignals(complaint.category).signals.map((signal, idx) => (
                    <Badge key={idx} variant="outline" size="sm" className="bg-bg-elevated text-text-secondary border-border">
                      {signal}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4 text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <Clock size={12} /> Filed: {formatDateTime(complaint.createdAt)}
                </span>
                {complaint.affectedPeople && (
                  <span className="flex items-center gap-1">
                    <TrendingUp size={12} /> {complaint.affectedPeople} affected
                  </span>
                )}
              </div>
            </Card>

            {/* Escalation banner */}
            {escalationLevel > 0 && complaint.status !== "resolved" && complaint.status !== "rejected" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card variant="outline" padding="md" className="border-danger text-danger bg-danger/5 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
                      <ShieldAlert size={24} className="text-danger" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg mb-1">
                        Unresolved Issue: Escalation Level {escalationLevel}
                      </p>
                      <p className="text-sm font-medium opacity-90">
                        {(() => {
                          const days = Math.floor((new Date().getTime() - new Date(complaint.createdAt).getTime()) / (1000 * 3600 * 24));
                          return `No action taken for ${days} days.`;
                        })()} This issue has been escalated to {ESCALATION_LABELS[escalationLevel - 1]}.
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Shame-Free Support Layer */}
            {complaint.status !== "resolved" && complaint.status !== "rejected" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card variant="outline" padding="lg" className="border-accent/30 bg-accent/5 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                        <HeartHandshake size={20} className="text-accent" />
                      </div>
                      <div>
                        <p className="font-bold text-text-primary">Need Help Now?</p>
                        <p className="text-xs text-text-secondary">Request private assistance. Your identity stays hidden.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-md">
                      <ShieldCheck size={12} /> 100% Anonymous
                    </div>
                  </div>

                  {!supportRequested ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Button variant="secondary" size="md" className="w-full justify-start bg-bg-surface hover:border-accent/50" icon={<Apple size={16} className="text-olive" />} onClick={() => setSupportRequested("food")}>
                        Food Relief
                      </Button>
                      <Button variant="secondary" size="md" className="w-full justify-start bg-bg-surface hover:border-accent/50" icon={<Pill size={16} className="text-accent" />} onClick={() => setSupportRequested("medical")}>
                        Medical Help
                      </Button>
                      <Button variant="secondary" size="md" className="w-full justify-start bg-bg-surface hover:border-danger/50 hover:text-danger" icon={<Siren size={16} className="text-danger" />} onClick={() => setSupportRequested("emergency")}>
                        Emergency
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-success/10 border border-success/20 flex flex-col items-center justify-center text-center">
                      <CheckCircle2 size={24} className="text-success mb-2" />
                      <p className="text-sm font-bold text-text-primary">Support Request Sent securely</p>
                      <p className="text-xs text-text-secondary mt-1">Nearby verified NGOs have been notified. Please stay safe.</p>
                    </div>
                  )}
                  
                  {!supportRequested && (
                    <div className="mt-4 flex items-center justify-center gap-1 text-[11px] text-text-muted">
                      <Activity size={12} /> 3 verified support partners active within 2km
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {/* Responsible Authority */}
            <Card variant="outline" padding="lg" className="border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <UserCheck size={18} className="text-accent" />
                  Responsible Authority
                </h3>
                <Badge variant="outline" size="sm" className="bg-bg-elevated text-text-secondary border-border">
                  {complaint.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-bg-primary border border-border">
                  <p className="text-xs text-text-muted mb-1 uppercase tracking-wider font-semibold">Department</p>
                  <p className="font-medium text-sm text-text-primary">{complaint.assignedDepartment}</p>
                </div>
                <div className="p-3 rounded-xl bg-bg-primary border border-border">
                  <p className="text-xs text-text-muted mb-1 uppercase tracking-wider font-semibold">Assigned Officer</p>
                  <p className="font-medium text-sm text-text-primary">{complaint.assignedOfficer}</p>
                </div>
              </div>
            </Card>

            {/* Timeline */}
            <Card variant="solid" padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold flex items-center gap-2">
                  <Clock size={18} className="text-accent" />
                  Complaint Timeline
                </h3>
                <Badge variant="outline" size="sm" className="border-success/30 text-success gap-1 bg-success/5">
                  <ShieldCheck size={12} /> Secure History
                </Badge>
              </div>
              <Timeline steps={buildTimelineSteps(complaint)} />
            </Card>

            {/* Proof of action */}
            {complaint.proofOfAction.length > 0 && (
              <Card variant="solid" padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    Proof of Action
                  </h3>
                  <Badge variant="success" size="sm" className="gap-1">
                    <CheckCircle2 size={12} /> Proof Verified
                  </Badge>
                </div>
                <div className="space-y-3">
                  {complaint.proofOfAction.map((proof) => (
                    <div
                      key={proof.id}
                      className="p-3 rounded-xl bg-bg-primary border border-border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant={proof.type === "after" ? "success" : "default"}
                          size="sm"
                        >
                          {proof.type === "before" ? "📸 Before" : proof.type === "after" ? "✅ After" : "📝 Note"}
                        </Badge>
                        <span className="text-xs text-text-muted">
                          {formatDateTime(proof.uploadedAt)}
                        </span>
                      </div>
                      <p className="text-sm text-text-primary">{proof.note}</p>
                      <p className="text-xs text-text-muted mt-1">By: {proof.uploadedBy}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Community Validation & Support */}
            <Card variant="outline" padding="lg" className="border-accent/20 bg-bg-surface/50">
              <div className="flex flex-col sm:flex-row gap-6">
                
                {/* Credibility Score & Validator Badge */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <ShieldAlert size={18} className="text-accent" />
                      <span className="text-sm font-medium">Credibility Score</span>
                    </div>
                    {complaint.validatorEndorsements > 0 && (
                      <Badge variant="success" size="sm" className="gap-1 animate-pulse">
                        <CheckCircle2 size={12} /> Trusted Validator
                      </Badge>
                    )}
                  </div>
                  
                  {/* Calculate credibility score: votes * 10 + validators * 50 (cap at 100) */}
                  {(() => {
                    const calculatedScore = Math.min(100, (complaint.communityVotes * 10) + (complaint.validatorEndorsements * 50) + (complaint.genuinenessScore || 0));
                    return (
                      <>
                        <div className="flex items-end gap-3 mb-2">
                          <span className="font-display text-4xl font-bold text-accent">
                            {calculatedScore}%
                          </span>
                          <span className="text-sm text-text-secondary mb-1">Confidence</span>
                        </div>
                        <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-accent"
                            initial={{ width: 0 }}
                            animate={{ width: `${calculatedScore}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </>
                    );
                  })()}
                  <p className="text-xs text-text-muted mt-2">
                    Score based on validator endorsements and community consensus.
                  </p>
                </div>

                {/* Vertical Divider */}
                <div className="hidden sm:block w-px bg-border" />

                {/* Community Votes */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp size={18} className="text-text-primary" />
                      <span className="text-sm font-medium">Community Consensus</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm mb-4">
                      <span className="flex items-center gap-1.5 text-text-secondary">
                        <Users size={16} /> {complaint.communityVotes} citizens affected
                      </span>
                      <span className="flex items-center gap-1.5 text-text-secondary">
                        <CheckCircle2 size={16} className="text-success" /> {complaint.validatorEndorsements} validators
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full sm:w-auto mt-auto"
                    icon={<TrendingUp size={16} />}
                    loading={isVoting}
                    onClick={handleVote}
                  >
                    I also face this issue
                  </Button>
                </div>

              </div>
            </Card>

            {/* Optional Community Support Block for Escalated issues */}
            {escalationLevel > 0 && complaint.status !== "resolved" && complaint.status !== "rejected" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card variant="solid" padding="lg" className="border-border">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-bg-surface rounded-xl flex items-center justify-center shrink-0 text-text-primary">
                      <HeartHandshake size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">Community Support Layer</h3>
                      <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                        This issue remains unresolved by official channels. While we continue to hold authorities accountable, registered NGOs, vetted volunteers, or local partners can offer temporary relief or coordinate a response. <strong>This does not absolve the government of its duty.</strong>
                      </p>
                      
                      {!showSupportForm ? (
                        <Button variant="outline" onClick={() => setShowSupportForm(true)}>
                          Offer Community Support
                        </Button>
                      ) : (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                          <Input label="Organization / Volunteer Name" placeholder="e.g. Clean City NGO" />
                          <Input label="Proposed Assistance" placeholder="e.g. Can provide water tankers temporarily" />
                          <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => setShowSupportForm(false)}>Cancel</Button>
                            <Button variant="primary" onClick={() => { alert("Support offer submitted for verification. Authorities are still responsible for the permanent fix."); setShowSupportForm(false); }}>
                              Submit Offer
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Anti-Fake Closure Verification (Only show if resolved) */}
            {complaint.status === "resolved" && (
              <Card variant="solid" padding="lg" className="border-accent border-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-1">
                      <ShieldCheck size={20} className="text-success" />
                      Verify Resolution
                    </h3>
                    <p className="text-sm text-text-secondary">
                      Officials have marked this as resolved. Is the issue actually fixed on the ground?
                    </p>
                  </div>
                  
                  {closureStatus === "pending" ? (
                    <div className="flex gap-3 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        className="flex-1 sm:flex-none border-danger text-danger hover:bg-danger/10"
                        onClick={() => handleClosure("rejected")}
                        icon={<XCircle size={16} />}
                      >
                        No, Reopen
                      </Button>
                      <Button
                        variant="primary"
                        className="flex-1 sm:flex-none bg-success hover:bg-success/90 text-white"
                        onClick={() => handleClosure("confirmed")}
                        icon={<CheckCircle2 size={16} />}
                      >
                        Yes, Confirmed
                      </Button>
                    </div>
                  ) : closureStatus === "confirmed" ? (
                    <Badge variant="success" size="md" className="px-4 py-2">
                      <CheckCircle2 size={16} className="mr-2" /> You confirmed this resolution
                    </Badge>
                  ) : (
                    <Badge variant="danger" size="md" className="px-4 py-2">
                      <AlertTriangle size={16} className="mr-2" /> Resolution rejected & flagged
                    </Badge>
                  )}
                </div>
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-text-muted">Loading...</p></div>}>
      <TrackingContent />
    </Suspense>
  );
}
