"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Filter,
  Search,
  Clock,
  Users,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  X,
  Send,
  UserCheck,
  Hammer,
  CircleCheckBig,
  ChevronDown,
  ChevronUp,
  MessageSquarePlus,
  RefreshCw,
  Brain,
  ShieldAlert,
  ShieldCheck,
  XCircle,
  Building2,
  Zap,
  Heart,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Timeline, type TimelineStep } from "@/components/ui/Timeline";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { adminService, type DashboardStats } from "@/services/adminService";
import { complaintService, type ApiComplaint } from "@/services/complaintService";
import api from "@/services/api";
import { mapApiComplaintToFrontend } from "@/lib/apiTransformers";
import { CATEGORIES, PRIORITIES, OFFICERS, STATUSES } from "@/lib/constants";
import { formatDateTime, getPriorityConfig, cn } from "@/lib/utils";
import type { Complaint, ComplaintCategory, ComplaintPriority, ComplaintStatus } from "@/lib/types";
import { useI18n } from "@/lib/i18n/I18nContext";

/* ============================================
   ADMIN DASHBOARD — API Connected
   ============================================ */

function AdminDashboard() {
  /* State */
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useI18n();
  const [filterPriority, setFilterPriority] = useState<ComplaintPriority | "all">("all");
  const [filterCategory, setFilterCategory] = useState<ComplaintCategory | "all">("all");
  const [filterStatus, setFilterStatus] = useState<ComplaintStatus | "all">("all");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'critical' | 'rejected'>('all');
  const [charityTotal, setCharityTotal] = useState(0);

  /* Action modal state */
  const [actionNote, setActionNote] = useState("");
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus | "">("");
  const [proofUrl, setProofUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  /* Load data from API */
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const [statsRes, complaintsRes] = await Promise.all([
        adminService.getDashboardStats().catch(() => null),
        complaintService.list({ page: 1, limit: 100 }),
      ]);

      if (statsRes) setStats(statsRes);

      // Fetch charity total from API
      try {
        const charityRes = (await api.get("/fundraisers/total-raised")) as any;
        if (charityRes?.data?.total != null) setCharityTotal(charityRes.data.total);
      } catch {
        // Non-critical — charity stat just shows 0
      }

      if (complaintsRes?.data) {
        const mapped = complaintsRes.data.map((c: ApiComplaint) => mapApiComplaintToFrontend(c));
        setComplaints(mapped);

        // Calculate stats from data if API stats failed
        if (!statsRes) {
          const total = mapped.length;
          const byStatus: Record<string, number> = {};
          mapped.forEach((c: Complaint) => {
            byStatus[c.status] = (byStatus[c.status] || 0) + 1;
          });
          setStats({ total, byStatus, byCategory: {} });
        }
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* Filtered complaints — now respects active tab */
  const filtered = useMemo(() => {
    let base = complaints;

    // Tab-based pre-filter
    if (activeTab === 'pending') base = base.filter((c) => c.status === 'submitted' && c.aiDecision === 'pending_review');
    else if (activeTab === 'critical') base = base.filter((c) => c.priority === 'critical' && c.status !== 'resolved');
    else if (activeTab === 'rejected') base = base.filter((c) => c.aiDecision === 'rejected');

    return base.filter((c) => {
      if (searchQuery && !c.id.toLowerCase().includes(searchQuery.toLowerCase()) && !c.rawText.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterPriority !== "all" && c.priority !== filterPriority) return false;
      if (filterCategory !== "all" && c.category !== filterCategory) return false;
      if (filterStatus !== "all" && c.status !== filterStatus) return false;
      return true;
    });
  }, [complaints, searchQuery, filterPriority, filterCategory, filterStatus, activeTab]);

  /* Computed stats */
  const computedStats = useMemo(() => ({
    total: stats?.total || complaints.length,
    pending: (stats?.byStatus?.submitted || 0) + (stats?.byStatus?.verified || 0),
    inProgress: (stats?.byStatus?.assigned || 0) + (stats?.byStatus?.under_review || 0) + (stats?.byStatus?.action_taken || 0),
    resolved: stats?.byStatus?.resolved || 0,
    critical: complaints.filter((c) => c.priority === "critical").length,
  }), [stats, complaints]);

  /* Actions */
  const handleUpdateComplaint = async () => {
    if (!selectedComplaint?._apiId) return;
    
    // Anti-fake closure validation
    if (selectedStatus === "resolved" && !proofUrl.trim()) {
      alert("Proof of action is required to mark a complaint as resolved. Please provide a proof URL or note.");
      return;
    }

    setIsUpdating(true);

    try {
      const updates: Record<string, unknown> = {};
      if (selectedStatus) updates.status = selectedStatus;
      if (actionNote) updates.note = actionNote;
      if (selectedOfficer) updates.assigned_to = selectedOfficer;

      await complaintService.update(selectedComplaint._apiId, updates);

      // Add timeline entry if note provided or proof provided
      if ((actionNote || proofUrl) && selectedComplaint._apiId) {
        await adminService.addTimelineEntry(
          selectedComplaint._apiId,
          selectedStatus || selectedComplaint.status,
          actionNote || "Proof of resolution provided.",
          proofUrl ? [proofUrl] : undefined
        ).catch(() => {});
      }

      // Refresh data
      await loadData();
      setSelectedComplaint(null);
      setActionNote("");
      setSelectedOfficer("");
      setSelectedStatus("");
      setProofUrl("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update complaint");
    } finally {
      setIsUpdating(false);
    }
  };

  /* Timeline builder */
  const buildTimelineSteps = (c: Complaint): TimelineStep[] => {
    return c.timeline.map((t, i) => ({
      id: t.id,
      label: STATUSES.find((s) => s.id === t.status)?.label || t.status,
      description: t.note,
      timestamp: formatDateTime(t.timestamp),
      status: i === c.timeline.length - 1 ? "active" as const : "completed" as const,
    }));
  };

  const statusIcon = (status: ComplaintStatus) => {
    const icons: Record<string, React.ReactNode> = {
      submitted: <Send size={14} />,
      verified: <CheckCircle2 size={14} />,
      assigned: <UserCheck size={14} />,
      under_review: <Search size={14} />,
      action_taken: <Hammer size={14} />,
      resolved: <CircleCheckBig size={14} />,
      rejected: <XCircle size={14} />,
    };
    return icons[status];
  };

  /* AI Actions */
  const handleApprove = async (complaint: Complaint) => {
    if (!complaint._apiId) return;
    try {
      await adminService.approveComplaint(complaint._apiId);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to approve');
    }
  };

  const handleReject = async (complaint: Complaint) => {
    if (!complaint._apiId) return;
    const reason = prompt('Rejection reason:');
    if (!reason) return;
    try {
      await adminService.rejectComplaint(complaint._apiId, reason);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reject');
    }
  };

  // Computed AI stats
  const aiStats = useMemo(() => ({
    pendingReview: complaints.filter(c => c.status === 'submitted' && c.aiDecision === 'pending_review').length,
    autoPublished: complaints.filter(c => c.aiDecision === 'auto_publish').length,
    spamRejected: complaints.filter(c => c.aiDecision === 'rejected').length,
    criticalAlerts: complaints.filter(c => c.priority === 'critical' && c.status !== 'resolved').length,
  }), [complaints]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card variant="outline" padding="lg" className="max-w-md w-full text-center border-danger/30">
          <AlertTriangle size={40} className="text-danger mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Dashboard Error</h2>
          <p className="text-sm text-text-secondary mb-6">{loadError}</p>
          <Button onClick={loadData} icon={<RefreshCw size={16} />}>Retry</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <LayoutDashboard size={28} className="text-accent" />
              <h1 className="font-display text-2xl sm:text-3xl font-bold">{t("admin.title")}</h1>
            </div>
            <Button variant="secondary" size="sm" onClick={loadData} icon={<RefreshCw size={14} />}>
              Refresh
            </Button>
          </div>
          <p className="text-text-secondary">{t("admin.overview")}</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
          {[
            { label: "Total", value: computedStats.total, icon: TrendingUp, color: "text-text-primary" },
            { label: "Pending", value: computedStats.pending, icon: Clock, color: "text-warning" },
            { label: "In Progress", value: computedStats.inProgress, icon: Users, color: "text-sky-400" },
            { label: "Resolved", value: computedStats.resolved, icon: CheckCircle2, color: "text-success" },
            { label: "Critical", value: computedStats.critical, icon: AlertTriangle, color: "text-danger" },
            { label: "Charity Raised", value: `₹${charityTotal.toLocaleString()}`, icon: Heart, color: "text-accent" },
          ].map((stat) => (
            <Card key={stat.label} variant="solid" padding="md">
              <div className="flex items-center gap-2">
                <stat.icon size={18} className={stat.color} />
                <span className="text-sm text-text-secondary">{stat.label}</span>
              </div>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* AI Intelligence Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card variant="outline" padding="md" className="border-accent/30 bg-accent/5 cursor-pointer hover:bg-accent/10 transition-colors" onClick={() => setActiveTab('all')}>
            <div className="flex items-center gap-2">
              <Brain size={16} className="text-accent" />
              <span className="text-xs text-accent font-semibold uppercase">Auto Published</span>
            </div>
            <p className="text-xl font-bold text-accent mt-1">{aiStats.autoPublished}</p>
          </Card>
          <Card variant="outline" padding="md" className="border-warning/30 bg-warning/5 cursor-pointer hover:bg-warning/10 transition-colors" onClick={() => setActiveTab('pending')}>
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} className="text-warning" />
              <span className="text-xs text-warning font-semibold uppercase">Pending Review</span>
            </div>
            <p className="text-xl font-bold text-warning mt-1">{aiStats.pendingReview}</p>
          </Card>
          <Card variant="outline" padding="md" className={`border-danger/30 bg-danger/5 cursor-pointer hover:bg-danger/10 transition-colors ${aiStats.criticalAlerts > 0 ? 'animate-pulse' : ''}`} onClick={() => setActiveTab('critical')}>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-danger" />
              <span className="text-xs text-danger font-semibold uppercase">Critical Alerts</span>
            </div>
            <p className="text-xl font-bold text-danger mt-1">{aiStats.criticalAlerts}</p>
          </Card>
          <Card variant="outline" padding="md" className="border-text-muted/30 bg-bg-elevated cursor-pointer hover:bg-bg-surface transition-colors" onClick={() => setActiveTab('rejected')}>
            <div className="flex items-center gap-2">
              <XCircle size={16} className="text-text-muted" />
              <span className="text-xs text-text-muted font-semibold uppercase">Spam / Rejected</span>
            </div>
            <p className="text-xl font-bold text-text-muted mt-1">{aiStats.spamRejected}</p>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4 overflow-x-auto hide-scrollbar">
          {[
            { id: 'all' as const, label: 'All Complaints', icon: LayoutDashboard },
            { id: 'pending' as const, label: 'Pending Verification', icon: ShieldAlert },
            { id: 'critical' as const, label: 'Critical Alerts', icon: Zap },
            { id: 'rejected' as const, label: 'Spam / Rejected', icon: XCircle },
          ].map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'primary' : 'secondary'}
              size="sm"
              icon={<tab.icon size={14} />}
              onClick={() => setActiveTab(tab.id)}
              className="whitespace-nowrap"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Search + Filters */}
        <Card variant="solid" padding="md" className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              inputSize="md"
              placeholder="Search complaints by ID or text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={16} />}
              className="flex-1"
            />
            <Button
              variant="secondary"
              size="md"
              icon={<Filter size={16} />}
              onClick={() => setShowFilters(!showFilters)}
              iconRight={showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            >
              Filters
            </Button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value as ComplaintPriority | "all")}
                    className="bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary"
                  >
                    <option value="all">All Priorities</option>
                    {PRIORITIES.map((p) => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>

                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value as ComplaintCategory | "all")}
                    className="bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary"
                  >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as ComplaintStatus | "all")}
                    className="bg-bg-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary"
                  >
                    <option value="all">All Statuses</option>
                    {STATUSES.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>

                  {(filterPriority !== "all" || filterCategory !== "all" || filterStatus !== "all") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<X size={14} />}
                      onClick={() => { setFilterPriority("all"); setFilterCategory("all"); setFilterStatus("all"); }}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Complaint Data Table */}
        <Card variant="outline" padding="none" className="overflow-hidden border-border/50">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-bg-surface/50 border-b border-border/50 text-text-muted text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">ID & Priority</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">Details</th>
                  <th className="px-6 py-4 font-medium">AI</th>
                  <th className="px-6 py-4 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                      No complaints match your filters
                    </td>
                  </tr>
                ) : (
                  filtered.map((complaint, i) => {
                    const priority = getPriorityConfig(complaint.priority);
                    const category = CATEGORIES.find((c) => c.id === complaint.category);
                    const statusConfig = STATUSES.find((s) => s.id === complaint.status);

                    return (
                      <motion.tr
                        key={complaint.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => setSelectedComplaint(complaint)}
                        className="hover:bg-bg-elevated/50 cursor-pointer transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1.5">
                            <span className="font-mono text-xs text-text-secondary group-hover:text-text-primary transition-colors">{complaint.id}</span>
                            <div>
                              <Badge
                                variant={priority.id === "critical" ? "danger" : priority.id === "high" ? "warning" : "default"}
                                size="sm"
                                pulse={priority.id === "critical"}
                              >
                                {priority.label}
                              </Badge>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1.5 items-start">
                            <span className="font-medium text-text-primary">{category?.label}</span>
                            <div className="flex gap-1">
                              {complaint.reportingMode === "anonymous" && <Badge variant="outline" size="sm">🔒 Anon</Badge>}
                              {complaint.reportingMode === "proxy" && <Badge variant="outline" size="sm">👤 Proxy</Badge>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="max-w-[400px]">
                            <p className="text-text-primary truncate mb-1">{complaint.summary || complaint.rawText}</p>
                            <div className="flex items-center gap-3 text-xs text-text-muted">
                              <span>{formatDateTime(complaint.createdAt)}</span>
                              <span>•</span>
                              <span>{complaint.communityVotes} votes</span>
                              {complaint.location && (
                                <>
                                  <span>•</span>
                                  <span className="truncate max-w-[120px]">{complaint.location}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {complaint.aiDecision && (
                              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                                complaint.aiDecision === 'auto_publish' ? 'bg-success/10 text-success' :
                                complaint.aiDecision === 'pending_review' ? 'bg-warning/10 text-warning' :
                                'bg-danger/10 text-danger'
                              }`}>
                                {complaint.aiDecision === 'auto_publish' ? <ShieldCheck size={10} /> : complaint.aiDecision === 'pending_review' ? <ShieldAlert size={10} /> : <XCircle size={10} />}
                                {complaint.aiDecision === 'auto_publish' ? 'AI OK' : complaint.aiDecision === 'pending_review' ? 'Review' : 'Spam'}
                              </span>
                            )}
                            {complaint.department && (
                              <span className="text-[10px] text-text-muted truncate max-w-[100px]" title={complaint.department}>
                                <Building2 size={10} className="inline mr-0.5" />{complaint.department.split(' ')[0]}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center gap-2 justify-end">
                            {/* Approve / Reject buttons for pending complaints */}
                            {(activeTab === 'pending' || complaint.aiDecision === 'pending_review') && complaint.status === 'submitted' && (
                              <>
                                <button onClick={(e) => { e.stopPropagation(); handleApprove(complaint); }} className="p-1.5 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors" title="Approve">
                                  <CheckCircle2 size={14} />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleReject(complaint); }} className="p-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 transition-colors" title="Reject">
                                  <XCircle size={14} />
                                </button>
                              </>
                            )}
                          </div>
                          <Badge
                            variant={
                              complaint.status === "resolved" ? "success" :
                              complaint.status === "rejected" ? "danger" :
                              complaint.status === "action_taken" ? "warning" :
                              "accent"
                            }
                            size="md"
                            icon={statusIcon(complaint.status)}
                          >
                            {statusConfig?.label}
                          </Badge>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Detail Modal */}
        <Modal
          open={!!selectedComplaint}
          onClose={() => { setSelectedComplaint(null); setActionNote(""); setSelectedOfficer(""); setSelectedStatus(""); }}
          title={selectedComplaint ? `Complaint ${selectedComplaint.id}` : ""}
          size="lg"
        >
          {selectedComplaint && (
            <div className="space-y-6">
              {/* Complaint info */}
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge
                    variant={getPriorityConfig(selectedComplaint.priority).id === "critical" ? "danger" : "warning"}
                    size="md"
                    pulse={selectedComplaint.priority === "critical"}
                  >
                    {getPriorityConfig(selectedComplaint.priority).label} Priority
                  </Badge>
                  <Badge variant="accent" size="md">
                    {CATEGORIES.find((c) => c.id === selectedComplaint.category)?.label}
                  </Badge>
                  <Badge variant="default" size="md">
                    {STATUSES.find((s) => s.id === selectedComplaint.status)?.label}
                  </Badge>
                </div>

                <div className="p-3 rounded-xl bg-bg-primary border border-border mt-3">
                  <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Original Complaint</p>
                  <p className="text-sm text-text-primary leading-relaxed">{selectedComplaint.rawText}</p>
                </div>

                {selectedComplaint.summary && (
                  <div className="p-3 rounded-xl bg-accent/5 border border-accent/20 mt-3">
                    <p className="text-xs text-accent uppercase tracking-wide mb-1">AI Summary</p>
                    <p className="text-sm text-text-primary leading-relaxed">{selectedComplaint.summary}</p>
                  </div>
                )}

                <div className="flex gap-4 mt-3 text-xs text-text-muted">
                  <span>👥 {selectedComplaint.affectedPeople || 0} affected</span>
                  <span>🗳️ {selectedComplaint.communityVotes} community votes</span>
                </div>

                {selectedComplaint.location && (
                  <div className="p-3 rounded-xl bg-bg-elevated border border-border mt-3 flex items-start gap-3">
                    <MapPin size={20} className="text-accent shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-text-primary mb-1">Incident Location</p>
                      <p className="text-sm text-text-secondary">{selectedComplaint.location}</p>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedComplaint.location)}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs text-accent hover:underline font-medium mt-2 inline-block"
                      >
                        View on Google Maps ↗
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Timeline */}
              {selectedComplaint.timeline.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Clock size={16} className="text-accent" /> Timeline
                  </h4>
                  <Timeline steps={buildTimelineSteps(selectedComplaint)} />
                </div>
              )}

              {/* Action panel */}
              <div className="border-t border-border pt-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <MessageSquarePlus size={16} className="text-accent" /> Take Action
                </h4>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-text-secondary mb-1 block">Assign Officer</label>
                      <select
                        value={selectedOfficer}
                        onChange={(e) => setSelectedOfficer(e.target.value)}
                        className="w-full bg-bg-elevated border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary"
                      >
                        <option value="">Select officer...</option>
                        {OFFICERS.map((o) => (
                          <option key={o.id} value={o.id}>{o.name} — {o.role}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-text-secondary mb-1 block">Update Status</label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus)}
                        className="w-full bg-bg-elevated border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary"
                      >
                        <option value="">Select status...</option>
                        {STATUSES.map((s) => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Textarea
                    label="Action Note"
                    placeholder="Describe the action being taken..."
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    className="min-h-[80px]"
                  />

                  {selectedStatus === "resolved" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="overflow-hidden"
                    >
                      <Input
                        label="Proof of Action (Required for Resolution)"
                        placeholder="Image URL or Document Link (e.g., https://img.com/resolved.jpg)"
                        value={proofUrl}
                        onChange={(e) => setProofUrl(e.target.value)}
                        className="w-full"
                        required
                      />
                    </motion.div>
                  )}

                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => { setSelectedComplaint(null); setActionNote(""); }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="md"
                      onClick={handleUpdateComplaint}
                      loading={isUpdating}
                      disabled={!actionNote && !selectedStatus && !selectedOfficer}
                      icon={<Send size={16} />}
                    >
                      Update Complaint
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  );
}
