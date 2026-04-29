# Trust-Mediated Grievance Platform — Project Plan

## Overview

A premium, voice-first grievance system enabling low-literacy and vulnerable communities to safely report civic issues (corruption, ration denial, harassment, etc.), track complaint progress with tamper-resistant timelines, and verify real action by authorities. Built as a polished hackathon demo with frontend-only independence.

**Project Type:** WEB (Next.js 14 App Router)
**Scope:** Frontend MVP — mock APIs, localStorage persistence, no real backend
**Timeline:** 36-hour hackathon

---

## Success Criteria

- [ ] All 6 pages render and navigate correctly
- [ ] Voice input works in Chrome, graceful fallback elsewhere
- [ ] Full complaint flow: Submit → AI Process → Track → Admin Action → Resolve
- [ ] Anonymous + Proxy reporting modes functional
- [ ] Admin dashboard with assign/update/resolve actions
- [ ] Community verification with support votes
- [ ] Proof-of-action trail with before/after evidence
- [ ] Mobile-responsive, accessible, low-literacy friendly
- [ ] Premium dark UI with meaningful animations
- [ ] Demo scenarios pre-loaded for presentation

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 14 (App Router) | File-based routing, API route stubs, SSR-ready |
| Language | TypeScript | Type safety, better DX |
| Styling | Tailwind CSS v4 | Rapid prototyping, CSS-first config, design tokens |
| Animations | Framer Motion | Declarative, performant, React-native integration |
| Voice | Web Speech API + fallback | Browser-native, zero dependencies |
| AI Mock | Rule-based engine | Deterministic, reliable demo |
| State | React state + localStorage | No backend dependency |
| Icons | Lucide React | Consistent, tree-shakeable |
| Fonts | Google Fonts (Inter + Outfit) | Modern, readable, low-literacy friendly |

---

## Design System

### Color Palette (NO purple/violet)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `oklch(0.13 0.02 250)` | Deep slate background |
| `--bg-surface` | `oklch(0.18 0.02 250)` | Card/surface background |
| `--bg-elevated` | `oklch(0.22 0.02 250)` | Elevated panels |
| `--accent-primary` | `oklch(0.75 0.18 165)` | Teal/emerald — trust, safety |
| `--accent-warning` | `oklch(0.80 0.16 75)` | Amber — urgency, attention |
| `--accent-danger` | `oklch(0.70 0.20 25)` | Coral — critical alerts |
| `--accent-success` | `oklch(0.78 0.17 145)` | Green — resolved, positive |
| `--text-primary` | `oklch(0.95 0 0)` | Primary text |
| `--text-secondary` | `oklch(0.65 0 0)` | Secondary/muted text |
| `--border` | `oklch(0.30 0.01 250)` | Subtle borders |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Display/Hero | Outfit | 3rem–4.5rem | 700–800 |
| Headings | Inter | 1.5rem–2.5rem | 600–700 |
| Body | Inter | 1rem–1.125rem | 400 |
| Labels/Captions | Inter | 0.875rem | 500 |
| Buttons (large) | Inter | 1.125rem–1.25rem | 600 |

### Design Principles

- **Low-literacy first:** Large touch targets (min 48px), icon-based navigation, minimal text
- **Trust-building:** Security cues, process transparency, consistent visual language
- **Emotional design:** Warm accents on dark base, human-centered copy, progress indicators
- **Glassmorphism (subtle):** Semi-transparent surfaces with backdrop blur on key cards only
- **Motion:** Purposeful — timeline progression, recording pulse, status transitions

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout + fonts + nav
│   ├── page.tsx                    # Landing page
│   ├── globals.css                 # Tailwind + design tokens
│   ├── submit/
│   │   └── page.tsx                # Complaint submission
│   ├── processing/
│   │   └── page.tsx                # AI summary view
│   ├── track/
│   │   └── page.tsx                # Complaint tracking
│   ├── admin/
│   │   ├── layout.tsx              # Admin layout with sidebar
│   │   └── page.tsx                # Admin dashboard
│   └── community/
│       └── page.tsx                # Community validation
│
├── components/
│   ├── ui/                         # Reusable primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Timeline.tsx
│   │   └── IconButton.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── MobileNav.tsx
│   ├── landing/
│   │   ├── Hero.tsx                # Mission-driven hero + voice CTA
│   │   ├── TrustBar.tsx            # Trust signals strip
│   │   ├── HowItWorks.tsx          # Visual workflow steps
│   │   ├── DemoComplaints.tsx      # Sample complaint cards
│   │   └── Stats.tsx               # Impact numbers
│   ├── submit/
│   │   ├── VoiceRecorder.tsx       # Big mic button + waveform
│   │   ├── TextInput.tsx           # Text fallback
│   │   ├── CategoryChips.tsx       # Icon-based categories
│   │   ├── MediaUpload.tsx         # Image/video attach
│   │   ├── AnonymousToggle.tsx     # Anonymous/proxy switch
│   │   └── ProxyForm.tsx           # Proxy reporter details
│   ├── processing/
│   │   ├── ProcessingAnimation.tsx # AI thinking animation
│   │   ├── SummaryCard.tsx         # Structured output card
│   │   └── PriorityBadge.tsx       # Urgency indicator
│   ├── track/
│   │   ├── TrackingInput.tsx       # ID + PIN entry
│   │   ├── StatusTimeline.tsx      # Animated status progression
│   │   ├── ProofCard.tsx           # Before/after evidence
│   │   └── EscalationBanner.tsx    # Escalation status
│   ├── admin/
│   │   ├── ComplaintTable.tsx      # Sortable complaint list
│   │   ├── ComplaintDetail.tsx     # Full complaint view
│   │   ├── ActionPanel.tsx         # Assign/update/resolve
│   │   ├── ProofUpload.tsx         # Upload action evidence
│   │   ├── FilterBar.tsx           # Priority/category/status filters
│   │   └── AdminSidebar.tsx        # Navigation sidebar
│   └── community/
│       ├── SupportVote.tsx         # "I also face this" button
│       ├── ValidatorCard.tsx       # Trusted validator info
│       └── GenuinenessScore.tsx    # Credibility meter
│
├── lib/
│   ├── types.ts                    # All TypeScript interfaces
│   ├── constants.ts                # Categories, statuses, priorities
│   ├── utils.ts                    # Helpers (ID generation, formatting)
│   ├── mock-data.ts                # Pre-loaded demo complaints
│   ├── ai-processor.ts            # Mock AI: category, priority, summary
│   ├── speech.ts                   # Web Speech API wrapper + fallback
│   ├── storage.ts                  # localStorage CRUD helpers
│   └── escalation.ts              # Time-based escalation logic
│
├── hooks/
│   ├── useSpeechRecognition.ts     # Voice input hook
│   ├── useComplaints.ts            # Complaint CRUD state
│   ├── useLocalStorage.ts          # Typed localStorage hook
│   └── useMediaRecorder.ts         # Audio/media capture
│
└── public/
    ├── icons/                      # Category icons (SVG)
    └── demo/                       # Demo images for proof-of-action
```

---

## Task Breakdown

### Task 1: Project Scaffolding + Design System
**Agent:** `frontend-specialist` | **Skills:** `tailwind-patterns`, `clean-code`
**Priority:** P0 (Foundation)
**Dependencies:** None

- [ ] Scaffold Next.js 14 project with TypeScript + Tailwind CSS + App Router
- [ ] Configure `globals.css` with `@theme` design tokens (colors, spacing, fonts)
- [ ] Install dependencies: `framer-motion`, `lucide-react`
- [ ] Import Google Fonts (Inter + Outfit) in root layout
- [ ] Create `lib/types.ts` — all interfaces (Complaint, Status, Category, User, etc.)
- [ ] Create `lib/constants.ts` — categories, statuses, priorities, escalation rules
- [ ] Create `lib/utils.ts` — ID generator, PIN generator, date formatters

**Verify:** `npm run dev` loads without errors, fonts render, design tokens apply

---

### Task 2: UI Primitives
**Agent:** `frontend-specialist` | **Skills:** `frontend-design`, `tailwind-patterns`
**Priority:** P0 (Foundation)
**Dependencies:** Task 1

- [ ] Build `Button.tsx` — sizes (lg/md/sm), variants (primary/secondary/ghost/danger), loading state
- [ ] Build `Card.tsx` — glass variant with backdrop-blur, solid variant, hover lift
- [ ] Build `Badge.tsx` — status colors, priority indicators, category tags
- [ ] Build `Input.tsx` — large touch-friendly, with icons, error states
- [ ] Build `IconButton.tsx` — circular, icon-only, tooltip support
- [ ] Build `Modal.tsx` — overlay, animated enter/exit
- [ ] Build `Timeline.tsx` — vertical stepper with animated progression, status dots

**Verify:** Each component renders in isolation, all variants visible, touch targets ≥ 48px

---

### Task 3: Layout + Navigation
**Agent:** `frontend-specialist` | **Skills:** `frontend-design`
**Priority:** P0 (Foundation)
**Dependencies:** Task 2

- [ ] Build `Navbar.tsx` — logo, primary nav links, mobile hamburger
- [ ] Build `MobileNav.tsx` — slide-out drawer, large icon-based links
- [ ] Build `Footer.tsx` — minimal, trust messaging
- [ ] Build root `layout.tsx` — dark theme wrapper, font providers, nav integration
- [ ] Build `admin/layout.tsx` — sidebar layout for dashboard

**Verify:** Navigation works across all routes, mobile hamburger toggles, admin layout distinct

---

### Task 4: Landing Page
**Agent:** `frontend-specialist` | **Skills:** `frontend-design`
**Priority:** P1 (Core)
**Dependencies:** Task 3

- [ ] Build `Hero.tsx` — mission statement, large "Report Issue" CTA, secondary "Track Complaint" CTA, animated background accent
- [ ] Build `TrustBar.tsx` — trust indicators (anonymous, encrypted, community-verified, tamper-proof)
- [ ] Build `HowItWorks.tsx` — 6-step visual workflow (Submit → Verify → Assign → Act → Prove → Confirm) with icons + motion
- [ ] Build `DemoComplaints.tsx` — 3 sample complaint cards showing different categories
- [ ] Build `Stats.tsx` — impact numbers (complaints resolved, communities helped, etc.)
- [ ] Assemble landing page with scroll-triggered animations

**Verify:** Page loads < 2s, hero CTAs navigate correctly, responsive on mobile, emotionally compelling

---

### Task 5: Voice Engine + Speech Hook
**Agent:** `frontend-specialist` | **Skills:** `clean-code`
**Priority:** P1 (Core)
**Dependencies:** Task 1

- [ ] Create `lib/speech.ts` — Web Speech API wrapper with language support detection
- [ ] Create `hooks/useSpeechRecognition.ts` — start/stop/transcript/error/isListening states
- [ ] Implement fallback: if Web Speech API unavailable → simulate with pre-filled demo transcript after 3s recording animation
- [ ] Handle interim + final results for live transcript display
- [ ] Add language options: English, Hindi (basic)

**Verify:** Chrome: real speech works. Firefox/Safari: fallback activates gracefully. No crashes.

---

### Task 6: Complaint Submission Page
**Agent:** `frontend-specialist` | **Skills:** `frontend-design`
**Priority:** P1 (Core)
**Dependencies:** Task 2, Task 5

- [ ] Build `VoiceRecorder.tsx` — large pulsing mic button, waveform visualization, recording timer, transcript preview
- [ ] Build `TextInput.tsx` — multiline, character count, placeholder guidance
- [ ] Build `CategoryChips.tsx` — icon + label chips for: Water, Roads, Sanitation, Harassment, Corruption, Ration Denial, Safety, Abuse
- [ ] Build `MediaUpload.tsx` — drag/drop or tap to upload, image preview, file size validation
- [ ] Build `AnonymousToggle.tsx` — clear toggle with explanation text, icon indicators
- [ ] Build `ProxyForm.tsx` — proxy reporter name, relationship, optional contact
- [ ] Assemble submission page — step-by-step flow (Voice/Text → Category → Details → Anonymous/Proxy → Submit)
- [ ] On submit: generate complaint ID + PIN, save to localStorage, navigate to processing page

**Verify:** Full submission flow completes, complaint saved in localStorage, ID + PIN generated

---

### Task 7: AI Processing Engine + View
**Agent:** `frontend-specialist` | **Skills:** `clean-code`
**Priority:** P1 (Core)
**Dependencies:** Task 6

- [ ] Create `lib/ai-processor.ts`:
  - `detectCategory(text)` — keyword matching to assign category
  - `estimatePriority(text, category)` — severity keywords + category weight → Critical/High/Medium/Low
  - `generateSummary(text)` — extract key details, rewrite into formal 2-3 sentence summary
  - `extractLocation(text)` — basic location keyword extraction
  - `estimateAffectedPeople(text)` — heuristic count
- [ ] Build `ProcessingAnimation.tsx` — step-by-step reveal: "Analyzing complaint..." → "Detecting category..." → "Assessing priority..." → "Generating summary..." with progress bar
- [ ] Build `SummaryCard.tsx` — displays structured output: category, priority, location, affected people, formal summary, original text toggle
- [ ] Build `PriorityBadge.tsx` — color-coded urgency (Critical=red pulse, High=amber, Medium=teal, Low=gray)
- [ ] Assemble processing page — auto-process on load, animated reveal, "Confirm & Submit" button

**Verify:** Processing animation plays smoothly, summary generates correctly for various inputs, priority colors correct

---

### Task 8: Complaint Tracking Page
**Agent:** `frontend-specialist` | **Skills:** `frontend-design`
**Priority:** P1 (Core)
**Dependencies:** Task 2, Task 7

- [ ] Build `TrackingInput.tsx` — complaint ID + PIN fields, large buttons, search action
- [ ] Build `StatusTimeline.tsx` — vertical timeline with 6 states (Submitted → Verified → Assigned → Under Review → Action Taken → Resolved), animated progress dots, timestamps
- [ ] Build `ProofCard.tsx` — before/after image slots, officer notes, resolution comments, timestamp
- [ ] Build `EscalationBanner.tsx` — warning banner if complaint stale > threshold, shows escalation path
- [ ] Create `lib/escalation.ts` — time-based escalation logic (check age of complaint vs. status)
- [ ] Assemble tracking page — ID/PIN entry → fetch from localStorage → display timeline + proof

**Verify:** Valid ID+PIN shows correct timeline, invalid shows error, escalation banner appears for old complaints

---

### Task 9: Admin Dashboard
**Agent:** `frontend-specialist` | **Skills:** `frontend-design`
**Priority:** P2 (Polish)
**Dependencies:** Task 2, Task 7

- [ ] Build `AdminSidebar.tsx` — nav links (Dashboard, Queue, Analytics), active state
- [ ] Build `FilterBar.tsx` — filter by priority (Critical/High/Medium/Low), category, status, search
- [ ] Build `ComplaintTable.tsx` — sortable table/card list, priority color indicator, category icon, status badge, timestamp, click to expand
- [ ] Build `ComplaintDetail.tsx` — full complaint view in modal/panel: original text, AI summary, category, priority, timeline, community votes
- [ ] Build `ActionPanel.tsx` — assign to officer (dropdown), update status (select), add action notes (textarea), mark resolved
- [ ] Build `ProofUpload.tsx` — upload before/after images, add resolution notes, require evidence for "Resolved" status
- [ ] Create `lib/mock-data.ts` — 8-10 pre-loaded demo complaints across all categories and statuses
- [ ] Assemble admin page — sidebar + filter bar + complaint list + detail panel

**Verify:** Filters work, status updates persist, proof upload flow works, resolution requires evidence

---

### Task 10: Community Validation
**Agent:** `frontend-specialist` | **Skills:** `frontend-design`
**Priority:** P2 (Polish)
**Dependencies:** Task 8

- [ ] Build `SupportVote.tsx` — "I also face this" button with vote count, animated increment
- [ ] Build `ValidatorCard.tsx` — trusted volunteer info, verification badge, validation note
- [ ] Build `GenuinenessScore.tsx` — visual credibility meter (based on community votes + validator endorsement)
- [ ] Integrate community section into tracking page and as standalone route
- [ ] Add vote data to mock complaints

**Verify:** Votes increment, genuineness score updates, validator endorsement visible

---

### Task 11: Demo Scenarios + Polish
**Agent:** `frontend-specialist` | **Skills:** `frontend-design`
**Priority:** P3 (Demo)
**Dependencies:** Task 9, Task 10

- [ ] Pre-load 3 demo scenarios:
  1. **Ration Corruption** — anonymous report, verified by community, escalated, action taken with proof
  2. **Fake Seeds / Farmer Issue** — proxy report by NGO, high priority, under review
  3. **Women Safety** — proxy report, identity masked, critical priority, assigned to authority
- [ ] Add read-aloud button prototype (text-to-speech API for key instructions)
- [ ] Polish all animations: page transitions, timeline progression, card hover states
- [ ] Responsive audit: test all pages at 375px, 768px, 1024px, 1440px
- [ ] Add favicon, meta tags, page titles
- [ ] Final visual polish: spacing consistency, color harmony, loading states

**Verify:** All demo scenarios walk through complete flow, mobile layout clean, animations smooth

---

## Implementation Order (Critical Path)

```
Task 1 (Scaffold + Tokens)
    ├── Task 2 (UI Primitives)
    │       ├── Task 3 (Layout + Nav)
    │       │       └── Task 4 (Landing Page)
    │       ├── Task 6 (Submission Page) ← needs Task 5
    │       │       └── Task 7 (AI Processing)
    │       │               ├── Task 8 (Tracking)
    │       │               │       └── Task 10 (Community)
    │       │               └── Task 9 (Admin Dashboard)
    │       └── Task 8 (Tracking)
    └── Task 5 (Voice Engine) ← parallel with Task 2
                               
Task 11 (Demo + Polish) ← after all above
```

**Parallel opportunities:**
- Task 2 + Task 5 can run simultaneously
- Task 9 + Task 10 can run simultaneously (both depend on Task 7)

---

## Phase X: Verification

- [ ] `npm run build` — no errors, no warnings
- [ ] `npm run dev` — all pages load correctly
- [ ] Responsive test at 375px, 768px, 1024px, 1440px
- [ ] Full demo walkthrough: Landing → Submit (voice) → Processing → Track → Admin resolve → Track again (resolved)
- [ ] Voice fallback test in non-Chrome browser
- [ ] No purple/violet hex codes in codebase
- [ ] No standard template layouts
- [ ] Touch targets ≥ 48px on all interactive elements
- [ ] All animations respect `prefers-reduced-motion`
- [ ] `python .agent/skills/frontend-design/scripts/ux_audit.py .` — passes
- [ ] `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .` — no critical issues
