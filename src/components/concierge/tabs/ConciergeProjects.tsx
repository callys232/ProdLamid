"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderKanban, Clock, CheckCircle2, AlertCircle, TrendingUp,
  MessageSquare, Lock, ArrowRight, X, DollarSign, Users,
  BarChart3, Activity, ShieldAlert, ExternalLink, Calendar,
  ChevronRight, AlertTriangle, Tag,
} from "lucide-react";
import Link from "next/link";
import type { Milestone, MilestoneStatus } from "@/types/project";
import {
  mockConciergeProjects,
  type ConciergeProject,
  type ConciergeProjectMilestone,
} from "@/mocks/mockConciergeProjects";

/* ── DB milestone status → MilestoneStatus (frontend canonical) ───── */
const normaliseMilestoneStatus = (raw: string): MilestoneStatus => {
  const map: Record<string, MilestoneStatus> = {
    started:  "in_progress",
    dispute:  "disputed",
    stopped:  "cancelled",
    approved: "completed",
  };
  return (map[raw] ?? raw) as MilestoneStatus;
};

/* ── Milestone colour config (keyed by MilestoneStatus values) ───── */
const M_CFG: Record<string, { card: string; badge: string; dot: string; bar: string; pct: string; shadow: string }> = {
  completed:   { card: "border-green-500/30  bg-green-500/8",   badge: "text-green-400  border-green-500/30  bg-green-500/10",   dot: "bg-green-400",   bar: "bg-green-500",   pct: "text-green-400",   shadow: "0 6px 20px rgba(34,197,94,0.2)"  },
  in_progress: { card: "border-yellow-500/30 bg-yellow-500/8",  badge: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",  dot: "bg-yellow-400",  bar: "bg-yellow-500",  pct: "text-yellow-400",  shadow: "0 6px 20px rgba(234,179,8,0.2)"  },
  disputed:    { card: "border-red-500/40    bg-red-500/10",    badge: "text-red-400    border-red-500/30    bg-red-500/10",     dot: "bg-red-400",     bar: "bg-red-500",     pct: "text-red-400",     shadow: "0 6px 20px rgba(239,68,68,0.2)"  },
  funded:      { card: "border-purple-500/30 bg-purple-500/8",  badge: "text-purple-400 border-purple-500/30 bg-purple-500/10",  dot: "bg-purple-400",  bar: "bg-purple-500",  pct: "text-purple-400",  shadow: "0 6px 20px rgba(168,85,247,0.2)" },
  released:    { card: "border-blue-500/30   bg-blue-500/8",    badge: "text-blue-400   border-blue-500/30   bg-blue-500/10",   dot: "bg-blue-400",    bar: "bg-blue-500",    pct: "text-blue-400",    shadow: "0 6px 20px rgba(59,130,246,0.2)"  },
  pending:     { card: "border-white/10      bg-white/5",        badge: "text-gray-400   border-gray-500/20   bg-gray-500/10",   dot: "bg-gray-500",    bar: "bg-gray-600",    pct: "text-gray-400",    shadow: "0 6px 20px rgba(0,0,0,0.3)"      },
  cancelled:   { card: "border-white/8       bg-white/3",        badge: "text-gray-500   border-gray-600/20   bg-gray-600/10",   dot: "bg-gray-600",    bar: "bg-gray-700",    pct: "text-gray-500",    shadow: "0 6px 20px rgba(0,0,0,0.2)"      },
};

/* ── Project status config — keyed by real DB values ─────────────── */
const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  open:      { label: "Open",      color: "text-blue-400   bg-blue-500/10   border-blue-500/30",    icon: TrendingUp  },
  ongoing:   { label: "Ongoing",   color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", icon: TrendingUp  },
  completed: { label: "Completed", color: "text-blue-400   bg-blue-500/10   border-blue-500/30",    icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-gray-400   bg-white/5       border-white/10",        icon: AlertCircle  },
};

const ACTIVITY_DOT: Record<string, string> = {
  success: "bg-emerald-500",
  info:    "bg-blue-500",
  warning: "bg-yellow-500",
  dispute: "bg-red-500",
};

interface Props {
  onOpenMessaging?: (projectId: string) => void;
  onOpenEscrow?: () => void;
}

/* ── Main component ──────────────────────────────────────────────── */
export default function ConciergeProjects({ onOpenMessaging, onOpenEscrow }: Props) {
  const [selected, setSelected] = useState<ConciergeProject | null>(null);
  const [PROJECTS, setProjects] = useState<ConciergeProject[]>(mockConciergeProjects);

  // Fetch real projects; fall back to mock if API unavailable or returns empty
  useEffect(() => {
    fetch("/api/projects?role=owner&limit=20")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        const list: ConciergeProject[] = Array.isArray(d?.data) ? d.data.map((p: any) => ({
          id:          p._id ?? p.id,
          _id:         p._id,
          title:       p.title,
          status:      p.status,          // keep real DB values: "open" | "ongoing" | "completed" | "cancelled"
          category:    p.category ?? "General",
          budget:      p.budget ?? 0,
          spent:       p.spent ?? 0,
          progress:    p.milestoneProgress ?? 0,
          pm:          p.pm ?? "Your PM",
          deadline:    p.deadline ?? "",
          description: p.description ?? "",
          skills:      p.skills ?? [],
          consultants: (p.consultants ?? []).map((c: any) => ({
            name: c.username ?? c.name ?? "Consultant",
            role: "Consultant",
          })),
          milestones: (p.milestones ?? []).map((m: any) => ({
            _id:           m._id,
            id:            m._id ?? m.id,
            title:         m.title,
            description:   m.description,
            progress:      m.progress ?? 0,
            dueDate:       m.dueDate,
            status:        normaliseMilestoneStatus(m.status ?? "pending"),
            disputeReason: m.notes,      // DB stores dispute detail in notes field
          })),
          activity: [],
        })) : [];
        if (list.length) setProjects(list);
      })
      .catch(() => {}); // keep mock on error
  }, []);

  const totalBudget = PROJECTS.reduce((s, p) => s + p.budget, 0);
  const active = PROJECTS.filter(p => p.status === "active").length;

  return (
    <>
      <div className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Projects", value: PROJECTS.length,                                                                    color: "text-white"        },
            { label: "Active",         value: active,                                                                             color: "text-emerald-400"  },
            { label: "Total Value",    value: `$${totalBudget.toLocaleString()}`,                                                 color: "text-yellow-400"   },
            { label: "Avg Progress",   value: `${Math.round(PROJECTS.reduce((s, p) => s + p.progress, 0) / PROJECTS.length)}%`,  color: "text-blue-400"     },
          ].map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.04, y: -3, boxShadow: "0 10px 28px rgba(0,0,0,0.35)" }}
              className="rounded-xl border border-white/10 bg-white/5 p-4 text-center cursor-default">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick-access row */}
        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.05, y: -2, boxShadow: "0 6px 20px rgba(194,18,25,0.25)" }} whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.15 }}
            onClick={onOpenEscrow}
            className="flex items-center gap-2 rounded-lg border border-[#c21219]/30 bg-[#c21219]/10 px-4 py-2 text-xs font-semibold text-[#c21219] transition hover:bg-[#c21219]/20"
          >
            <Lock className="h-3.5 w-3.5" /> Escrow & Payments
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, y: -2, boxShadow: "0 6px 16px rgba(0,0,0,0.3)" }} whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.15 }}
            onClick={() => onOpenMessaging?.("")}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            <MessageSquare className="h-3.5 w-3.5" /> Messaging
          </motion.button>
        </div>

        {/* Project cards */}
        <div className="space-y-3">
          {PROJECTS.map((proj, i) => {
            const cfg = STATUS_CONFIG[proj.status] || STATUS_CONFIG.open;
            const Icon = cfg.icon;
            const hasDispute = proj.milestones.some(m => m.status === "disputed");
            return (
              <motion.button
                key={proj.id}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.01, y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.35)", borderColor: hasDispute ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelected(proj)}
                className={`w-full rounded-xl border bg-white/5 p-5 text-left ${hasDispute ? "border-red-500/25" : "border-white/10"}`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <FolderKanban className={`h-5 w-5 flex-shrink-0 ${hasDispute ? "text-red-400" : "text-[#c21219]"}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{proj.title}</p>
                      <p className="text-xs text-gray-500">PM: {proj.pm} · Due: {proj.deadline}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {hasDispute && (
                      <span className="flex items-center gap-1 text-[10px] text-red-400 border border-red-500/30 bg-red-500/10 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="h-2.5 w-2.5" /> Dispute
                      </span>
                    )}
                    <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border ${cfg.color}`}>
                      <Icon className="h-3 w-3" />{cfg.label}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{proj.milestones.filter(m => m.status === "completed").length}/{proj.milestones.length} milestones · {proj.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${hasDispute ? "bg-red-500" : "bg-[#c21219]"}`}
                      initial={{ width: 0 }} animate={{ width: `${proj.progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.1 }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-yellow-400">${proj.budget.toLocaleString()} total value</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                    <span>View details</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Project detail modal ────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <ProjectDetailModal
            project={selected}
            onClose={() => setSelected(null)}
            onOpenMessaging={onOpenMessaging}
            onOpenEscrow={onOpenEscrow}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Modal ───────────────────────────────────────────────────────── */
function ProjectDetailModal({ project: p, onClose, onOpenMessaging, onOpenEscrow }: {
  project: ConciergeProject;
  onClose: () => void;
  onOpenMessaging?: (id: string) => void;
  onOpenEscrow?: () => void;
}) {
  const [tab, setTab] = useState<"overview" | "milestones" | "report">("overview");

  const cfg        = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.open;
  const StatusIcon = cfg.icon;
  const completedM = p.milestones.filter(m => m.status === "completed").length;
  const disputes   = p.milestones.filter(m => m.status === "disputed");
  const remaining  = p.budget - p.spent;
  const spentPct   = Math.round((p.spent / p.budget) * 100);
  const hasDispute = disputes.length > 0;

  const TABS = [
    { key: "overview",   label: "Overview",   icon: FolderKanban },
    { key: "milestones", label: "Milestones", icon: CheckCircle2 },
    { key: "report",     label: "Report",     icon: BarChart3    },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 20 }}
        transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] as const }}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl overflow-hidden"
      >
        {/* ── Sticky header ──────────────────────────────────────── */}
        <div className="flex-shrink-0 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md px-4 pt-4 pb-0">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <FolderKanban className={`h-5 w-5 flex-shrink-0 ${hasDispute ? "text-red-400" : "text-[#c21219]"}`} />
                <h2 className="text-base font-bold text-white leading-snug">{p.title}</h2>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${cfg.color}`}>
                  <StatusIcon className="h-3 w-3" />{cfg.label}
                </span>
                {hasDispute && (
                  <span className="flex items-center gap-1 text-[10px] text-red-400 border border-red-500/30 bg-red-500/10 px-2 py-0.5 rounded-full">
                    <ShieldAlert className="h-3 w-3" /> {disputes.length} Dispute{disputes.length > 1 ? "s" : ""}
                  </span>
                )}
                <span className="text-[11px] text-gray-500 flex items-center gap-1">
                  <Tag className="h-3 w-3" />{p.category}
                </span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.15 }}
              onClick={onClose}
              className="flex-shrink-0 rounded-xl border border-white/10 bg-white/5 p-2 text-gray-400 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
                  tab === key
                    ? "border-[#c21219] text-white"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />{label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Scrollable body ─────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

          {/* ───────────── OVERVIEW TAB ───────────── */}
          {tab === "overview" && (
            <>
              {/* Dispute banner */}
              {hasDispute && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3.5">
                  <ShieldAlert className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-300">{disputes.length} Active Dispute{disputes.length > 1 ? "s" : ""}</p>
                    <p className="text-xs text-red-400/80 mt-0.5">Mediation team has been notified. See Milestones tab for details.</p>
                  </div>
                </motion.div>
              )}

              {/* Key stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Budget",       value: `$${p.budget.toLocaleString()}`,   color: "text-yellow-400", icon: DollarSign  },
                  { label: "Spent",        value: `$${p.spent.toLocaleString()}`,    color: "text-white",      icon: TrendingUp  },
                  { label: "Remaining",    value: `$${remaining.toLocaleString()}`,  color: "text-emerald-400", icon: Lock       },
                  { label: "Consultants",  value: p.consultants.length,              color: "text-blue-400",   icon: Users       },
                ].map(({ label, value, color, icon: Icon }, i) => (
                  <motion.div key={label}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.04, y: -2 }}
                    className="rounded-xl border border-white/10 bg-white/5 p-3 text-center cursor-default">
                    <Icon className={`h-4 w-4 mx-auto mb-1 ${color}`} />
                    <p className={`text-base font-bold ${color}`}>{value}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Description */}
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-2">About this project</p>
                <p className="text-sm text-gray-300 leading-relaxed">{p.description}</p>
              </div>

              {/* Meta row */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-white/8 bg-white/5 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Dedicated PM</p>
                  <p className="font-medium text-white">{p.pm}</p>
                </div>
                <div className="rounded-xl border border-white/8 bg-white/5 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Deadline</p>
                  <p className="font-medium text-white flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-gray-500" />{p.deadline}
                  </p>
                </div>
              </div>

              {/* Skills */}
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-2">Skills & Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {p.skills.map(s => (
                    <span key={s} className="rounded-full border border-[#c21219]/30 bg-[#c21219]/10 px-3 py-0.5 text-[11px] text-[#c21219]">{s}</span>
                  ))}
                </div>
              </div>

              {/* Consultants */}
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-2">Consultants</p>
                <div className="space-y-2">
                  {p.consultants.map((c, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                      className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 px-4 py-2.5">
                      <div className="h-8 w-8 rounded-full bg-[#c21219]/15 border border-[#c21219]/20 flex items-center justify-center text-xs font-bold text-[#c21219] flex-shrink-0">
                        {c.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{c.name}</p>
                        <p className="text-[11px] text-gray-500">{c.role}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Overall progress */}
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-2">Overall Progress</p>
                <div className="rounded-xl border border-white/8 bg-white/5 px-4 py-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">{completedM} of {p.milestones.length} milestones complete</span>
                    <span className="font-bold text-white">{p.progress}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${hasDispute ? "bg-red-500" : "bg-[#c21219]"}`}
                      initial={{ width: 0 }} animate={{ width: `${p.progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ───────────── MILESTONES TAB ───────────── */}
          {tab === "milestones" && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-[11px] uppercase tracking-widest text-gray-500">
                  {completedM} of {p.milestones.length} complete
                </p>
                {hasDispute && (
                  <span className="flex items-center gap-1 text-[10px] text-red-400">
                    <ShieldAlert className="h-3.5 w-3.5" /> {disputes.length} disputed
                  </span>
                )}
              </div>

              {/* Dispute detail cards */}
              {disputes.map((m, i) => (
                <motion.div key={m.id}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                  className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3.5">
                  <div className="flex items-start gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-300">{m.title}</p>
                      <p className="text-[11px] text-red-400/70">Disputed milestone</p>
                    </div>
                  </div>
                  {m.disputeReason && (
                    <p className="text-xs text-red-300/80 leading-relaxed mt-1 pl-6">{m.disputeReason}</p>
                  )}
                </motion.div>
              ))}

              {/* Milestone cards grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {p.milestones.map((m, mi) => {
                  const mcfg = M_CFG[m.status] ?? M_CFG.pending;
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.04, y: -2, boxShadow: mcfg.shadow }}
                      transition={{ delay: mi * 0.05, duration: 0.15 }}
                      className={`rounded-xl border px-3 py-3 cursor-default ${mcfg.card}`}
                    >
                      <div className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full border mb-2 capitalize ${mcfg.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${mcfg.dot}`} />
                        {m.status.replace("_", " ")}
                      </div>
                      <div className="flex items-start gap-1 mb-2">
                        <span className="text-[10px] text-gray-500 mt-0.5 flex-shrink-0">#{mi + 1}</span>
                        <p className="text-xs text-white font-medium leading-snug line-clamp-3">{m.title}</p>
                      </div>
                      {m.description && (
                        <p className="text-[10px] text-gray-500 leading-snug line-clamp-2 mb-2">{m.description}</p>
                      )}
                      <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden mb-1.5">
                        <motion.div
                          className={`h-full rounded-full ${mcfg.bar}`}
                          initial={{ width: 0 }} animate={{ width: `${m.progress}%` }}
                          transition={{ duration: 0.6, ease: "easeOut", delay: mi * 0.06 }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold ${mcfg.pct}`}>{m.progress}%</span>
                        <span className="text-[10px] text-gray-600">
                          {new Date(m.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}

          {/* ───────────── REPORT TAB ───────────── */}
          {tab === "report" && (
            <>
              {/* Budget breakdown */}
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-3">Financial Summary</p>
                <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 space-y-3">
                  {[
                    { label: "Total Budget",  value: p.budget,           color: "bg-white/20",      pct: 100         },
                    { label: "Spent to Date", value: p.spent,            color: "bg-[#c21219]",     pct: spentPct    },
                    { label: "Remaining",     value: remaining,          color: "bg-emerald-500",   pct: 100 - spentPct },
                  ].map(({ label, value, color, pct }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">{label}</span>
                        <span className="font-semibold text-white">${value.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${color}`}
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="pt-1 border-t border-white/8 flex justify-between text-xs">
                    <span className="text-gray-500">Budget utilisation</span>
                    <span className={`font-bold ${spentPct > 90 ? "text-red-400" : spentPct > 70 ? "text-yellow-400" : "text-emerald-400"}`}>
                      {spentPct}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Milestone status breakdown */}
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-3">Milestone Breakdown</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(["completed", "in_progress", "disputed", "funded", "pending"] as const).map(status => {
                    const count = p.milestones.filter(m => m.status === status).length;
                    if (!count && status !== "completed") return null;
                    const mcfg = M_CFG[status];
                    return (
                      <motion.div key={status}
                        whileHover={{ scale: 1.04, y: -2 }}
                        className={`rounded-xl border px-4 py-3 text-center cursor-default ${mcfg.card}`}>
                        <p className={`text-2xl font-bold ${mcfg.pct}`}>{count}</p>
                        <p className={`text-[10px] capitalize mt-0.5 ${mcfg.pct}`}>{status.replace("_", " ")}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Activity log */}
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5" /> Recent Activity
                </p>
                <div className="space-y-0 relative">
                  <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/8" />
                  {(p.activity ?? []).map((a, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                      whileHover={{ x: 4 }}
                      className="flex items-start gap-3 py-2.5 pl-1 cursor-default">
                      <span className={`h-3.5 w-3.5 rounded-full flex-shrink-0 mt-0.5 border-2 border-[#0a0a0a] ${ACTIVITY_DOT[a.type]}`} />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-300 leading-snug">{a.text}</p>
                        <p className="text-[10px] text-gray-600 mt-0.5">{a.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Sticky footer actions ────────────────────────────────── */}
        <div className="flex-shrink-0 border-t border-white/10 bg-[#0a0a0a] px-4 py-3 flex flex-wrap items-center gap-3">
          <motion.div whileHover={{ scale: 1.05, y: -1, boxShadow: "0 6px 20px rgba(194,18,25,0.3)" }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.15 }}>
            <Link
              href={`/projects/${p.id}/workspace`}
              className="flex items-center gap-2 rounded-xl border border-[#c21219]/30 bg-[#c21219]/10 px-4 py-2.5 text-xs font-semibold text-[#c21219] transition hover:bg-[#c21219]/20"
            >
              Open Workspace <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.15 }}
            onClick={() => { onOpenMessaging?.(p.id); onClose(); }}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            <MessageSquare className="h-3.5 w-3.5" /> Messages
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.15 }}
            onClick={() => { onOpenEscrow?.(); onClose(); }}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            <Lock className="h-3.5 w-3.5" /> Escrow
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={onClose}
            className="ml-auto text-xs text-gray-500 hover:text-white transition px-3 py-2"
          >
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
