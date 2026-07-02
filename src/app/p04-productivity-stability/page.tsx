"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Anchor, ShieldCheck, Layers, Lock, AlertCircle, ArrowUpRight } from "lucide-react";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";

const KPIS = [
  { icon: Anchor,      label: "Stability Score",      value: "73%",        trend: "Enterprise productivity stability index" },
  { icon: ShieldCheck, label: "Stable Functions",     value: "8/12",       trend: "Functions holding productivity under pressure" },
  { icon: Layers,      label: "Volatility Index",     value: "Low-Medium", trend: "Current enterprise volatility rating" },
  { icon: Lock,        label: "Resilience Strength",  value: "79%",        trend: "Capacity to absorb productivity disruption" },
];
const SIGNALS = [
  { severity: "High",   title: "4 functions showing productivity volatility under transformation pressure",       action: "Deploy stability protocols and assign transformation support to at-risk functions immediately" },
  { severity: "Medium", title: "Productivity stability dipping during talent transitions — succession gaps exposing fragility", action: "Accelerate succession planning and install interim performance anchors for transitions" },
  { severity: "Low",    title: "CORE consulting productivity maintained stability through 2 leadership changes",  action: "Extract CORE stability model and codify it as enterprise-wide transition playbook" },
];
const DIMENSIONS = [
  { label: "CORE Stability",       value: 84 },
  { label: "GROW Stability",       value: 71 },
  { label: "TALENT Stability",     value: 68 },
  { label: "Operations Stability", value: 74 },
];
const fadeUp = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.45, delay: d } });

export default function P04Page() {
  return (
    <DashboardTierGate pillar="P04 — Productivity Stability Engine" backHref="/p03-productivity-drift" backLabel="Back to Productivity Drift">
      <main className="aivora-section min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp(0)} className="mb-10">
            <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">P-Series · P04 · Enterprise Productivity</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Productivity Stability Engine</h1>
            <p className="text-gray-500 dark:text-white/45 text-sm max-w-xl">Ensures enterprise productivity holds under transformation pressure, surfacing fragility points before volatility compounds into systemic underperformance.</p>
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
            <Link href="/p05-productivity-balance" className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#C12129] hover:bg-[#a01a20] transition-colors shadow-[0_0_14px_rgba(193,33,41,0.35)] inline-flex items-center gap-1.5">Productivity Balance <ArrowUpRight className="w-3.5 h-3.5" /></Link>
            <Link href="/p03-productivity-drift" className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#C12129]/25 text-[#C12129] hover:bg-[#C12129]/8 transition-colors">Productivity Drift</Link>
          </motion.div>
        </div>
      </main>
    </DashboardTierGate>
  );
}
