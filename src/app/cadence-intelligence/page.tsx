"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Activity, Clock, Waves, Shuffle, AlertCircle, ArrowUpRight } from "lucide-react";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";

const KPIS = [
  { icon: Activity, label: "Cadence Health Index",    value: "76%",    trend: "Stable for 45 days" },
  { icon: Clock,    label: "Cadence Velocity",        value: "Medium", trend: "3 cycle delays detected" },
  { icon: Waves,    label: "Drift Level",              value: "Low",    trend: "No critical drift" },
  { icon: Shuffle,  label: "Synchronisation Score",   value: "81%",    trend: "Teams moving in cadence" },
];

const SIGNALS = [
  { severity: "Medium", title: "Decision-making cadence slower than strategy cycle",    action: "Introduce weekly decision rhythm checkpoints" },
  { severity: "Medium", title: "Customer engagement rhythm misaligned with delivery",   action: "Sync CX touchpoints with delivery milestones" },
  { severity: "Low",    title: "Leadership and team rhythms aligned for 30+ days",      action: "No action needed — sustain" },
];

const DIMENSIONS = [
  { label: "Strategic Cadence",    value: 82 },
  { label: "Operational Cadence",  value: 74 },
  { label: "Customer Flow",        value: 71 },
  { label: "Delivery Sync",        value: 85 },
  { label: "Leadership Cadence",   value: 78 },
];

const fadeUp = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.45, delay: d } });

export default function RhythmIntelligencePage() {
  return (
    <DashboardTierGate pillar="R-Series — Cadence Intelligence" backHref="/quality-intelligence" backLabel="Back to Quality Intelligence">
      <main className="aivora-section min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">

          <motion.div {...fadeUp(0)} className="mb-10">
            <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">R-Series · Cadence Intelligence</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Cadence Intelligence</h1>
            <p className="text-gray-500 dark:text-white/45 text-sm max-w-xl">
              The enterprise heartbeat. Map timing, detect cadence drift, and synchronise every dimension of organisational cadence.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.05)} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {KPIS.map((kpi) => (
              <div key={kpi.label} className="aivora-card border rounded-2xl p-5">
                <kpi.icon className="w-4 h-4 text-[#2563EB] mb-3" strokeWidth={2.2} />
                <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none mb-1.5">{kpi.value}</p>
                <p className="text-xs text-gray-500 dark:text-white/45">{kpi.label}</p>
                <p className="text-[10px] text-gray-400 dark:text-white/30 mt-1">{kpi.trend}</p>
              </div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <motion.div {...fadeUp(0.1)} className="aivora-card border rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Cadence Signals</p>
              <div className="flex flex-col gap-3">
                {SIGNALS.map((s) => (
                  <div key={s.title} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-white/6 last:border-0 last:pb-0">
                    <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${s.severity === "Medium" ? "text-[#2563EB]" : "text-gray-400 dark:text-white/30"}`} strokeWidth={2} />
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white leading-snug">{s.title}</p>
                      <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">{s.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.15)} className="aivora-card border rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Cadence Dimensions</p>
              <div className="flex flex-col gap-4">
                {DIMENSIONS.map((d) => (
                  <div key={d.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm text-gray-700 dark:text-white/70">{d.label}</p>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">{d.value}%</p>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden">
                      <motion.div className="h-full rounded-full bg-[#2563EB]"
                        initial={{ width: 0 }} whileInView={{ width: `${d.value}%` }}
                        viewport={{ once: true }} transition={{ duration: 0.7, ease: "easeOut" }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div {...fadeUp(0.2)} className="mt-10 flex flex-wrap gap-3">
            <Link href="/operations-intelligence" className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-[0_0_14px_rgba(37,99,235,0.35)] inline-flex items-center gap-1.5">
              Operations Intelligence <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/core-dashboard" className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#2563EB]/25 text-[#2563EB] hover:bg-[#2563EB]/8 transition-colors">
              LAMID CORE Dashboard
            </Link>
          </motion.div>

        </div>
      </main>
    </DashboardTierGate>
  );
}
