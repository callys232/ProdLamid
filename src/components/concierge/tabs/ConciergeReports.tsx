"use client";

import { motion } from "framer-motion";
import { BarChart3, Download, TrendingUp, Users, DollarSign, Target } from "lucide-react";

const REPORTS = [
  { title: "Q2 2026 Executive Summary",       date: "1 Jun 2026", type: "Quarterly",  size: "2.4 MB" },
  { title: "UNDP Programme Impact Report",    date: "15 May 2026", type: "Impact",     size: "5.1 MB" },
  { title: "Gender Equality Initiative KPIs", date: "30 Apr 2026", type: "KPI Report", size: "1.8 MB" },
  { title: "HR Transformation Progress",      date: "1 Apr 2026",  type: "Progress",   size: "3.2 MB" },
];

const KPIs = [
  { label: "Project Completion Rate", value: "94%",   icon: Target,    color: "text-emerald-400" },
  { label: "Total Beneficiaries",     value: "12,400", icon: Users,     color: "text-blue-400"   },
  { label: "Budget Utilisation",      value: "81%",    icon: DollarSign,color: "text-yellow-400" },
  { label: "Consultant Satisfaction", value: "4.8/5",  icon: TrendingUp,color: "text-purple-400" },
];

export default function ConciergeReports() {
  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {KPIs.map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col items-center text-center">
            <kpi.icon className={`h-5 w-5 mb-2 ${kpi.color}`} />
            <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Reports list */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[#c21219]" />Generated Reports
        </h3>
        <div className="space-y-3">
          {REPORTS.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4 hover:border-white/20 transition">
              <div>
                <p className="text-sm font-medium text-white">{r.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{r.date} · {r.type} · {r.size}</p>
              </div>
              <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/15 text-gray-300 hover:border-white/40 hover:text-white transition">
                <Download className="h-3.5 w-3.5" />Download
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Request report */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-xl border border-dashed border-white/15 bg-white/5 p-5 text-center">
        <p className="text-sm text-gray-400 mb-3">Need a custom impact or progress report?</p>
        <button className="px-5 py-2 rounded-xl bg-[#c21219] hover:bg-red-700 text-white text-sm font-semibold transition">
          Request Custom Report
        </button>
      </motion.div>
    </div>
  );
}
