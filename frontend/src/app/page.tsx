"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Mic,
  Search,
  ShieldCheck,
  EyeOff,
  Users,
  Lock,
  ArrowRight,
  Droplets,
  Construction,
  Scale,
  Headphones,
  Brain,
  BarChart3,
  FileCheck,
  Eye,
  Megaphone,
  Target,
  Globe,
  Heart,
  Puzzle,
  Settings,
  Hammer,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { MaterialCard } from "@/components/ui/MaterialCard";
import { ImpactSection } from "@/components/ui/ImpactSection";
import { HeroParticles } from "@/components/ui/HeroParticles";
import { APP_TAGLINE } from "@/lib/constants";
import { useI18n } from "@/lib/i18n/I18nContext";
import { Testimonials } from "@/components/ui/Testimonials";

/* ============================================
   LANDING PAGE — SocialImpact-Inspired
   ============================================ */

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const trustItems = [
  { icon: EyeOff, key: "trust.anonymous" },
  { icon: Lock, key: "trust.identity" },
  { icon: Users, key: "trust.community" },
  { icon: ShieldCheck, key: "trust.tamper" },
];

const liveFeed = [
  { id: "NV-2026-XK92R", text: "No water supply in Ward 14 for 3 days. 200+ families affected.", time: "2 mins ago", status: "Verified" },
  { id: "NV-2026-MP3T8", text: "Large pothole on NH-48 near school. Two accidents in last week.", time: "15 mins ago", status: "Action Taken" },
  { id: "NV-2026-QW7L5", text: "BDO demanding ₹500 bribe for caste certificate.", time: "1 hour ago", status: "Assigned" },
  { id: "NV-2026-KL8M2", text: "Garbage piled up near community hall for 2 weeks.", time: "2 hours ago", status: "Verified" },
];

/* --- Services Data --- */
const services = [
  {
    id: "service.voice",
    icon: Headphones,
  },
  {
    id: "service.ai",
    icon: Brain,
  },
  {
    id: "service.monitor",
    icon: BarChart3,
  },
  {
    id: "service.verify",
    icon: FileCheck,
  },
  {
    id: "service.transparent",
    icon: Eye,
  },
  {
    id: "service.commval",
    icon: Megaphone,
  },
];

/* --- Sectors Data --- */
const sectors = [
  { image: "/sectors/water.png", label: "Water & Sanitation", description: "Access to clean water and proper sanitation remains a critical issue in rural communities. Complaints include broken hand pumps, contaminated supply, and irregular water tanker schedules." },
  { image: "/sectors/roads.png", label: "Roads & Infrastructure", description: "Potholes, damaged bridges, missing streetlights, and poor road conditions endanger commuters daily. Infrastructure complaints are among the most reported issues." },
  { image: "/sectors/safety.png", label: "Public Safety", description: "Citizens report harassment, lack of police patrols, missing streetlights, and unsafe public spaces. Safety complaints help redirect law enforcement resources." },
  { image: "/sectors/corruption.png", label: "Anti-Corruption", description: "Bribery demands, illegal fees, and bureaucratic obstruction at government offices. Anonymous reporting protects whistleblowers from retaliation." },
  { image: "/sectors/ration.png", label: "Ration & Food Security", description: "Irregular ration distribution, adulterated supplies, and denial of rightful entitlements at fair price shops affect millions of vulnerable families." },
  { image: "/sectors/healthcare.png", label: "Healthcare Access", description: "Absent doctors, medicine shortages, and non-functional primary health centers leave rural populations without critical healthcare services." },
  { image: "/sectors/governance.png", label: "Governance & Law", description: "Delays in document processing, lack of transparency in local governance, and unresponsive public offices undermine citizen trust in institutions." },
  { image: "/sectors/electricity.png", label: "Electricity & Power", description: "Frequent outages, voltage fluctuations, faulty transformers, and non-functional street lighting impact daily life and economic activity." },
  { image: "/sectors/waste.png", label: "Waste Management", description: "Uncleared garbage, missing waste collection services, and illegal dumping near residential areas create public health hazards." },
  { image: "/sectors/emergency.png", label: "Emergency Services", description: "Delayed ambulance and fire response, non-functional emergency helplines, and lack of disaster preparedness in vulnerable areas." },
  { image: "/sectors/education.png", label: "Education", description: "Teacher absenteeism, infrastructure decay in government schools, missing mid-day meals, and lack of basic facilities for students." },
  { image: "/sectors/welfare.png", label: "Social Welfare", description: "Denial of pension benefits, failure to deliver social security schemes, and exploitation of marginalized communities by intermediaries." },
];

/* --- Guiding Principles Data --- */
const principles: Array<{ icon: any, title: string, subtitle: string, description: string, imageSrc: string }> = [
  {
    icon: Target,
    title: "Citizen-Centered Design",
    subtitle: "Accessibility First",
    description: "Every interface decision is guided by the needs of low-literacy, vulnerable users. Voice-first, touch-friendly, minimal text.",
    imageSrc: "/sectors/governance.png",
  },
  {
    icon: ShieldCheck,
    title: "Trust Through Transparency",
    subtitle: "Public Accountability",
    description: "Complaint timelines, proof-of-action, and resolution evidence are publicly visible. No black boxes. No hidden processes.",
    imageSrc: "/sectors/safety.png",
  },
  {
    icon: Globe,
    title: "Community-Led Accountability",
    subtitle: "Collective Action",
    description: "Citizens validate resolutions, not bureaucrats. Genuineness scores and consensus voting ensure that real issues get real attention.",
    imageSrc: "/sectors/welfare.png",
  },
  {
    icon: Puzzle,
    title: "Customized Local Solutions",
    subtitle: "Adaptive Architecture",
    description: "The platform adapts to local governance structures, languages, and complaint categories specific to each community it serves.",
    imageSrc: "/sectors/roads.png",
  },
  {
    icon: Settings,
    title: "Systematic Escalation",
    subtitle: "Guaranteed Response",
    description: "Unresolved complaints automatically escalate through governance levels, ensuring no issue is buried or forgotten by officials.",
    imageSrc: "/sectors/electricity.png",
  },
  {
    icon: Heart,
    title: "Safety & Dignity First",
    subtitle: "Zero Retaliation",
    description: "Anonymous reporting, proxy filing, and identity protection ensure that the most vulnerable can speak without fear of retaliation.",
    imageSrc: "/sectors/healthcare.png",
  },
];

/* ============================================
   SECTORS SECTION COMPONENT — Image + Hover Popup
   ============================================ */

function SectorsSection() {
  const { t } = useI18n();
  const [activeSector, setActiveSector] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">{t("sectors.label")}</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary max-w-3xl">
            {t("sectors.title") || "Issues we address across communities"}
          </h2>
        </motion.div>

        <div ref={containerRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {sectors.map((sector, i) => (
            <motion.div
              key={sector.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="relative group cursor-pointer text-center"
              onMouseEnter={() => setActiveSector(i)}
              onMouseLeave={() => setActiveSector(null)}
            >
              {/* Image card */}
              <div className="relative w-full aspect-square rounded-2xl border border-border overflow-hidden mb-3 transition-all duration-300 group-hover:border-accent group-hover:shadow-lg">
                <img
                  src={sector.image}
                  alt={sector.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Dark overlay on hover */}
                <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/20 transition-colors duration-300" />
              </div>

              {/* Label */}
              <p className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors duration-200">
                {sector.label}
              </p>

              {/* Hover Popup */}
              <AnimatePresence>
                {activeSector === i && (
                  <motion.div
                    initial={{ opacity: 0, y: i >= 6 ? -10 : 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: i >= 6 ? -10 : 10, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className={`absolute z-50 left-1/2 -translate-x-1/2 w-72 sm:w-80 ${
                      i >= 6 ? "bottom-full mb-3" : "top-full mt-3"
                    }`}
                  >
                    <div className="bg-bg-elevated rounded-2xl shadow-xl border border-border overflow-hidden">
                      {/* Popup image */}
                      <div className="h-40 w-full overflow-hidden">
                        <img
                          src={sector.image}
                          alt={sector.label}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Popup content */}
                      <div className="p-5">
                        <h4 className="font-display text-base font-bold text-text-primary mb-2">
                          {sector.label}
                        </h4>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {sector.description}
                        </p>
                      </div>

                      {/* Arrow pointer — top for downward popup, bottom for upward popup */}
                      {i >= 6 ? (
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-bg-elevated border-r border-b border-border rotate-45" />
                      ) : (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-bg-elevated border-l border-t border-border rotate-45" />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   WORKFLOW SECTION COMPONENT — Snake Path with Scroll Animation
   ============================================ */

function SnakeConnector({ scrollProgress }: { scrollProgress: any }) {
  const pathLength = useSpring(scrollProgress, { stiffness: 100, damping: 30 });

  return (
    <svg
      className="absolute left-1/2 -translate-x-1/2 top-0 w-full h-full pointer-events-none hidden md:block"
      viewBox="0 0 800 1800"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      style={{ zIndex: 0 }}
    >
      {/* Glow filter */}
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="pathGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2F4F3F" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#6E8B4A" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#2F4F3F" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Background track */}
      <motion.path
        d="M 400 0
           C 400 120, 680 120, 680 300
           C 680 480, 120 480, 120 660
           C 120 840, 680 840, 680 1020
           C 680 1200, 120 1200, 120 1380
           C 120 1560, 400 1560, 400 1800"
        stroke="#D5D0C8"
        strokeWidth="3"
        strokeDasharray="8 8"
        fill="none"
        opacity={0.5}
      />

      {/* Animated path */}
      <motion.path
        d="M 400 0
           C 400 120, 680 120, 680 300
           C 680 480, 120 480, 120 660
           C 120 840, 680 840, 680 1020
           C 680 1200, 120 1200, 120 1380
           C 120 1560, 400 1560, 400 1800"
        stroke="url(#pathGrad)"
        strokeWidth="3.5"
        fill="none"
        filter="url(#glow)"
        style={{
          pathLength: pathLength,
        }}
        strokeLinecap="round"
      />
    </svg>
  );
}

function WorkflowSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useTransform(scrollYProgress, [0.1, 0.85], [0, 1]);

  const steps = [
    {
      id: 1,
      label: "Submit",
      desc: "Citizen reports an issue anonymously via voice, text, or AI assistant. Available in 10+ Indian languages.",
      icon: Mic,
      detail: "Voice-First • Multi-Language",
      color: "from-accent/10 to-accent/5",
      borderColor: "border-accent/20 hover:border-accent/40",
      iconBg: "bg-accent/10 text-accent",
    },
    {
      id: 2,
      label: "Verify",
      desc: "The community validates the complaint through voting. Genuine issues get boosted by consensus.",
      icon: Users,
      detail: "Community Powered • Trust Score",
      color: "from-olive/10 to-olive/5",
      borderColor: "border-olive/20 hover:border-olive/40",
      iconBg: "bg-olive/10 text-olive",
    },
    {
      id: 3,
      label: "Assign",
      desc: "AI analyzes the complaint, classifies severity, and automatically routes it to the correct government department.",
      icon: Brain,
      detail: "AI Classification • Smart Routing",
      color: "from-sky-500/10 to-sky-500/5",
      borderColor: "border-sky-500/20 hover:border-sky-500/40",
      iconBg: "bg-sky-500/10 text-sky-600",
    },
    {
      id: 4,
      label: "Act",
      desc: "The assigned official takes real, measurable action on the complaint. Progress is tracked in real-time.",
      icon: Hammer,
      detail: "Real Action • Tracked Progress",
      color: "from-amber-500/10 to-amber-500/5",
      borderColor: "border-amber-500/20 hover:border-amber-500/40",
      iconBg: "bg-amber-500/10 text-amber-600",
    },
    {
      id: 5,
      label: "Prove",
      desc: "Officials must upload photographic or documented proof of resolution. No claims without evidence.",
      icon: ShieldCheck,
      detail: "Photo Evidence • Tamper-Proof",
      color: "from-emerald-500/10 to-emerald-500/5",
      borderColor: "border-emerald-500/20 hover:border-emerald-500/40",
      iconBg: "bg-emerald-500/10 text-emerald-600",
    },
    {
      id: 6,
      label: "Confirm",
      desc: "The original citizen reviews and confirms whether the resolution is satisfactory. The loop is closed.",
      icon: CheckCircle2,
      detail: "Citizen Approval • Case Closed",
      color: "from-accent/10 to-accent/5",
      borderColor: "border-accent/20 hover:border-accent/40",
      iconBg: "bg-accent/10 text-accent",
    },
  ];

  return (
    <section ref={sectionRef} className="py-24 md:py-32 px-4 bg-bg-surface/50 border-y border-border relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #2F4F3F 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20 md:mb-24 relative z-10"
        >
          <Badge variant="accent" size="sm" className="mb-4">
            <ShieldCheck size={14} /> Trust-Mediated Workflow
          </Badge>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary mb-4">
            How It Works
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto leading-relaxed">
            From complaint to confirmation — a transparent, accountable pipeline that ensures every voice leads to real action.
          </p>
        </motion.div>

        {/* Snake path container */}
        <div className="relative" style={{ minHeight: steps.length * 300 }}>
          {/* SVG Snake Path — Desktop only */}
          <SnakeConnector scrollProgress={smoothProgress} />

          {/* Step Cards */}
          <div className="relative z-10 space-y-16 md:space-y-24">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 40, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.1,
                  }}
                  className={`flex ${isLeft ? "md:justify-start" : "md:justify-end"} justify-center`}
                >
                  <div
                    className={`relative max-w-md w-full group`}
                  >
                    {/* Step number badge - positioned at the center-facing edge */}
                    <div
                      className={`absolute top-6 z-20 w-10 h-10 rounded-full bg-accent text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-accent/25 ring-4 ring-bg-surface ${
                        isLeft ? "md:-right-5 -right-2" : "md:-left-5 -left-2"
                      }`}
                    >
                      {step.id}
                    </div>

                    {/* Card */}
                    <div
                      className={`bg-gradient-to-br ${step.color} backdrop-blur-sm rounded-2xl border ${step.borderColor} p-6 md:p-8 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1`}
                    >
                      {/* Icon + Label row */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-xl ${step.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                          <Icon size={26} />
                        </div>
                        <div>
                          <h3 className="font-display text-xl font-bold text-text-primary">
                            {step.label}
                          </h3>
                          <p className="text-xs font-medium text-text-muted tracking-wide uppercase">
                            {step.detail}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {step.desc}
                      </p>

                      {/* Subtle bottom accent bar */}
                      <div className="mt-5 h-1 w-12 rounded-full bg-accent/20 group-hover:w-20 group-hover:bg-accent/40 transition-all duration-500" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16 md:mt-20 relative z-10"
        >
          <Link href="/submit">
            <Button size="lg" icon={<Mic size={20} />} className="rounded-full px-8 shadow-lg shadow-accent/20 hover:shadow-accent/40 transition-all hover:-translate-y-1">
              Report an Issue Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  const { t } = useI18n();
  const [activeService, setActiveService] = useState<string | null>(null);

  return (
    <div className="relative overflow-hidden">

      {/* ===== HERO ===== */}
      <section className="relative min-h-[85vh] flex items-center pt-16 pb-16 px-4 sm:px-6">
        <HeroParticles />
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0 bg-bg-primary transition-colors duration-300">
          <img 
            src="/hero_bg.png" 
            alt="Community Background" 
            className="w-full h-full object-cover opacity-60 sm:opacity-70 dark:opacity-20 object-right transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg-primary/90 via-bg-primary/50 to-transparent z-10 transition-colors duration-300" />
        </div>

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 lg:gap-12 items-center relative z-10">

          <motion.div className="relative z-10" initial="initial" animate="animate" variants={stagger}>
            <motion.div variants={fadeUp}>
              <Badge variant="accent" size="sm" className="mb-6">
                <ShieldCheck size={14} />
                Trust-Mediated Civic Grievance System
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-8 text-text-primary"
            >
              {t("home.hero.speak")}
              <br />
              {t("home.hero.stay")}
              <br />
              <span className="text-olive">{t("home.hero.see")}</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg sm:text-xl text-text-secondary max-w-lg mb-10 leading-relaxed"
            >
              {t("home.hero.tagline") || `${APP_TAGLINE} Report issues anonymously with your voice, track real progress, and hold authorities accountable — all without fear.`}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-2"
            >
              <Link href="/submit" className="w-full sm:w-auto">
                <Button size="xl" className="w-full sm:w-auto px-8 rounded-full shadow-[0_8px_30px_rgb(var(--accent-rgb),0.2)] hover:shadow-[0_8px_30px_rgb(var(--accent-rgb),0.4)] transition-all hover:-translate-y-1">
                  <Mic size={24} className="mr-2" />
                  Speak Complaint
                </Button>
              </Link>
              <Link href="/track" className="w-full sm:w-auto">
                <Button variant="secondary" size="xl" className="w-full sm:w-auto px-8 rounded-full border border-border/60 bg-bg-surface/50 hover:bg-bg-surface backdrop-blur-sm transition-all hover:-translate-y-1">
                  <Search size={22} className="mr-2 text-text-secondary" />
                  Track Status
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8 flex items-center justify-start">
              <Link href="/demo" className="group flex items-center gap-4 text-text-secondary hover:text-accent transition-all p-2 rounded-full hover:bg-accent/5 pr-6 border border-transparent hover:border-accent/10">
                <div className="w-12 h-12 rounded-full bg-bg-elevated shadow-md border border-border flex items-center justify-center group-hover:scale-110 group-hover:shadow-accent/20 transition-all duration-300">
                  <PlayCircle size={24} className="text-accent ml-0.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">See how it works</span>
                  <span className="text-xs opacity-80">Interactive 1-minute demo</span>
                </div>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-12 flex items-center justify-between gap-3 overflow-x-auto hide-scrollbar border-t border-border pt-8 pb-2">
              {trustItems.map((item) => (
                <div key={item.key} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-text-secondary whitespace-nowrap">
                  <item.icon size={16} className="text-accent shrink-0" />
                  <span>{t(item.key)}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Live Feed */}
          <motion.div
            className="relative h-[480px] hidden lg:block overflow-hidden rounded-2xl border border-border/40 bg-bg-surface/30 backdrop-blur-sm shadow-xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-bg-primary/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-bg-primary/80 to-transparent z-10 pointer-events-none" />

            <div className="flex flex-col gap-4 p-6 animate-marquee-vertical hover:[animation-play-state:paused]">
              {[...liveFeed, ...liveFeed, ...liveFeed].map((item, i) => (
                <div key={i} className="rounded-xl border border-border/50 bg-bg-elevated/60 p-5 shadow-sm backdrop-blur-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-text-muted/80">{item.id}</span>
                    <Badge variant="accent" size="sm">{item.status}</Badge>
                  </div>
                  <p className="text-sm text-text-primary leading-relaxed font-medium">{item.text}</p>
                  <p className="text-xs text-text-muted mt-3 mix-blend-multiply">{item.time}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== SERVICES — Interactive List (socialimpact.com-inspired) ===== */}
      <section className="py-24 px-4 bg-bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">{t("services.label")}</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary max-w-3xl">
              {t("services.heading")}
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-0 border-t border-border">
            {services.map((service, i) => {
              const Icon = service.icon;
              const isActive = activeService === service.id;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`group border-b border-border cursor-pointer transition-colors duration-300 ${i % 2 === 0 ? "lg:border-r" : ""} ${isActive ? "bg-accent/5" : "hover:bg-bg-hover/60"}`}
                  onMouseEnter={() => setActiveService(service.id)}
                  onMouseLeave={() => setActiveService(null)}
                >
                  <div className="p-8 md:p-10">
                    <div className="flex items-start gap-5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300 ${isActive ? "bg-accent text-white" : "bg-accent/10 text-accent"}`}>
                        <Icon size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-xl font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors">
                          {t(service.id)}
                        </h3>

                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <p className="text-text-secondary leading-relaxed mb-4">
                                {t(`${service.id}.desc`)}
                              </p>
                              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent group-hover:gap-2.5 transition-all">
                                {t("services.learn")} <ArrowRight size={14} />
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <ArrowRight
                        size={20}
                        className={`shrink-0 mt-1 transition-all duration-300 ${isActive ? "text-accent translate-x-1" : "text-text-muted"}`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== SECTORS — Image Grid with Hover Popup ===== */}
      <SectorsSection />

      {/* ===== IMPACT STATS ===== */}
      <ImpactSection />

      <WorkflowSection />

      {/* ===== GUIDING PRINCIPLES — Color-coded Icon Grid (socialimpact.com-inspired) ===== */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-accent mb-3">{t("principles.label")}</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-text-primary max-w-4xl">
              {t("principles.heading")}
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-8 md:gap-y-12">
            {principles.map((principle, i) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="w-full flex"
              >
                <MaterialCard
                  title={principle.title}
                  subtitle={principle.subtitle}
                  description={principle.description}
                  imageSrc={principle.imageSrc}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-24 px-4 bg-accent/5 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <ShieldCheck size={48} className="text-accent mx-auto mb-6" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-text-primary mb-6">
              {t("cta.title")}
            </h2>
            <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
              {t("cta.desc")}
            </p>
            <Link href="/submit">
              <Button size="xl" icon={<Mic size={22} />}>
                {t("cta.btn")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Testimonials />

    </div>
  );
}
