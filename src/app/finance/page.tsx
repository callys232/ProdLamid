"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import AivoraTestimonials from "@/components/aivora/AivoraTestimonials";
import { useScrollBackground } from "@/hooks/useScrollBackground";

const PAIN_POINTS = [
  {
    icon: "⚡",
    title: "Enterprises are flying blind financially",
    body: "Fragmented spreadsheets, delayed reporting, and disconnected systems mean most finance teams work with last month's truth. LAMID FINANCE installs real-time financial visibility across across your organization.",
  },
  {
    icon: "◈",
    title: "Budgeting and forecasting are guesswork",
    body: "87% of enterprises report their forecasting accuracy falls below 70%. LAMID FINANCE replaces guesswork with an AI-assisted Budgeting & Forecasting Engine — scenario-ready, cash-flow-aware.",
  },
  {
    icon: "⬡",
    title: "KPIs and financial outcomes are disconnected",
    body: "Operational KPIs exist in silos. Digital KPIs live in dashboards. Talent KPIs sit in HR. None of them talk to the P&L. LAMID FINANCE links every KPI directly to financial outcomes.",
  },
  {
    icon: "⬟",
    title: "Finance teams manage reporting — not value",
    body: "Most finance functions are trapped in compliance and reporting. LAMID FINANCE transforms finance from a back-office function into the central nervous system of enterprise value.",
  },
];

const PILLARS = [
  {
    icon: "⚡",
    title: "Financial Visibility Engine",
    body: "Unified dashboards for revenue, cost, margin, cash flow, financial KPIs, and risk — across across your organization and site. The single source of financial truth.",
    href: "/f01-financial-visibility",
  },
  {
    icon: "◈",
    title: "Budgeting & Forecasting Engine",
    body: "AI-assisted budgeting, forecasting, scenario planning, cost modelling, and cash flow projections. Replace guesswork with intelligence.",
    href: "/f02-budgeting-forecasting",
  },
  {
    icon: "⬡",
    title: "Financial KPI Engine",
    body: "Links operational KPIs to revenue, digital KPIs to growth, talent KPIs to productivity, and leadership KPIs to margin — the sovereign KPI-to-financial linkage.",
    href: "/f03-financial-kpi",
  },
  {
    icon: "⬟",
    title: "Cost Optimization Engine",
    body: "Identifies waste, inefficiency, cost leakage, and productivity gaps. Improves margin without reducing capability. Synergy-based cost reduction at enterprise scale.",
    href: "/f04-cost-optimization",
  },
  {
    icon: "▣",
    title: "Enterprise Value Engine",
    body: "Tracks valuation drivers, licensing ROI, synergy ROI, engine ROI, and destiny curve financial trajectory. Shows investors the financial inevitability of LAMID ONE.",
    href: "/f05-enterprise-value",
  },
  {
    icon: "✦",
    title: "Financial Governance Engine",
    body: "Installs financial rituals, controls, reporting cadence, and compliance architecture. Ensures financial discipline becomes cultural — not occasional.",
    href: "/f06-financial-governance",
  },
  {
    icon: "◇",
    title: "CFO Transformation Engine",
    body: "Transforms finance teams, CFO capability, and financial culture. Elevates finance from support to strategy. The leadership layer of financial sovereignty.",
    href: "/f07-cfo-transformation",
  },
  {
    icon: "⬢",
    title: "Finance Dashboard",
    body: "The unified financial command center — real-time visibility across all seven finance engines in one consolidated view.",
    href: "/finance-dashboard",
  },
  {
    icon: "◉",
    title: "Intelligence Hub",
    body: "Cross-engine intelligence layer that connects financial signals to strategic, growth, and people outcomes across the whole organization.",
    href: "/intelligence-hub",
  },
];

const STATS = [
  { value: "$1.3T", label: "Lost annually to poor financial decision-making in enterprises" },
  { value: "65–82%", label: "Target margin range LAMID FINANCE installs across enterprise deployments" },
  { value: "+112%", label: "Total enterprise value acceleration across all 8 governance levers" },
];

const STAGES = [
  { num: 1, title: "Financial Discovery",      body: "Map financial visibility, cost structure, forecasting maturity, and CFO capability across the enterprise." },
  { num: 2, title: "Dashboard Installation",   body: "Deploy enterprise and engine dashboards. Create the single source of financial truth." },
  { num: 3, title: "Forecasting Engine Setup", body: "Implement budgeting templates, forecasting models, and scenario planning tools." },
  { num: 4, title: "KPI Integration",          body: "Link operational, digital, and talent KPIs directly to financial outcomes." },
  { num: 5, title: "Cost Optimization",        body: "Identify cost leakage, productivity gaps, and synergy-based savings." },
  { num: 6, title: "Enterprise Value Engine",  body: "Map valuation drivers, licensing ROI, synergy ROI, and destiny curve projections." },
  { num: 7, title: "Financial Governance",     body: "Install financial rituals, controls, reporting cadence, and CFO leadership systems." },
];

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.45, delay: d },
});

export default function FinancePage() {
  useScrollBackground();
  const [activePillar, setActivePillar] = useState<number | null>(null);
  const [activeStage, setActiveStage] = useState<number | null>(null);
  const router = useRouter();

  return (
    <main className="aivora-section min-h-screen">

      {/* ── Hero ── */}
      <section data-scroll-section data-bg-from-dark="#0D6E8A" data-bg-to-dark="#04111F" data-bg-from-light="#BFE3FF" data-bg-to-light="#F8FAFF" className="relative pt-28 pb-16 px-4 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          {[
            "M-60 200 C300 80 600 320 900 160 C1100 40 1300 280 1500 150",
            "M-60 280 C300 160 600 400 900 240 C1100 120 1300 360 1500 230",
          ].map((d, i) => (
            <motion.path key={i} d={d} fill="none" stroke="#2563EB" strokeWidth="0.6"
              strokeOpacity="0.08" strokeDasharray="12 20"
              animate={{ strokeDashoffset: [0, -100], opacity: [0.05, 0.18, 0.05] }}
              transition={{ duration: 20 + i * 4, repeat: Infinity, ease: "linear", delay: i * 4 }}
            />
          ))}
        </svg>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.p {...fadeUp(0)} className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">
            LAMID FINANCE
          </motion.p>
          <motion.h1 {...fadeUp(0.05)} className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-snug mb-5">
            Financial clarity for{" "}
            <span className="aivora-gradient-text">every leader.</span>
          </motion.h1>
          <motion.p {...fadeUp(0.1)} className="text-gray-500 dark:text-white/55 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-8">
            LAMID FINANCE helps leaders see numbers clearly and forecast with confidence.
          </motion.p>
          <motion.div {...fadeUp(0.15)} className="flex flex-wrap justify-center gap-3">
            <Link href="/premium/business-diagnostic"
              className="px-6 py-3 rounded-full text-sm font-bold bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors shadow-[0_0_22px_rgba(37,99,235,0.35)]">
              See FINANCE in Action
            </Link>
            <Link href="/contact"
              className="px-6 py-3 rounded-full text-sm font-semibold border border-[#2563EB]/30 text-[#2563EB] hover:bg-[#2563EB]/8 transition-colors">
              Book a Demo
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section data-scroll-section data-bg-from-dark="#1456A0" data-bg-to-dark="#040A1E" data-bg-from-light="#B8CCFF" data-bg-to-light="#F5F3FF" className="py-6 px-4 border-y border-gray-100 dark:border-white/8">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-10">
          {STATS.map((s, i) => (
            <motion.div key={s.label} {...fadeUp(i * 0.1)} className="text-center">
              <span className="text-2xl font-bold aivora-gradient-text block">{s.value}</span>
              <span className="text-gray-500 dark:text-white/50 text-xs mt-1 block max-w-[180px] leading-snug">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Pain points ── */}
      <section data-scroll-section data-bg-from-dark="#0A8090" data-bg-to-dark="#030C14" data-bg-from-light="#FDDCB0" data-bg-to-light="#FEF9F0" className="py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-10">
            <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">The Problem</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Most enterprises are{" "}
              <span className="aivora-gradient-text">flying blind</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PAIN_POINTS.map((p, i) => (
              <motion.div key={p.title} {...fadeUp(i * 0.08)}
                className="aivora-card border rounded-2xl p-7">
                <span className="aivora-gradient-text text-2xl block mb-4">{p.icon}</span>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{p.title}</h3>
                <p className="text-gray-600 dark:text-white/55 text-xs leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7 FME Pillars ── */}
      <section data-scroll-section data-bg-from-dark="#3D1070" data-bg-to-dark="#0A041E" data-bg-from-light="#E8D8C0" data-bg-to-light="#FFFFF0" className="py-14 px-4 border-t border-gray-100 dark:border-white/8">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-10">
            <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">The Financial Management Engine</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Seven Sovereign{" "}
              <span className="aivora-gradient-text">Financial Powers</span>
            </h2>
            <p className="text-gray-500 dark:text-white/50 text-sm max-w-xl mx-auto mt-3 leading-relaxed">
              Each component solves a distinct financial problem. Together, they create financial sovereignty inside every enterprise.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PILLARS.map((pillar, i) => {
              const isHov = activePillar === i;
              return (
                <motion.div
                  key={pillar.title}
                  {...fadeUp(i * 0.06)}
                  onHoverStart={() => setActivePillar(i)}
                  onHoverEnd={() => setActivePillar(null)}
                  onClick={() => router.push(pillar.href)}
                  whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(37,99,235,0.18)" }}
                  whileTap={{ scale: 0.98 }}
                  className="relative aivora-card border rounded-2xl p-7 overflow-hidden cursor-pointer"
                  style={{ borderColor: isHov ? "rgba(37,99,235,0.4)" : undefined }}
                >
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-[#2563EB] to-transparent"
                    animate={{ scaleX: isHov ? 1 : 0, originX: 0 }}
                    transition={{ duration: 0.28 }}
                  />
                  <motion.div
                    className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-3xl pointer-events-none bg-[#2563EB]"
                    animate={{ opacity: isHov ? 0.1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="aivora-gradient-text text-2xl block mb-4">{pillar.icon}</span>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{pillar.title}</h3>
                  <p className="text-gray-600 dark:text-white/55 text-xs leading-relaxed mb-4">{pillar.body}</p>
                  <motion.span
                    className="text-[10px] font-semibold aivora-gradient-text"
                    animate={{ opacity: isHov ? 1 : 0.5, x: isHov ? 3 : 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    Open Engine →
                  </motion.span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 7-Stage Deployment Journey ── */}
      <section data-scroll-section data-bg-from-dark="#0A6078" data-bg-to-dark="#030E18" data-bg-from-light="#B0DCFF" data-bg-to-light="#F0F9FF" className="py-14 px-4 border-t border-gray-100 dark:border-white/8">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-10">
            <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">How We Deploy</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Seven Stages to{" "}
              <span className="aivora-gradient-text">Financial Sovereignty</span>
            </h2>
          </motion.div>
          <div className="flex flex-col gap-3">
            {STAGES.map((stage, i) => {
              const isOpen = activeStage === i;
              return (
                <motion.div
                  key={stage.title}
                  {...fadeUp(i * 0.06)}
                  className="aivora-card border rounded-2xl overflow-hidden cursor-pointer"
                  style={{ borderColor: isOpen ? "rgba(37,99,235,0.3)" : undefined }}
                  onClick={() => setActiveStage(isOpen ? null : i)}
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.14 }}
                >
                  <div className="flex items-center gap-4 px-6 py-4">
                    <motion.div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 bg-[#2563EB]"
                      animate={{ scale: isOpen ? 1.1 : 1, boxShadow: isOpen ? "0 0 18px rgba(37,99,235,0.4)" : "none" }}
                      transition={{ type: "spring", stiffness: 280, damping: 18 }}
                    >
                      {stage.num}
                    </motion.div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white flex-1">{stage.title}</p>
                    <motion.span
                      className="text-[10px] text-gray-400 dark:text-white/30"
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >▼</motion.span>
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pl-[4.25rem]">
                          <p className="text-xs text-gray-500 dark:text-white/50 leading-relaxed">{stage.body}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Multi-engine synergy ── */}
      <section data-scroll-section data-bg-from-dark="#1A2880" data-bg-to-dark="#020508" data-bg-from-light="#B0C4FF" data-bg-to-light="#E8EEFF" className="py-14 px-4 border-t border-gray-100 dark:border-white/8">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp(0)} className="text-center mb-10">
            <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">Four-Engine Synergy</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              FINANCE integrates with{" "}
              <span className="aivora-gradient-text">every engine</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { from: "CORE", arrow: "FINANCE", desc: "Transformation outcomes → financial ROI. Consulting delivery → financial clarity and discipline." },
              { from: "GROW", arrow: "FINANCE", desc: "Digital KPIs → revenue acceleration. Advisory insights → cost reduction and margin improvement." },
              { from: "TALENT", arrow: "FINANCE", desc: "Workforce intelligence → productivity uplift. Leadership capability → financial discipline across teams." },
              { from: "FINANCE", arrow: "ALL REALMS", desc: "Financial dashboards → licensing value. Financial ROI → licensing renewal. Synergy ROI → enterprise value." },
            ].map((row, i) => (
              <motion.div key={row.from} {...fadeUp(i * 0.08)} className="aivora-card border rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-black text-[#2563EB] bg-[#2563EB]/10 px-2.5 py-1 rounded-full border border-[#2563EB]/20">
                    {row.from}
                  </span>
                  <span className="text-gray-400 dark:text-white/30 text-xs">→</span>
                  <span className="text-xs font-bold text-gray-500 dark:text-white/50 bg-gray-100 dark:bg-white/8 px-2.5 py-1 rounded-full">
                    {row.arrow}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-white/55 leading-relaxed">{row.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <AivoraTestimonials />

      {/* ── CTA ── */}
      <section data-scroll-section data-bg-from-dark="#0D6E8A" data-bg-to-dark="#04111F" data-bg-from-light="#BFE3FF" data-bg-to-light="#F8FAFF" className="py-16 px-4 border-t border-gray-100 dark:border-white/8">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p {...fadeUp(0)} className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-4">
            Ready to Begin
          </motion.p>
          <motion.h2 {...fadeUp(0.05)} className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to see where you stand?
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="text-gray-500 dark:text-white/50 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
            Takes two minutes. No commitment, no cost.
          </motion.p>
          <motion.div {...fadeUp(0.15)} className="flex flex-wrap justify-center gap-3">
            <Link href="/premium/business-diagnostic"
              className="px-7 py-3.5 rounded-full text-sm font-extrabold bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-colors shadow-[0_0_28px_rgba(37,99,235,0.4)] inline-flex items-center gap-2">
              Take your Lamid One Diagnostic
            </Link>
            <Link href="/contact"
              className="px-7 py-3.5 rounded-full text-sm font-semibold border border-[#2563EB]/30 text-[#2563EB] hover:bg-[#2563EB]/8 transition-colors">
              Book a Demo
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
