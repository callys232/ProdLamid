"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Anchor, ShieldCheck, BarChart2, Layers, AlertCircle, ArrowUpRight } from "lucide-react";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";

const KPIS = [
  { icon: Anchor,     label: "Quality Stability Index",   value: "73%",   trend: "Composite stability across dimensions" },
  { icon: ShieldCheck,label: "Stable Quality Patterns",   value: "9/12",  trend: "Of tracked patterns within tolerance" },
  { icon: BarChart2,  label: "Volatility Score",          value: "Low",   trend: "Improving quarter-over-quarter" },
  { icon: Layers,     label: "Instability Zones",         value: "3",     trend: "Requiring active stabilisation" },
];
const SIGNALS = [
  { severity: "High",   title: "3 quality dimensions showing high volatility — unpredictable outputs", action: "Deploy quality stabilisation protocols and increase monitoring frequency across flagged dimensions" },
  { severity: "Medium", title: "Consultant quality scores varying ±23% between engagements — inconsistency risk", action: "Standardise consultant quality benchmarking and introduce pre-engagement quality gates" },
  { severity: "Low",    title: "Platform quality stability at highest recorded level in 18 months", action: "Sustain current infrastructure controls and document as platform quality benchmark" },
];
const DIMENSIONS = [
  { label: "Strategic Quality Stability",    value: 84 },
  { label: "Operational Quality Stability",  value: 71 },
  { label: "Cultural Quality Stability",     value: 58 },
  { label: "Technology Quality Stability",   value: 88 },
];
const fadeUp = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.45, delay: d } });

export default function Q08Page() {
  return (
    <DashboardTierGate pillar="Q08 — Quality Stability Engine" backHref="/q07-quality-continuity" backLabel="Back to Quality Continuity">
      <main className="aivora-section min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp(0)} className="mb-10">
            <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">Q-Series · Q08 · Quality Intelligence</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Quality Stability Engine</h1>
            <p className="text-gray-500 dark:text-white/45 text-sm max-w-xl">Detects instability in quality patterns across enterprise dimensions, identifying volatility zones before they produce unpredictable or inconsistent outputs.</p>
          </motion.div>
          <motion.div {...fadeUp(0.05)} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {KPIS.map((k) => (<div key={k.label} className="aivora-card border rounded-2xl p-5"><k.icon className="w-4 h-4 text-[#C12129] mb-3" strokeWidth={2.2} /><p className="text-2xl font-bold text-gray-900 dark:text-white leading-none mb-1.5">{k.value}</p><p className="text-xs text-gray-500 dark:text-white/45">{k.label}</p><p className="text-[10px] text-gray-400 dark:text-white/30 mt-1">{k.trend}</p></div>))}
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div {...fadeUp(0.1)} className="aivora-card border rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Quality Signals</p>
              <div className="flex flex-col gap-3">{SIGNALS.map((s) => (<div key={s.title} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-white/6 last:border-0 last:pb-0"><AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${s.severity === "High" ? "text-[#C12129]" : "text-gray-400 dark:text-white/30"}`} strokeWidth={2} /><div><p className="text-sm text-gray-900 dark:text-white leading-snug">{s.title}</p><p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">{s.action}</p></div></div>))}</div>
            </motion.div>
            <motion.div {...fadeUp(0.15)} className="aivora-card border rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Quality Dimensions</p>
              <div className="flex flex-col gap-4">{DIMENSIONS.map((d) => (<div key={d.label}><div className="flex items-center justify-between mb-1.5"><p className="text-sm text-gray-700 dark:text-white/70">{d.label}</p><p className="text-xs font-semibold text-gray-900 dark:text-white">{d.value}%</p></div><div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden"><motion.div className="h-full rounded-full bg-[#C12129]" initial={{ width: 0 }} whileInView={{ width: `${d.value}%` }} viewport={{ once: true }} transition={{ duration: 0.7, ease: "easeOut" }} /></div></div>))}</div>
            </motion.div>
          </div>
          <motion.div {...fadeUp(0.2)} className="mt-10 flex flex-wrap gap-3">
            <Link href="/q09-quality-balance" className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#C12129] hover:bg-[#a01a20] transition-colors shadow-[0_0_14px_rgba(193,33,41,0.35)] inline-flex items-center gap-1.5">Quality Balance <ArrowUpRight className="w-3.5 h-3.5" /></Link>
            <Link href="/q07-quality-continuity" className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#C12129]/25 text-[#C12129] hover:bg-[#C12129]/8 transition-colors">Quality Continuity</Link>
          </motion.div>
        </div>
      </main>
    </DashboardTierGate>
  );
}
