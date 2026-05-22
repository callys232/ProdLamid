"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Brain, Layers, BarChart2, Zap, Shield, ArrowRight, ArrowLeft, X } from "lucide-react";
import HowItWorksModal from "./HowItWorksModal";

/* ── Line decoration ─────────────────────────────────────────── */
const Lines = ({ color }: { color: string }) => (
    <svg viewBox="0 0 200 120" fill="none" className="absolute inset-0 w-full h-full opacity-[0.05]" preserveAspectRatio="none">
        <line x1="0" y1="30" x2="200" y2="90" stroke={color} strokeWidth="1" />
        <line x1="0" y1="90" x2="200" y2="30" stroke={color} strokeWidth="0.6" />
        <line x1="100" y1="0" x2="100" y2="120" stroke={color} strokeWidth="0.6" />
    </svg>
);

/* ── Seeded random ───────────────────────────────────────────── */
function sr(seed: number) { const x = Math.sin(seed + 1) * 10000; return x - Math.floor(x); }

/* ── Wave background ─────────────────────────────────────────── */
function WaveBg() {
    const W = 320, H = 520, COLOR = "#c21219";
    const makeDots = (flip: boolean) => {
        const dots: { x: number; y: number; r: number; a: number }[] = [];
        for (let w = 0; w < 7; w++) {
            const amp = 18 + w * 11, freq = 0.013 + w * 0.005, phase = w * 1.2;
            const yBase = H * (0.08 + w * 0.13);
            for (let s = 0; s < W; s += 3) {
                const x = flip ? W - s : s;
                const y = yBase + amp * Math.sin(freq * s + phase);
                if (y < 0 || y > H) continue;
                const proximity = flip ? s / W : 1 - s / W;
                dots.push({ x, y, r: 0.5 + sr(w * 1000 + s) * 1.3, a: 0.04 + 0.3 * proximity });
            }
        }
        return dots;
    };
    const left = makeDots(false), right = makeDots(true);
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <svg className="absolute left-0 top-0 h-full w-[220px]" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMinYMid slice">
                {left.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={COLOR} opacity={d.a} />)}
            </svg>
            <svg className="absolute right-0 top-0 h-full w-[220px]" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMaxYMid slice">
                {right.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={COLOR} opacity={d.a} />)}
            </svg>
        </div>
    );
}

/* ── Data ────────────────────────────────────────────────────── */
const PROBLEM = {
    title: "The Solution we Provide",
    subtitle: "The hidden cost of fragmented work",
    bullets: [
        {
            text: "Leads die in inbox chaos — before they become clients",
            detail: "Every unanswered message and delayed follow-up is a deal lost to a competitor who moved faster. Without a unified CRM, your pipeline leaks silently and expensively. LAMID closes the gap — keeping every lead warm, every client engaged, and every opportunity visible in one intelligent workspace.",
        },
        {
            text: "Teams drift when communication lives across five apps",
            detail: "When decisions are buried in WhatsApp threads, emails, and Slack channels, accountability blurs and momentum dies. LAMID's Workrooms consolidate every conversation, task, and file in one place — so your team moves with clarity, not confusion.",
        },
        {
            text: "Projects stall when accountability has no single home",
            detail: "One missed update across Google Docs, Trello, and email chains is all it takes to derail a delivery. LAMID replaces the patchwork with a single source of truth — milestones, budgets, timelines, and sign-offs all in sync, so every engagement ships on time.",
        },
        {
            text: "Experts can't grow what they can't track or monetize",
            detail: "Top consultants chasing clients manually, managing admin across spreadsheets, and upskilling in isolation can't build a sustainable practice. LAMID's marketplace connects verified talent to enterprise-grade projects, automates the operational layer, and keeps skills sharp — so experts focus on impact, not overhead.",
        },
    ],
    full: "Most businesses don't fail from lack of ambition — they fail from friction. Fragmented tools, misaligned teams, and disconnected workflows quietly erode performance at every layer. LAMID eliminates that friction, unifying strategy, talent, delivery, and growth into one AI-enabled ecosystem built for scale.",
    hex: "#c21219",
    glow: "rgba(194,18,25,0.25)",
};

const SOLUTIONS = [
    {
        title: "AI Powered Matching – Where talent accelerates and leaders rise",
        bullets: ["Verified expertise at every level", "All-in- one intelligent talent engine", "AI automates scoping, matching & risk detection", "Predictive scoring for the right fit every time"],
        Icon: Brain, hex: "#3b82f6",
        border: "border-blue-500/40", bg: "bg-blue-500/10", iconStyle: "text-blue-400 bg-blue-500/15", glow: "rgba(59,130,246,0.25)",
    },
    {
        title: "Marketplace + CRM & PM",
        bullets: ["Workrooms, milestones & messaging", "Contract management & analytics", "Secure file sharing & collaboration", "Workflow automation built-in"],
        Icon: Layers, hex: "#10b981",
        border: "border-emerald-500/40", bg: "bg-emerald-500/10", iconStyle: "text-emerald-400 bg-emerald-500/15", glow: "rgba(16,185,129,0.25)",
    },
    {
        title: "Enterprise-Grade Operations Suite - One workspace. Infinite possibilities",
        bullets: ["Businesses post projects, vetted experts get matched ", "Budgeting, resource planning, & time tracking", "Secured payment management", "Transparent, seamless end-to-end delivery"],
        Icon: BarChart2, hex: "#f97316",
        border: "border-orange-500/40", bg: "bg-orange-500/10", iconStyle: "text-orange-400 bg-orange-500/15", glow: "rgba(249,115,22,0.25)",
    },
    {
        title: "Premium Growth Platform — Scale with clarity and measurable results",
        bullets: ["Scale across industries and globally", "AI-enabled intelligence and smarter decisions", "Enterprise-grade reliability for complex operations", "Impact that compounds over time"],
        Icon: Zap, hex: "#a855f7",
        border: "border-purple-500/40", bg: "bg-purple-500/10", iconStyle: "text-purple-400 bg-purple-500/15", glow: "rgba(168,85,247,0.25)",
    },
];

/* ── Three-layer platform data (used in FragmentedModal) ── */
const PLATFORM_LAYERS = [
    {
        num: "01",
        label: "Service Pillars",
        title: "Four Pillars. One Mission.",
        desc: "LAMID's four proprietary service pillars — digitised, AI-assisted, and delivered through one connected platform.",
        bullets: [
            "BIZ — SME & startup empowerment tools",
            "HCD — Training, recruitment & leadership",
            "SDC — Sustainable development consulting",
            "Portal — Freelancers, Clients, Enterprise & Concierge in one marketplace",
        ],
        Icon: Layers,
        hex: "#c21219",
        glow: "rgba(194,18,25,0.35)",
    },
    {
        num: "02",
        label: "Marketplace & Workspace",
        title: "Where Work Gets Done",
        desc: "A connected layer where projects are posted, experts matched, and delivery tracked end to end.",
        bullets: [
            "Post projects — match verified experts via AI",
            "Built-in CRM, task boards & document sharing",
            "Contracting, milestones & secure payments",
            "Freelancer, Enterprise & Concierge tiers",
        ],
        Icon: BarChart2,
        hex: "#3b82f6",
        glow: "rgba(59,130,246,0.35)",
    },
    {
        num: "03",
        label: "AI Operating System",
        title: "Intelligence Built In",
        desc: "The brain of the platform — automating, matching, and optimising at every layer.",
        bullets: [
            "Smart consultant-to-project matching engine",
            "Automated scoping & proposal generation",
            "AI diagnostics for businesses & organisations",
            "Quality assurance, reports & insights",
        ],
        Icon: Brain,
        hex: "#a855f7",
        glow: "rgba(168,85,247,0.35)",
    },
    {
        num: "04",
        label: "Governance & Trust",
        title: "Secure. Compliant. Transparent.",
        desc: "Enterprise-grade oversight — keeping every user, transaction, and delivery accountable.",
        bullets: [
            "KYC verification & dispute resolution",
            "Secure escrow & payment management",
            "Analytics dashboards & performance tracking",
            "Admin controls, compliance & audit trails",
        ],
        Icon: Shield,
        hex: "#10b981",
        glow: "rgba(16,185,129,0.35)",
    },
];

const USER_TYPES = [
    { label: "Freelancers", desc: "Match, deliver & earn on every project", hex: "#10b981" },
    { label: "Enterprise Clients", desc: "Post projects, manage teams, scale outcomes", hex: "#3b82f6" },
    { label: "Concierge", desc: "Dedicated PM, custom dashboards & multi-project oversight", hex: "#c21219" },
];

/* ── Slide variants ──────────────────────────────────────────── */
const slide = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
};
const slideTx = { duration: 0.48, ease: [0.33, 1, 0.68, 1] as const };

/* ── Fragmented Work Modal ───────────────────────────────────── */
function FragmentedModal({ onClose }: { onClose: () => void }) {
    return (
        <AnimatePresence>
            <motion.div
                key="fm-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md px-4 py-8"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.93, y: 28 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.93, y: 28 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-5xl bg-[#080808] border border-white/8 rounded-3xl overflow-hidden shadow-[0_0_120px_rgba(194,18,25,0.18)]"
                >
                    {/* Dot grid bg */}
                    <div className="absolute inset-0 pointer-events-none [background-image:radial-gradient(circle,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:28px_28px]" />
                    <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-40 rounded-full bg-[#c21219]/10 blur-3xl pointer-events-none" />
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c21219]/40 to-transparent" />

                    {/* ── Header ── */}
                    <div className="relative sticky top-0 z-10 bg-[#080808]/95 backdrop-blur-md border-b border-white/6 px-8 py-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2.5 mb-2">
                                    <motion.span
                                        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                        className="h-1.5 w-1.5 rounded-full bg-[#c21219]"
                                    />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c21219]">Platform Overview</span>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#c21219] via-rose-400 to-white leading-tight">
                                    A Four-Layer Ecosystem Built to End Fragmented Work
                                </h2>
                                <p className="text-xs text-gray-500 mt-2 max-w-xl leading-relaxed">
                                    LAMID unifies four proprietary service pillars, an AI-powered marketplace, a delivery workspace, and an intelligent operating system — one connected platform that replaces the patchwork.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="hidden sm:block text-[10px] text-gray-600 font-medium tracking-wide">click outside to close</span>
                                <motion.button
                                    whileHover={{ scale: 1.12, rotate: 90, boxShadow: "0 0 16px rgba(194,18,25,0.45)" }}
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                                    onClick={onClose}
                                    className="flex items-center justify-center w-8 h-8 rounded-xl border border-white/10 bg-white/[0.03] text-gray-400 hover:text-white hover:border-[#c21219]/40 transition-colors"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* ── Body ── */}
                    <div className="overflow-y-auto max-h-[70vh] px-8 py-8 space-y-6 [scrollbar-width:none] [-ms-overflow-style:none]">
                        {/* Three layer cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {PLATFORM_LAYERS.map((layer, i) => (
                                <motion.div
                                    key={layer.label}
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1, type: "spring", stiffness: 280, damping: 22 }}
                                    whileHover={{ y: -4, boxShadow: `0 14px 40px ${layer.glow}` }}
                                    className="relative rounded-2xl p-6 flex flex-col gap-4 overflow-hidden group cursor-default"
                                    style={{ border: `1px solid ${layer.hex}25`, backgroundColor: `${layer.hex}06` }}
                                >
                                    {/* Hover gradient */}
                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                        style={{ background: `linear-gradient(135deg, ${layer.hex}0a, transparent)` }}
                                    />

                                    {/* Number + icon */}
                                    <div className="flex items-center justify-between relative z-10">
                                        <span className="text-4xl font-black select-none" style={{ color: `${layer.hex}18` }}>{layer.num}</span>
                                        <div
                                            className="w-9 h-9 rounded-xl flex items-center justify-center"
                                            style={{ backgroundColor: `${layer.hex}18`, border: `1px solid ${layer.hex}35` }}
                                        >
                                            <layer.Icon className="h-4 w-4" style={{ color: layer.hex }} />
                                        </div>
                                    </div>

                                    {/* Labels + copy */}
                                    <div className="relative z-10 space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: layer.hex }}>{layer.label}</p>
                                        <h3 className="text-base font-bold text-white">{layer.title}</h3>
                                        <p className="text-xs text-gray-500 leading-relaxed">{layer.desc}</p>
                                    </div>

                                    {/* Bullets */}
                                    <div className="flex flex-col gap-2 relative z-10">
                                        {layer.bullets.map((b, bi) => (
                                            <div key={bi} className="flex items-start gap-2 text-xs text-gray-400 leading-relaxed">
                                                <span className="mt-1.5 h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: layer.hex }} />
                                                {b}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Accent line */}
                                    <div className="h-0.5 w-8 rounded-full mt-auto relative z-10" style={{ backgroundColor: layer.hex }} />
                                </motion.div>
                            ))}
                        </div>

                        {/* User types strip */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.38, type: "spring", stiffness: 260, damping: 24 }}
                            className="rounded-2xl border border-white/6 bg-white/[0.02] p-6"
                        >
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">Built For Every User</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {USER_TYPES.map((u, i) => (
                                    <motion.div
                                        key={u.label}
                                        initial={{ opacity: 0, scale: 0.92 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.44 + i * 0.08 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-default"
                                        style={{ backgroundColor: `${u.hex}08`, border: `1px solid ${u.hex}20` }}
                                    >
                                        <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: u.hex }} />
                                        <div>
                                            <p className="text-[13px] font-semibold text-white">{u.label}</p>
                                            <p className="text-xs text-gray-500 leading-snug">{u.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

/* ── Component ───────────────────────────────────────────────── */
export default function AISystemSection() {
    const [revealed, setRevealed] = useState(false);
    const [hovered, setHovered] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [expandedBullet, setExpandedBullet] = useState<number | null>(null);
    const [howItWorksOpen, setHowItWorksOpen] = useState(false);
    const dir = revealed ? 1 : -1;

    return (
        <>
            <section className="relative w-full bg-black text-white px-4 md:px-10 py-6 overflow-hidden">
                <WaveBg />

                <div className="relative z-10 max-w-7xl mx-auto overflow-hidden rounded-2xl">
                    <AnimatePresence mode="wait" custom={dir}>

                        {/* ══ PANEL 1: Problem ══════════════════════════════════ */}
                        {!revealed && (
                            <motion.div key="problem" custom={dir} variants={slide}
                                initial="enter" animate="center" exit="exit" transition={slideTx}>

                                <div className="relative rounded-2xl border border-[#c21219]/30 bg-[#0d0d0d] overflow-hidden">
                                    <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-[#c21219]/8 blur-3xl pointer-events-none" />

                                    <svg
                                        className="absolute inset-0 w-full h-full pointer-events-none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        preserveAspectRatio="xMidYMid slice"
                                    >
                                        <line x1="0" y1="0" x2="100%" y2="100%" stroke="#c21219" strokeWidth="0.5" opacity="0.07" />
                                        <line x1="100%" y1="0" x2="0" y2="100%" stroke="#c21219" strokeWidth="0.4" opacity="0.05" />
                                        <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#c21219" strokeWidth="0.4" opacity="0.04" />
                                        <line x1="0" y1="70%" x2="100%" y2="70%" stroke="#c21219" strokeWidth="0.3" opacity="0.03" />
                                        <line x1="40%" y1="0" x2="40%" y2="100%" stroke="#ffffff" strokeWidth="0.3" opacity="0.03" />
                                        <line x1="0" y1="0" x2="18%" y2="55%" stroke="#c21219" strokeWidth="0.5" opacity="0.06" />
                                        <line x1="100%" y1="100%" x2="72%" y2="40%" stroke="#c21219" strokeWidth="0.5" opacity="0.06" />
                                        <line x1="65%" y1="0" x2="35%" y2="100%" stroke="#ffffff" strokeWidth="0.3" opacity="0.025" />
                                    </svg>

                                    <motion.div
                                        whileHover={{ backgroundColor: "rgba(194,18,25,0.06)" }}
                                        transition={{ duration: 0.2 }}
                                        className="relative z-10 flex items-center gap-2.5 border-b border-white/5 bg-white/[0.02] px-6 py-2.5 cursor-default"
                                    >
                                        <motion.span
                                            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                            className="h-1.5 w-1.5 rounded-full bg-[#c21219] flex-shrink-0"
                                        />
                                        <p className="text-xs text-gray-400 leading-snug">
                                            The Unified Growth Ecosystem — Matches businesses with vetted experts, provides built-in CRM &amp; project
                                            management and uses AI to automate the process.
                                        </p>
                                    </motion.div>

                                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 p-7 md:p-10 items-stretch">

                                        <div className="flex flex-col gap-3">
                                            <motion.div
                                                initial={{ scale: 0.6, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 18, delay: 0.1 }}
                                                className="flex items-center gap-2.5 w-fit"
                                            >
                                                <motion.div
                                                    whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                                                    transition={{ duration: 0.4 }}
                                                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#c21219]/15 border border-[#c21219]/30"
                                                >
                                                    <AlertCircle className="h-4 w-4 text-[#c21219]" />
                                                </motion.div>
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c21219]">Powering Enterprise Transformation Seamlessly</span>
                                            </motion.div>

                                            <h2 className="text-xl md:text-2xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#c21219] via-rose-400 to-white">
                                                {PROBLEM.title}
                                            </h2>

                                            {/* Clickable subtitle → opens modal */}
                                            <motion.p
                                                whileHover={{ color: "#c21219", x: 2 }}
                                                whileTap={{ scale: 0.96, x: 0 }}
                                                transition={{ duration: 0.2 }}
                                                onClick={() => setModalOpen(true)}
                                                className="text-xs text-gray-500 italic cursor-pointer underline underline-offset-2 decoration-dotted w-fit"
                                            >
                                                {PROBLEM.subtitle} →
                                            </motion.p>

                                            <p className="text-[13px] text-gray-300 leading-relaxed">{PROBLEM.full}</p>

                                            <motion.button
                                                whileHover={{ scale: 1.03, boxShadow: `0 0 24px ${PROBLEM.glow}` }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setRevealed(true)}
                                                className="group mt-1 inline-flex items-center gap-2.5 rounded-xl bg-[#c21219] hover:bg-red-700 px-5 py-2.5 text-xs font-bold text-white transition-colors w-fit shadow-[0_0_16px_rgba(193,33,41,0.3)]"
                                            >
                                                See how we solve these problems
                                                <motion.span
                                                    animate={{ x: [0, 3, 0] }}
                                                    transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                                                >
                                                    <ArrowRight className="h-3.5 w-3.5" />
                                                </motion.span>
                                            </motion.button>
                                        </div>

                                        <div className="flex flex-col h-full">
                                            {/* Section title */}
                                            <p className="text-[10px] font-bold uppercase tracking-widest mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#c21219] via-rose-400 to-white w-fit">
                                                Delivering Value — Why it Matters
                                            </p>

                                            <div className="flex flex-col flex-1 justify-between gap-2">
                                            {PROBLEM.bullets.map((b, i) => {
                                                const isOpen = expandedBullet === i;
                                                return (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: 14 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.12 + i * 0.09, duration: 0.35, ease: [0.33, 1, 0.68, 1] as const }}
                                                        className="rounded-lg border overflow-hidden transition-colors duration-200"
                                                        style={{
                                                            borderColor: isOpen ? "rgba(194,18,25,0.45)" : "rgba(194,18,25,0.15)",
                                                            backgroundColor: isOpen ? "rgba(194,18,25,0.1)" : "rgba(194,18,25,0.04)",
                                                        }}
                                                    >
                                                        {/* Header row — clickable */}
                                                        <motion.button
                                                            whileHover={{ backgroundColor: "rgba(194,18,25,0.08)" }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => setExpandedBullet(isOpen ? null : i)}
                                                            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 cursor-pointer text-left"
                                                        >
                                                            <motion.span
                                                                animate={{ rotate: isOpen ? 90 : 0 }}
                                                                transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
                                                                className="text-[#c21219] flex-shrink-0 text-[9px]"
                                                            >▸</motion.span>
                                                            <p className={`text-[13px] leading-snug transition-colors duration-200 ${isOpen ? "text-white font-medium" : "text-gray-300"}`}>
                                                                {b.text}
                                                            </p>
                                                            {/* Active indicator dot */}
                                                            {isOpen && (
                                                                <motion.span
                                                                    initial={{ scale: 0, opacity: 0 }}
                                                                    animate={{ scale: 1, opacity: 1 }}
                                                                    className="ml-auto h-1.5 w-1.5 rounded-full bg-[#c21219] flex-shrink-0"
                                                                />
                                                            )}
                                                        </motion.button>

                                                        {/* Dropdown detail */}
                                                        <motion.div
                                                            initial={false}
                                                            animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                                                            transition={{ duration: 0.32, ease: [0.33, 1, 0.68, 1] }}
                                                            style={{ overflow: "hidden" }}
                                                        >
                                                            <p className="text-xs text-gray-400 leading-relaxed px-3.5 pb-4 pt-1.5 border-t border-[#c21219]/15">
                                                                {b.detail}
                                                            </p>
                                                        </motion.div>
                                                    </motion.div>
                                                );
                                            })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ══ PANEL 2: Solutions ════════════════════════════════ */}
                        {revealed && (
                            <motion.div key="solutions" custom={dir} variants={slide}
                                initial="enter" animate="center" exit="exit" transition={slideTx}>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <motion.div
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: "spring", stiffness: 380, damping: 16 }}
                                            className="h-1.5 w-1.5 rounded-full bg-[#c21219] animate-pulse"
                                        />
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-1">Our Solution</p>
                                            <h3 className="text-xl font-bold text-white leading-tight">One Integrated Ecosystem — Every Layer of Impact</h3>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.08)" }}
                                            whileTap={{ scale: 0.94 }}
                                            onClick={() => setRevealed(false)}
                                            className="group inline-flex items-center gap-1.5 rounded-lg border border-white/12 bg-white/5 px-3.5 py-2 text-xs font-semibold text-gray-400 transition-colors"
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
                                </div>

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
                                                        animate={isHov
                                                            ? { scale: 1.15, rotate: 6, boxShadow: `0 0 16px ${s.glow}` }
                                                            : { scale: 1, rotate: 0, boxShadow: "none" }}
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
                                                                className="flex items-start gap-2 text-xs text-gray-400 leading-relaxed"
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

                                {/* How it Works CTA — bottom center */}
                                <div className="flex justify-center mt-5">
                                    <motion.button
                                        whileHover={{ scale: 1.04, boxShadow: "0 0 28px rgba(194,18,25,0.65)" }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setHowItWorksOpen(true)}
                                        className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white overflow-hidden
                                            bg-gradient-to-r from-[#c21219] via-rose-600 to-rose-500
                                            shadow-[0_0_16px_rgba(194,18,25,0.4)]"
                                    >
                                        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" />
                                        <span className="relative z-10">How it Works!</span>
                                        <ArrowRight className="relative z-10 h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* ── Modal portals ────────────────────────────────────── */}
            {modalOpen && <FragmentedModal onClose={() => setModalOpen(false)} />}
            <AnimatePresence>
                {howItWorksOpen && <HowItWorksModal onClose={() => setHowItWorksOpen(false)} />}
            </AnimatePresence>
        </>
    );
}
