"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Network, TrendingUp, GraduationCap, Landmark, Check, ArrowRight } from "lucide-react";

const HUBS = [
  {
    id: "core",
    Icon: Network,
    label: "LAMID CORE",
    href: "/core",
    color: "#2563EB",
    points: [
      "See where strategy is stalling and what needs to move first.",
      "Align leadership around one view of execution and performance.",
    ],
  },
  {
    id: "grow",
    Icon: TrendingUp,
    label: "LAMID GROW",
    href: "/grow",
    color: "#047857",
    points: [
      "Track customer engagement and digital performance in real time.",
      "Spot where growth is compounding — and where it's leaking.",
    ],
  },
  {
    id: "talent",
    Icon: GraduationCap,
    label: "LAMID TALENT",
    href: "/talent",
    color: "#6D28D9",
    points: [
      "Put the right people in the right roles.",
      "Track capability, culture health, and hiring readiness in one place.",
    ],
  },
  {
    id: "finance",
    Icon: Landmark,
    label: "LAMID FINANCE",
    href: "/finance",
    color: "#B45309",
    points: [
      "See cost, cash, and enterprise value in real time.",
      "Forecast with numbers that move as fast as the business does.",
    ],
  },
];

/** One flagship tool per pillar — the deepest engine in each. */
const FEATURED = [
  {
    code:  "F02",
    pillar:"LAMID FINANCE",
    name:  "Budgeting & Forecasting Engine",
    href:  "/f02-budgeting-forecasting",
    color: "#B45309",
    tag:   "Builds a real budget",
    features: [
      "Itemised line-item budgets across 12 project types",
      "Overhead, contingency, tax and phasing computed automatically",
      "Edit any line — totals recalculate instantly, export to CSV",
    ],
  },
  {
    code:  "R14",
    pillar:"LAMID GROW",
    name:  "Real-Time Cadence Pulse",
    href:  "/r14-real-time-cadence-pulse",
    color: "#047857",
    tag:   "Takes your data",
    features: [
      "Track cycle time, on-time rate and meeting load period by period",
      "Trend and volatility computed from your own numbers",
      "Strategic, operational, financial and cultural pulse scored",
    ],
  },
  {
    code:  "Q46",
    pillar:"LAMID CORE",
    name:  "Predictive Foresight Engine",
    href:  "/q46-predictive-foresight",
    color: "#2563EB",
    tag:   "Decision modelling",
    features: [
      "Model decisions across four time horizons before committing",
      "Near-term, medium-term, long-range and long-term horizons scored",
      "Surfaces consequences and scenarios ahead of the decision",
    ],
  },
  {
    code:  "A32",
    pillar:"LAMID TALENT",
    name:  "ETOS — Enterprise Talent OS",
    href:  "/a32-etos",
    color: "#6D28D9",
    tag:   "Unifies 31 engines",
    features: [
      "Integrates every talent engine into one operating layer",
      "OS stability, intelligence routing health and governance",
      "Operating velocity across the whole workforce",
    ],
  },
];

const cardV = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
};
const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } };

export default function EcosystemHubs() {
  return (
    <section id="ecosystem" className="relative lamidone-section py-20 px-4 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-12 lg:gap-16 items-center">

          {/* ── LEFT — sticky pitch ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Eyebrow pill */}
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-white/12 bg-white/70 dark:bg-white/[0.04] mb-8">
              <Sparkles className="w-4 h-4 text-[#2563EB]" strokeWidth={2} />
              <span className="text-gray-700 dark:text-white/75">Powered by HumanAI</span>
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-gray-900 dark:text-white leading-[1.12] tracking-tight mb-6">
              One Platform.{" "}
              <span className="lamidone-gradient-text">Four Engines.</span>
              <br className="hidden sm:block" />
              Every Layer of Your Business.
            </h2>

            <p className="text-gray-500 dark:text-white/55 text-base leading-relaxed mb-9 max-w-md">
              LAMID ONE shows leaders what is actually happening in their business,
              where their people need support, and what to move on first.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-[0_0_20px_rgba(37,99,235,0.35)]"
              >
                Book a Demo
              </Link>
              <Link
                href="/ecosystem"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-sm font-semibold border border-[#2563EB]/30 text-[#2563EB] bg-[#2563EB]/[0.06] hover:bg-[#2563EB]/12 transition-colors"
              >
                Explore the Ecosystem
              </Link>
            </div>
          </motion.div>

          {/* ── RIGHT — 2×2 hub cards ── */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {HUBS.map((hub) => (
              <motion.div key={hub.id} variants={cardV}>
                <Link
                  href={hub.href}
                  className="group h-full flex flex-col rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] p-6 transition-all duration-200 hover:border-[#2563EB]/40 hover:shadow-[0_12px_36px_rgba(37,99,235,0.12)] hover:-translate-y-1"
                >
                  {/* Icon + name */}
                  <div className="flex items-center gap-2.5 mb-4">
                    <hub.Icon
                      className="w-5 h-5 shrink-0"
                      strokeWidth={2}
                      style={{ color: hub.color }}
                    />
                    <h3 className="text-base font-bold text-gray-900 dark:text-white tracking-tight">
                      {hub.label}
                    </h3>
                  </div>

                  <div className="h-px bg-gray-100 dark:bg-white/8 mb-4" />

                  {/* Checkmark bullets */}
                  <ul className="flex flex-col gap-3 flex-1">
                    {hub.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5">
                        <Check
                          className="w-4 h-4 shrink-0 mt-0.5"
                          strokeWidth={2.5}
                          style={{ color: hub.color }}
                        />
                        <span className="text-sm text-gray-600 dark:text-white/60 leading-snug">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="h-px bg-gray-100 dark:bg-white/8 mt-5 mb-4" />

                  {/* Learn more */}
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-white">
                    Learn more
                    <ArrowRight
                      className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                      strokeWidth={2}
                      style={{ color: hub.color }}
                    />
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>

        </div>

        {/* ── Flagship tool from each pillar ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mt-20"
        >
          <div className="mb-8">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em] lamidone-gradient-text">
              Start Here
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              The flagship engine from each pillar.
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED.map((t) => (
              <Link
                key={t.code}
                href={t.href}
                className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#2563EB]/40 hover:shadow-[0_12px_36px_rgba(37,99,235,0.12)] dark:border-white/10 dark:bg-white/[0.03]"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className="rounded-md px-2 py-1 font-mono text-[10px] font-bold"
                    style={{ background: `${t.color}14`, color: t.color }}
                  >
                    {t.code}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-gray-500 dark:text-white/40">
                    {t.pillar}
                  </span>
                </div>

                <h4 className="mb-2 text-sm font-bold leading-snug text-gray-900 dark:text-white">
                  {t.name}
                </h4>

                <span
                  className="mb-4 self-start rounded-full px-2.5 py-1 text-[10px] font-bold"
                  style={{ background: `${t.color}12`, color: t.color }}
                >
                  {t.tag}
                </span>

                <ul className="flex flex-1 flex-col gap-2.5">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={2.5} style={{ color: t.color }} />
                      <span className="text-[11px] leading-relaxed text-gray-600 dark:text-white/55">{f}</span>
                    </li>
                  ))}
                </ul>

                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-900 dark:text-white">
                  Open engine
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
                    strokeWidth={2}
                    style={{ color: t.color }}
                  />
                </span>
              </Link>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
