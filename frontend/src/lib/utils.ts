import type { ComplaintPriority, ComplaintStatus } from "./types";
import { STATUSES, PRIORITIES, ESCALATION_THRESHOLDS } from "./constants";

/* ============================================
   ID & PIN GENERATION
   ============================================ */

/** Generates a complaint ID like "NV-2026-A3X7K" */
export function generateComplaintId(): string {
  const year = new Date().getFullYear();
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No ambiguous chars (0/O, 1/I)
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `NV-${year}-${code}`;
}

/** Generates a 6-digit PIN */
export function generatePin(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/* ============================================
   DATE / TIME FORMATTERS
   ============================================ */

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(dateString: string): string {
  return `${formatDate(dateString)}, ${formatTime(dateString)}`;
}

export function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(dateString);
}

/* ============================================
   STATUS & PRIORITY HELPERS
   ============================================ */

export function getStatusConfig(status: ComplaintStatus) {
  return STATUSES.find((s) => s.id === status) ?? STATUSES[0];
}

export function getPriorityConfig(priority: ComplaintPriority) {
  return PRIORITIES.find((p) => p.id === priority) ?? PRIORITIES[3];
}

export function getStatusOrder(status: ComplaintStatus): number {
  return getStatusConfig(status).order;
}

export function isStatusBefore(a: ComplaintStatus, b: ComplaintStatus): boolean {
  return getStatusOrder(a) < getStatusOrder(b);
}

/* ============================================
   ESCALATION
   ============================================ */

export function getEscalationLevel(createdAt: string, status: ComplaintStatus): number {
  if (status === "resolved" || status === "action_taken") return 0;
  const age = Date.now() - new Date(createdAt).getTime();
  if (age >= ESCALATION_THRESHOLDS.level3) return 3;
  if (age >= ESCALATION_THRESHOLDS.level2) return 2;
  if (age >= ESCALATION_THRESHOLDS.level1) return 1;
  return 0;
}

/* ============================================
   STRING UTILS
   ============================================ */

export function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max).trimEnd() + "…";
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Joins class names, filtering out falsy values */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
