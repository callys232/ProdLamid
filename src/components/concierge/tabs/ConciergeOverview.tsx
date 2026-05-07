"use client";

import { motion } from "framer-motion";
import {
  FolderKanban, DollarSign, UserCheck, BarChart3,
  TrendingUp, Clock, CheckCircle2, Star,
} from "lucide-react";

const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.07, ease: [0.33, 1, 0.68, 1] },
});

const STATS = [
  { label: "Active Projects",     value: "4",       icon: FolderKanban, color: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/20" },
  { label: "Total Value",         value: "$362,000", icon: DollarSign,   color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  { label: "Dedicated PM",        value: "Assigned", icon: UserCheck,    color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { label: "Avg. Progress",       value: "73%",      icon: BarChart3,    color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
];

const RECENT = [
  { title: "UNDP Community Health Programme",      status: "active",    progress: 68, budget: "$85,000" },
  { title: "Federal Ministry HR Transformation",   status: "active",    progress: 35, budget: "$120,000" },
  { title: "Gender Equality Initiative — Lagos",   status: "review",    progress: 90, budget: "$62,000" },
  { title: "NGO Digital Capacity Building",        status: "completed", progress: 100, budget: "$45,000" },
];

const STATUS_STYLE: Record<string, string> = {
  active:    "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  review:    "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  completed: "text-blue-400 bg-blue-500/10 border-blue-500/30",
};

const ACTIVITY = [
  { text: "Milestone approved — UNDP Health Programme Phase 2",  time: "2 hours ago" },
  { text: "PM Dr. Amaka Okafor scheduled your weekly check-in",  time: "Yesterday" },
  { text: "Custom Q2 Impact Report is ready for download",        time: "2 days ago" },
  { text: "New consultant matched for HR Transformation project", time: "3 days ago" },
];

export default function ConciergeOverview() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div {...fadeUp(0)}>
        <div className="flex items-center gap-2 mb-1">
          <Star className="h-4 w-4 text-[#c21219]" />
          <span className="text-xs font-semibold text-[#c21219] uppercase tracking-widest">Concierge Portal</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="text-sm text-gray-400 mt-0.5">Here's your executive summary across all active programmes.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div key={s.label} {...fadeUp(i)}
            className={`rounded-xl border p-4 flex flex-col gap-2 ${s.bg} ${s.border}`}>
            <s.icon className={`h-5 w-5 ${s.color}`} />
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Projects summary */}
      <motion.div {...fadeUp(4)}>
        <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <FolderKanban className="h-4 w-4 text-[#c21219]" />Active Programmes
        </h2>
        <div className="space-y-3">
          {RECENT.map((p, i) => (
            <motion.div key={p.title} {...fadeUp(5 + i)}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 hover:border-white/20 transition">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-sm font-medium text-white">{p.title}</p>
                  <p className="text-xs text-yellow-400 mt-0.5">{p.budget}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border capitalize ${STATUS_STYLE[p.status]}`}>
                  {p.status}
                </span>
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                  <span>Progress</span><span>{p.progress}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <motion.div className="h-full rounded-full bg-[#c21219]"
                    initial={{ width: 0 }}
                    animate={{ width: `${p.progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 + i * 0.1 }} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent activity */}
      <motion.div {...fadeUp(9)}>
        <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#c21219]" />Recent Activity
        </h2>
        <div className="space-y-2">
          {ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-200">{a.text}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
