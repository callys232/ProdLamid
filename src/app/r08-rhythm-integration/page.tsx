"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { GitMerge, Network, Puzzle, Share2, AlertCircle, ArrowUpRight } from "lucide-react";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";

const KPIS = [
  { icon: GitMerge, label: "Integration Score",         value: "69%",  trend: "Cross-rhythm connectivity" },
  { icon: Network,  label: "Connected Rhythm Paths",   value: "11",   trend: "Active temporal pathways" },
  { icon: Puzzle,   label: "Disconnected Rhythms",     value: "4",    trend: "Isolated timing cycles" },
  { icon: Share2,   label: "Fusion Density",           value: "0.67", trend: "Rhythm mesh coherence" },
];
const SIGNALS = [
  { severity: "High",   title: "4 rhythm cycles running in complete isolation — no cross-system temporal linkage", action: "Build rhythm bridges: assign cross-functional cadence owners to isolated cycles" },
  { severity: "Medium", title: "SDC and GROW rhythms not yet integrated into unified enterprise temporal mesh",    action: "Connect SDC cadence to GROW growth rhythm — create shared review cycle" },
  { severity: "Low",    title: "CORE and TALENT rhythms showing deepening integration over last two quarters",    action: "Accelerate — formalise integration model and scale to other pillar pairs" },
];
const DIMENSIONS = [
  { label: "CORE–GROW Integration",   value: 74 },
  { label: "CORE–TALENT Integration", value: 81 },
  { label: "GROW–TALENT Integration", value: 62 },
  { label: "SDC Integration",         value: 41 },
];
const fadeUp = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.45, delay: d } });

export default function R08Page() {
  return (
    <DashboardTierGate pillar="R08 — Rhythm Integration Engine" backHref="/r07-rhythm-coherence" backLabel="Back to Rhythm Coherence">
      <main className="aivora-section min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp(0)} className="mb-10">
            <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">R-Series · R08 · Arc 2 — Harmonic</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Rhythm Integration Engine</h1>
            <p className="text-gray-500 dark:text-white/45 text-sm max-w-xl">Temporal network intelligence — mapping how rhythms connect, fuse, and reinforce one another across enterprise systems, functions, and strategic layers.</p>
          </motion.div>
          <motion.div {...fadeUp(0.05)} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {KPIS.map((k) => (<div key={k.label} className="aivora-card border rounded-2xl p-5"><k.icon className="w-4 h-4 text-[#C12129] mb-3" strokeWidth={2.2} /><p className="text-2xl font-bold text-gray-900 dark:text-white leading-none mb-1.5">{k.value}</p><p className="text-xs text-gray-500 dark:text-white/45">{k.label}</p><p className="text-[10px] text-gray-400 dark:text-white/30 mt-1">{k.trend}</p></div>))}
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div {...fadeUp(0.1)} className="aivora-card border rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Integration Signals</p>
              <div className="flex flex-col gap-3">{SIGNALS.map((s) => (<div key={s.title} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-white/6 last:border-0 last:pb-0"><AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${s.severity === "High" ? "text-[#C12129]" : "text-gray-400 dark:text-white/30"}`} strokeWidth={2} /><div><p className="text-sm text-gray-900 dark:text-white leading-snug">{s.title}</p><p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">{s.action}</p></div></div>))}</div>
            </motion.div>
            <motion.div {...fadeUp(0.15)} className="aivora-card border rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Integration by Pillar Pair</p>
              <div className="flex flex-col gap-4">{DIMENSIONS.map((d) => (<div key={d.label}><div className="flex items-center justify-between mb-1.5"><p className="text-sm text-gray-700 dark:text-white/70">{d.label}</p><p className="text-xs font-semibold text-gray-900 dark:text-white">{d.value}%</p></div><div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden"><motion.div className="h-full rounded-full bg-[#C12129]" initial={{ width: 0 }} whileInView={{ width: `${d.value}%` }} viewport={{ once: true }} transition={{ duration: 0.7, ease: "easeOut" }} /></div></div>))}</div>
            </motion.div>
          </div>
          <motion.div {...fadeUp(0.2)} className="mt-10 flex flex-wrap gap-3">
            <Link href="/r09-rhythm-alignment" className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#C12129] hover:bg-[#a01a20] transition-colors shadow-[0_0_14px_rgba(193,33,41,0.35)] inline-flex items-center gap-1.5">Rhythm Alignment <ArrowUpRight className="w-3.5 h-3.5" /></Link>
            <Link href="/r07-rhythm-coherence" className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#C12129]/25 text-[#C12129] hover:bg-[#C12129]/8 transition-colors">Rhythm Coherence</Link>
          </motion.div>
        </div>
      </main>
    </DashboardTierGate>
  );
}
