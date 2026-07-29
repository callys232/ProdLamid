"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Layers,
  BarChart2,
  Zap,
  ArrowRight,
  ArrowLeft,
  X,
} from "lucide-react";
import HowItWorksModal from "./HowItWorksModal";
import bg from "./Aihero.module.css";

/* ── Line decoration ─────────────────────────────────────────── */
const Lines = ({ color }: { color: string }) => (
  <svg
    viewBox="0 0 200 120"
    fill="none"
    className="absolute inset-0 w-full h-full opacity-[0.05]"
    preserveAspectRatio="none"
  >
    <line x1="0" y1="30" x2="200" y2="90" stroke={color} strokeWidth="1" />
    <line x1="0" y1="90" x2="200" y2="30" stroke={color} strokeWidth="0.6" />
    <line x1="100" y1="0" x2="100" y2="120" stroke={color} strokeWidth="0.6" />
  </svg>
);

/* ── Section background ──────────────────────────────────────── */
function SectionBg() {
  return (
    <div className={bg.sectionBg}>
      {/* Faint red grid */}
      <div className={bg.grid} />

      {/* Animated glow orbs */}
      <div className={bg.orb1} />
      <div className={bg.orb2} />
      <div className={bg.orb3} />

      {/* SVG vector layer — LAMID-theme geometric shapes */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1280 560"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden="true"
      >
        {/* ── Hexagon cluster — top right ── */}
        <polygon points="1020,14 1100,14 1140,83 1100,152 1020,152 980,83"
          stroke="rgba(37,99,235,0.12)" strokeWidth="1" />
        <polygon points="1035,40 1085,40 1110,83 1085,126 1035,126 1010,83"
          stroke="rgba(37,99,235,0.07)" strokeWidth="0.8" />
        <circle cx="1060" cy="83" r="3" fill="rgba(37,99,235,0.20)" />
        <circle cx="1060" cy="83" r="7" stroke="rgba(37,99,235,0.10)" strokeWidth="0.8" />

        {/* ── Hexagon — bottom left ── */}
        <polygon points="60,390 120,390 150,442 120,494 60,494 30,442"
          stroke="rgba(255,255,255,0.06)" strokeWidth="0.9" />
        <circle cx="90" cy="442" r="2.5" fill="rgba(255,255,255,0.10)" />

        {/* ── Diamond accent — upper left ── */}
        <polygon points="110,60 158,105 110,150 62,105"
          stroke="rgba(37,99,235,0.10)" strokeWidth="0.9" />
        <polygon points="110,82 136,105 110,128 84,105"
          stroke="rgba(37,99,235,0.06)" strokeWidth="0.7" />

        {/* ── Large sweeping arc — right edge ── */}
        <path d="M 1250 50 A 260 260 0 0 1 1250 510"
          stroke="rgba(37,99,235,0.09)" strokeWidth="0.9" strokeDasharray="8 16" />
        <path d="M 1230 100 A 200 200 0 0 1 1230 460"
          stroke="rgba(37,99,235,0.05)" strokeWidth="0.7" strokeDasharray="5 18" />

        {/* ── Circuit path — bottom left ── */}
        <path d="M 0 500 L 60 500 L 60 440 L 160 440 L 160 480 L 280 480 L 280 510 L 380 510"
          stroke="rgba(37,99,235,0.13)" strokeWidth="1" />
        <circle cx="60"  cy="500" r="2" fill="rgba(37,99,235,0.22)" />
        <circle cx="160" cy="440" r="2" fill="rgba(37,99,235,0.18)" />
        <circle cx="280" cy="480" r="2" fill="rgba(37,99,235,0.18)" />

        {/* ── Circuit path — top centre ── */}
        <path d="M 420 0 L 420 40 L 520 40 L 520 18 L 680 18 L 680 40 L 760 40"
          stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
        <circle cx="520" cy="40" r="1.8" fill="rgba(255,255,255,0.10)" />
        <circle cx="680" cy="18" r="1.8" fill="rgba(255,255,255,0.10)" />

        {/* ── Diagonal dashed lines ── */}
        <line x1="0"    y1="200" x2="320" y2="560"
          stroke="rgba(37,99,235,0.06)" strokeWidth="0.8" strokeDasharray="6 18" />
        <line x1="900"  y1="0"   x2="640" y2="560"
          stroke="rgba(37,99,235,0.05)" strokeWidth="0.7" strokeDasharray="5 20" />

        {/* ── Corner brackets ── */}
        <path d="M 24 28 L 24 6 L 46 6"
          stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <path d="M 1256 532 L 1256 554 L 1234 554"
          stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        <path d="M 1256 6 L 1256 28 L 1234 28"
          stroke="rgba(37,99,235,0.12)" strokeWidth="1" />
        <path d="M 24 532 L 24 554 L 46 554"
          stroke="rgba(37,99,235,0.10)" strokeWidth="1" />

        {/* ── Scattered node dots ── */}
        <circle cx="340" cy="90"  r="1.5" fill="rgba(37,99,235,0.18)" />
        <circle cx="560" cy="300" r="1.5" fill="rgba(255,255,255,0.09)" />
        <circle cx="780" cy="180" r="1.5" fill="rgba(37,99,235,0.14)" />
        <circle cx="920" cy="400" r="1.5" fill="rgba(255,255,255,0.08)" />
        <circle cx="200" cy="260" r="1.5" fill="rgba(37,99,235,0.12)" />
      </svg>
    </div>
  );
}

/* ── Data ────────────────────────────────────────────────────── */
const PROBLEM = {
  title: "One Ecosystem. Every Layer of Growth.",
  subtitle: "Why fragmented consulting fails organizations",
  bullets: [
    {
      text: "Quality expertise is expensive and hard to access",
      detail:
        "73% of SMEs report difficulty accessing affordable, high-quality consulting. Without the right match, organizations pay premium rates for misaligned expertise — or go without. LAMID CORE's AI matching engine surfaces the right consultant for every challenge, in 24 hours.",
    },
    {
      text: "AI adoption is urgent — but poorly guided",
      detail:
        "87% of executives say AI integration is a strategic priority, yet fewer than 1 in 4 have a clear plan. Adopting AI tools without human expertise to guide application produces expensive experiments with limited returns. LAMID ONE pairs advanced AI with trusted expertise at every stage.",
    },
    {
      text: "Tools, consultants, and training don't talk to each other",
      detail:
        "Organizations rely on fragmented providers — a consultant here, an LMS there, a SaaS dashboard elsewhere. Nothing reinforces anything. LAMID ONE integrates Marketplace, BIZ intelligence, and Talent development into one connected ecosystem — each layer amplifying the others.",
    },
    {
      text: "Decisions are made on last month's data",
      detail:
        "Board packs assembled manually. KPIs in spreadsheets. Risks surfacing after they've compounded. LAMID GROW gives leadership a live, AI-powered intelligence window — business health scores, scenario modelling, and board-ready reports, generated automatically.",
    },
  ],
  full: "LAMID ONE eliminates friction — unifying expert consulting, business intelligence, and talent development into one HumanAI ecosystem built for scale.",
  hex: "#2563EB",
  glow: "rgba(194,18,25,0.25)",
};

/* ── 4 core service cards — one capability per portal ─────── */
const SERVICE_CARDS = [
  {
    service: "LAMID CORE",
    area:    "Expert Matching & Delivery",
    href:    "/talent",
    tools: [
      "AI-matched consultants, 24-hr shortlist",
      "Vetted experts across every sector",
      "72-hr kickoff, measurable outcomes",
    ],
    borderCls: "border-l-2 border-[#2563EB]/35 hover:border-[#2563EB]/70",
    serviceCls: "text-[#2563EB]/70",
    areaCls:    "text-rose-300",
    dotCls:     "bg-[#2563EB]",
    hoverBg:    "hover:bg-[#2563EB]/[0.05]",
  },
  {
    service: "LAMID GROW",
    area:    "Business Intelligence",
    href:    "/biz",
    tools: [
      "Real-time business health score",
      "AI insight engine & scenario modelling",
      "Board-ready reporting, automated",
    ],
    borderCls: "border-l-2 border-blue-500/35 hover:border-blue-500/70",
    serviceCls: "text-blue-400/70",
    areaCls:    "text-blue-300",
    dotCls:     "bg-blue-400",
    hoverBg:    "hover:bg-blue-500/[0.05]",
  },
  {
    service: "LAMID TALENT",
    area:    "Capability & Learning",
    href:    "/hcd",
    tools: [
      "AI-powered skills assessment (12 min)",
      "Personalized learning paths, AI coach",
      "Expert-designed certifications",
    ],
    borderCls: "border-l-2 border-orange-500/35 hover:border-orange-500/70",
    serviceCls: "text-orange-400/70",
    areaCls:    "text-orange-300",
    dotCls:     "bg-orange-400",
    hoverBg:    "hover:bg-orange-500/[0.05]",
  },
  {
    service: "LAMID Workspace",
    area:    "Project Delivery",
    href:    "/postjobs",
    tools: [
      "Milestone-tracked engagements",
      "CRM, contracts & secure escrow",
      "Real-time team workrooms",
    ],
    borderCls: "border-l-2 border-violet-500/35 hover:border-violet-500/70",
    serviceCls: "text-violet-400/70",
    areaCls:    "text-violet-300",
    dotCls:     "bg-violet-400",
    hoverBg:    "hover:bg-violet-500/[0.05]",
  },
];

const SOLUTIONS = [
  {
    title: "AI Powered Matching – Where talent accelerates and leaders rise",
    bullets: [
      "Verified expertise at every level",
      "All-in-one intelligent talent engine",
      "AI automates scoping, matching & risk detection",
      "Predictive scoring for the right fit every time",
    ],
    Icon: Brain,
    hex: "#3b82f6",
    border: "border-blue-500/40",
    bg: "bg-blue-500/10",
    iconStyle: "text-blue-400 bg-blue-500/15",
    glow: "rgba(59,130,246,0.25)",
  },
  {
    title: "Marketplace + CRM & PM",
    bullets: [
      "Workrooms, milestones & messaging",
      "Contract oversight & performance analytics",
      "File sharing, versioning & collaboration",
      "Workflow automation built-in",
    ],
    Icon: Layers,
    hex: "#10b981",
    border: "border-emerald-500/40",
    bg: "bg-emerald-500/10",
    iconStyle: "text-emerald-400 bg-emerald-500/15",
    glow: "rgba(16,185,129,0.25)",
  },
  {
    title:
      "Enterprise-Grade Operations Suite - One workspace. Infinite possibilities",
    bullets: [
      "Structured project intake with smart allocation",
      "Budgeting, resource planning & time tracking",
      "Payment processing & escrow",
      "Transparent delivery, end to end",
    ],
    Icon: BarChart2,
    hex: "#f97316",
    border: "border-orange-500/40",
    bg: "bg-orange-500/10",
    iconStyle: "text-orange-400 bg-orange-500/15",
    glow: "rgba(249,115,22,0.25)",
  },
  {
    title:
      "Premium Growth Platform — Scale with clarity and measurable results",
    bullets: [
      "Expand across industries and global markets",
      "Data-driven insights and sharper decisions",
      "Resilient infrastructure for demanding operations",
      "Impact that compounds over time",
    ],
    Icon: Zap,
    hex: "#a855f7",
    border: "border-purple-500/40",
    bg: "bg-purple-500/10",
    iconStyle: "text-purple-400 bg-purple-500/15",
    glow: "rgba(168,85,247,0.25)",
  },
];


/* ── Problem modal — 4 pain points → solution CTA ────────────── */
function FragmentedModal({ onClose, onReveal }: { onClose: () => void; onReveal: () => void }) {
  const PAIN = [
    {
      label: "Pipeline",
      text: "Leads die in inbox chaos — before they become clients",
      detail: "Without a unified CRM, every unanswered message is a deal lost to a faster competitor.",
      icon: "📉",
    },
    {
      label: "Collaboration",
      text: "Teams drift when work lives across five apps",
      detail: "Decisions buried in WhatsApp, email, and Slack blur accountability and kill momentum.",
      icon: "🔀",
    },
    {
      label: "Delivery",
      text: "Projects stall when accountability has no single home",
      detail: "One missed update across Trello and Google Docs is all it takes to derail a client engagement.",
      icon: "⏳",
    },
    {
      label: "Growth",
      text: "Experts can't scale what they can't track or monetise",
      detail: "Top consultants chasing clients manually and upskilling in isolation can't build a sustainable practice.",
      icon: "📊",
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        key="fm-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/88 backdrop-blur-md px-4 py-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-[#080808] border border-white/8 rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(194,18,25,0.16)]"
        >
          {/* Top glow line */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#2563EB]/50 to-transparent" />
          {/* Dot bg */}
          <div className="absolute inset-0 pointer-events-none [background-image:radial-gradient(circle,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:26px_26px]" />

          {/* Header */}
          <div className="relative px-6 pt-6 pb-4 border-b border-white/6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border border-[#2563EB]/30 bg-[#2563EB]/8 text-[#2563EB] mb-3">
                  <motion.span
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                    className="h-1 w-1 rounded-full bg-[#2563EB]"
                  />
                  Why Businesses Stall
                </span>
                <h2 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-[#2563EB] leading-tight">
                  The silent drain of fragmented work
                </h2>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed max-w-md">
                  Four compounding problems that stall growth — and the one platform that eliminates all of them.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.12, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                onClick={onClose}
                className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl border border-white/10 bg-white/[0.03] text-gray-600 hover:text-white hover:border-[#2563EB]/40 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </motion.button>
            </div>
          </div>

          {/* Pain point cards */}
          <div className="relative px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PAIN.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, type: "spring", stiffness: 300, damping: 24 }}
                className="group flex flex-col gap-2 rounded-xl border border-[#2563EB]/12 bg-[#2563EB]/[0.04] hover:border-[#2563EB]/28 hover:bg-[#2563EB]/[0.07] p-4 transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base leading-none">{p.icon}</span>
                  <span className="text-[9px] font-black uppercase tracking-[0.16em] text-[#2563EB]/80">{p.label}</span>
                </div>
                <p className="text-[12.5px] font-semibold text-white leading-snug">{p.text}</p>
                <p className="text-[11px] text-gray-500 leading-relaxed">{p.detail}</p>
              </motion.div>
            ))}
          </div>

          {/* Solution CTA */}
          <div className="relative px-6 pb-6">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 28px rgba(194,18,25,0.55)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { onClose(); onReveal(); }}
              className="group relative w-full inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] via-blue-700 to-rose-800 px-5 py-3 text-sm font-bold text-white overflow-hidden shadow-[0_0_18px_rgba(194,18,25,0.35)]"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 pointer-events-none" />
              <span className="relative z-10">See How LAMID ONE Solves This</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                className="relative z-10"
              >
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Slide variants ──────────────────────────────────────────── */
const slide = {
  enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
};
const slideTx = { duration: 0.48, ease: [0.33, 1, 0.68, 1] as const };

/* ── Component ───────────────────────────────────────────────── */
export default function AISystemSection() {
  const [revealed, setRevealed] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const dir = revealed ? 1 : -1;

  return (
    <>
      <section className="relative w-full bg-black text-white px-4 md:px-10 py-6 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="relative rounded-2xl border border-[#2563EB]/30 bg-[#0d0d0d] overflow-hidden">
            {/* Creative theme background */}
            <SectionBg />

            {/* Top bar — always visible */}
            <motion.div
              whileHover={{ backgroundColor: "rgba(194,18,25,0.06)" }}
              transition={{ duration: 0.2 }}
              className="relative z-10 flex items-center gap-2.5 border-b border-white/5 bg-white/[0.02] px-6 py-2.5 cursor-default"
            >
              <motion.span
                animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="h-1.5 w-1.5 rounded-full bg-[#2563EB] flex-shrink-0"
              />
              <p className="text-xs text-gray-600 leading-snug">
                LAMID ONE — The HumanAI Consulting Ecosystem. Expert matching, AI-powered intelligence, and talent development in one unified platform.
              </p>
            </motion.div>

            {/* ── Sliding panels ── */}
            <div className="relative z-10 overflow-hidden">
              <AnimatePresence mode="wait" custom={dir}>

                {/* ══ PANEL 1: Solutions overview ══ */}
                {!revealed && (
                  <motion.div key="overview" custom={dir} variants={slide}
                    initial="enter" animate="center" exit="exit" transition={slideTx}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-7 md:p-10 items-stretch">

                      {/* Left: headline + description + CTA */}
                      <div className="flex flex-col gap-4">
                        <motion.div
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.1 }}
                          className="flex items-center gap-2.5 w-fit"
                        >
                          <motion.div
                            whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                            transition={{ duration: 0.4 }}
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30"
                          >
                            <Zap className="h-4 w-4 text-[#2563EB]" />
                          </motion.div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB]">
                            Powering Enterprise Transformation
                          </span>
                        </motion.div>

                        <h2 className="text-xl md:text-2xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] via-rose-400 to-white">
                          {PROBLEM.title}
                        </h2>

                        <motion.button
                          type="button"
                          whileHover="hover"
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setModalOpen(true)}
                          className="group flex items-center gap-2 w-fit cursor-pointer bg-transparent border-0 p-0"
                        >
                          <motion.span
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                            className="h-1 w-1 rounded-full bg-[#2563EB] shrink-0"
                          />
                          <motion.span
                            variants={{ hover: { x: 3 } }}
                            transition={{ type: "spring", stiffness: 380, damping: 22 }}
                            className="text-[11px] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 group-hover:from-[#2563EB] group-hover:via-rose-300 group-hover:to-white"
                          >
                            {PROBLEM.subtitle}
                          </motion.span>
                          <motion.span
                            variants={{ hover: { x: 5, opacity: 1 } }}
                            initial={{ opacity: 0.45 }}
                            className="text-[11px] text-[#2563EB] font-bold"
                          >
                            →
                          </motion.span>
                        </motion.button>

                        <p className="text-[13px] text-gray-600 leading-relaxed">{PROBLEM.full}</p>

                        <div className="flex flex-wrap gap-2 mt-1">
                          <motion.button
                            whileHover={{ scale: 1.03, boxShadow: "0 0 24px rgba(194,18,25,0.5)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setRevealed(true)}
                            className="group inline-flex items-center gap-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 px-5 py-2.5 text-xs font-bold text-white transition-colors w-fit shadow-[0_0_16px_rgba(37,99,235,0.3)]"
                          >
                            Explore Our Solutions
                            <motion.span
                              animate={{ x: [0, 3, 0] }}
                              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                            >
                              <ArrowRight className="h-3.5 w-3.5" />
                            </motion.span>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.07)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 border border-white/10 bg-white/[0.03] transition-colors"
                          >
                            Platform Overview
                            <ArrowRight className="h-3 w-3" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Right: 4-core-service capability cards */}
                      <div className="flex flex-col gap-2 h-full">
                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-gray-600 mb-0.5">
                          How our tools help
                        </p>

                        <div className="grid grid-cols-2 gap-2 flex-1">
                          {SERVICE_CARDS.map((card, i) => (
                            <motion.a
                              key={card.area}
                              href={card.href}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 + i * 0.07, type: "spring", stiffness: 300, damping: 24 }}
                              whileHover={{ x: 2 }}
                              whileTap={{ scale: 0.98 }}
                              className={`group flex flex-col gap-2 rounded-lg p-3 no-underline
                                          bg-white/[0.02] transition-all duration-200
                                          ${card.borderCls} ${card.hoverBg}`}
                            >
                              {/* Service label */}
                              <span className={`text-[9px] font-bold uppercase tracking-widest leading-none ${card.serviceCls}`}>
                                {card.service}
                              </span>

                              {/* Area name */}
                              <p className={`text-[12px] font-extrabold leading-tight ${card.areaCls}`}>
                                {card.area}
                              </p>

                              {/* Tool bullets */}
                              <ul className="flex flex-col gap-1 mt-auto">
                                {card.tools.map((t) => (
                                  <li key={t} className="flex items-start gap-1.5 text-[10.5px] text-gray-600 leading-snug">
                                    <span className={`mt-[4px] h-1 w-1 rounded-full flex-shrink-0 ${card.dotCls}`} />
                                    {t}
                                  </li>
                                ))}
                              </ul>

                              {/* Arrow */}
                              <span className={`text-[11px] font-bold self-end opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${card.areaCls}`}>
                                →
                              </span>
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ══ PANEL 2: Solution cards ══ */}
                {revealed && (
                  <motion.div key="solutions" custom={dir} variants={slide}
                    initial="enter" animate="center" exit="exit" transition={slideTx}>
                    <div className="p-7 md:p-10 flex flex-col gap-5">

                      {/* Header row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 380, damping: 16 }}
                            className="h-1.5 w-1.5 rounded-full bg-[#2563EB] animate-pulse"
                          />
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-0.5">Our Solution</p>
                            <h3 className="text-xl font-bold text-white leading-tight">One Integrated Ecosystem — Built for Every Outcome</h3>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
                          whileTap={{ scale: 0.94 }}
                          onClick={() => setRevealed(false)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/12 bg-white/5 px-3.5 py-2 text-xs font-semibold text-gray-600 transition-colors"
                        >
                          <motion.span
                            animate={{ x: [0, -3, 0] }}
                            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                          >
                            <ArrowLeft className="h-3 w-3" />
                          </motion.span>
                          Back
                        </motion.button>
                      </div>

                      {/* 4-col solution cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {SOLUTIONS.map((s, i) => {
                          const { Icon } = s;
                          const isHov = hovered === i;
                          return (
                            <motion.div
                              key={s.title}
                              initial={{ opacity: 0, y: 18, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ delay: i * 0.08, duration: 0.35, type: "spring", stiffness: 300, damping: 22 }}
                              whileHover={{ y: -4, boxShadow: `0 14px 36px ${s.glow}`, borderColor: s.hex + "60" }}
                              whileTap={{ scale: 0.97, y: 0 }}
                              onHoverStart={() => setHovered(i)}
                              onHoverEnd={() => setHovered(null)}
                              className={`relative rounded-xl border ${s.border} ${s.bg} p-5 flex flex-col gap-4 overflow-hidden cursor-default transition-colors`}
                            >
                              <Lines color={s.hex} />
                              <div className="relative z-10 flex flex-col gap-2.5">
                                <motion.div
                                  animate={isHov ? { scale: 1.15, rotate: 6, boxShadow: `0 0 16px ${s.glow}` } : { scale: 1, rotate: 0, boxShadow: "none" }}
                                  transition={{ type: "spring", stiffness: 400, damping: 16 }}
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.iconStyle} border ${s.border}`}
                                >
                                  <Icon className="h-4 w-4" />
                                </motion.div>
                                <h4 className="text-[13px] font-bold text-white leading-snug">{s.title}</h4>
                                <div className="space-y-2">
                                  {s.bullets.map((b, bi) => (
                                    <motion.div
                                      key={bi}
                                      initial={{ opacity: 0, x: -6 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: i * 0.08 + bi * 0.07 + 0.15, duration: 0.3 }}
                                      className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed"
                                    >
                                      <motion.span
                                        animate={isHov ? { x: 2, opacity: 1 } : { x: 0, opacity: 0.7 }}
                                        transition={{ duration: 0.2 }}
                                        className="mt-0.5 flex-shrink-0 text-[8px]"
                                        style={{ color: s.hex }}
                                      >▸</motion.span>
                                      {b}
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                              <motion.span
                                animate={{ opacity: isHov ? 0.12 : 0.04 }}
                                transition={{ duration: 0.25 }}
                                className="absolute bottom-2 right-3 text-5xl font-black leading-none select-none"
                                style={{ color: s.hex }}
                              >
                                {i + 1}
                              </motion.span>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* How it Works CTA */}
                      <div className="flex justify-center mt-1">
                        <motion.button
                          whileHover={{ scale: 1.04, boxShadow: "0 0 28px rgba(194,18,25,0.65)" }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setHowItWorksOpen(true)}
                          className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white overflow-hidden bg-gradient-to-r from-[#2563EB] via-rose-600 to-rose-500 shadow-[0_0_16px_rgba(194,18,25,0.4)]"
                        >
                          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
                          <span className="relative z-10">How it Works!</span>
                          <ArrowRight className="relative z-10 h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── Modal portals ────────────────────────────────────── */}
      {modalOpen && <FragmentedModal onClose={() => setModalOpen(false)} onReveal={() => setRevealed(true)} />}
      <AnimatePresence>
        {howItWorksOpen && <HowItWorksModal onClose={() => setHowItWorksOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
