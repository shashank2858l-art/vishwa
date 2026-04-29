import type { Complaint } from "./types";
import { STORAGE_KEYS } from "./constants";

/* ============================================
   LOCALSTORAGE HELPERS
   ============================================ */

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn(`Failed to save to localStorage key: ${key}`);
  }
}

/* ============================================
   COMPLAINT CRUD
   ============================================ */

export function getComplaints(): Complaint[] {
  let complaints = getItem<Complaint[]>(STORAGE_KEYS.complaints, []);
  if (complaints.length === 0) {
    const mockData: Complaint[] = [
      {
        id: "NV-2026-A1X9",
        pin: "1234",
        rawText: "The municipal water pipeline on MG Road burst 3 days ago. Over 500 liters of clean water are being wasted every hour. The local authorities have been notified but no action has been taken yet. This is causing severe water shortages in Sector 4.",
        category: "water",
        priority: "high",
        status: "action_taken",
        reportingMode: "self",
        summary: "Major water pipeline burst on MG Road causing water shortages in Sector 4 for 3 days.",
        location: "MG Road, Sector 4",
        affectedPeople: 2500,
        mediaUrls: [],
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        communityVotes: 342,
        validatorEndorsements: 5,
        genuinenessScore: 94,
        timeline: [],
        proofOfAction: [],
        escalationLevel: 2,
        department: "Water Supply & Sanitation",
        routedTo: "Ministry of Jal Shakti",
        aiConfidence: 0.98,
        amountRaised: 0,
        targetAmount: 0,
        approved: true,
      },
      {
        id: "NV-2026-B4Y2",
        pin: "1234",
        rawText: "Massive pothole on the main highway near the primary school. Two fatal accidents occurred here last week. The contractor used substandard materials.",
        category: "roads",
        priority: "critical",
        status: "under_review",
        reportingMode: "self",
        summary: "Dangerous pothole near primary school on main highway causing accidents.",
        location: "NH-48, near Sunrise School",
        affectedPeople: 10000,
        mediaUrls: [],
        createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        communityVotes: 128,
        validatorEndorsements: 3,
        genuinenessScore: 88,
        timeline: [],
        proofOfAction: [],
        escalationLevel: 1,
        department: "Public Works Department",
        routedTo: "Ministry of Road Transport",
        aiConfidence: 0.95,
        amountRaised: 12500,
        targetAmount: 25000,
        approved: true,
      },
      {
        id: "NV-2026-C7Z8",
        pin: "1234",
        rawText: "Local ration shop owner is denying food grains to BPL card holders unless they pay a bribe of Rs. 200 per family. This is extortion.",
        category: "corruption",
        priority: "high",
        status: "verified",
        reportingMode: "anonymous",
        summary: "Ration shop owner extorting bribes from BPL families.",
        location: "Ward 12, Ration Depot #44",
        affectedPeople: 400,
        mediaUrls: [],
        createdAt: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 hours ago
        updatedAt: new Date().toISOString(),
        communityVotes: 42, // Under threshold
        validatorEndorsements: 1,
        genuinenessScore: 75,
        timeline: [],
        proofOfAction: [],
        escalationLevel: 0,
        approved: false,
      }
    ];
    setItem(STORAGE_KEYS.complaints, mockData);
    complaints = mockData;
  }
  return complaints;
}

export function saveComplaint(complaint: Complaint): void {
  const complaints = getComplaints();
  const index = complaints.findIndex((c) => c.id === complaint.id);
  if (index >= 0) {
    complaints[index] = complaint;
  } else {
    complaints.unshift(complaint);
  }
  setItem(STORAGE_KEYS.complaints, complaints);
}

export function getComplaintById(id: string): Complaint | null {
  return getComplaints().find((c) => c.id === id) ?? null;
}

export function getComplaintByIdAndPin(id: string, pin: string): Complaint | null {
  const complaint = getComplaintById(id);
  if (complaint && complaint.pin === pin) return complaint;
  return null;
}

export function updateComplaintStatus(
  id: string,
  updates: Partial<Complaint>
): Complaint | null {
  const complaints = getComplaints();
  const index = complaints.findIndex((c) => c.id === id);
  if (index < 0) return null;
  complaints[index] = { ...complaints[index], ...updates, updatedAt: new Date().toISOString() };
  setItem(STORAGE_KEYS.complaints, complaints);
  return complaints[index];
}

export function deleteComplaint(id: string): void {
  const complaints = getComplaints().filter((c) => c.id !== id);
  setItem(STORAGE_KEYS.complaints, complaints);
}

export function clearAllComplaints(): void {
  setItem(STORAGE_KEYS.complaints, []);
}
