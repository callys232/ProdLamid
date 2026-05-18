"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Brain, Layers, BarChart2, Zap, ArrowRight, ArrowLeft, X } from "lucide-react";
import HowItWorksModal from "./HowItWorksModal";

/* ── Line decoration ─────────────────────────────────────────── */
const Lines = ({ color }: { color: string }) => (
    <svg viewBox="0 0 200 120" fill="none" className="absolute inset-0 w-full h-full"
        style={{ color, opacity: 0.05 }} preserveAspectRatio="none">
        <line x1="0" y1="30" x2="200" y2="90" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="90" x2="200" y2="30" stroke="currentColor" strokeWidth="0.6" />
        <line x1="100" y1="0" x2="100" y2="120" stroke="currentColor" strokeWidth="0.6" />
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
            <svg className="absolute left-0 top-0 h-full" style={{ width: 220 }} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMinYMid slice">
                {left.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={COLOR} opacity={d.a} />)}
            </svg>
            <svg className="absolute right-0 top-0 h-full" style={{ width: 220 }} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMaxYMid slice">
                {right.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={COLOR} opacity={d.a} />)}
            </svg>
        </div>
    );
}

/* ── Data ────────────────────────────────────────────────────── */
const PROBLEM = {
    title: "The Solution we Provide ",
    subtitle: "Why fragmented work kills growth",
    bullets: [
        {
            text: "Client acquisition & retention are hard",
            detail: "Without a unified platform, businesses lose prospects to slow response times and disjointed follow-ups. LAMID's AI-powered CRM keeps every lead, client, and opportunity in one place — so nothing falls through the cracks.",
        },
        {
            text: "Talent alignment breaks across email & WhatsApp",
            detail: "Critical decisions buried in chat threads and scattered inboxes cause costly delays. LAMID's workrooms centralize all communication, task assignments, and file sharing — giving your team clarity and momentum.",
        },
        {
            text: "Delivery fails when spread across disconnected tools",
            detail: "Juggling five tools means five failure points. LAMID unifies project milestones, timelines, budgets, and deliverables in one dashboard — so every engagement ships on time and on spec.",
        },
        {
            text: "Experts struggle to upskill fast enough and secure consistent projects",
            detail: "Top talent deserves a platform that matches them with the right opportunities and helps them grow. LAMID's marketplace connects verified experts to enterprise-grade projects while its learning pathways keep skills sharp.",
        },
    ],
    full: "We help businesses scale with intelligence, agility, and measurable impact — across every layer of the enterprise. LAMID unifies strategy, performance, systems, and seamless work into one AIenabled, marketplacedriven, enterprisegrade ecosystem.",
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
        title: "Premium Growth Platform - From operational excellence to strategic execution, we help businesses scale with clarity, resilience, and measurable results.",
        bullets: ["Scale across industries and globally", "AIenabled intelligence and smarter decisions", "Marketplacedriven flexibility for dynamic teams", "Enterprisegrade reliability for complex operations", "Multipillar transformation across performance, systems, and work", "Impact that compounds over time", "One secure workspace for everything", "Zero fragmentation"],
        Icon: Zap, hex: "#a855f7",
        border: "border-purple-500/40", bg: "bg-purple-500/10", iconStyle: "text-purple-400 bg-purple-500/15", glow: "rgba(168,85,247,0.25)",
    },
];

/* ── Modal service cards data — mirrors SOLUTIONS, keeps images ── */
const MODAL_SERVICES = [
    {
        title: "AI Powered Matching – Where talent accelerates and leaders rise",
        image: "/bizLogo.png",
        bullets: ["Verified expertise at every level", "All-in-one intelligent talent engine", "AI automates scoping, matching & risk detection", "Predictive scoring for the right fit every time"],
        hex: "#3b82f6",
        glow: "rgba(59,130,246,0.35)",
        Icon: Brain,
        iconStyle: "text-blue-400",
        bg: "bg-blue-500/8",
        border: "border-blue-500/30",
    },
    {
        title: "Marketplace + CRM & PM",
        image: "/portalLogo.png",
        bullets: ["Workrooms, milestones & messaging", "Contract management & analytics", "Secure file sharing & collaboration", "Workflow automation built-in"],
        hex: "#10b981",
        glow: "rgba(16,185,129,0.35)",
        Icon: Layers,
        iconStyle: "text-emerald-400",
        bg: "bg-emerald-500/8",
        border: "border-emerald-500/30",
    },
    {
        title: "Enterprise-Grade Operations Suite – One workspace. Infinite possibilities",
        image: "/sdLogo.png",
        bullets: ["Businesses post projects, vetted experts get matched", "Budgeting, resource planning, & time tracking", "Secured payment management", "Transparent, seamless end-to-end delivery"],
        hex: "#f97316",
        glow: "rgba(249,115,22,0.35)",
        Icon: BarChart2,
        iconStyle: "text-orange-400",
        bg: "bg-orange-500/8",
        border: "border-orange-500/30",
    },
    {
        title: "Premium Growth Platform",
        image: "/hcdLogo.png",
        bullets: ["Scale across industries and globally", "AI-enabled intelligence and smarter decisions", "Marketplace-driven flexibility for dynamic teams", "Enterprise-grade reliability for complex operations", "Multi-pillar transformation across performance, systems, and work", "Impact that compounds over time", "One secure workspace for everything", "Zero fragmentation"],
        hex: "#a855f7",
        glow: "rgba(168,85,247,0.35)",
        Icon: Zap,
        iconStyle: "text-purple-400",
        bg: "bg-purple-500/8",
        border: "border-purple-500/30",
    },
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
    const [hoveredModal, setHoveredModal] = useState<number | null>(null);
    return (
        <AnimatePresence>
            <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 py-8"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 24 }}
                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative w-full max-w-4xl bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(194,18,25,0.15)]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#c21219]">The Root Problem</p>
                            <h2 className="text-lg font-extrabold text-white leading-tight">Why Fragmented Work Kills Growth</h2>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
                            whileTap={{ scale: 0.92 }}
                            onClick={onClose}
                            className="flex items-center justify-center w-8 h-8 rounded-lg border border-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </motion.button>
                    </div>

                    {/* Service cards grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 max-h-[70vh] overflow-y-auto">
                        {MODAL_SERVICES.map((s, i) => {
                            const { Icon } = s;
                            const isHov = hoveredModal === i;
                            return (
                                <motion.div
                                    key={s.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 24 }}
                                    whileHover={{ y: -4, boxShadow: `0 16px 48px ${s.glow}` }}
                                    whileTap={{ scale: 0.97, y: 0 }}
                                    onHoverStart={() => setHoveredModal(i)}
                                    onHoverEnd={() => setHoveredModal(null)}
                                    className={`relative rounded-xl border ${s.border} ${s.bg} overflow-hidden flex flex-col cursor-default`}
                                    style={{ borderColor: isHov ? s.hex + "70" : s.hex + "40", transition: "border-color 0.2s" }}
                                >
                                    {/* Image — zooms on hover */}
                                    <div className="relative w-full h-36 overflow-hidden" style={{ backgroundColor: s.hex + "12" }}>
                                        <motion.div
                                            animate={{ scale: isHov ? 1.06 : 1 }}
                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                            className="absolute inset-0"
                                        >
                                            <Image
                                                src={s.image}
                                                alt={s.title}
                                                fill
                                                className="object-cover opacity-80"
                                            />
                                        </motion.div>
                                        {/* Color wash overlay — intensifies on hover */}
                                        <motion.div
                                            animate={{ opacity: isHov ? 1 : 0.6 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute inset-0"
                                            style={{ background: `linear-gradient(to bottom, ${s.hex}10, ${s.hex}50)` }}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col gap-2 p-4">
                                        {/* Icon + title */}
                                        <div className="flex items-center gap-2.5">
                                            <motion.div
                                                animate={isHov
                                                    ? { scale: 1.15, rotate: 8, boxShadow: `0 0 14px ${s.glow}` }
                                                    : { scale: 1, rotate: 0, boxShadow: "none" }}
                                                transition={{ type: "spring", stiffness: 400, damping: 16 }}
                                                className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.iconStyle}`}
                                                style={{ backgroundColor: s.hex + "20", border: `1px solid ${s.hex}40` }}
                                            >
                                                <Icon className="h-4 w-4" />
                                            </motion.div>
                                            <h3 className="text-sm font-bold text-white">{s.title}</h3>
                                        </div>

                                        {/* Bullets — staggered nudge on hover */}
                                        <ul className="flex flex-col gap-1 mt-0.5">
                                            {s.bullets.map((b, bi) => (
                                                <motion.li
                                                    key={bi}
                                                    animate={isHov ? { x: 3, opacity: 1 } : { x: 0, opacity: 0.75 }}
                                                    transition={{ duration: 0.2, delay: bi * 0.04 }}
                                                    className="flex items-start gap-1.5 text-[11px] text-gray-400 leading-snug"
                                                >
                                                    <motion.span
                                                        animate={isHov ? { scale: 1.4, opacity: 1 } : { scale: 1, opacity: 0.7 }}
                                                        transition={{ duration: 0.2, delay: bi * 0.04 }}
                                                        className="mt-0.5 flex-shrink-0 text-[8px]"
                                                        style={{ color: s.hex }}
                                                    >▸</motion.span>
                                                    {b}
                                                </motion.li>
                                            ))}
                                        </ul>

                                        {/* Accent bar — expands on hover */}
                                        <motion.div
                                            animate={{ width: isHov ? "60%" : "3rem" }}
                                            transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
                                            className="mt-1 h-0.5 rounded-full"
                                            style={{ backgroundColor: s.hex }}
                                        />
                                    </div>
                                </motion.div>
                            );
                        })}
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

                                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8 items-start">

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

                                            <p className="text-xs text-gray-300 leading-relaxed">{PROBLEM.full}</p>

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

                                        <div className="flex flex-col gap-2">
                                            {/* Section title */}
                                            <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-transparent bg-clip-text bg-gradient-to-r from-[#c21219] via-rose-400 to-white w-fit">
                                                Delivering Value — Why it Matters
                                            </p>

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
                                                            <p className={`text-xs leading-snug transition-colors duration-200 ${isOpen ? "text-white font-medium" : "text-gray-300"}`}>
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
                                                            <p className="text-[11px] text-gray-400 leading-relaxed px-3.5 pb-3 pt-0.5 border-t border-[#c21219]/15">
                                                                {b.detail}
                                                            </p>
                                                        </motion.div>
                                                    </motion.div>
                                                );
                                            })}
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
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">Our Solution</p>
                                            <h3 className="text-base font-bold text-white leading-tight">One Integrated Ecosystem - Every Layer of Impact</h3>
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

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                                                className={`relative rounded-xl border ${s.border} ${s.bg} p-4 flex flex-col gap-3 overflow-hidden cursor-default transition-colors`}
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

                                                    <h4 className="text-xs font-bold text-white leading-snug">{s.title}</h4>

                                                    <ul className="space-y-1.5">
                                                        {s.bullets.map((b, bi) => (
                                                            <motion.li
                                                                key={bi}
                                                                initial={{ opacity: 0, x: -6 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: i * 0.08 + bi * 0.07 + 0.15, duration: 0.3 }}
                                                                className="flex items-start gap-1.5 text-[11px] text-gray-400"
                                                            >
                                                                <motion.span
                                                                    animate={isHov ? { x: 2, opacity: 1 } : { x: 0, opacity: 0.7 }}
                                                                    transition={{ duration: 0.2 }}
                                                                    className="mt-0.5 flex-shrink-0 text-[8px]"
                                                                    style={{ color: s.hex }}
                                                                >▸</motion.span>
                                                                {b}
                                                            </motion.li>
                                                        ))}
                                                    </ul>
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
