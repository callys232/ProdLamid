"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Users, Workflow, Gauge, CheckCircle2, AlertTriangle, ArrowUpRight } from "lucide-react";

const KPIS = [
  { icon: Users,        label: "Active Engagements",     value: "18",   trend: "+3 this month" },
  { icon: Workflow,     label: "Consultants Matched",    value: "120+", trend: "Across 6 countries" },
  { icon: Gauge,        label: "Avg. Match Time",        value: "24h",  trend: "Down from 72h" },
  { icon: CheckCircle2, label: "Workflow Completion",    value: "92%",  trend: "On-track engagements" },
];

const INSIGHTS = [
  { severity: "High",   title: "Consultant capacity tight in Compliance & Risk", action: "Open vetting for 3 new specialists" },
  { severity: "Medium", title: "2 engagements approaching milestone review",     action: "Schedule client check-ins this week" },
  { severity: "Low",    title: "Onboarding time improving across new clients",   action: "No action needed" },
];

const WORKFLOWS = [
  { name: "Horizon Capital — Strategy Engagement",  stage: "Delivery",   status: "On track" },
  { name: "NovaTech — Digital Transformation",       stage: "Discovery", status: "On track" },
  { name: "Meridian Group — Compliance Review",      stage: "Review",    status: "At risk" },
  { name: "Atlas Logistics — Ops Diagnostic",        stage: "Kickoff",   status: "On track" },
];

const fadeUp = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.45, delay: d } });

export default function CoreDashboardPage() {
  return (
    <main className="aivora-section min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div {...fadeUp(0)} className="mb-10">
          <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">LAMID CORE</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Consulting Dashboard</h1>
          <p className="text-gray-500 dark:text-white/45 text-sm max-w-xl">
            Engagements, matching, and delivery — at a glance.
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

          {/* Intelligence feed */}
          <motion.div {...fadeUp(0.1)} className="aivora-card border rounded-2xl p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Intelligence Feed</p>
            <div className="flex flex-col gap-3">
              {INSIGHTS.map((item) => (
                <div key={item.title} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-white/6 last:border-0 last:pb-0">
                  <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${item.severity === "High" ? "text-[#C12129]" : "text-gray-400 dark:text-white/30"}`} strokeWidth={2} />
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white leading-snug">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">{item.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Workflow status */}
          <motion.div {...fadeUp(0.15)} className="aivora-card border rounded-2xl p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Workflow Status</p>
            <div className="flex flex-col gap-3">
              {WORKFLOWS.map((wf) => (
                <div key={wf.name} className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-white/6 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white leading-snug">{wf.name}</p>
                    <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">{wf.stage}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full shrink-0 ${
                    wf.status === "At risk"
                      ? "bg-[#C12129]/10 text-[#C12129]"
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  }`}>
                    {wf.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick actions */}
        <motion.div {...fadeUp(0.2)} className="mt-10 flex flex-wrap gap-3">
          <Link href="/talent" className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#C12129] hover:bg-[#a01a20] transition-colors shadow-[0_0_14px_rgba(193,33,41,0.35)] inline-flex items-center gap-1.5">
            Match a Consultant <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link href="/postjobs" className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#C12129]/25 text-[#C12129] hover:bg-[#C12129]/8 transition-colors">
            Post a Project
          </Link>
        </motion.div>

      </div>
    </main>
  );
}
