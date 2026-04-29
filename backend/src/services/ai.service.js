/**
 * AI Service — Intelligent Complaint Moderation with Google Gemini.
 * Provides: spam detection, authenticity scoring, priority classification,
 * department routing, safety escalation, and publish decisions.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../config/env');
const ComplaintModel = require('../models/complaint.model');
const AuditLogModel = require('../models/auditLog.model');
const { AUDIT_ACTIONS, CATEGORIES, PRIORITIES, DEPARTMENTS, SAFETY_KEYWORDS } = require('../config/constants');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

let genAI = null;

function getGenAI() {
  if (!genAI) {
    if (!env.geminiApiKey) throw AppError.internal('Gemini API key not configured');
    genAI = new GoogleGenerativeAI(env.geminiApiKey);
  }
  return genAI;
}

/* ══════════════════════════════════════════════
   SYSTEM PROMPT — Full Moderation Engine
   ══════════════════════════════════════════════ */

const MODERATION_PROMPT = `You are an AI moderation engine for a government civic grievance platform called VISHWAS.

Analyze the citizen complaint and return ONLY valid JSON with these fields:

{
  "summary": "2-3 sentence official summary of the complaint",
  "english_translation": "If the complaint is in a non-English language, translate it to English here. Otherwise set to null",
  "category": "one of: ${CATEGORIES.join(', ')}",
  "priority": "one of: ${PRIORITIES.join(', ')}",
  "urgency_score": <number 0-100>,
  "authenticity_score": <number 0-100, how genuine/real the complaint sounds>,
  "spam_score": <number 0-100, how likely this is spam/nonsense/fake>,
  "sentiment": "positive | negative | neutral | hostile",
  "is_spam": <boolean>,
  "is_abusive": <boolean, contains hate speech or threats toward platform>,
  "is_duplicate_risk": <boolean, sounds very generic/common>,
  "public_safety_risk": <boolean, involves crime/violence/emergency>,
  "publish_decision": "auto_publish | pending_review | rejected",
  "rejection_reason": "If rejected, explain why clearly. Otherwise null",
  "department": "the government department that should handle this",
  "key_issues": ["issue1", "issue2"],
  "moderation_notes": "Brief internal note for admin about the decision"
}

DECISION RULES:
- auto_publish: Genuine complaint about civic/municipal issues (water, roads, sanitation, ration, etc.) with clear details. Authenticity >= 60, Spam <= 30.
- pending_review: Genuine but sensitive (corruption, harassment, abuse, crime, high-impact allegations, claims without evidence). OR authenticity 40-60. OR public_safety_risk is true.
- rejected: Nonsense text, gibberish, empty/meaningless, pure abuse toward platform, meme descriptions, test messages. Spam >= 70 OR authenticity <= 25.

PRIORITY RULES:
- critical: Active crime, violence, fire, medical emergency, child/women danger, severe corruption affecting many
- high: Many people affected, water/electricity outage, school/hospital impact, safety concern
- medium: Local service disruption, moderate impact, repeated issue
- low: Minor inconvenience, cosmetic issue, single person non-urgent issue

DEPARTMENT MAPPING:
${Object.entries(DEPARTMENTS).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

Return ONLY the JSON object. No markdown, no explanation.`;

/* ══════════════════════════════════════════════
   RULE ENGINE FALLBACK
   ══════════════════════════════════════════════ */

function runRuleEngineFallback(rawText, category) {
  const text = (rawText || '').toLowerCase().trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // Detect safety keywords
  const detectedSafetyWords = SAFETY_KEYWORDS.filter(kw => text.includes(kw));
  const hasSafetyRisk = detectedSafetyWords.length > 0;

  // ── CIVIC RELEVANCE SCORING ──────────────────────
  // Keywords that indicate a real civic complaint
  const civicKeywords = [
    'water', 'road', 'pothole', 'drain', 'sewage', 'garbage', 'waste', 'electricity',
    'power', 'supply', 'outage', 'broken', 'damaged', 'flooded', 'flooding', 'leak',
    'repair', 'maintenance', 'streetlight', 'light', 'pollution', 'noise', 'sanitation',
    'health', 'hospital', 'school', 'ration', 'bribe', 'corruption', 'harass', 'threat',
    'unsafe', 'danger', 'accident', 'collapse', 'bridge', 'building', 'illegal',
    'encroachment', 'construction', 'traffic', 'signal', 'park', 'footpath', 'sidewalk',
    'public', 'toilet', 'drinking', 'pipeline', 'tap', 'well', 'bore', 'pump',
    'complaint', 'problem', 'issue', 'help', 'please', 'urgent', 'since', 'days',
    'weeks', 'months', 'people', 'residents', 'colony', 'area', 'village', 'ward',
    'society', 'street', 'lane', 'nagar', 'mohalla', 'gali', 'chowk',
    'paani', 'sadak', 'bijli', 'nali', 'safai', 'kachra', // Hindi civic words
  ];

  // Keywords that indicate noise/spam
  const noiseKeywords = [
    'lol', 'haha', 'rofl', 'lmao', 'test', 'testing', 'hello', 'hi there',
    'asdf', 'qwerty', 'just checking', 'nothing', 'random', 'idk', 'whatever',
    'blah', 'abc', 'xyz', 'dancing', 'singing', 'playing', 'eating', 'sleeping',
    'movie', 'song', 'game', 'funny', 'joke', 'meme', 'cool', 'nice',
    'ok', 'okay', 'bye', 'thanks', 'thank you',
  ];

  const civicMatches = civicKeywords.filter(kw => text.includes(kw));
  const noiseMatches = noiseKeywords.filter(kw => text.includes(kw));
  const civicScore = civicMatches.length;
  const noiseScore = noiseMatches.length;

  // ── SPAM DETECTION ────────────────────────────────
  const isGibberish = /(.)\1{4,}/.test(text); // repeated chars like "aaaaaa"
  const isTooShort = wordCount < 5 && civicScore === 0;
  const isNonsense = noiseScore > 0 && civicScore === 0;
  const isNoCivicRelevance = civicScore === 0 && wordCount < 15;
  const isLikelySpam = isGibberish || isTooShort || isNonsense || isNoCivicRelevance;

  // ── AUTHENTICITY SCORING ──────────────────────────
  let authenticity = 20; // Start low, build up with evidence
  if (civicScore >= 1) authenticity += 25;
  if (civicScore >= 3) authenticity += 15;
  if (civicScore >= 5) authenticity += 10;
  if (wordCount >= 10) authenticity += 15;
  if (wordCount >= 20) authenticity += 10;
  if (wordCount >= 40) authenticity += 5;
  if (text.includes('please') || text.includes('help') || text.includes('urgent')) authenticity += 5;
  if (text.match(/\d+/)) authenticity += 5; // Contains numbers (addresses, dates, quantities)
  // Penalties
  if (noiseScore > 0) authenticity -= 20;
  if (isGibberish) authenticity = 5;
  if (isTooShort && civicScore === 0) authenticity = 10;

  // ── SPAM SCORE ────────────────────────────────────
  let spamScore = 10;
  if (noiseScore > 0) spamScore += 30;
  if (isGibberish) spamScore = 95;
  if (isTooShort) spamScore += 25;
  if (isNoCivicRelevance) spamScore += 25;
  if (civicScore >= 2) spamScore = Math.max(0, spamScore - 30);

  // ── PRIORITY ──────────────────────────────────────
  let priority = 'medium';
  let urgency = 40;
  if (hasSafetyRisk) {
    priority = 'critical';
    urgency = 95;
  } else if (civicScore >= 4 || wordCount > 30) {
    priority = 'high';
    urgency = 70;
  } else if (civicScore >= 2) {
    priority = 'medium';
    urgency = 50;
  } else {
    priority = 'low';
    urgency = 25;
  }

  // ── CATEGORY DETECTION (if not provided) ──────────
  let detectedCategory = category || 'other';
  if (!category || category === 'other') {
    if (text.match(/water|paani|tap|pipeline|bore|pump|supply/)) detectedCategory = 'water';
    else if (text.match(/road|pothole|bridge|traffic|sadak/)) detectedCategory = 'roads';
    else if (text.match(/garbage|waste|sewage|drain|kachra|safai|nali/)) detectedCategory = 'sanitation';
    else if (text.match(/harass|molest|stalk|eve.teas/)) detectedCategory = 'harassment';
    else if (text.match(/bribe|corrupt|scam|fraud/)) detectedCategory = 'corruption';
    else if (text.match(/ration|food|supply|bijli|electricity/)) detectedCategory = 'ration';
    else if (text.match(/danger|unsafe|accident|fire/)) detectedCategory = 'safety';
    else if (text.match(/abuse|beat|assault|violen/)) detectedCategory = 'abuse';
  }

  const department = DEPARTMENTS[detectedCategory] || DEPARTMENTS.other;

  // ── PUBLISH DECISION ──────────────────────────────
  let publishDecision = 'auto_publish';
  let rejectionReason = null;

  if (isLikelySpam) {
    publishDecision = 'rejected';
    if (isGibberish) rejectionReason = 'Your submission contains gibberish text. Please describe a real civic issue clearly.';
    else if (isTooShort) rejectionReason = 'Your complaint is too short. Please provide at least a few sentences describing the problem, location, and impact.';
    else if (isNonsense) rejectionReason = 'Your submission does not appear to describe a civic issue. Please report a genuine public concern.';
    else rejectionReason = 'Your submission could not be identified as a civic grievance. Please provide more details about the problem.';
  } else if (hasSafetyRisk || ['harassment', 'corruption', 'abuse'].includes(detectedCategory)) {
    publishDecision = 'pending_review';
  }

  // ── SENTIMENT ─────────────────────────────────────
  let sentiment = 'neutral';
  if (hasSafetyRisk || text.match(/angry|furious|disgusted|outraged|pathetic/)) sentiment = 'hostile';
  else if (text.match(/bad|terrible|worst|poor|broken|damaged|suffering|dying/)) sentiment = 'negative';
  else if (text.match(/thank|good|help|hope/)) sentiment = 'positive';

  // Generate smart summary
  let summary;
  if (isLikelySpam) {
    summary = `[Spam Detected] ${rawText.slice(0, 100)}`;
  } else {
    const issues = civicMatches.slice(0, 3).join(', ');
    summary = issues
      ? `Civic complaint regarding ${issues}. ${rawText.slice(0, 150)}`
      : rawText.slice(0, 200);
  }

  return {
    summary,
    english_translation: null,
    category: detectedCategory,
    priority,
    urgency_score: Math.min(100, Math.max(0, urgency)),
    authenticity_score: Math.min(100, Math.max(0, authenticity)),
    spam_score: Math.min(100, Math.max(0, spamScore)),
    sentiment,
    is_spam: isLikelySpam,
    is_abusive: text.match(/fuck|shit|bastard|idiot|stupid/i) ? true : false,
    is_duplicate_risk: false,
    public_safety_risk: hasSafetyRisk,
    publish_decision: publishDecision,
    rejection_reason: rejectionReason,
    department,
    key_issues: civicScore > 0 ? civicMatches.slice(0, 5) : noiseScore > 0 ? ['non-civic content'] : ['unclassified'],
    moderation_notes: `Rule-engine: civic_score=${civicScore}, noise_score=${noiseScore}, word_count=${wordCount}, spam=${isLikelySpam}`,
    _fallback: true,
  };
}

/* ══════════════════════════════════════════════
   AI SERVICE
   ══════════════════════════════════════════════ */

const AIService = {
  /**
   * Moderate a complaint using Gemini AI.
   * Returns a comprehensive analysis object without touching the database.
   */
  async moderateComplaint(rawText, category, location) {
    try {
      const ai = getGenAI();
      const model = ai.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
      });

      const userPrompt = `Category: ${category || 'unknown'}\nLocation: ${location || 'not specified'}\n\nComplaint Text:\n${rawText}`;
      const result = await model.generateContent([{ text: MODERATION_PROMPT }, { text: userPrompt }]);
      const responseText = result.response.text();

      let analysis;
      try {
        analysis = JSON.parse(responseText);
      } catch (parseErr) {
        logger.error('AI moderation parse failed, falling back to rule engine', { error: parseErr.message });
        return runRuleEngineFallback(rawText, category);
      }

      // Validate and clamp values
      analysis.urgency_score = Math.min(100, Math.max(0, parseInt(analysis.urgency_score, 10) || 50));
      analysis.authenticity_score = Math.min(100, Math.max(0, parseInt(analysis.authenticity_score, 10) || 50));
      analysis.spam_score = Math.min(100, Math.max(0, parseInt(analysis.spam_score, 10) || 0));

      // Validate category
      if (!CATEGORIES.includes(analysis.category)) analysis.category = category || 'other';
      // Validate priority
      if (!PRIORITIES.includes(analysis.priority)) analysis.priority = 'medium';
      // Validate publish_decision
      if (!['auto_publish', 'pending_review', 'rejected', 'duplicate'].includes(analysis.publish_decision)) {
        analysis.publish_decision = 'pending_review';
      }

      // Safety override: force critical + pending_review for safety threats
      const textLower = rawText.toLowerCase();
      const hasSafetyKeyword = SAFETY_KEYWORDS.some(kw => textLower.includes(kw));
      if (hasSafetyKeyword) {
        analysis.public_safety_risk = true;
        if (analysis.priority !== 'critical') analysis.priority = 'critical';
        if (analysis.publish_decision === 'auto_publish') analysis.publish_decision = 'pending_review';
        analysis.urgency_score = Math.max(analysis.urgency_score, 90);
      }

      // Ensure department is set
      if (!analysis.department) {
        analysis.department = DEPARTMENTS[analysis.category] || DEPARTMENTS.other;
      }

      logger.info(`AI moderated: decision=${analysis.publish_decision}, priority=${analysis.priority}, authenticity=${analysis.authenticity_score}`);
      return analysis;

    } catch (err) {
      logger.error('Gemini API call failed, using rule engine fallback', { error: err.message });
      return runRuleEngineFallback(rawText, category);
    }
  },

  /**
   * Process an existing complaint by ID (legacy method for admin-triggered processing).
   */
  async processComplaint(complaintId) {
    const complaint = await ComplaintModel.findById(complaintId);
    if (!complaint) throw AppError.notFound('Complaint not found');
    if (!complaint.raw_text) throw AppError.badRequest('Complaint has no text to analyze');

    const analysis = await this.moderateComplaint(complaint.raw_text, complaint.category, complaint.location);

    const aiSummaryPayload = JSON.stringify({
      summary: analysis.summary,
      decision: analysis.publish_decision,
      department: analysis.department,
      spam_score: analysis.spam_score,
      authenticity_score: analysis.authenticity_score,
      sentiment: analysis.sentiment,
      is_spam: analysis.is_spam,
      is_abusive: analysis.is_abusive,
      public_safety_risk: analysis.public_safety_risk,
      key_issues: analysis.key_issues,
      moderation_notes: analysis.moderation_notes,
      english_translation: analysis.english_translation,
      rejection_reason: analysis.rejection_reason,
    });

    const updates = {
      ai_summary: aiSummaryPayload,
      category: analysis.category,
      priority: analysis.priority,
      urgency_score: analysis.urgency_score,
      genuineness_score: analysis.authenticity_score,
    };

    const updated = await ComplaintModel.update(complaintId, updates);

    await AuditLogModel.create({
      complaint_id: complaintId,
      action: AUDIT_ACTIONS.AI_MODERATED,
      actor: null,
      metadata: { model: 'gemini-2.5-flash', decision: analysis.publish_decision },
    });

    return { complaint: updated, analysis };
  },
};

module.exports = AIService;
