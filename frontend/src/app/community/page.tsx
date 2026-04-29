"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  AlertTriangle,
  RefreshCw,
  Flame,
  MapPin,
  ArrowUp,
  Filter,
  Search,
  ChevronUp,
  Megaphone,
  Shield,
  BarChart3,
  Eye,
  Clock,
} from "lucide-react";
import type { Complaint } from "@/lib/types";
import { complaintService, type ApiComplaint } from "@/services/complaintService";
import { communityService } from "@/services/communityService";
import { mapApiComplaintToFrontend } from "@/lib/apiTransformers";
import { ComplaintPost } from "@/components/ui/ComplaintPost";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CATEGORIES } from "@/lib/constants";
import { useI18n } from "@/lib/i18n/I18nContext";

/* ============================================
   ANIMATED COUNTER
   ============================================ */
function AnimatedNumber({ value }: { value: number }) {
  return (
    <motion.span
      key={value}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="tabular-nums"
    >
      {value.toLocaleString()}
    </motion.span>
  );
}

/* ============================================
   STAT CARD
   ============================================ */
function StatCard({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 ${
        accent
          ? "bg-accent/5 border-accent/15"
          : "bg-bg-elevated border-border hover:border-border-hover"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
          accent ? "bg-accent/10" : "bg-bg-surface"
        }`}
      >
        <Icon size={18} className={accent ? "text-accent" : "text-text-secondary"} />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold text-text-primary leading-tight">
          <AnimatedNumber value={value} />
        </p>
        <p className="text-xs text-text-muted truncate">{label}</p>
      </div>
    </div>
  );
}

/* ============================================
   CATEGORY CHIP
   ============================================ */
function CategoryChip({
  category,
  count,
  isActive,
  onClick,
}: {
  category: { id: string; label: string; color: string };
  count: number;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border ${
        isActive
          ? "bg-accent text-white border-accent shadow-sm"
          : "bg-bg-elevated text-text-secondary border-border hover:border-border-hover hover:bg-bg-hover"
      }`}
    >
      <span className={isActive ? "text-white" : category.color}>●</span>
      <span>{category.label}</span>
      <span
        className={`text-xs px-1.5 py-0.5 rounded-full ${
          isActive ? "bg-white/20 text-white" : "bg-bg-surface text-text-muted"
        }`}
      >
        {count}
      </span>
    </motion.button>
  );
}

/* ============================================
   TOP ISSUE ROW
   ============================================ */
function TopIssueRow({
  complaint,
  rank,
}: {
  complaint: Complaint;
  rank: number;
}) {
  const category = CATEGORIES.find((c) => c.id === complaint.category);

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.1 }}
      className="group flex items-start gap-3 p-3 rounded-xl hover:bg-bg-surface transition-colors cursor-pointer"
    >
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
          rank === 0
            ? "bg-amber-100 text-amber-700"
            : rank === 1
            ? "bg-zinc-100 text-zinc-500"
            : "bg-orange-50 text-orange-500"
        }`}
      >
        {rank + 1}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary leading-snug line-clamp-2 group-hover:text-accent transition-colors">
          {complaint.summary || complaint.rawText.slice(0, 80)}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="inline-flex items-center gap-1 text-xs text-text-muted">
            <MapPin size={10} />
            {complaint.location || category?.label || "Unknown"}
          </span>
          <span className="text-text-muted text-xs">•</span>
          <span className="inline-flex items-center gap-1 text-xs text-rose-500 font-medium">
            <ArrowUp size={10} />
            {complaint.communityVotes}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ============================================
   MAIN COMMUNITY PAGE
   ============================================ */
export default function CommunityFeedPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { t } = useI18n();

  const loadComplaints = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const { default: api } = await import("@/services/api");
      const res = (await api.get("/complaints/feed?page=1&limit=50")) as unknown as {
        data: ApiComplaint[];
        success: boolean;
      };
      const data = res?.data || [];
      if (Array.isArray(data)) {
        const mapped = data
          .map((c: ApiComplaint) => {
            const complaint = mapApiComplaintToFrontend(c);
            complaint.approved = true;
            return complaint;
          })
          .filter((c) => c.aiDecision !== "rejected");
        setComplaints(mapped);
      }
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load community feed");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  /* Scroll-to-top visibility */
  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleVote = async (id: string) => {
    const complaint = complaints.find((c) => c.id === id);
    if (!complaint?._apiId) return;

    try {
      const result = await communityService.vote(complaint._apiId);
      setComplaints((prev) =>
        prev.map((c) => {
          if (c.id === id) {
            return {
              ...c,
              communityVotes: c.communityVotes + 1,
              genuinenessScore: result?.genuineness_score ?? c.genuinenessScore,
            };
          }
          return c;
        })
      );
    } catch {
      alert("You may have already voted on this complaint.");
    }
  };

  /* Derived data */
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    complaints.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, [complaints]);

  const activeCategories = useMemo(
    () => CATEGORIES.filter((cat) => categoryCounts[cat.id]),
    [categoryCounts]
  );

  const filteredComplaints = useMemo(() => {
    let result = complaints;

    if (selectedCategory) {
      result = result.filter((c) => c.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.rawText.toLowerCase().includes(q) ||
          c.summary?.toLowerCase().includes(q) ||
          c.location?.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => b.communityVotes - a.communityVotes);
  }, [complaints, selectedCategory, searchQuery]);

  const topIssues = useMemo(
    () => [...complaints].sort((a, b) => b.communityVotes - a.communityVotes).slice(0, 5),
    [complaints]
  );

  const totalVotes = useMemo(
    () => complaints.reduce((sum, c) => sum + c.communityVotes, 0),
    [complaints]
  );

  const resolvedCount = useMemo(
    () =>
      complaints.filter(
        (c) =>
          c.status === "resolved" || c.status === "action_taken"
      ).length,
    [complaints]
  );

  /* ===== LOADING ===== */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-12 h-12 border-2 border-accent/20 rounded-full" />
            <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin absolute inset-0" />
          </div>
          <p className="text-sm text-text-muted font-medium">Loading community feed...</p>
        </motion.div>
      </div>
    );
  }

  /* ===== ERROR ===== */
  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-bg-primary">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="outline" padding="lg" className="max-w-md w-full text-center border-danger/30">
            <AlertTriangle size={40} className="text-danger mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Feed Error</h2>
            <p className="text-sm text-text-secondary mb-6">{loadError}</p>
            <Button onClick={loadComplaints} icon={<RefreshCw size={16} />}>
              Retry
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-20">
      {/* ===== HERO HEADER ===== */}
      <div className="relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-olive/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Megaphone size={20} className="text-accent" />
                </div>
                <Badge variant="accent" size="sm" pulse>
                  Live Feed
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-text-primary tracking-tight">
                Community Pulse
              </h1>
              <p className="text-text-secondary mt-2 max-w-lg text-base leading-relaxed">
                Real voices. Real issues. Support the complaints that matter to your
                community and help them reach the right authorities.
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 lg:min-w-[420px]">
              <StatCard
                icon={Eye}
                label="Total Issues"
                value={complaints.length}
                accent
              />
              <StatCard
                icon={ArrowUp}
                label="Total Votes"
                value={totalVotes}
              />
              <StatCard
                icon={Shield}
                label="Resolved"
                value={resolvedCount}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search & Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search issues by keyword, location, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-bg-elevated border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Chips */}
          {activeCategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border ${
                  !selectedCategory
                    ? "bg-accent text-white border-accent shadow-sm"
                    : "bg-bg-elevated text-text-secondary border-border hover:border-border-hover"
                }`}
              >
                <Filter size={14} />
                All
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    !selectedCategory
                      ? "bg-white/20 text-white"
                      : "bg-bg-surface text-text-muted"
                  }`}
                >
                  {complaints.length}
                </span>
              </button>
              {activeCategories.map((cat) => (
                <CategoryChip
                  key={cat.id}
                  category={cat}
                  count={categoryCounts[cat.id] || 0}
                  isActive={selectedCategory === cat.id}
                  onClick={() =>
                    setSelectedCategory((prev) =>
                      prev === cat.id ? null : cat.id
                    )
                  }
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ===== MAIN FEED ===== */}
          <div className="lg:col-span-8 space-y-1">
            {/* Feed Header */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-text-muted font-medium">
                {filteredComplaints.length === 0
                  ? "No issues found"
                  : `Showing ${filteredComplaints.length} issue${filteredComplaints.length !== 1 ? "s" : ""}`}
                {selectedCategory && (
                  <span className="text-accent"> in {CATEGORIES.find(c => c.id === selectedCategory)?.label}</span>
                )}
              </p>
              <button
                onClick={loadComplaints}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors cursor-pointer"
              >
                <RefreshCw size={12} />
                Refresh
              </button>
            </div>

            <AnimatePresence mode="wait">
              {filteredComplaints.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-bg-elevated rounded-2xl border border-border p-16 text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-bg-surface mx-auto mb-5 flex items-center justify-center">
                    <Users size={28} className="text-text-muted" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    {searchQuery ? "No matching issues" : "No complaints yet"}
                  </h3>
                  <p className="text-text-secondary max-w-sm mx-auto">
                    {searchQuery
                      ? "Try adjusting your search terms or removing category filters."
                      : "Be the first to raise an issue for your community."}
                  </p>
                  {(searchQuery || selectedCategory) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory(null);
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="feed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-5"
                >
                  {filteredComplaints.map((complaint, idx) => (
                    <motion.div
                      key={complaint.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.05, 0.3) }}
                    >
                      <ComplaintPost
                        complaint={complaint}
                        onVote={handleVote}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ===== RIGHT SIDEBAR ===== */}
          <div className="hidden lg:block lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Top Issues */}
              {topIssues.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-bg-elevated rounded-2xl border border-border overflow-hidden"
                >
                  <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border bg-gradient-to-r from-amber-50/60 to-transparent">
                    <Flame size={18} className="text-amber-500" />
                    <h3 className="font-display font-bold text-text-primary">
                      Most Supported
                    </h3>
                  </div>
                  <div className="p-2">
                    {topIssues.map((c, i) => (
                      <TopIssueRow key={c.id} complaint={c} rank={i} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Category Breakdown */}
              {activeCategories.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-bg-elevated rounded-2xl border border-border overflow-hidden"
                >
                  <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
                    <BarChart3 size={18} className="text-accent" />
                    <h3 className="font-display font-bold text-text-primary">
                      By Category
                    </h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {activeCategories
                      .sort(
                        (a, b) =>
                          (categoryCounts[b.id] || 0) -
                          (categoryCounts[a.id] || 0)
                      )
                      .map((cat) => {
                        const count = categoryCounts[cat.id] || 0;
                        const pct = complaints.length
                          ? Math.round((count / complaints.length) * 100)
                          : 0;
                        return (
                          <button
                            key={cat.id}
                            onClick={() =>
                              setSelectedCategory((prev) =>
                                prev === cat.id ? null : cat.id
                              )
                            }
                            className={`w-full text-left group cursor-pointer transition-colors rounded-lg p-2 -m-2 ${
                              selectedCategory === cat.id ? "bg-accent/5" : "hover:bg-bg-surface"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-sm font-medium text-text-primary flex items-center gap-2">
                                <span className={cat.color}>●</span>
                                {cat.label}
                              </span>
                              <span className="text-xs text-text-muted tabular-nums">
                                {count} ({pct}%)
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-bg-surface rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{
                                  duration: 0.8,
                                  ease: "easeOut",
                                  delay: 0.4,
                                }}
                                className="h-full rounded-full bg-accent/60"
                              />
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </motion.div>
              )}

              {/* How It Works */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-accent/5 to-olive/5 rounded-2xl border border-accent/10 p-5"
              >
                <h3 className="font-display font-bold text-text-primary mb-3 flex items-center gap-2">
                  <Shield size={16} className="text-accent" />
                  How It Works
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      step: "1",
                      title: "Citizens report issues",
                      desc: "Via voice, text, or AI assistant",
                    },
                    {
                      step: "2",
                      title: "Community verifies",
                      desc: "Vote to boost genuine complaints",
                    },
                    {
                      step: "3",
                      title: "AI routes automatically",
                      desc: "Complaints reach the right department",
                    },
                    {
                      step: "4",
                      title: "Authorities act",
                      desc: "Track progress transparently",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-accent">
                          {item.step}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary leading-snug">
                          {item.title}
                        </p>
                        <p className="text-xs text-text-muted">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== BACK TO TOP ===== */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-8 right-8 w-12 h-12 bg-accent text-white rounded-full shadow-lg shadow-accent/25 flex items-center justify-center hover:bg-accent-hover transition-colors cursor-pointer z-40"
          >
            <ChevronUp size={22} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
