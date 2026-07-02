"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { AlertTriangle, Navigation, TrendingDown, Shuffle, AlertCircle, ArrowUpRight } from "lucide-react";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";

const KPIS = [
  { icon: AlertTriangle, label: "Drift Zones",        value: "5",        trend: "Functions deviating from targets" },
  { icon: Navigation,    label: "Drift Severity",     value: "Medium",   trend: "Enterprise-wide severity rating" },
  { icon: TrendingDown,  label: "Target Deviation",   value: "14%",      trend: "Average deviation from planned targets" },
  { icon: Shuffle,       label: "Coherence Loss",     value: "4 areas",  trend: "Areas losing strategic productivity coherence" },
];
const SIGNALS = [
  { severity: "High",   title: "Finance productivity drifted 28% below Q1 target — systemic underperformance",  action: "Appoint drift recovery lead and initiate structured root-cause analysis within 48 hours" },
  { severity: "High",   title: "2 consulting teams drifting into below-threshold output zones",                  action: "Intervene with performance support protocols before threshold breach becomes entrenched" },
  { severity: "Medium", title: "GROW productivity drifting due to market uncertainty — not structural",          action: "Monitor weekly and deploy stabilisation support if drift persists beyond 30 days" },
];
const DIMENSIONS = [
  { label: "Finance Productivity Drift",    value: 28 },
  { label: "Consulting Drift",              value: 19 },
  { label: "Operations Drift",              value: 12 },
  { label: "Tech Drift",                    value: 8 },
];
const fadeUp = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.45, delay: d } });

export default function P03Page() {
  return (
    <DashboardTierGate pillar="P03 — Productivity Drift Engine" backHref="/p02-productivity-velocity" backLabel="Back to Productivity Velocity">
      <main className="aivora-section min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp(0)} className="mb-10">
            <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">P-Series · P03 · Enterprise Productivity</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Productivity Drift Engine</h1>
            <p className="text-gray-500 dark:text-white/45 text-sm max-w-xl">Detects where productivity deviates from planned targets across enterprise functions, enabling rapid course correction before drift becomes structural.</p>
          </motion.div>
          <motion.div {...fadeUp(0.05)} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {KPIS.map((k) => (<div key={k.label} className="aivora-card border rounded-2xl p-5"><k.icon className="w-4 h-4 text-[#C12129] mb-3" strokeWidth={2.2} /><p className="text-2xl font-bold text-gray-900 dark:text-white leading-none mb-1.5">{k.value}</p><p className="text-xs text-gray-500 dark:text-white/45">{k.label}</p><p className="text-[10px] text-gray-400 dark:text-white/30 mt-1">{k.trend}</p></div>))}
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div {...fadeUp(0.1)} className="aivora-card border rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Productivity Signals</p>
              <div className="flex flex-col gap-3">{SIGNALS.map((s) => (<div key={s.title} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-white/6 last:border-0 last:pb-0"><AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${s.severity === "High" ? "text-[#C12129]" : "text-gray-400 dark:text-white/30"}`} strokeWidth={2} /><div><p className="text-sm text-gray-900 dark:text-white leading-snug">{s.title}</p><p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">{s.action}</p></div></div>))}</div>
            </motion.div>
            <motion.div {...fadeUp(0.15)} className="aivora-card border rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Productivity Dimensions</p>
              <div className="flex flex-col gap-4">{DIMENSIONS.map((d) => (<div key={d.label}><div className="flex items-center justify-between mb-1.5"><p className="text-sm text-gray-700 dark:text-white/70">{d.label}</p><p className="text-xs font-semibold text-gray-900 dark:text-white">{d.value}%</p></div><div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden"><motion.div className="h-full rounded-full bg-[#C12129]" initial={{ width: 0 }} whileInView={{ width: `${d.value}%` }} viewport={{ once: true }} transition={{ duration: 0.7, ease: "easeOut" }} /></div></div>))}</div>
            </motion.div>
          </div>
          <motion.div {...fadeUp(0.2)} className="mt-10 flex flex-wrap gap-3">
            <Link href="/p04-productivity-stability" className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#C12129] hover:bg-[#a01a20] transition-colors shadow-[0_0_14px_rgba(193,33,41,0.35)] inline-flex items-center gap-1.5">Productivity Stability <ArrowUpRight className="w-3.5 h-3.5" /></Link>
            <Link href="/p02-productivity-velocity" className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#C12129]/25 text-[#C12129] hover:bg-[#C12129]/8 transition-colors">Productivity Velocity</Link>
          </motion.div>
        </div>
      </main>
    </DashboardTierGate>
  );
}
