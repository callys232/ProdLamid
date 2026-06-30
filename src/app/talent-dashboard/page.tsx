"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GraduationCap, Users2, TrendingUp, BadgeCheck, Lightbulb, ArrowUpRight } from "lucide-react";

const KPIS = [
  { icon: Users2,        label: "Workforce Readiness Index", value: "76%", trend: "Up 4pts this quarter" },
  { icon: BadgeCheck,    label: "Capability Health Score",   value: "81%", trend: "Stable" },
  { icon: GraduationCap, label: "Learning Completion Rate",  value: "88%", trend: "+12pts vs last cohort" },
  { icon: TrendingUp,    label: "Leadership Pipeline Strength", value: "63%", trend: "Watch: mid-level gap" },
];

const SIGNALS = [
  { severity: "High",   title: "Digital capability gap in Operations team",  action: "Assign upskilling pathway" },
  { severity: "Medium", title: "Leadership bench thin at mid-level",         action: "Activate mentorship matching" },
  { severity: "Low",    title: "Certification completion trending up",       action: "No action needed" },
];

const LEARNING = [
  { label: "Leadership Essentials",    progress: 92 },
  { label: "Digital Foundations",      progress: 74 },
  { label: "Operational Excellence",   progress: 58 },
];

const fadeUp = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.45, delay: d } });

export default function TalentDashboardPage() {
  return (
    <main className="aivora-section min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div {...fadeUp(0)} className="mb-10">
          <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">LAMID TALENT</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Talent Dashboard</h1>
          <p className="text-gray-500 dark:text-white/45 text-sm max-w-xl">
            Capability, readiness, and learning progress — at a glance.
          </p>
        </motion.div>

        {/* KPI row */}
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

          {/* Talent signals */}
          <motion.div {...fadeUp(0.1)} className="aivora-card border rounded-2xl p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Talent Signals</p>
            <div className="flex flex-col gap-3">
              {SIGNALS.map((item) => (
                <div key={item.title} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-white/6 last:border-0 last:pb-0">
                  <Lightbulb className={`w-4 h-4 mt-0.5 shrink-0 ${item.severity === "High" ? "text-[#C12129]" : "text-gray-400 dark:text-white/30"}`} strokeWidth={2} />
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white leading-snug">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">{item.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Learning progress */}
          <motion.div {...fadeUp(0.15)} className="aivora-card border rounded-2xl p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Learning Progress</p>
            <div className="flex flex-col gap-4">
              {LEARNING.map((l) => (
                <div key={l.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm text-gray-700 dark:text-white/70">{l.label}</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{l.progress}%</p>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-[#C12129]"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${l.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick actions */}
        <motion.div {...fadeUp(0.2)} className="mt-10 flex flex-wrap gap-3">
          <Link href="/hcd" className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#C12129] hover:bg-[#a01a20] transition-colors shadow-[0_0_14px_rgba(193,33,41,0.35)] inline-flex items-center gap-1.5">
            Start Your Assessment <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link href="/hcd/recruitment" className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#C12129]/25 text-[#C12129] hover:bg-[#C12129]/8 transition-colors">
            Explore Programs
          </Link>
        </motion.div>

      </div>
    </main>
  );
}
