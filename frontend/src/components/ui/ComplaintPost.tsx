"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Bot, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle,
  User,
  ArrowRight,
  Check,
  Send,
  Languages
} from "lucide-react";
import type { Complaint } from "@/lib/types";
import { CATEGORIES, PRIORITIES } from "@/lib/constants";
import { Badge } from "./Badge";
import { Button } from "./Button";
import { useI18n } from "@/lib/i18n/I18nContext";
import { useTranslate } from "@/hooks/useTranslate";

interface ComplaintPostProps {
  complaint: Complaint;
  onVote: (id: string) => void;
}

export function ComplaintPost({ complaint, onVote }: ComplaintPostProps) {
  const [isVoting, setIsVoting] = useState(false);
  
  // Local state for Comments & Sharing (no backend)
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [comments, setComments] = useState<{text: string; date: Date}[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  
  const { t } = useI18n();

  // --- Dynamic Translation ---
  const { translate, isTranslating, isEnglish } = useTranslate();
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);

  useEffect(() => {
    if (isEnglish || !complaint.rawText) {
      setTranslatedText(null);
      return;
    }
    let cancelled = false;
    translate(complaint.rawText).then((result) => {
      if (!cancelled && result !== complaint.rawText) {
        setTranslatedText(result);
      }
    });
    return () => { cancelled = true; };
  }, [complaint.rawText, isEnglish, translate]);

  const category = CATEGORIES.find((c) => c.id === complaint.category);
  const priority = PRIORITIES.find((p) => p.id === complaint.priority);
  const isEscalated = complaint.communityVotes >= 50 || (complaint.escalationLevel && complaint.escalationLevel > 0) || complaint.status === 'action_taken' || complaint.status === 'resolved' || complaint.priority === 'critical';

  const handleVote = () => {
    setIsVoting(true);
    onVote(complaint.id);
    setTimeout(() => setIsVoting(false), 500);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/processing?id=${complaint.id}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    setComments([...comments, { text: replyText.trim(), date: new Date() }]);
    setReplyText("");
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-elevated border border-border rounded-2xl p-4 sm:p-6 mb-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
    >
      {/* Top Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-bg-surface flex items-center justify-center border border-border">
            <User size={20} className="text-text-secondary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-text-primary">
                {complaint.reportingMode === "anonymous" ? t("post.anonymous") || "Anonymous Citizen" : t("post.verified") || "Verified Citizen"}
              </span>
              {complaint.reportingMode !== "anonymous" && (
                <ShieldCheck size={14} className="text-accent" />
              )}
            </div>
            <div className="text-xs text-text-secondary flex items-center gap-2">
              <span>{formatDistanceToNow(new Date(complaint.createdAt))} ago</span>
              {complaint.location && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {complaint.location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        <Badge variant={priority?.id === "critical" ? "danger" : "default"}>
          {category?.label}
        </Badge>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-text-primary text-base sm:text-lg leading-relaxed mb-1">
          {showOriginal || !translatedText ? complaint.rawText : translatedText}
        </p>

        {/* Translation toggle */}
        {translatedText && (
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-accent transition-colors cursor-pointer mb-2"
          >
            <Languages size={12} />
            {showOriginal ? "View Translation" : "View Original"}
          </button>
        )}
        {isTranslating && !translatedText && (
          <span className="inline-flex items-center gap-1 text-xs text-text-muted mb-2">
            <Languages size={12} className="animate-pulse" />
            Translating...
          </span>
        )}
        
        {/* Actual Uploaded Media */}
        {complaint.mediaUrls && complaint.mediaUrls.length > 0 ? (
          <div className={`grid gap-2 mb-4 ${complaint.mediaUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {complaint.mediaUrls.map((url, idx) => (
              <div key={idx} className="w-full h-48 bg-bg-surface rounded-xl border border-border flex items-center justify-center overflow-hidden">
                <img src={url} alt={`Evidence ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        ) : complaint.category === "roads" ? (
          <div className="w-full h-48 bg-bg-surface rounded-xl border border-border flex items-center justify-center mb-4 overflow-hidden">
            <img src="/sectors/roads.png" alt="Pothole" className="w-full h-full object-cover opacity-80" />
          </div>
        ) : null}
      </div>

      {/* AI Routing Tag */}
      <AnimatePresence>
        {isEscalated ? (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-4 bg-accent/5 border border-accent/20 rounded-xl p-3 flex items-start gap-3"
          >
            <Bot size={20} className="text-accent mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-1 flex items-center gap-2">
                {complaint.priority === 'critical' ? 'CRITICAL ALERT - ROUTED' : t("comm.post.routed")}
                {complaint.aiConfidence !== undefined && (
                  <Badge variant="accent" size="sm">{(complaint.aiConfidence * 100).toFixed(0)}% Match</Badge>
                )}
              </p>
              <p className="text-sm text-text-primary">
                {t("post.sentTo") || "Sent to:"} <span className="font-medium">{complaint.routedTo}</span> ({complaint.department})
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="mb-4 bg-warning/5 border border-warning/20 rounded-xl p-3 flex items-start gap-3">
            <AlertTriangle size={20} className="text-warning mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-warning uppercase tracking-wider mb-1">
                {t("comm.post.pending")}
              </p>
              <p className="text-sm text-text-secondary">
                Needs {50 - complaint.communityVotes} {t("post.needsVotes") || "more votes to automatically alert the authorities."}
              </p>
              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-border rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-warning transition-all duration-500"
                  style={{ width: `${Math.min(100, (complaint.communityVotes / 50) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-border/60">
        <div className="flex items-center gap-4 sm:gap-6">
          <button 
            onClick={handleVote}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${isVoting ? 'text-rose-500 scale-110' : 'text-text-secondary hover:text-rose-500'}`}
          >
            <Heart size={20} className={complaint.communityVotes > 0 ? "fill-rose-100" : ""} />
            <span>{complaint.communityVotes}</span>
          </button>
          <button 
            onClick={() => setShowReply(!showReply)}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${showReply ? 'text-accent' : 'text-text-secondary hover:text-accent'}`}
          >
            <MessageSquare size={20} />
            <span>{comments.length > 0 ? comments.length : t("comm.post.reply")}</span>
          </button>
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-accent transition-colors"
          >
            {isCopied ? <Check size={20} className="text-success" /> : <Share2 size={20} />}
            <span className={isCopied ? "text-success" : ""}>{isCopied ? "Copied!" : "Share"}</span>
          </button>
        </div>
      </div>

      {/* Reply / Comment Section (Local State) */}
      <AnimatePresence>
        {showReply && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border mt-4 pt-4"
          >
            {comments.length > 0 && (
              <div className="space-y-3 mb-4 max-h-40 overflow-y-auto hide-scrollbar">
                {comments.map((comment, i) => (
                  <div key={i} className="flex gap-3 bg-bg-surface p-3 rounded-xl border border-border">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <User size={14} className="text-accent" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-text-primary">You</span>
                        <span className="text-[10px] text-text-muted">{formatDistanceToNow(comment.date)} ago</span>
                      </div>
                      <p className="text-sm text-text-secondary">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Write a comment..." 
                className="flex-1 bg-bg-surface border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-accent text-text-primary"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply()}
              />
              <button 
                onClick={handleSubmitReply}
                disabled={!replyText.trim()}
                className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-hover transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
