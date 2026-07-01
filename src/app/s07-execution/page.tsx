"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Rocket, CheckCircle2, AlertTriangle, ArrowUpRight, Target, Zap } from "lucide-react";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";

const KPIS = [
  { icon: Target,       label: "Active Strategic Initiatives", value: "12",   trend: "+2 launched this quarter" },
  { icon: Rocket,       label: "Execution Score",              value: "79%",  trend: "Up 6pts vs last review" },
  { icon: CheckCircle2, label: "Milestones On Track",          value: "87%",  trend: "3 at risk, none delayed" },
  { icon: Zap,          label: "Completion Velocity",          value: "Fast", trend: "Ahead of 90-day target" },
];

const SIGNALS = [
  { severity: "High",   title: "Digital transformation initiative behind by 1 milestone", action: "Realign team cadence and unblock dependency" },
  { severity: "Medium", title: "Market expansion plan lacks assigned execution owner",     action: "Assign initiative lead within 48hrs" },
  { severity: "Low",    title: "Culture programme ahead of schedule",                     action: "Capture learnings for next cycle" },
];

const INITIATIVES = [
  { name: "LAMID CORE modernisation",       status: "On track", pct: 74 },
  { name: "West Africa market expansion",   status: "At risk",  pct: 38 },
  { name: "LAMID TALENT LMS rollout",       status: "On track", pct: 62 },
  { name: "Digital diagnostics automation", status: "On track", pct: 90 },
];

const fadeUp = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.45, delay: d } });

export default function S07Page() {
  return (
    <DashboardTierGate pillar="S07 — Strategic Execution" backHref="/portfolio" backLabel="Back to About">
      <main className="aivora-section min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">

          <motion.div {...fadeUp(0)} className="mb-10">
            <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">S-Series · S07</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Strategic Execution</h1>
            <p className="text-gray-500 dark:text-white/45 text-sm max-w-xl">
              Strategy in motion. Track initiatives, velocity, and delivery against the enterprise direction.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.05)} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {KPIS.map((kpi) => (
              <div key={kpi.label} className="aivora-card border rounded-2xl p-5">
                <kpi.icon className="w-4 h-4 text-[#C12129] mb-3" strokeWidth={2.2} />
                <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none mb-1.5">{kpi.value}</p>
                <p className="text-xs text-gray-500 dark:text-white/45">{kpi.label}</p>
                <p className="text-[10px] text-gray-400 dark:text-white/30 mt-1">{kpi.trend}</p>
              </div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <motion.div {...fadeUp(0.1)} className="aivora-card border rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Execution Signals</p>
              <div className="flex flex-col gap-3">
                {SIGNALS.map((s) => (
                  <div key={s.title} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-white/6 last:border-0 last:pb-0">
                    <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${s.severity === "High" ? "text-[#C12129]" : "text-gray-400 dark:text-white/30"}`} strokeWidth={2} />
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white leading-snug">{s.title}</p>
                      <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">{s.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.15)} className="aivora-card border rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Initiative Progress</p>
              <div className="flex flex-col gap-4">
                {INITIATIVES.map((init) => (
                  <div key={init.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm text-gray-700 dark:text-white/70 truncate pr-2">{init.name}</p>
                      <span className={`text-[10px] font-semibold shrink-0 px-2 py-0.5 rounded-full ${init.status === "At risk" ? "bg-[#C12129]/10 text-[#C12129]" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}`}>
                        {init.status}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden">
                      <motion.div className="h-full rounded-full bg-[#C12129]"
                        initial={{ width: 0 }} whileInView={{ width: `${init.pct}%` }}
                        viewport={{ once: true }} transition={{ duration: 0.7, ease: "easeOut" }} />
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-white/30 mt-1">{init.pct}% complete</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div {...fadeUp(0.2)} className="mt-10 flex flex-wrap gap-3">
            <Link href="/s08-renewal" className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#C12129] hover:bg-[#a01a20] transition-colors shadow-[0_0_14px_rgba(193,33,41,0.35)] inline-flex items-center gap-1.5">
              Strategic Renewal <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/core-dashboard" className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#C12129]/25 text-[#C12129] hover:bg-[#C12129]/8 transition-colors">
              LAMID CORE Dashboard
            </Link>
          </motion.div>

        </div>
      </main>
    </DashboardTierGate>
  );
}
