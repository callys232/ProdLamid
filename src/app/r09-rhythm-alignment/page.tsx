"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Compass, Navigation, ArrowRight, Crosshair, AlertCircle, ArrowUpRight } from "lucide-react";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";

const KPIS = [
  { icon: Compass,    label: "Alignment Score",         value: "77%",  trend: "Rhythms tracking strategic north star" },
  { icon: Navigation, label: "Aligned Rhythm Cycles",  value: "9/13", trend: "69% locked to enterprise direction" },
  { icon: ArrowRight, label: "Misaligned Cycles",       value: "4",    trend: "Requiring direction correction" },
  { icon: Crosshair,  label: "Directional Coherence",  value: "81%",  trend: "Leadership rhythm alignment" },
];
const SIGNALS = [
  { severity: "High",   title: "Market rhythm pulling in a different direction from transformation strategy",     action: "Realign market cadence to transformation arc — adjust Q3 market review timing" },
  { severity: "Medium", title: "Customer rhythm still aligned to legacy service model — not new ecosystem model", action: "Update customer engagement cadence to reflect LAMID ONE value proposition" },
  { severity: "Low",    title: "Leadership rhythm highly aligned with strategic goals for 3 consecutive cycles",  action: "No action — document the rhythm-strategy alignment model for replication" },
];
const DIMENSIONS = [
  { label: "Strategy Alignment",      value: 88 },
  { label: "Market Alignment",        value: 54 },
  { label: "Customer Alignment",      value: 61 },
  { label: "Transformation Alignment",value: 79 },
];
const fadeUp = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.45, delay: d } });

export default function R09Page() {
  return (
    <DashboardTierGate pillar="R09 — Rhythm Alignment Engine" backHref="/r08-rhythm-integration" backLabel="Back to Rhythm Integration">
      <main className="aivora-section min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp(0)} className="mb-10">
            <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">R-Series · R09 · Arc 2 — Harmonic</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Rhythm Alignment Engine</h1>
            <p className="text-gray-500 dark:text-white/45 text-sm max-w-xl">Temporal direction intelligence — ensuring enterprise rhythms align with strategic intent, enterprise identity, and transformation goals.</p>
          </motion.div>
          <motion.div {...fadeUp(0.05)} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {KPIS.map((k) => (<div key={k.label} className="aivora-card border rounded-2xl p-5"><k.icon className="w-4 h-4 text-[#C12129] mb-3" strokeWidth={2.2} /><p className="text-2xl font-bold text-gray-900 dark:text-white leading-none mb-1.5">{k.value}</p><p className="text-xs text-gray-500 dark:text-white/45">{k.label}</p><p className="text-[10px] text-gray-400 dark:text-white/30 mt-1">{k.trend}</p></div>))}
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div {...fadeUp(0.1)} className="aivora-card border rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Alignment Signals</p>
              <div className="flex flex-col gap-3">{SIGNALS.map((s) => (<div key={s.title} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-white/6 last:border-0 last:pb-0"><AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${s.severity === "High" ? "text-[#C12129]" : "text-gray-400 dark:text-white/30"}`} strokeWidth={2} /><div><p className="text-sm text-gray-900 dark:text-white leading-snug">{s.title}</p><p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">{s.action}</p></div></div>))}</div>
            </motion.div>
            <motion.div {...fadeUp(0.15)} className="aivora-card border rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Alignment by Direction</p>
              <div className="flex flex-col gap-4">{DIMENSIONS.map((d) => (<div key={d.label}><div className="flex items-center justify-between mb-1.5"><p className="text-sm text-gray-700 dark:text-white/70">{d.label}</p><p className="text-xs font-semibold text-gray-900 dark:text-white">{d.value}%</p></div><div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden"><motion.div className="h-full rounded-full bg-[#C12129]" initial={{ width: 0 }} whileInView={{ width: `${d.value}%` }} viewport={{ once: true }} transition={{ duration: 0.7, ease: "easeOut" }} /></div></div>))}</div>
            </motion.div>
          </div>
          <motion.div {...fadeUp(0.2)} className="mt-10 flex flex-wrap gap-3">
            <Link href="/r10-rhythm-convergence" className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#C12129] hover:bg-[#a01a20] transition-colors shadow-[0_0_14px_rgba(193,33,41,0.35)] inline-flex items-center gap-1.5">Rhythm Convergence <ArrowUpRight className="w-3.5 h-3.5" /></Link>
            <Link href="/r08-rhythm-integration" className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#C12129]/25 text-[#C12129] hover:bg-[#C12129]/8 transition-colors">Rhythm Integration</Link>
          </motion.div>
        </div>
      </main>
    </DashboardTierGate>
  );
}
