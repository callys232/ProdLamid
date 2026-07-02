"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Repeat, RefreshCw, Calendar, Clock, AlertCircle, ArrowUpRight } from "lucide-react";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";

const KPIS = [
  { icon: Repeat,     label: "Quality Continuity",        value: "84%",  trend: "Sustained across all cycles" },
  { icon: RefreshCw,  label: "Consistent Quality Rate",   value: "79%",  trend: "Engagements meeting repeat standards" },
  { icon: Calendar,   label: "Quality Cycle Adherence",   value: "91%",  trend: "On-schedule quality review completion" },
  { icon: Clock,      label: "Continuity Breaks",         value: "1",    trend: "During leadership transition period" },
];
const SIGNALS = [
  { severity: "Medium", title: "Quality continuity break detected during leadership transition period", action: "Implement quality handover protocols for all leadership transitions going forward" },
  { severity: "Low",    title: "Client quality experience maintained continuously across 3 product upgrades", action: "Embed upgrade-phase quality continuity playbook as standard release protocol" },
  { severity: "Low",    title: "84% of quality standards persisting across quarterly cycles without regression", action: "Investigate the 16% regression rate and close root cause gaps" },
];
const DIMENSIONS = [
  { label: "Process Continuity",  value: 84 },
  { label: "Delivery Continuity", value: 79 },
  { label: "Platform Continuity", value: 91 },
  { label: "Advisory Continuity", value: 77 },
];
const fadeUp = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.45, delay: d } });

export default function Q07Page() {
  return (
    <DashboardTierGate pillar="Q07 — Quality Continuity Engine" backHref="/q06-quality-resilience" backLabel="Back to Quality Resilience">
      <main className="aivora-section min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp(0)} className="mb-10">
            <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">Q-Series · Q07 · Quality Intelligence</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Quality Continuity Engine</h1>
            <p className="text-gray-500 dark:text-white/45 text-sm max-w-xl">Ensures quality persists across cycles, transitions, and platform upgrades — preventing regression and maintaining client quality experience without interruption.</p>
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
            <Link href="/q08-quality-stability" className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#C12129] hover:bg-[#a01a20] transition-colors shadow-[0_0_14px_rgba(193,33,41,0.35)] inline-flex items-center gap-1.5">Quality Stability <ArrowUpRight className="w-3.5 h-3.5" /></Link>
            <Link href="/q06-quality-resilience" className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#C12129]/25 text-[#C12129] hover:bg-[#C12129]/8 transition-colors">Quality Resilience</Link>
          </motion.div>
        </div>
      </main>
    </DashboardTierGate>
  );
}
