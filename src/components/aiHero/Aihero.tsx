"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Brain, Layers, Building2, Users } from "lucide-react";

/* ── Minimal vector line decoration ─────────────────────────── */
const Lines = ({ color }: { color: string }) => (
    <svg
        viewBox="0 0 200 120"
        fill="none"
        className="absolute inset-0 w-full h-full"
        style={{ color, opacity: 0.06 }}
        preserveAspectRatio="none"
    >
        <line x1="0" y1="30" x2="200" y2="90" stroke="currentColor" strokeWidth="1" />
        <line x1="0" y1="90" x2="200" y2="30" stroke="currentColor" strokeWidth="0.6" />
        <line x1="100" y1="0" x2="100" y2="120" stroke="currentColor" strokeWidth="0.6" />
    </svg>
);

/* ── Seeded random (avoids hydration mismatch) ───────────────── */
function sr(seed: number) {
    const x = Math.sin(seed + 1) * 10000;
    return x - Math.floor(x);
}

/* ── Waveform background ─────────────────────────────────────── */
function WaveBg() {
    const W = 320; const H = 520;
    const COLOR = "#c21219";

    const makeDots = (flip: boolean) => {
        const dots: { x: number; y: number; r: number; a: number }[] = [];
        const waveCount = 7;
        for (let w = 0; w < waveCount; w++) {
            const amp = 18 + w * 11;
            const freq = 0.013 + w * 0.005;
            const phase = w * 1.2;
            const yBase = H * (0.08 + w * 0.13);
            for (let s = 0; s < W; s += 3) {
                const x = flip ? W - s : s;
                const y = yBase + amp * Math.sin(freq * s + phase);
                if (y < 0 || y > H) continue;
                const proximity = flip ? s / W : 1 - s / W;
                const a = 0.04 + 0.3 * proximity;
                const r = 0.5 + sr(w * 1000 + s) * 1.3;
                dots.push({ x, y, r, a });
            }
        }
        return dots;
    };

    const left = makeDots(false);
    const right = makeDots(true);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <svg
                className="absolute left-0 top-0 h-full"
                style={{ width: 280 }}
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="xMinYMid slice"
            >
                {left.map((d, i) => (
                    <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={COLOR} opacity={d.a} />
                ))}
            </svg>
            <svg
                className="absolute right-0 top-0 h-full"
                style={{ width: 280 }}
                viewBox={`0 0 ${W} ${H}`}
                preserveAspectRatio="xMaxYMid slice"
            >
                {right.map((d, i) => (
                    <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={COLOR} opacity={d.a} />
                ))}
            </svg>
        </div>
    );
}

/* ── Data ────────────────────────────────────────────────────── */
const insights = [
    {
        title: "Unified Ecosystem",
        bullets: [
            "Expertise discovered, contracted & executed globally",
            "End-to-end delivery in one marketplace",
            "CRM + Project Management in one platform",
        ],
        full: "We have provided a unified ecosystem infrastructure for how expertise is discovered, contracted and executed globally. Our AI-driven consulting system unites project matching and end-to-end delivery in one marketplace — combining CRM and project management into a single intelligent platform.",
        Icon: Globe,
        hex: "#3b82f6",
        border: "border-blue-500",
        bg: "bg-blue-500/10",
        bgStrong: "bg-blue-950/50",
        iconStyle: "text-blue-400 bg-blue-500/15",
        glow: "rgba(59,130,246,0.3)",
    },
    {
        title: "AI-Curated Matching",
        bullets: [
            "Businesses post projects, consultants get matched",
            "Instant matching & predictive feed scoring",
            "Verified expertise at every level",
        ],
        full: "Our Global AI-Curated System connects businesses and consultants through intelligent matching. Businesses post projects, consultants get matched, and both parties collaborate using built-in CRM and project management tools — eliminating WhatsApp, spreadsheets and fragmented multi-tool delivery.",
        Icon: Brain,
        hex: "#10b981",
        border: "border-emerald-500",
        bg: "bg-emerald-500/10",
        bgStrong: "bg-emerald-950/50",
        iconStyle: "text-emerald-400 bg-emerald-500/15",
        glow: "rgba(16,185,129,0.3)",
    },
    {
        title: "Vertically Integrated",
        bullets: [
            "Standardizes trust across the marketplace",
            "Accelerates execution at every stage",
            "Reshapes the global consulting economy",
        ],
        full: "We have unlocked a data-defensible, vertically integrated platform that standardizes trust, accelerates execution, and reshapes the global consulting economy. One system from project creation to delivery and payment — no fragmentation, no guesswork.",
        Icon: Layers,
        hex: "#f97316",
        border: "border-orange-500",
        bg: "bg-orange-500/10",
        bgStrong: "bg-orange-950/50",
        iconStyle: "text-orange-400 bg-orange-500/15",
        glow: "rgba(249,115,22,0.3)",
    },
    {
        title: "Built for Organizations",
        bullets: [
            "Find the right expertise quickly",
            "No more WhatsApp or spreadsheet delivery",
            "Bidding, escrow & project tools built-in",
        ],
        full: "Organizations struggle to find the right services quickly, and when they do, delivery happens across WhatsApp, spreadsheets and multiple disconnected tools. Through instant matching, verified expertise, and predictive feed scoring, Lamid solves this in one integrated marketplace — CRM suite.",
        Icon: Building2,
        hex: "#a855f7",
        border: "border-purple-500",
        bg: "bg-purple-500/10",
        bgStrong: "bg-purple-950/50",
        iconStyle: "text-purple-400 bg-purple-500/15",
        glow: "rgba(168,85,247,0.3)",
    },
    {
        title: "Built for Consultants",
        bullets: [
            "Consistent, reliable work stream",
            "Efficient client collaboration built-in",
            "Payment that compensates your expertise",
        ],
        full: "Consultants seek a consistent, reliable work stream and an efficient way of managing work in collaboration with clients. Lamid provides payment streams that adequately compensate their expertise — through a single intelligent marketplace where trust, delivery and income are in one place.",
        Icon: Users,
        hex: "#c21219",
        border: "border-[#c21219]",
        bg: "bg-[#c21219]/10",
        bgStrong: "bg-red-950/50",
        iconStyle: "text-[#c21219] bg-[#c21219]/15",
        glow: "rgba(194,18,25,0.3)",
    },
];

/* ── Component ───────────────────────────────────────────────── */
export default function AISystemSection() {
    const [expanded, setExpanded] = useState<number | null>(null);

    return (
        <section className="relative w-full bg-black text-white px-6 md:px-12 overflow-hidden">
            <WaveBg />
            {/* HEADER */}
            <motion.div
                className="max-w-7xl mx-auto text-left mb-8"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
            >
                <motion.h2
                    className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#c21219] via-red-400 to-white bg-clip-text text-transparent"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    Human-AI-Assisted Operating System
                </motion.h2>
                <motion.p
                    className="mt-2 text-sm text-gray-400 max-w-2xl"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                >
                    Your gateway portal to a Human-AI curated operating system for organizational growth.
                </motion.p>
            </motion.div>

            {/* CARDS */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
                {insights.map((item, index) => {
                    const isExpanded = expanded === index;
                    const { Icon } = item;

                    return (
                        <motion.div
                            key={index}
                            layout
                            whileHover={!isExpanded ? { scale: 1.03, y: -4 } : {}}
                            animate={{
                                boxShadow: isExpanded
                                    ? `0 0 0 1px ${item.hex}70, 0 20px 50px ${item.glow}`
                                    : "0 4px 20px rgba(0,0,0,0.5)",
                            }}
                            transition={{ layout: { duration: 0.35, ease: [0.33, 1, 0.68, 1] }, duration: 0.3 }}
                            className={`relative overflow-hidden rounded-xl border cursor-pointer transition-colors duration-300 ${isExpanded
                                ? `${item.border} ${item.bgStrong}`
                                : `border-white/10 bg-[#0d0d0d] hover:${item.border} hover:${item.bg}`
                                }`}
                        >
                            {/* Subtle line decoration */}
                            <Lines color={item.hex} />

                            {/* Card content */}
                            <div className="relative z-10 p-5 flex flex-col items-start text-left">
                                {/* Icon */}
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${item.iconStyle}`}>
                                    <Icon className="h-4 w-4" />
                                </div>

                                {/* Title */}
                                <h3 className="text-sm font-bold text-white mb-3 leading-snug">
                                    {item.title}
                                </h3>

                                {/* Switchable content */}
                                <AnimatePresence mode="wait" initial={false}>
                                    {!isExpanded ? (
                                        <motion.div
                                            key="collapsed"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="w-full flex flex-col items-start"
                                        >
                                            <ul className="space-y-2 mb-4 text-left w-full">
                                                {item.bullets.map((b, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                                                        <span className="mt-0.5 text-[9px] flex-shrink-0" style={{ color: item.hex }}>▸</span>
                                                        {b}
                                                    </li>
                                                ))}
                                            </ul>
                                            <button
                                                onClick={() => setExpanded(index)}
                                                className="text-xs font-medium transition-opacity hover:opacity-70"
                                                style={{ color: item.hex }}
                                            >
                                                Read more ↑
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="expanded"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.25, delay: 0.1 }}
                                            className="w-full flex flex-col items-start"
                                        >
                                            <p className="text-xs text-gray-200 leading-relaxed mb-4 text-justify">
                                                {item.full}
                                            </p>
                                            <button
                                                onClick={() => setExpanded(null)}
                                                className="text-xs font-medium transition-opacity hover:opacity-70"
                                                style={{ color: item.hex }}
                                            >
                                                ↓ Close
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
