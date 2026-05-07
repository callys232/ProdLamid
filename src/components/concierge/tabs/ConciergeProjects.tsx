"use client";

import { motion } from "framer-motion";
import { FolderKanban, Clock, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";

const MOCK_PROJECTS = [
  { id: 1, title: "UNDP Community Health Programme", status: "active",   budget: 85000,  progress: 68, pm: "Dr. A. Okafor",  deadline: "Aug 2026" },
  { id: 2, title: "Federal Ministry HR Transformation", status: "active",   budget: 120000, progress: 35, pm: "Ms. T. Williams", deadline: "Dec 2026" },
  { id: 3, title: "NGO Digital Capacity Building", status: "completed", budget: 45000,  progress: 100, pm: "Mr. B. Adeyemi", deadline: "Apr 2026" },
  { id: 4, title: "Gender Equality Initiative — Lagos", status: "review",   budget: 62000,  progress: 90, pm: "Dr. A. Okafor",  deadline: "Jun 2026" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  active:    { label: "Active",    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", icon: TrendingUp },
  completed: { label: "Completed", color: "text-blue-400 bg-blue-500/10 border-blue-500/30",         icon: CheckCircle2 },
  review:    { label: "In Review", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",   icon: Clock },
  paused:    { label: "Paused",    color: "text-gray-400 bg-white/5 border-white/10",               icon: AlertCircle },
};

export default function ConciergeProjects() {
  const totalBudget = MOCK_PROJECTS.reduce((s, p) => s + p.budget, 0);
  const active = MOCK_PROJECTS.filter(p => p.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Projects",  value: MOCK_PROJECTS.length, color: "text-white" },
          { label: "Active",          value: active,                color: "text-emerald-400" },
          { label: "Total Value",     value: `$${totalBudget.toLocaleString()}`, color: "text-yellow-400" },
          { label: "Avg Progress",    value: `${Math.round(MOCK_PROJECTS.reduce((s, p) => s + p.progress, 0) / MOCK_PROJECTS.length)}%`, color: "text-blue-400" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Project cards */}
      <div className="space-y-3">
        {MOCK_PROJECTS.map((proj, i) => {
          const cfg = STATUS_CONFIG[proj.status] || STATUS_CONFIG.paused;
          const Icon = cfg.icon;
          return (
            <motion.div key={proj.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-white/10 bg-white/5 p-5 hover:border-white/20 transition">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <FolderKanban className="h-5 w-5 text-[#c21219] flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-white">{proj.title}</p>
                    <p className="text-xs text-gray-500">PM: {proj.pm} · Due: {proj.deadline}</p>
                  </div>
                </div>
                <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border ${cfg.color}`}>
                  <Icon className="h-3 w-3" />{cfg.label}
                </span>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{proj.progress}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <motion.div className="h-full rounded-full bg-[#c21219]"
                    initial={{ width: 0 }} animate={{ width: `${proj.progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 }} />
                </div>
              </div>

              <p className="text-xs text-yellow-400 mt-2">${proj.budget.toLocaleString()} total value</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
