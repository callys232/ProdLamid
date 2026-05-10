"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Brain, Layers, BarChart2, Zap, ArrowRight, ArrowLeft } from "lucide-react";

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
    title: "The Problem We Solve",
    subtitle: "Why fragmented work kills growth",
    bullets: [
        "Client acquisition & retention are hard",
        "Talent alignment breaks across email & WhatsApp",
        "Delivery fails when spread across disconnected tools",
        "Experts struggle to upskill fast enough and secure consistent projects",
    ],
    full: "Client acquisition and retention are hard, talent alignment is harder, and delivery breaks down when work is spread across email, WhatsApp, spreadsheets, and multiple disconnected tools. Even top-notch experts battle to upskill fast enough, secure consistent projects, and manage clients efficiently.",
    hex: "#c21219",
    glow: "rgba(194,18,25,0.25)",
};

const SOLUTIONS = [
    {
        title: "AI-Powered Matching",
        bullets: ["Matches organizations with vetted experts", "AI automates scoping, matching & risk detection", "Predictive scoring for the right fit every time"],
        Icon: Brain, hex: "#3b82f6",
        border: "border-blue-500/40", bg: "bg-blue-500/10", iconStyle: "text-blue-400 bg-blue-500/15", glow: "rgba(59,130,246,0.25)",
    },
    {
        title: "Built-in CRM & PM",
        bullets: ["Workrooms, milestones & messaging", "Contract management & analytics", "Secure file sharing & collaboration", "Workflow automation built-in"],
        Icon: Layers, hex: "#10b981",
        border: "border-emerald-500/40", bg: "bg-emerald-500/10", iconStyle: "text-emerald-400 bg-emerald-500/15", glow: "rgba(16,185,129,0.25)",
    },
    {
        title: "Full Operations Suite",
        bullets: ["Budgeting, time tracking & resource planning", "Secured payment management", "Transparent, seamless end-to-end delivery"],
        Icon: BarChart2, hex: "#f97316",
        border: "border-orange-500/40", bg: "bg-orange-500/10", iconStyle: "text-orange-400 bg-orange-500/15", glow: "rgba(249,115,22,0.25)",
    },
    {
        title: "Premium Growth Platform",
        bullets: ["Scale systems & streamline operations", "Fuel innovation & drive digital growth", "Build world-class teams", "Empower organizations & communities through technology"],
        Icon: Zap, hex: "#a855f7",
        border: "border-purple-500/40", bg: "bg-purple-500/10", iconStyle: "text-purple-400 bg-purple-500/15", glow: "rgba(168,85,247,0.25)",
    },
];

/* ── Slide variants ──────────────────────────────────────────── */
const slide = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
};
const slideTx = { duration: 0.48, ease: [0.33, 1, 0.68, 1] as const };

/* ── Component ───────────────────────────────────────────────── */
export default function AISystemSection() {
    const [revealed, setRevealed] = useState(false);
    const [hovered, setHovered] = useState<number | null>(null);
    const dir = revealed ? 1 : -1;

    return (
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

                                {/* Vector line bg */}
                                <svg
                                    className="absolute inset-0 w-full h-full pointer-events-none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid slice"
                                >
                                    {/* long diagonals */}
                                    <line x1="0"    y1="0"    x2="100%" y2="100%" stroke="#c21219" strokeWidth="0.5" opacity="0.07" />
                                    <line x1="100%" y1="0"    x2="0"    y2="100%" stroke="#c21219" strokeWidth="0.4" opacity="0.05" />
                                    {/* horizontal runners */}
                                    <line x1="0"    y1="30%"  x2="100%" y2="30%"  stroke="#c21219" strokeWidth="0.4" opacity="0.04" />
                                    <line x1="0"    y1="70%"  x2="100%" y2="70%"  stroke="#c21219" strokeWidth="0.3" opacity="0.03" />
                                    {/* vertical accent */}
                                    <line x1="40%"  y1="0"    x2="40%"  y2="100%" stroke="#ffffff" strokeWidth="0.3" opacity="0.03" />
                                    {/* short corner lines */}
                                    <line x1="0"    y1="0"    x2="18%"  y2="55%"  stroke="#c21219" strokeWidth="0.5" opacity="0.06" />
                                    <line x1="100%" y1="100%" x2="72%"  y2="40%"  stroke="#c21219" strokeWidth="0.5" opacity="0.06" />
                                    {/* mid cross */}
                                    <line x1="65%"  y1="0"    x2="35%"  y2="100%" stroke="#ffffff" strokeWidth="0.3" opacity="0.025" />
                                </svg>

                                {/* Tagline strip — hover shimmer */}
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
                                        All in one ecosystem — matches organizations with vetted experts, provides built-in CRM
                                        and project management, and uses AI to automate the process.
                                    </p>
                                </motion.div>

                                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8 items-start">

                                    {/* Left: copy */}
                                    <div className="flex flex-col gap-3">
                                        {/* Icon badge — pops in */}
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
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#c21219]">The Challenge</span>
                                        </motion.div>

                                        <h2 className="text-xl md:text-2xl font-extrabold text-white leading-tight">{PROBLEM.title}</h2>
                                        <p className="text-xs text-gray-500 italic">{PROBLEM.subtitle}</p>
                                        <p className="text-xs text-gray-300 leading-relaxed">{PROBLEM.full}</p>

                                        {/* CTA — arrow animates on hover */}
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

                                    {/* Right: bullet pills */}
                                    <div className="flex flex-col gap-2">
                                        {PROBLEM.bullets.map((b, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: 14 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.12 + i * 0.09, duration: 0.35, ease: [0.33,1,0.68,1] as const }}
                                                whileHover={{ x: 4, backgroundColor: "rgba(194,18,25,0.1)", borderColor: "rgba(194,18,25,0.35)" }}
                                                className="flex items-start gap-2.5 rounded-lg border border-[#c21219]/15 bg-[#c21219]/5 px-3.5 py-2.5 cursor-default transition-colors"
                                            >
                                                <motion.span
                                                    whileHover={{ scale: 1.4 }}
                                                    className="mt-0.5 text-[#c21219] flex-shrink-0 text-[9px]"
                                                >▸</motion.span>
                                                <p className="text-xs text-gray-300 leading-snug">{b}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ══ PANEL 2: Solutions ════════════════════════════════ */}
                    {revealed && (
                        <motion.div key="solutions" custom={dir} variants={slide}
                            initial="enter" animate="center" exit="exit" transition={slideTx}>

                            {/* Header row */}
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
                                        <h3 className="text-base font-bold text-white leading-tight">All-in-one Ecosystem</h3>
                                    </div>
                                </div>

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

                            {/* 4 solution cards */}
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
                                            onHoverStart={() => setHovered(i)}
                                            onHoverEnd={() => setHovered(null)}
                                            className={`relative rounded-xl border ${s.border} ${s.bg} p-4 flex flex-col gap-3 overflow-hidden cursor-default transition-colors`}
                                        >
                                            <Lines color={s.hex} />

                                            <div className="relative z-10 flex flex-col gap-2.5">
                                                {/* Icon — pops + rotates on hover */}
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

                                            {/* Number watermark — fades in on hover */}
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
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
