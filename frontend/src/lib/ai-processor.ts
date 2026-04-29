import type { AISummary, ComplaintCategory, ComplaintPriority } from "./types";

/* ============================================
   MOCK AI COMPLAINT PROCESSOR
   ============================================ */

/* --- Keyword maps --- */
const CATEGORY_KEYWORDS: Record<ComplaintCategory, string[]> = {
  water: ["water", "supply", "tap", "pipeline", "bore", "well", "drinking", "tank", "pump", "pani"],
  roads: ["road", "pothole", "highway", "bridge", "footpath", "street", "NH", "accident", "crack", "tar"],
  sanitation: ["garbage", "waste", "trash", "dump", "sweeper", "drain", "sewer", "mosquito", "smell", "toilet"],
  harassment: ["harass", "threaten", "stalk", "intimidat", "bully", "abuse", "molest"],
  corruption: ["bribe", "bribery", "corrupt", "money", "payment", "extra", "illegal", "demand", "commission", "BDO"],
  ration: ["ration", "PDS", "card", "wheat", "rice", "kerosene", "quota", "dealer", "shop", "fair price"],
  safety: ["danger", "unsafe", "accident", "fire", "collapse", "electric", "wire", "flood", "risk"],
  abuse: ["beat", "hit", "assault", "violence", "domestic", "attack", "injure", "hurt", "torture"],
  other: [],
};

const URGENCY_KEYWORDS: Record<string, number> = {
  death: 10, died: 10, killed: 10, murder: 10,
  emergency: 9, critical: 9, urgent: 9, danger: 9, fire: 9,
  injured: 8, accident: 8, hospital: 8, sick: 8, disease: 8,
  children: 7, women: 7, elderly: 7, disabled: 7, pregnant: 7,
  threat: 6, fear: 6, afraid: 6, scared: 6,
  weeks: 5, months: 5, "long time": 5, repeated: 5,
  many: 4, families: 4, village: 4, community: 4, ward: 4,
  bribe: 4, corrupt: 4, illegal: 4,
  complaint: 2, issue: 2, problem: 2, request: 2,
};

const LOCATION_PATTERNS = [
  /(?:ward|block|district|village|town|city|area|sector|colony|mohalla|nagar|gram)\s*(?:no\.?\s*)?(\d+|\w+)/gi,
  /(?:near|at|in)\s+(?:the\s+)?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
  /(?:NH|SH|MC|MR)-?\s*\d+/gi,
];

/* ============================================
   PROCESSOR FUNCTIONS
   ============================================ */

export function detectCategory(text: string): ComplaintCategory {
  const lower = text.toLowerCase();
  let bestCategory: ComplaintCategory = "other";
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = keywords.reduce((sum, kw) => {
      return sum + (lower.includes(kw) ? 1 : 0);
    }, 0);
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category as ComplaintCategory;
    }
  }

  return bestCategory;
}

export function estimatePriority(text: string, category: ComplaintCategory): ComplaintPriority {
  const lower = text.toLowerCase();
  let score = 0;

  // Check urgency keywords
  for (const [keyword, weight] of Object.entries(URGENCY_KEYWORDS)) {
    if (lower.includes(keyword)) score += weight;
  }

  // Category bonus
  const highPriorityCategories: ComplaintCategory[] = ["harassment", "abuse", "safety", "corruption"];
  if (highPriorityCategories.includes(category)) score += 5;

  // People count heuristic
  const numberMatch = text.match(/(\d+)\s*(people|families|houses|children|persons)/i);
  if (numberMatch) {
    const count = parseInt(numberMatch[1]);
    if (count > 100) score += 5;
    else if (count > 50) score += 3;
    else if (count > 10) score += 2;
  }

  if (score >= 15) return "critical";
  if (score >= 8) return "high";
  if (score >= 4) return "medium";
  return "low";
}

export function extractLocation(text: string): string | null {
  for (const pattern of LOCATION_PATTERNS) {
    const match = pattern.exec(text);
    if (match) return match[0];
  }
  return null;
}

export function estimateAffectedPeople(text: string): number {
  const match = text.match(/(\d+)\s*(people|families|houses|children|persons|villagers|residents)/i);
  if (match) return parseInt(match[1]);

  const lower = text.toLowerCase();
  if (lower.includes("village") || lower.includes("community")) return 500;
  if (lower.includes("ward") || lower.includes("colony")) return 200;
  if (lower.includes("many") || lower.includes("several")) return 50;
  return 10;
}

export function generateSummary(text: string): string {
  // Clean and shorten the raw text
  const sentences = text.replace(/\s+/g, " ").trim().split(/[.!?]+/).filter(Boolean);
  if (sentences.length <= 2) return text.trim();
  // Take the first 2 most relevant sentences
  return sentences.slice(0, 2).join(". ").trim() + ".";
}

export function generateFormalStatement(text: string, category: ComplaintCategory, location: string | null): string {
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
  const locationStr = location ? ` in ${location}` : "";
  const summary = generateSummary(text);
  return `A complaint has been registered regarding ${categoryLabel} issues${locationStr}. ${summary} Immediate attention and appropriate action are requested.`;
}

/* ============================================
   MAIN PROCESSOR
   ============================================ */

export function processComplaint(rawText: string): AISummary {
  const category = detectCategory(rawText);
  const priority = estimatePriority(rawText, category);
  const location = extractLocation(rawText);
  const affectedPeople = estimateAffectedPeople(rawText);
  const summary = generateSummary(rawText);
  const formalStatement = generateFormalStatement(rawText, category, location);

  // Extract top keywords
  const words = rawText.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
  const wordFreq = new Map<string, number>();
  words.forEach((w) => wordFreq.set(w, (wordFreq.get(w) || 0) + 1));
  const keywords = Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([w]) => w);

  const urgencyReasons: string[] = [];
  if (priority === "critical") urgencyReasons.push("Immediate danger or severe harm detected");
  if (affectedPeople > 100) urgencyReasons.push(`${affectedPeople}+ people affected`);
  if (["harassment", "abuse", "safety"].includes(category)) urgencyReasons.push("Sensitive category requires urgent attention");

  return {
    category,
    priority,
    summary,
    formalStatement,
    location,
    affectedPeople,
    keywords,
    urgencyReason: urgencyReasons.join(". ") || "Standard processing priority",
  };
}
