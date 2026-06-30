"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

/* ── AIHero repurposed content: 4 pain points ── */
const PAIN_POINTS = [
  {
    icon: "⚡",
    title: "Quality expertise is expensive and hard to access",
    body: "73% of SMEs report difficulty accessing affordable, high-quality consulting. LAMID CORE's AI matching engine surfaces the right consultant for every challenge, in 24 hours.",
  },
  {
    icon: "◈",
    title: "AI adoption is urgent — but poorly guided",
    body: "87% of executives say AI integration is a strategic priority, yet fewer than 1 in 4 have a clear plan. LAMID ONE pairs advanced AI with trusted expertise at every stage.",
  },
  {
    icon: "⬡",
    title: "Tools, consultants, and training don't talk to each other",
    body: "LAMID ONE integrates Marketplace, BIZ intelligence, and Talent development into one connected ecosystem — each layer amplifying the others.",
  },
  {
    icon: "⬟",
    title: "Decisions are made on last month's data",
    body: "Board packs assembled manually. KPIs in spreadsheets. Risks compounding silently. LAMID GROW gives leadership a live, AI-powered intelligence window.",
  },
];

/* ── AIHero repurposed content: 4 portal cards ── */
const PORTALS = [
  { icon: "◈", title: "LAMID CORE",  area: "Expert Matching & Delivery",  href: "/talent",  bullets: ["AI-matched consultants, 24-hr shortlist", "Vetted experts across every sector", "72-hr kickoff, measurable outcomes"] },
  { icon: "⬡", title: "LAMID GROW",   area: "Business Intelligence",        href: "/biz",     bullets: ["Real-time business health score", "AI insight engine & scenario modelling", "Board-ready reporting, automated"] },
  { icon: "⬟", title: "LAMID TALENT", area: "Capability & Learning",        href: "/hcd",     bullets: ["AI-powered skills assessment (12 min)", "Personalised learning paths, AI coach", "Expert-designed certifications"] },
  { icon: "▣", title: "LAMID Workspace",    area: "Project Delivery",              href: "/postjobs",bullets: ["Milestone-tracked engagements", "CRM, contracts & secure escrow", "Real-time team workrooms"] },
];

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
  const [hoveredFeature,  setHoveredFeature]  = useState(null);
  const [hoveredPersona,  setHoveredPersona]  = useState(null);
  const [hoveredPortal,   setHoveredPortal]   = useState(null);
  const [overviewOpen,    setOverviewOpen]    = useState(false);
  const router = useRouter();

  return (
    <div className="aivora-section min-h-screen">

      {/* ── Hero ── */}
      <section className="relative px-4 pt-28 pb-10 text-center overflow-hidden">
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
            LAMID GROW
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-6">
            <span className="aivora-gradient-text">Your AI Command Center</span>
          </h1>
          <p className="text-gray-500 dark:text-white/55 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Real-time analytics, strategic dashboards, and AI-powered governance tools — all in one unified ecosystem.
          </p>
        </motion.div>
      </section>

      {/* ── 5 Feature rows ── */}
      <section className="px-4 pb-12">
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
                  <span className="text-lg aivora-gradient-text">{f.icon}</span>
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
      <section className="px-4 pb-12">
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
                    <span className="text-xl aivora-gradient-text">{p.icon}</span>
                  </motion.div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{p.title}</h3>
                  <p className="text-gray-500 dark:text-white/55 text-xs leading-relaxed">{p.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Subtle CTA strip at bottom ── */}
      <section className="px-4 pb-12">
        <motion.div {...fadeUp(0)} className="max-w-4xl mx-auto border-t border-gray-100 dark:border-white/6 pt-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Ready to see it in action?</p>
            <p className="text-xs text-gray-500 dark:text-white/40">Your first AI analysis is ready within 48 hours of activation.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/premium/business-diagnostic"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#C12129] hover:bg-[#a01a20] transition-colors shadow-[0_0_14px_rgba(193,33,41,0.35)]">
              Run a Diagnostic
            </Link>
            <Link href="/grow-dashboard"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#C12129]/25 text-[#C12129] hover:bg-[#C12129]/8 transition-colors">
              Open Dashboard →
            </Link>
            <button type="button" onClick={() => setOverviewOpen(true)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#C12129]/25 text-[#C12129] hover:bg-[#C12129]/8 transition-colors cursor-pointer">
              Ecosystem Overview →
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── Platform Overview Modal (repurposed AIHero content) ── */}
      <AnimatePresence>
        {overviewOpen && (
          <motion.div
            key="overview-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/88 backdrop-blur-md px-4 py-8"
            onClick={() => setOverviewOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl bg-[#080808] border border-white/8 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(193,33,41,0.2)] max-h-[88vh] overflow-y-auto"
            >
              <div className="h-[3px] bg-gradient-to-r from-[#C12129] via-red-400 to-transparent sticky top-0" />

              <div className="px-7 pt-7 pb-8">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-2">Platform Overview</p>
                    <h2 className="text-xl font-bold text-white leading-snug">
                      One Ecosystem. Every Layer of Growth.
                    </h2>
                    <p className="text-white/45 text-xs mt-2 max-w-md leading-relaxed">
                      LAMID ONE eliminates friction — unifying expert consulting, business intelligence, and talent development into one HumanAI ecosystem built for scale.
                    </p>
                  </div>
                  <button type="button" onClick={() => setOverviewOpen(false)}
                    className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl border border-white/10 text-white/30 hover:text-white hover:border-[#C12129]/40 transition-colors cursor-pointer text-base">
                    ✕
                  </button>
                </div>

                {/* 4 pain points */}
                <div className="h-px bg-white/8 mb-5" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">Why organizations struggle</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
                  {PAIN_POINTS.map((pain, i) => (
                    <motion.div
                      key={pain.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                      className="flex gap-3 p-4 rounded-xl border border-[#C12129]/12 bg-[#C12129]/[0.04] hover:border-[#C12129]/25 hover:bg-[#C12129]/[0.07] transition-all duration-200"
                    >
                      <span className="text-[#C12129] text-base shrink-0 mt-0.5">{pain.icon}</span>
                      <div>
                        <p className="text-xs font-semibold text-white leading-snug mb-1">{pain.title}</p>
                        <p className="text-[11px] text-white/40 leading-relaxed">{pain.body}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* 4 portal cards */}
                <div className="h-px bg-white/8 mb-5" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">How LAMID ONE solves it</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PORTALS.map((portal, i) => {
                    const isHov = hoveredPortal === i;
                    return (
                      <motion.div
                        key={portal.title}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.24 + i * 0.06, duration: 0.3 }}
                        onHoverStart={() => setHoveredPortal(i)}
                        onHoverEnd={() => setHoveredPortal(null)}
                        onClick={() => { setOverviewOpen(false); router.push(portal.href); }}
                        whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(193,33,41,0.18)" }}
                        whileTap={{ scale: 0.97 }}
                        className="flex gap-3 p-4 rounded-xl border bg-white/[0.025] cursor-pointer transition-all duration-200"
                        style={{ borderColor: isHov ? "rgba(193,33,41,0.45)" : "rgba(255,255,255,0.07)" }}
                      >
                        <motion.div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-[#C12129]/15 border border-[#C12129]/25 mt-0.5"
                          animate={{ scale: isHov ? 1.1 : 1 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>
                          <span className="text-sm text-[#C12129]">{portal.icon}</span>
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-wider aivora-gradient-text mb-0.5">{portal.area}</p>
                          <p className="text-xs font-bold text-white mb-2">{portal.title}</p>
                          <ul className="space-y-1">
                            {portal.bullets.map((b) => (
                              <li key={b} className="text-[10.5px] text-white/40 flex gap-1.5 leading-snug">
                                <span className="text-[#C12129] shrink-0 mt-0.5">▸</span>{b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
