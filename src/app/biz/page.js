"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

/* ── Feature rows ── */
const FEATURES = [
  {
    icon: "▣",
    title: "Real-Time Strategic Dashboards",
    body: "Unified view of all active engagements, KPIs, and strategic initiatives. Drill down into any metric with AI-generated insights and anomaly detection.",
    href: "/client",
  },
  {
    icon: "◈",
    title: "AI-Generated Reports",
    body: "Automatically generate board-ready reports, executive summaries, and strategic briefings powered by your engagement data.",
    href: "/premium/business-diagnostic",
  },
  {
    icon: "⬡",
    title: "Governance & Compliance Engine",
    body: "Built-in compliance tracking, audit trails, and policy enforcement. Stay ahead of regulatory changes with AI-powered alerts.",
    href: "/premium/business-diagnostic",
  },
  {
    icon: "⬟",
    title: "Team Collaboration Hub",
    body: "Shared workspaces, real-time document collaboration, and integrated communication — keep your entire team aligned.",
    href: "/dashboard",
  },
  {
    icon: "⚡",
    title: "Predictive Analytics",
    body: "AI forecasting models that predict outcomes, identify risks early, and surface opportunities before your competitors see them.",
    href: "/premium/business-diagnostic",
  },
];

/* ── Decision-maker personas ── */
const PERSONAS = [
  {
    icon: "◈",
    title: "For the CEO",
    body: "Strategic oversight, market intelligence, and organisational alignment — all in one view.",
    href: "/client",
  },
  {
    icon: "▣",
    title: "For the CFO",
    body: "Cost tracking, ROI dashboards, and financial governance tools for every engagement.",
    href: "/client",
  },
  {
    icon: "⬡",
    title: "For the Board",
    body: "Board-ready reports, compliance dashboards, and risk heatmaps — delivered automatically.",
    href: "/premium/business-diagnostic",
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

export default function BizPage() {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredPersona, setHoveredPersona] = useState(null);
  const router = useRouter();

  return (
    <div className="aivora-section min-h-screen">

      {/* ── Hero ── */}
      <section className="relative px-4 pt-32 pb-20 text-center overflow-hidden">
        {/* bg lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          {["M-60 200 C200 80 400 320 700 160 C950 40 1200 280 1450 150"].map((d, i) => (
            <motion.path key={i} d={d} fill="none" stroke="#C12129" strokeWidth="0.6"
              strokeOpacity="0.07" strokeDasharray="12 20"
              animate={{ strokeDashoffset: [0, -100] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          ))}
        </svg>

        <motion.div {...fadeUp(0)} className="relative z-10 max-w-3xl mx-auto">
          <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">
            AIVORA BIZ Portal
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            <span className="aivora-gradient-text">Your AI Command Center</span>
          </h1>
          <p className="text-gray-500 dark:text-white/55 text-sm sm:text-base max-w-xl mx-auto mb-10 leading-relaxed">
            Real-time analytics, strategic dashboards, and AI-powered governance tools — all in one unified platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/premium/business-diagnostic"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white bg-[#C12129] hover:bg-[#a01a20] transition-colors shadow-[0_0_20px_rgba(193,33,41,0.45)] hover:shadow-[0_0_32px_rgba(193,33,41,0.7)]">
                Run a Business Diagnostic
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/client"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold border border-[#C12129]/30 text-[#C12129] hover:bg-[#C12129]/10 transition-colors">
                View Dashboard
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ── 5 Feature rows ── */}
      <section className="px-4 pb-24">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {FEATURES.map((f, i) => {
            const isHov = hoveredFeature === i;
            return (
              <motion.div
                key={f.title}
                {...fadeUp(i * 0.08)}
                onHoverStart={() => setHoveredFeature(i)}
                onHoverEnd={() => setHoveredFeature(null)}
                onClick={() => router.push(f.href)}
                whileHover={{ x: 4, boxShadow: "0 8px 30px rgba(193,33,41,0.15)" }}
                whileTap={{ scale: 0.99 }}
                className="aivora-card border rounded-2xl p-6 flex items-start gap-5 cursor-pointer transition-all duration-250"
                style={{ borderColor: isHov ? "rgba(193,33,41,0.4)" : undefined }}
              >
                {/* Icon square */}
                <motion.div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-[#C12129]/12 border border-[#C12129]/25"
                  animate={{ scale: isHov ? 1.1 : 1, boxShadow: isHov ? "0 0 14px rgba(193,33,41,0.35)" : "none" }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                >
                  <span className="text-lg text-[#C12129]">{f.icon}</span>
                </motion.div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">{f.title}</h3>
                  <p className="text-gray-500 dark:text-white/55 text-xs leading-relaxed">{f.body}</p>
                </div>

                <motion.span
                  className="text-[#C12129] text-sm shrink-0 self-center"
                  animate={{ opacity: isHov ? 1 : 0, x: isHov ? 0 : -6 }}
                  transition={{ duration: 0.15 }}
                >
                  →
                </motion.span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Built for Decision-Makers ── */}
      <section className="px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <motion.h2 {...fadeUp(0)} className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">
            Built for Decision-Makers
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {PERSONAS.map((p, i) => {
              const isHov = hoveredPersona === i;
              return (
                <motion.div
                  key={p.title}
                  {...fadeUp(i * 0.1)}
                  onHoverStart={() => setHoveredPersona(i)}
                  onHoverEnd={() => setHoveredPersona(null)}
                  onClick={() => router.push(p.href)}
                  whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(193,33,41,0.18)" }}
                  whileTap={{ scale: 0.98 }}
                  className="aivora-card border rounded-2xl p-7 flex flex-col items-center text-center cursor-pointer"
                  style={{ borderColor: isHov ? "rgba(193,33,41,0.4)" : undefined }}
                >
                  {/* Circle icon */}
                  <motion.div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-5 bg-[#C12129]/12 border border-[#C12129]/25"
                    animate={{ scale: isHov ? 1.12 : 1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 18 }}
                  >
                    <span className="text-xl text-[#C12129]">{p.icon}</span>
                  </motion.div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{p.title}</h3>
                  <p className="text-gray-500 dark:text-white/55 text-xs leading-relaxed">{p.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section className="px-4 pb-24">
        <motion.div {...fadeUp(0)} className="max-w-4xl mx-auto rounded-2xl border border-[#C12129]/30 bg-gradient-to-br from-[#C12129]/8 via-transparent to-transparent p-10 text-center">
          <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">Next Step</p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
            What would your leadership team do with real-time intelligence?
          </h2>
          <p className="text-gray-500 dark:text-white/50 text-sm mb-8 max-w-lg mx-auto">
            Activate your BIZ Portal and have your first AI-generated business analysis within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/premium/business-diagnostic"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white bg-[#C12129] hover:bg-[#a01a20] transition-colors shadow-[0_0_18px_rgba(193,33,41,0.4)]">
                Activate Your BIZ Portal
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold border border-[#C12129]/30 text-[#C12129] hover:bg-[#C12129]/10 transition-colors">
                Book a Demo
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
