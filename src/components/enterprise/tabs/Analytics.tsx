"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  DollarSign, TrendingUp, FolderKanban, CheckCircle2,
  AlertTriangle, Users, BarChart3, Target, UserCheck,
  Lock, Briefcase, ArrowUpRight,
} from "lucide-react";
import { mockEnterpriseAnalytics } from "@/mocks/mockEnterpriseAnalytics";
import type {
  EnterpriseAnalytics,
  ConsultantPerformance,
  ProjectStatusDataPoint,
} from "@/types/enterprise";

/* ── helpers ─────────────────────────────────────────────── */
const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: i * 0.055, ease: [0.33, 1, 0.68, 1] as const },
});

const fmt  = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;
const card = "rounded-xl border border-white/10 bg-white/5 p-5";

const TOOLTIP = {
  contentStyle: {
    background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10, color: "#fff", fontSize: 11,
  },
  cursor: { fill: "rgba(37,99,235,0.05)" },
};

const ACCENT = "#2563EB";

/* ── component ───────────────────────────────────────────── */
export default function Analytics() {
  const [data, setData]       = useState<EnterpriseAnalytics>(mockEnterpriseAnalytics);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/enterprise/analytics")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.data?.kpi) setData(d.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#2563EB] border-t-transparent" />
      </div>
    );
  }

  const { kpi, monthlySpend, categoryData, statusBreakdown, milestoneTrend,
          hiringActivity, escrowActivity, topConsultants } = data;

  const budgetPct    = Math.round((kpi.totalSpent    / kpi.totalBudget)       * 100);
  const milestonePct = Math.round((kpi.completedMilestones / kpi.totalMilestones) * 100);
  const totalStatusProjects = statusBreakdown.reduce((s, b) => s + b.count, 0);
  const maxEscrow    = Math.max(...escrowActivity.map(e => e.funded));

  return (
    <div className="space-y-5 p-4">

      {/* ── Section label ── */}
      <motion.div {...fadeUp(0)} className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-[#2563EB]" />
        <span className="text-xs font-semibold uppercase tracking-widest text-[#2563EB]">Enterprise Analytics</span>
      </motion.div>

      {/* ── KPI grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Budget",      value: fmt(kpi.totalBudget),                             icon: DollarSign,  color: "text-yellow-400",  bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
          { label: "Spent to Date",     value: fmt(kpi.totalSpent),                              icon: TrendingUp,  color: "text-white",       bg: "bg-white/5",       border: "border-white/10"      },
          { label: "Remaining",         value: fmt(kpi.totalRemaining),                          icon: Target,      color: "text-emerald-400", bg: "bg-emerald-500/10",border: "border-emerald-500/20"},
          { label: "Active Projects",   value: kpi.activeProjects,                               icon: FolderKanban,color: "text-blue-400",    bg: "bg-blue-500/10",   border: "border-blue-500/20"   },
          { label: "Completed",         value: kpi.completedProjects,                            icon: CheckCircle2,color: "text-green-400",   bg: "bg-green-500/10",  border: "border-green-500/20"  },
          { label: "Milestone Rate",    value: `${milestonePct}%`,                               icon: CheckCircle2,color: "text-purple-400",  bg: "bg-purple-500/10", border: "border-purple-500/20" },
          { label: "Active Consultants",value: `${kpi.activeConsultants}/${kpi.totalConsultants}`,icon: UserCheck,  color: "text-cyan-400",    bg: "bg-cyan-500/10",   border: "border-cyan-500/20"   },
          { label: "Open Disputes",     value: kpi.openDisputes,                                 icon: AlertTriangle,color:"text-blue-400",     bg: "bg-blue-500/10",    border: "border-blue-500/20"    },
          { label: "Completion Rate",   value: `${kpi.avgCompletionRate}%`,                      icon: Target,      color: "text-emerald-400", bg: "bg-emerald-500/10",border: "border-emerald-500/20"},
          { label: "Avg Duration",      value: `${kpi.avgProjectDuration} mo`,                   icon: Briefcase,   color: "text-orange-400",  bg: "bg-orange-500/10", border: "border-orange-500/20" },
          { label: "Team Members",      value: kpi.memberCount,                                  icon: Users,       color: "text-pink-400",    bg: "bg-pink-500/10",   border: "border-pink-500/20"   },
          { label: "Pending Invites",   value: kpi.pendingInvites,                               icon: Users,       color: "text-gray-400",    bg: "bg-white/5",       border: "border-white/10"      },
        ].map(({ label, value, icon: Icon, color, bg, border }, i) => (
          <motion.div
            key={label} {...fadeUp(i + 1)}
            whileHover={{ y: -3, scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}
            className={`rounded-xl border ${border} ${bg} p-4 cursor-default`}
          >
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${bg} border ${border} mb-2.5`}>
              <Icon className={`h-3.5 w-3.5 ${color}`} />
            </div>
            <p className={`text-xl font-black ${color}`}>{value}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Budget utilisation bar ── */}
      <motion.div {...fadeUp(14)} className={card}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-white">Budget Utilisation</p>
          <span className={`text-xs font-bold ${budgetPct > 85 ? "text-blue-400" : budgetPct > 65 ? "text-yellow-400" : "text-emerald-400"}`}>
            {budgetPct}%
          </span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden mb-1.5">
          <motion.div
            className={`h-full rounded-full ${budgetPct > 85 ? "bg-blue-500" : budgetPct > 65 ? "bg-yellow-500" : "bg-emerald-500"}`}
            initial={{ width: 0 }} animate={{ width: `${budgetPct}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-500">
          <span>{fmt(kpi.totalSpent)} spent</span>
          <span>{fmt(kpi.totalBudget)} total</span>
        </div>
      </motion.div>

      {/* ── Spend + Category charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div {...fadeUp(15)} className={card}>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">Monthly Spend vs Budget</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlySpend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip {...TOOLTIP} formatter={(v, n) => [`$${Number(v).toLocaleString()}`, n === "spend" ? "Spent" : "Budget"]} />
              <Legend wrapperStyle={{ fontSize: 10, color: "#6b7280" }} />
              <Line type="monotone" dataKey="budget" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} strokeDasharray="4 3" dot={false} name="Budget" />
              <Line type="monotone" dataKey="spend"  stroke={ACCENT} strokeWidth={2.5} dot={{ fill: ACCENT, r: 3 }} activeDot={{ r: 5 }} name="Spent" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...fadeUp(16)} className={card}>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">Projects by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="category" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP} />
              <Bar dataKey="count" fill={ACCENT} radius={[4, 4, 0, 0]} name="Projects" />
              <Bar dataKey="spend" fill="rgba(37,99,235,0.25)" radius={[4, 4, 0, 0]} name="Spend ($)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ── Milestone trend + Hiring activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div {...fadeUp(17)} className={card}>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">Milestone Completion Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={milestoneTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP} />
              <Legend wrapperStyle={{ fontSize: 10, color: "#6b7280" }} />
              <Bar dataKey="total"     fill="rgba(255,255,255,0.1)" radius={[3, 3, 0, 0]} name="Total" />
              <Bar dataKey="completed" fill="#22c55e"               radius={[3, 3, 0, 0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...fadeUp(18)} className={card}>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">Hiring Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hiringActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP} />
              <Legend wrapperStyle={{ fontSize: 10, color: "#6b7280" }} />
              <Bar dataKey="bids"     fill="rgba(255,255,255,0.12)" radius={[3, 3, 0, 0]} name="Bids Received" />
              <Bar dataKey="accepted" fill={ACCENT}                 radius={[3, 3, 0, 0]} name="Accepted" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ── Project status breakdown + Escrow activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status breakdown */}
        <motion.div {...fadeUp(19)} className={card}>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">Project Pipeline</h3>
          <div className="space-y-3">
            {statusBreakdown.map((b: ProjectStatusDataPoint) => {
              const pct = Math.round((b.count / totalStatusProjects) * 100);
              return (
                <div key={b.status}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400 capitalize">{b.status}</span>
                    <span className="text-white font-semibold">{b.count} <span className="text-gray-500 font-normal">({pct}%)</span></span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: b.color }}
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Milestone donut */}
          <div className="mt-5 flex items-center gap-5">
            <div className="relative flex-shrink-0 flex items-center justify-center">
              <svg className="h-24 w-24 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="2.5" />
                <motion.circle cx="18" cy="18" r="15.5" fill="none" stroke="#22c55e" strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 15.5}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 15.5 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 15.5 * (1 - milestonePct / 100) }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }} />
              </svg>
              <div className="absolute text-center">
                <p className="text-base font-black text-white">{milestonePct}%</p>
                <p className="text-[9px] text-gray-500">done</p>
              </div>
            </div>
            <div className="flex-1 space-y-1.5">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Milestones</p>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Completed</span>
                <span className="text-green-400 font-semibold">{kpi.completedMilestones}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Remaining</span>
                <span className="text-white font-semibold">{kpi.totalMilestones - kpi.completedMilestones}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Disputes open</span>
                <span className="text-blue-400 font-semibold">{kpi.openDisputes}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Disputes resolved</span>
                <span className="text-gray-400 font-semibold">{kpi.resolvedDisputes}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Escrow activity */}
        <motion.div {...fadeUp(20)} className={card}>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">Escrow Activity</h3>
          <div className="flex items-end gap-1.5 h-36 mb-3">
            {escrowActivity.map((e, i) => (
              <div key={e.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col justify-end gap-px h-28">
                  <motion.div className="w-full rounded-t-sm bg-emerald-500/60"
                    initial={{ height: 0 }} animate={{ height: `${(e.released / maxEscrow) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.07, ease: "easeOut" }} />
                  <motion.div className="w-full bg-[#2563EB]/70"
                    initial={{ height: 0 }} animate={{ height: `${((e.funded - e.released) / maxEscrow) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.07 + 0.08, ease: "easeOut" }} />
                  <motion.div className="w-full rounded-b-sm bg-blue-800/50"
                    initial={{ height: 0 }} animate={{ height: `${(e.disputed / maxEscrow) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.07 + 0.14, ease: "easeOut" }} />
                </div>
                <span className="text-[9px] text-gray-500">{e.month}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-[10px] text-gray-400"><span className="h-2 w-2 rounded-sm bg-emerald-500/60 inline-block" />Released</span>
            <span className="flex items-center gap-1.5 text-[10px] text-gray-400"><span className="h-2 w-2 rounded-sm bg-[#2563EB]/70 inline-block" />Held</span>
            <span className="flex items-center gap-1.5 text-[10px] text-gray-400"><span className="h-2 w-2 rounded-sm bg-blue-800/50 inline-block" />Disputed</span>
          </div>
        </motion.div>
      </div>

      {/* ── Consultant performance ── */}
      <motion.div {...fadeUp(21)} className={card}>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">Consultant Performance</h3>
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-gray-500">
                <th className="pb-3 text-left font-medium">Consultant</th>
                <th className="pb-3 text-left font-medium">Specialty</th>
                <th className="pb-3 text-center font-medium">Projects</th>
                <th className="pb-3 text-center font-medium">Rating</th>
                <th className="pb-3 text-center font-medium">On-time</th>
                <th className="pb-3 text-right font-medium">Total Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {topConsultants.map((c: ConsultantPerformance, i) => (
                <motion.tr
                  key={c.name}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.06 }}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                  className="transition"
                >
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2563EB]/15 text-xs font-bold text-[#2563EB] flex-shrink-0">
                        {c.avatar}
                      </div>
                      <span className="font-medium text-white">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-500 text-xs">{c.specialty}</td>
                  <td className="py-3 text-center text-gray-400">{c.projects}</td>
                  <td className="py-3 text-center font-semibold text-yellow-400">★ {c.avgRating}</td>
                  <td className="py-3 text-center">
                    <span className={`text-xs font-semibold ${c.onTime >= 98 ? "text-green-400" : c.onTime >= 90 ? "text-yellow-400" : "text-blue-400"}`}>
                      {c.onTime}%
                    </span>
                  </td>
                  <td className="py-3 text-right font-semibold text-emerald-400">${c.totalPaid.toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Summary footer row ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Lock,    label: "Total Escrow Funded",   value: fmt(escrowActivity.reduce((s, e) => s + e.funded,   0)), color: "text-[#2563EB]" },
          { icon: Lock,    label: "Total Escrow Released",  value: fmt(escrowActivity.reduce((s, e) => s + e.released, 0)), color: "text-emerald-400" },
          { icon: ArrowUpRight, label: "Bids → Accepted",  value: `${hiringActivity.reduce((s, e) => s + e.accepted, 0)} / ${hiringActivity.reduce((s, e) => s + e.bids, 0)}`, color: "text-blue-400" },
        ].map(({ icon: Icon, label, value, color }, i) => (
          <motion.div key={label} {...fadeUp(22 + i)}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 flex items-center gap-3">
            <Icon className={`h-4 w-4 flex-shrink-0 ${color}`} />
            <div>
              <p className={`text-sm font-bold ${color}`}>{value}</p>
              <p className="text-[10px] text-gray-500">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
