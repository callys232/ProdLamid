"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const TABS = [
  {
    id: "core",
    label: "Lamid Core",
    tagline: "Every strategic initiative, tracked in flight.",
    description:
      "Live diagnostic scores, alignment signals, and the correction priorities your leadership team should act on first.",
    href: "/core",
    src: "/screenshots/q46-foresight.png" as string | null,
    accent: "#2563EB",
    url: "lamidone.com/q46-predictive-foresight",
  },
  {
    id: "grow",
    label: "Lamid Grow",
    tagline: "Growth signals, moving as they happen.",
    description:
      "Engagement trends, funnel health, and digital performance — refreshing as the data lands, not a month later.",
    href: "/grow",
    src: "/screenshots/r14-cadence.png" as string | null,
    accent: "#3B82F6",
    url: "lamidone.com/r14-real-time-cadence-pulse",
  },
  {
    id: "talent",
    label: "Lamid Talent",
    tagline: "The whole workforce on one screen.",
    description:
      "Capability maps, culture health scores, and readiness gaps — surfaced before they turn into vacancies.",
    href: "/talent",
    src: "/screenshots/a25-career.png" as string | null,
    accent: "#2563EB",
    url: "lamidone.com/a25-career-pathing",
  },
  {
    id: "finance",
    label: "Lamid Finance",
    tagline: "Cost, cash, and enterprise value — live.",
    description:
      "Rolling forecasts, burn tracking, and value modelling that update with the business instead of trailing it.",
    href: "/finance",
    src: "/screenshots/f02-budgeting.png" as string | null,
    accent: "#F59E0B",
    url: "lamidone.com/f02-budgeting-forecasting",
  },
];

function DashboardPlaceholder({ tab }: { tab: (typeof TABS)[0] }) {
  if (tab.src) {
    return (
      <img
        src={tab.src}
        alt={`${tab.label} dashboard`}
        className="w-full h-full object-cover object-top"
      />
    );
  }

  // Skeleton placeholder — replace with real screenshot by setting tab.src
  return (
    <div className="w-full h-full bg-gray-50 dark:bg-[#0D1117] flex flex-col p-5 gap-4 select-none">
      {/* Top nav bar mock */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-6 h-6 rounded-lg bg-[#2563EB]/20" />
        <div className="w-28 h-5 rounded-lg bg-gray-200 dark:bg-white/10" />
        <div className="flex-1" />
        <div className="w-20 h-6 rounded-full bg-gray-200 dark:bg-white/10" />
        <div className="w-7 h-7 rounded-full bg-[#2563EB]/20" />
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-3 shrink-0">
        {[72, 88, 61, 94].map((val, i) => (
          <div
            key={i}
            className="rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8 p-4"
          >
            <div className="w-7 h-7 rounded-lg mb-3" style={{ background: `${tab.accent}22` }} />
            <p
              className="text-xl font-extrabold mb-1"
              style={{ color: i === 0 ? tab.accent : undefined }}
            >
              {val}
              <span className="text-xs font-normal text-gray-400 dark:text-white/30">%</span>
            </p>
            <div className="w-16 h-2 rounded bg-gray-100 dark:bg-white/8" />
          </div>
        ))}
      </div>

      {/* Chart + list row */}
      <div className="grid grid-cols-5 gap-3 flex-1 min-h-0">
        {/* Bar chart */}
        <div className="col-span-3 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8 p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="w-24 h-3 rounded bg-gray-200 dark:bg-white/15" />
            <div className="w-12 h-3 rounded bg-gray-100 dark:bg-white/8" />
          </div>
          <div className="flex items-end gap-2 flex-1">
            {[55, 72, 48, 91, 67, 83, 60, 77].map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t"
                style={{ background: i === 3 ? tab.accent : `${tab.accent}28` }}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: "easeOut" }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex-1 h-2 rounded bg-gray-100 dark:bg-white/8" />
            ))}
          </div>
        </div>

        {/* Signal list */}
        <div className="col-span-2 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/8 p-4 flex flex-col gap-3">
          <div className="w-20 h-3 rounded bg-gray-200 dark:bg-white/15 mb-1" />
          {[90, 75, 62, 85, 50].map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: i === 0 ? tab.accent : `${tab.accent}40` }}
              />
              <div
                className="h-2.5 rounded flex-shrink-0"
                style={{
                  width: `${w}%`,
                  background: i === 0 ? `${tab.accent}30` : "rgba(0,0,0,0.06)",
                }}
              />
              {i === 0 && (
                <div
                  className="w-7 h-4 rounded text-[8px] font-bold flex items-center justify-center text-white ml-auto shrink-0"
                  style={{ background: tab.accent }}
                >
                  NEW
                </div>
              )}
            </div>
          ))}
          <div className="mt-auto pt-2 border-t border-gray-100 dark:border-white/8">
            <div className="w-16 h-2 rounded bg-gray-100 dark:bg-white/8" />
          </div>
        </div>
      </div>
    </div>
  );
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.48, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function ProductShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = TABS[activeIdx];

  return (
    <section className="relative lamidone-section py-20 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div {...fadeUp(0)} className="text-center mb-10">
          <p className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">
            See It In Action
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-snug mb-3">
            The dashboards behind{" "}
            <span className="lamidone-gradient-text">every decision.</span>
          </h2>
          <p className="text-gray-500 dark:text-white/50 text-sm max-w-lg mx-auto leading-relaxed">
            Every engine connects — so what happens in strategy shows up in finance,
            talent, and growth automatically.
          </p>
        </motion.div>

        {/* Tab switcher */}
        <motion.div {...fadeUp(0.08)} className="flex flex-wrap justify-center gap-2 mb-8">
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                i === activeIdx
                  ? "text-white shadow-md"
                  : "border border-gray-200 dark:border-white/15 text-gray-500 dark:text-white/50 hover:border-[#2563EB]/40 hover:text-[#2563EB]"
              }`}
              style={i === activeIdx ? { background: active.accent } : {}}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Browser frame */}
        <motion.div
          {...fadeUp(0.14)}
          className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.14)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
        >
          {/* Browser chrome */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 dark:bg-[#161B22] border-b border-gray-200 dark:border-white/8">
            <div className="flex gap-1.5 shrink-0">
              <div className="w-3 h-3 rounded-full bg-red-400/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
              <div className="w-3 h-3 rounded-full bg-green-400/60" />
            </div>
            <div className="flex-1 mx-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.url}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="bg-white dark:bg-white/8 rounded-lg px-3 py-1.5 text-[10px] text-gray-400 dark:text-white/30 font-mono truncate"
                >
                  🔒 {active.url}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Screenshot / placeholder */}
          <div className="aspect-[16/9] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full"
              >
                <DashboardPlaceholder tab={active} />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Caption + CTA below screenshot */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 px-1"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">
                {active.tagline}
              </p>
              <p className="text-xs text-gray-500 dark:text-white/45 max-w-md leading-relaxed">
                {active.description}
              </p>
            </div>
            <Link
              href={active.href}
              className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold text-white transition-all duration-200 hover:opacity-90 shadow-md"
              style={{ background: active.accent }}
            >
              Explore {active.label} <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
