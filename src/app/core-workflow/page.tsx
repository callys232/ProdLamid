"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Workflow, CheckCircle2, AlertTriangle, Clock, AlertCircle, ArrowUpRight } from "lucide-react";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";

const KPIS = [
  { icon: Workflow,     label: "Active Workflows",     value: "14",   trend: "5 in delivery, 9 in discovery" },
  { icon: CheckCircle2, label: "Completion Rate",      value: "88%",  trend: "Above 85% target" },
  { icon: AlertTriangle,label: "Blocked Workflows",    value: "2",    trend: "Awaiting client approval" },
  { icon: Clock,        label: "Avg. Cycle Time",      value: "22d",  trend: "Down from 28d last quarter" },
];
const SIGNALS = [
  { severity: "High",   title: "2 workflows blocked at client approval stage for 7+ days", action: "Escalate — assign Concierge follow-up" },
  { severity: "Medium", title: "Analysis stage taking 40% longer than planned average",    action: "Review resource allocation for analysis specialists" },
  { severity: "Low",    title: "Discovery workflows completing ahead of schedule",          action: "No action — sustain" },
];
const STAGES = [
  { label: "Intake",          count: 3,  status: "Active" },
  { label: "Discovery",       count: 4,  status: "Active" },
  { label: "Analysis",        count: 3,  status: "Active" },
  { label: "Recommendation",  count: 2,  status: "Active" },
  { label: "Implementation",  count: 1,  status: "Active" },
  { label: "Sustain",         count: 1,  status: "Active" },
];
const fadeUp = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.45, delay: d } });

export default function CoreWorkflowPage() {
  return (
    <DashboardTierGate pillar="C02 — Workflow Engine" backHref="/core-dashboard" backLabel="Back to LAMID CORE Dashboard">
      <main className="aivora-section min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp(0)} className="mb-10">
            <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">LAMID CORE · C02</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Workflow Engine</h1>
            <p className="text-gray-500 dark:text-white/45 text-sm max-w-xl">Consulting workflows in motion — active stages, blockers, cycle times, and completion rates across all client engagements.</p>
          </motion.div>
          <motion.div {...fadeUp(0.05)} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {KPIS.map((k) => (<div key={k.label} className="aivora-card border rounded-2xl p-5"><k.icon className="w-4 h-4 text-[#C12129] mb-3" strokeWidth={2.2} /><p className="text-2xl font-bold text-gray-900 dark:text-white leading-none mb-1.5">{k.value}</p><p className="text-xs text-gray-500 dark:text-white/45">{k.label}</p><p className="text-[10px] text-gray-400 dark:text-white/30 mt-1">{k.trend}</p></div>))}
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div {...fadeUp(0.1)} className="aivora-card border rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Workflow Signals</p>
              <div className="flex flex-col gap-3">{SIGNALS.map((s) => (<div key={s.title} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-white/6 last:border-0 last:pb-0"><AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${s.severity === "High" ? "text-[#C12129]" : "text-gray-400 dark:text-white/30"}`} strokeWidth={2} /><div><p className="text-sm text-gray-900 dark:text-white leading-snug">{s.title}</p><p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">{s.action}</p></div></div>))}</div>
            </motion.div>
            <motion.div {...fadeUp(0.15)} className="aivora-card border rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Workflow Stages</p>
              <div className="flex flex-col gap-2">{STAGES.map((s) => (<div key={s.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/6 last:border-0"><p className="text-sm text-gray-700 dark:text-white/70">{s.label}</p><div className="flex items-center gap-2"><span className="text-xs font-bold text-gray-900 dark:text-white">{s.count}</span><span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded-full">{s.status}</span></div></div>))}</div>
            </motion.div>
          </div>
          <motion.div {...fadeUp(0.2)} className="mt-10 flex flex-wrap gap-3">
            <Link href="/core-diagnostic" className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#C12129] hover:bg-[#a01a20] transition-colors shadow-[0_0_14px_rgba(193,33,41,0.35)] inline-flex items-center gap-1.5">Diagnostic Engine <ArrowUpRight className="w-3.5 h-3.5" /></Link>
            <Link href="/core-dashboard" className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#C12129]/25 text-[#C12129] hover:bg-[#C12129]/8 transition-colors">CORE Dashboard</Link>
          </motion.div>
        </div>
      </main>
    </DashboardTierGate>
  );
}
