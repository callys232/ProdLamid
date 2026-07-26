"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const ENGINES = [
  {
    id: "core",
    badge: "Strategy",
    label: "LAMID CORE",
    tagline: "Strategy, execution, and alignment — in one view.",
    desc: "Clear plans, better decisions, smoother execution. LAMID CORE gives your leadership team a single, intelligent view of strategy, execution, and organisational alignment.",
    color: "#2563EB",
    href: "/core",
    tools: [
      {
        code: "C03",
        name: "Diagnostic Engine",
        desc: "Where your strategy stands — what's aligned, what's stalling, and what needs to move first.",
        href: "/core-diagnostic",
      },
      {
        code: "Q46",
        name: "Predictive Foresight Engine",
        desc: "Model decision paths before committing. Understand outcomes, assess probability, and move with confidence.",
        href: "/q46-predictive-foresight-engine",
      },
    ],
    stat: { value: "137", label: "modules" },
    series: ["C-Series", "S-Series", "Q-Series", "Z-Series", "Operating Model"],
  },
  {
    id: "grow",
    badge: "Growth",
    label: "LAMID GROW",
    tagline: "Know where growth is happening — and where it's being lost.",
    desc: "See how customers find, use, and stay with your business. Spot where growth is compounding and where it's leaking — in real time.",
    color: "#047857",
    href: "/grow",
    tools: [
      {
        code: "R14",
        name: "Real-Time Cadence Pulse",
        desc: "Live view of your organisation's growth rhythm — know exactly where pace is slipping before it costs you.",
        href: "/r14-real-time-cadence-pulse",
      },
      {
        code: "P01",
        name: "Productivity Mapping",
        desc: "See where work flows and where it stalls — across every team, every layer of your operation.",
        href: "/p01-productivity-mapping",
      },
      {
        code: "P30",
        name: "Flow Engine",
        desc: "The operational ideal state. Every system, team, and process moving without friction.",
        href: "/p30-flow",
      },
    ],
    stat: { value: "69", label: "modules" },
    series: ["G-Series", "R-Series", "P-Series"],
  },
  {
    id: "talent",
    badge: "People",
    label: "LAMID TALENT",
    tagline: "Better teams, better culture, better performance.",
    desc: "Better teams, better culture, better performance. LAMID TALENT gives you the complete picture of your workforce — capability, readiness, culture health, and leadership depth.",
    color: "#6D28D9",
    href: "/talent",
    tools: [
      {
        code: "A01",
        name: "Talent Intelligence Dashboard",
        desc: "Your people at a glance — capability, culture health, risk, and readiness in one unified view.",
        href: "/talent-dashboard",
      },
      {
        code: "A32",
        name: "ETOS — Enterprise Talent OS",
        desc: "The complete people intelligence operating system. Every talent signal, unified under one platform.",
        href: "/a32-etos",
      },
    ],
    stat: { value: "32", label: "modules" },
    series: ["A-Series"],
  },
  {
    id: "finance",
    badge: "Capital",
    label: "LAMID FINANCE",
    tagline: "Every financial decision, grounded in the full picture.",
    desc: "Real-time visibility, forecasting, cost clarity, enterprise value. Every financial decision grounded in the full picture — not just last quarter's report.",
    color: "#B45309",
    href: "/finance",
    tools: [
      {
        code: "F01",
        name: "Financial Visibility Engine",
        desc: "Real-time clarity across every financial dimension — cost, cash, and performance in one place.",
        href: "/f01-financial-visibility",
      },
      {
        code: "F05",
        name: "Enterprise Value Engine",
        desc: "Understand and grow enterprise value — the metric that matters most to owners and boards.",
        href: "/f05-enterprise-value",
      },
    ],
    stat: { value: "7", label: "modules" },
    series: ["F-Series"],
  },
];

export default function EcosystemOverview() {
  const [activeId, setActiveId] = useState("core");
  const active = ENGINES.find((e) => e.id === activeId)!;
  const activeIdx = ENGINES.findIndex((e) => e.id === activeId);

  return (
    <section id="ecosystem" className="relative lamidone-section py-20 px-4 overflow-hidden">

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.48 }}
          className="mb-10"
        >
          <p className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">
            The Ecosystem
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-snug mb-3">
            One Platform.{" "}
            <span className="lamidone-gradient-text">Four Engines.</span>
            <br className="hidden sm:block" />
            Every Layer of Your Business.
          </h2>
          <p className="text-gray-500 dark:text-white/50 text-sm max-w-lg leading-relaxed">
            LAMID ONE gives leaders a simple, intelligent way to understand their business,
            support their people, and lift performance.
          </p>
        </motion.div>

        {/* ── ENGINE CARD ROW (always visible) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-0">
          {ENGINES.map((engine, i) => {
            const isActive = engine.id === activeId;
            return (
              <button
                key={engine.id}
                type="button"
                aria-label={`View ${engine.label}`}
                onClick={() => setActiveId(engine.id)}
                className={`relative text-left rounded-t-xl px-5 py-4 border-x border-t transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  isActive
                    ? "border-gray-200 dark:border-white/10 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]"
                    : "border-transparent hover:border-gray-200 dark:hover:border-white/10 bg-transparent"
                }`}
                style={isActive ? { background: `${engine.color}0A` } : {}}
              >
                {/* Top accent strip */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl transition-opacity duration-200"
                  style={{
                    background: engine.color,
                    opacity: isActive ? 1 : 0,
                  }}
                />

                <span
                  className="block text-[9px] font-bold uppercase tracking-[0.18em] mb-1.5 transition-colors duration-200"
                  style={{ color: isActive ? engine.color : undefined }}
                >
                  {isActive ? engine.badge : engine.badge}
                </span>
                <span
                  className={`block text-sm font-bold leading-tight transition-colors duration-200 ${
                    isActive ? "" : "text-gray-600 dark:text-white/50"
                  }`}
                  style={isActive ? { color: engine.color } : {}}
                >
                  {engine.label}
                </span>
                <span className="block text-[11px] text-gray-400 dark:text-white/28 mt-1 leading-snug line-clamp-2">
                  {engine.tagline}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── CONTENT PANEL (updates on tab click) ── */}
        <div className="border border-gray-200 dark:border-white/10 rounded-b-2xl rounded-tr-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white/80 dark:bg-white/[0.03]"
            >
              {/* Thin colored strip at top of panel matching active engine */}
              <div
                className="h-[2px] w-full"
                style={{ background: `linear-gradient(to right, ${active.color}, transparent 60%)` }}
              />

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-0">

                {/* LEFT — engine info + tool features */}
                <div className="p-7 lg:p-10 lg:border-r border-gray-100 dark:border-white/8">

                  {/* Engine title + description */}
                  <div className="mb-8">
                    <h3
                      className="text-xl sm:text-2xl font-bold leading-snug mb-3"
                      style={{ color: active.color }}
                    >
                      {active.label}
                    </h3>
                    <p className="text-gray-600 dark:text-white/60 text-sm leading-relaxed max-w-xl">
                      {active.desc}
                    </p>
                  </div>

                  {/* Featured tool list — HubSpot feature-item style */}
                  <div className="space-y-5">
                    {active.tools.map((tool, i) => (
                      <motion.div
                        key={tool.code}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.24, delay: i * 0.08 }}
                        className="flex gap-4"
                      >
                        {/* Code badge + left rule */}
                        <div className="flex flex-col items-center gap-1 shrink-0">
                          <span
                            className="font-mono text-[10px] font-bold px-2 py-1 rounded-md"
                            style={{
                              background: `${active.color}14`,
                              color: active.color,
                            }}
                          >
                            {tool.code}
                          </span>
                          {i < active.tools.length - 1 && (
                            <div
                              className="w-px flex-1 min-h-[16px]"
                              style={{ background: `${active.color}20` }}
                            />
                          )}
                        </div>

                        {/* Text */}
                        <div className="pb-2">
                          <Link
                            href={tool.href}
                            className="group inline-flex items-center gap-1"
                          >
                            <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:underline decoration-[1px] underline-offset-2">
                              {tool.name}
                            </span>
                            <span
                              className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ color: active.color }}
                              aria-hidden="true"
                            >
                              →
                            </span>
                          </Link>
                          <p className="text-xs text-gray-500 dark:text-white/45 leading-relaxed mt-0.5">
                            {tool.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA row */}
                  <div className="mt-8 flex items-center gap-4 flex-wrap">
                    <Link
                      href={active.href}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-85"
                      style={{ background: active.color }}
                    >
                      Explore {active.label}
                      <span aria-hidden="true">→</span>
                    </Link>
                    <Link
                      href="/ecosystem"
                      className="text-sm text-gray-400 dark:text-white/35 hover:text-gray-600 dark:hover:text-white/60 transition-colors"
                    >
                      View full ecosystem
                    </Link>
                  </div>
                </div>

                {/* RIGHT — stats + series list */}
                <div className="p-7 lg:p-10 bg-gray-50/60 dark:bg-white/[0.02]">

                  {/* Module count */}
                  <div className="mb-7 pb-7 border-b border-gray-100 dark:border-white/8">
                    <p
                      className="text-4xl font-extrabold tracking-tight leading-none mb-1"
                      style={{ color: active.color }}
                    >
                      {active.stat.value}
                      <span className="text-sm font-semibold text-gray-400 dark:text-white/30 ml-1 tracking-normal">
                        {active.stat.label}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 dark:text-white/30">
                      intelligence modules
                    </p>
                  </div>

                  {/* Series list */}
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-gray-400 dark:text-white/28 mb-3">
                      Intelligence Series
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {active.series.map((s) => (
                        <span
                          key={s}
                          className="text-[11px] font-semibold px-3 py-1 rounded-full border"
                          style={{
                            color: active.color,
                            borderColor: `${active.color}30`,
                            background: `${active.color}08`,
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* X06 cross-engine badge */}
                  <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/8">
                    <p className="text-[10px] uppercase tracking-[0.16em] font-bold text-gray-400 dark:text-white/28 mb-2">
                      Cross-Engine Layer
                    </p>
                    <div className="flex items-start gap-2">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 dark:bg-red-500/10 text-red-500 shrink-0 mt-0.5">
                        X06
                      </span>
                      <span className="text-xs text-gray-400 dark:text-white/30 leading-relaxed">
                        Resilience Intelligence — built into every engine
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
