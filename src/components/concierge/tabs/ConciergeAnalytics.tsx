"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign, TrendingUp, FolderKanban, CheckCircle2,
  AlertTriangle, Users, BarChart3, Target, ArrowUpRight,
} from "lucide-react";
import { mockConciergeAnalytics } from "@/mocks/mockConciergeAnalytics";
import type {
  ConciergeMonthlySpend,
  ConciergeMilestoneTrend,
  ConciergeTopProject,
  ConciergeProjectStatusBreakdown,
} from "@/types/project";

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, delay: i * 0.06, ease: [0.33, 1, 0.68, 1] as const },
});

const fmt = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;

const STATUS_COLOR: Record<string, string> = {
  active:    "text-blue-400  border-blue-500/30  bg-blue-500/10",
  completed: "text-green-400 border-green-500/30 bg-green-500/10",
  paused:    "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",
  disputed:  "text-red-400   border-red-500/30   bg-red-500/10",
};

export default function ConciergeAnalytics() {
  const [data] = useState(mockConciergeAnalytics);
  const { kpi, monthlySpend, statusBreakdown, milestoneTrend, topProjects } = data;

  const budgetPct    = Math.round((kpi.totalSpent / kpi.totalBudget) * 100);
  const milestonePct = Math.round((kpi.completedMilestones / kpi.totalMilestones) * 100);

  const maxSpend   = Math.max(...monthlySpend.map(m => m.budget));
  const maxMs      = Math.max(...milestoneTrend.map(m => m.total));
  const totalProjects = statusBreakdown.reduce((s, b) => s + b.count, 0);

  return (
    <div className="space-y-5">

      {/* ── Section label ── */}
      <motion.div {...fadeUp(0)} className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-[#c21219]" />
        <span className="text-xs font-semibold uppercase tracking-widest text-[#c21219]">Concierge Analytics</span>
      </motion.div>

      {/* ── KPI grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Budget",      value: fmt(kpi.totalBudget),        icon: DollarSign,   color: "text-yellow-400",  bg: "bg-yellow-500/10",  border: "border-yellow-500/20" },
          { label: "Spent to Date",     value: fmt(kpi.totalSpent),         icon: TrendingUp,   color: "text-white",       bg: "bg-white/5",        border: "border-white/10"      },
          { label: "Remaining",         value: fmt(kpi.totalRemaining),     icon: Target,       color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20"},
          { label: "Active Projects",   value: kpi.activeProjects,          icon: FolderKanban, color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20"   },
          { label: "Milestones Done",   value: `${kpi.completedMilestones}/${kpi.totalMilestones}`, icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
          { label: "Open Disputes",     value: kpi.openDisputes,            icon: AlertTriangle,color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20"    },
          { label: "Avg Progress",      value: `${kpi.avgProgress}%`,       icon: BarChart3,    color: "text-purple-400",  bg: "bg-purple-500/10",  border: "border-purple-500/20" },
          { label: "Team Size",         value: kpi.teamSize,                icon: Users,        color: "text-cyan-400",    bg: "bg-cyan-500/10",    border: "border-cyan-500/20"   },
        ].map(({ label, value, icon: Icon, color, bg, border }, i) => (
          <motion.div
            key={label}
            {...fadeUp(i + 1)}
            whileHover={{ y: -3, scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
            className={`rounded-xl border ${border} ${bg} p-4 cursor-default`}
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg} border ${border} mb-3`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <p className={`text-xl font-black ${color}`}>{value}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Budget utilisation bar ── */}
      <motion.div {...fadeUp(9)} className="rounded-xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-white">Budget Utilisation</p>
          <span className={`text-xs font-bold ${budgetPct > 85 ? "text-red-400" : budgetPct > 65 ? "text-yellow-400" : "text-emerald-400"}`}>
            {budgetPct}%
          </span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden mb-1.5">
          <motion.div
            className={`h-full rounded-full ${budgetPct > 85 ? "bg-red-500" : budgetPct > 65 ? "bg-yellow-500" : "bg-emerald-500"}`}
            initial={{ width: 0 }} animate={{ width: `${budgetPct}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-500">
          <span>{fmt(kpi.totalSpent)} spent</span>
          <span>{fmt(kpi.totalBudget)} total</span>
        </div>
      </motion.div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Monthly budget vs spend */}
        <motion.div {...fadeUp(10)} className="rounded-xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-semibold text-white mb-4">Monthly Budget vs Spend</p>
          <div className="flex items-end gap-2 h-36">
            {monthlySpend.map((m: ConciergeMonthlySpend, i) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end gap-0.5 h-28">
                  {/* Budget bar */}
                  <motion.div
                    className="flex-1 rounded-t-sm bg-white/10"
                    initial={{ height: 0 }}
                    animate={{ height: `${(m.budget / maxSpend) * 100}%` }}
                    transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
                  />
                  {/* Spent bar */}
                  <motion.div
                    className="flex-1 rounded-t-sm bg-[#c21219]"
                    initial={{ height: 0 }}
                    animate={{ height: `${(m.spent / maxSpend) * 100}%` }}
                    transition={{ duration: 0.7, delay: i * 0.08 + 0.1, ease: "easeOut" }}
                  />
                </div>
                <span className="text-[9px] text-gray-500">{m.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-[10px] text-gray-400"><span className="h-2 w-2 rounded-sm bg-white/20 inline-block" />Budget</span>
            <span className="flex items-center gap-1.5 text-[10px] text-gray-400"><span className="h-2 w-2 rounded-sm bg-[#c21219] inline-block" />Spent</span>
          </div>
        </motion.div>

        {/* Milestone completion trend */}
        <motion.div {...fadeUp(11)} className="rounded-xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-semibold text-white mb-4">Milestone Completion</p>
          <div className="flex items-end gap-2 h-36">
            {milestoneTrend.map((m: ConciergeMilestoneTrend, i) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative h-28">
                  {/* Total bar */}
                  <motion.div
                    className="absolute bottom-0 w-full rounded-t-sm bg-white/10"
                    initial={{ height: 0 }}
                    animate={{ height: `${(m.total / maxMs) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                  />
                  {/* Completed bar */}
                  <motion.div
                    className="absolute bottom-0 w-full rounded-t-sm bg-emerald-500"
                    initial={{ height: 0 }}
                    animate={{ height: `${(m.completed / maxMs) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.08 + 0.12, ease: "easeOut" }}
                  />
                </div>
                <span className="text-[9px] text-gray-500">{m.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-[10px] text-gray-400"><span className="h-2 w-2 rounded-sm bg-white/20 inline-block" />Total</span>
            <span className="flex items-center gap-1.5 text-[10px] text-gray-400"><span className="h-2 w-2 rounded-sm bg-emerald-500 inline-block" />Completed</span>
          </div>
        </motion.div>
      </div>

      {/* ── Project status breakdown + milestone pct ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Status breakdown */}
        <motion.div {...fadeUp(12)} className="rounded-xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-semibold text-white mb-4">Project Status Breakdown</p>
          <div className="space-y-3">
            {statusBreakdown.map((b: ConciergeProjectStatusBreakdown) => {
              const pct = Math.round((b.count / totalProjects) * 100);
              return (
                <div key={b.status}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400 capitalize">{b.status}</span>
                    <span className="text-white font-semibold">{b.count} <span className="text-gray-500 font-normal">({pct}%)</span></span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: b.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Milestone completion rate */}
        <motion.div {...fadeUp(13)} className="rounded-xl border border-white/10 bg-white/5 p-5 flex flex-col">
          <p className="text-xs font-semibold text-white mb-4">Overall Milestone Rate</p>
          <div className="flex-1 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <svg className="h-36 w-36 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
                <motion.circle
                  cx="18" cy="18" r="15.5" fill="none"
                  stroke="#22c55e" strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 15.5}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 15.5 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 15.5 * (1 - milestonePct / 100) }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                />
              </svg>
              <div className="absolute text-center">
                <p className="text-2xl font-black text-white">{milestonePct}%</p>
                <p className="text-[10px] text-gray-500">complete</p>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg bg-white/5 border border-white/8 py-2">
              <p className="text-base font-bold text-green-400">{kpi.completedMilestones}</p>
              <p className="text-[10px] text-gray-500">Done</p>
            </div>
            <div className="rounded-lg bg-white/5 border border-white/8 py-2">
              <p className="text-base font-bold text-gray-400">{kpi.totalMilestones - kpi.completedMilestones}</p>
              <p className="text-[10px] text-gray-500">Remaining</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Top projects table ── */}
      <motion.div {...fadeUp(14)} className="rounded-xl border border-white/10 bg-white/5 p-5">
        <p className="text-xs font-semibold text-white mb-4">Project Performance</p>
        <div className="space-y-2">
          {topProjects.map((p: ConciergeTopProject, i) => {
            const spentPct = Math.round((p.spent / p.budget) * 100);
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.06 }}
                whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                className="rounded-lg px-3 py-3 transition-colors"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-sm font-medium text-white truncate flex-1">{p.title}</p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border capitalize ${STATUS_COLOR[p.status] ?? "text-gray-400 border-gray-500/20 bg-gray-500/10"}`}>
                      {p.status}
                    </span>
                    <span className="text-[10px] text-gray-500">{p.pm}</span>
                    <ArrowUpRight className="h-3 w-3 text-gray-600" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-[#c21219]"
                      initial={{ width: 0 }}
                      animate={{ width: `${p.progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 + i * 0.06 }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 w-8 text-right">{p.progress}%</span>
                  <span className="text-[10px] text-gray-500">{fmt(p.spent)}/{fmt(p.budget)}</span>
                  <span className={`text-[10px] font-semibold ${spentPct > 90 ? "text-red-400" : "text-gray-500"}`}>
                    {spentPct}% used
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

    </div>
  );
}
