"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderKanban, DollarSign, UserCheck, BarChart3,
  TrendingUp, Clock, CheckCircle2, Star, ChevronDown,
  ArrowRight, Lock, MessageSquare, AlertCircle, RefreshCw,
} from "lucide-react";
import Link from "next/link";
import type { MilestoneStatus } from "@/types/project";
import { mockConciergeProjects, type ConciergeProject } from "@/mocks/mockConciergeProjects";

/* ── Normalise DB milestone status ─────────────────────────────── */
const normMilestone = (raw: string): MilestoneStatus => ({
  started: "in_progress", dispute: "disputed",
  stopped: "cancelled",   approved: "completed",
} as Record<string, MilestoneStatus>)[raw] ?? (raw as MilestoneStatus);

/* ── Animation helpers ─────────────────────────────────────────── */
const fadeUp = (i = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: i * 0.07, ease: [0.33, 1, 0.68, 1] as const },
});

/* ── Milestone colour config ───────────────────────────────────── */
const MILESTONE_CONFIG: Record<string, { card: string; badge: string; dot: string; bar: string; pct: string; shadow: string }> = {
  completed:   { card: "border-green-500/30  bg-green-500/8",   badge: "text-green-400  border-green-500/30  bg-green-500/10",   dot: "bg-green-400",   bar: "bg-green-500",   pct: "text-green-400",   shadow: "0 6px 20px rgba(34,197,94,0.2)"   },
  in_progress: { card: "border-yellow-500/30 bg-yellow-500/8",  badge: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",  dot: "bg-yellow-400",  bar: "bg-yellow-500",  pct: "text-yellow-400",  shadow: "0 6px 20px rgba(234,179,8,0.2)"   },
  disputed:    { card: "border-red-500/30    bg-red-500/8",     badge: "text-red-400    border-red-500/30    bg-red-500/10",     dot: "bg-red-400",     bar: "bg-red-500",     pct: "text-red-400",     shadow: "0 6px 20px rgba(239,68,68,0.2)"   },
  funded:      { card: "border-purple-500/30 bg-purple-500/8",  badge: "text-purple-400 border-purple-500/30 bg-purple-500/10",  dot: "bg-purple-400",  bar: "bg-purple-500",  pct: "text-purple-400",  shadow: "0 6px 20px rgba(168,85,247,0.2)"  },
  pending:     { card: "border-white/10      bg-white/5",        badge: "text-gray-400   border-gray-500/20   bg-gray-500/10",   dot: "bg-gray-500",    bar: "bg-gray-600",    pct: "text-gray-400",    shadow: "0 6px 20px rgba(0,0,0,0.3)"       },
  cancelled:   { card: "border-white/8       bg-white/3",        badge: "text-gray-500   border-gray-600/20   bg-gray-600/10",   dot: "bg-gray-600",    bar: "bg-gray-700",    pct: "text-gray-500",    shadow: "0 6px 20px rgba(0,0,0,0.2)"       },
};

const STATUS_STYLE: Record<string, string> = {
  active:    "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  ongoing:   "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  review:    "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  open:      "text-blue-400   bg-blue-500/10   border-blue-500/30",
  completed: "text-blue-400 bg-blue-500/10 border-blue-500/30",
};

/* ── Skeleton card ─────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 animate-pulse">
      <div className="h-5 w-5 rounded bg-white/10 mb-3" />
      <div className="h-7 w-16 rounded bg-white/10 mb-2" />
      <div className="h-3 w-24 rounded bg-white/10" />
    </div>
  );
}

function SkeletonProject() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-4 w-48 rounded bg-white/10" />
        <div className="h-4 w-16 rounded bg-white/10" />
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/10" />
    </div>
  );
}

/* ── Main component ────────────────────────────────────────────── */
export default function ConciergeOverview() {
  const [projects,    setProjects]    = useState<ConciergeProject[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(false);
  const [expandedId,  setExpandedId]  = useState<string | null>(null);
  const [retryKey,    setRetryKey]    = useState(0);

  /* ── Fetch projects from real API → mock fallback ──────────── */
  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/projects?role=owner&limit=20");
      if (!res.ok) throw new Error("api_error");
      const d = await res.json();

      const list: ConciergeProject[] = Array.isArray(d?.data) && d.data.length
        ? d.data.map((p: any) => ({
            id:          p._id ?? p.id,
            _id:         p._id,
            title:       p.title,
            status:      p.status,
            category:    p.category ?? "General",
            budget:      p.budget ?? 0,
            spent:       p.spent ?? 0,
            progress:    p.milestoneProgress ?? 0,
            pm:          p.pm ?? "Your Dedicated PM",
            deadline:    p.deadline ?? "TBD",
            description: p.description ?? "",
            skills:      p.skills ?? [],
            consultants: (p.consultants ?? []).map((c: any) => ({
              name: c.username ?? c.name ?? "Consultant",
              role: "Consultant",
            })),
            milestones: (p.milestones ?? []).map((m: any) => ({
              _id:      m._id,
              id:       m._id ?? m.id,
              title:    m.title,
              progress: m.progress ?? 0,
              dueDate:  m.dueDate ?? "",
              status:   normMilestone(m.status ?? "pending"),
              description: m.description,
            })),
            activity: [],
          }))
        : mockConciergeProjects; // fallback to mock when API returns empty

      setProjects(list);
    } catch {
      // On network error, fall back to mock data (dev-friendly)
      setProjects(mockConciergeProjects);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects, retryKey]);

  /* ── Computed stats from real data ─────────────────────────── */
  const activeProjects = projects.filter(p =>
    p.status === "ongoing" || p.status === "active"
  ).length;

  const totalValue = projects.reduce((s, p) => s + (p.budget ?? 0), 0);

  const pmAssigned = projects.filter(p =>
    p.pm && p.pm !== "Your Dedicated PM" && p.pm !== "Your PM"
  ).length;
  const pmRate = projects.length
    ? Math.round((pmAssigned / projects.length) * 100)
    : 0;

  const avgProgress = projects.length
    ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length)
    : 0;

  const STATS = [
    {
      label: "Active Projects",
      value: loading ? "—" : String(activeProjects),
      icon: FolderKanban,
      color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20",
    },
    {
      label: "Total Value",
      value: loading ? "—" : totalValue > 0 ? `$${totalValue.toLocaleString()}` : "—",
      icon: DollarSign,
      color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20",
    },
    {
      label: "PM Assignment",
      value: loading ? "—" : projects.length === 0 ? "—" : pmRate === 100 ? "100%" : `${pmRate}%`,
      icon: UserCheck,
      color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20",
    },
    {
      label: "Avg. Progress",
      value: loading ? "—" : `${avgProgress}%`,
      icon: BarChart3,
      color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20",
    },
  ];

  const toggle = (id: string) =>
    setExpandedId(prev => (prev === id ? null : id));

  return (
    <div className="space-y-5">
      {/* Welcome */}
      <motion.div {...fadeUp(0)}>
        <div className="flex items-center gap-2 mb-1">
          <Star className="h-4 w-4 text-[#c21219]" />
          <span className="text-xs font-semibold text-[#c21219] uppercase tracking-widest">Concierge Portal</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="text-sm text-gray-400 mt-0.5">Here's your executive summary across all active programmes.</p>
      </motion.div>

      {/* Error banner (non-blocking — mock data still shown) */}
      {error && !loading && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-xl border border-yellow-500/30 bg-yellow-500/8 px-4 py-3"
        >
          <AlertCircle className="h-4 w-4 text-yellow-400 flex-shrink-0" />
          <p className="text-xs text-yellow-300 flex-1">Showing demo data — live projects unavailable.</p>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setRetryKey(k => k + 1)}
            className="flex items-center gap-1 text-xs text-yellow-400 border border-yellow-500/30 px-2.5 py-1 rounded-lg hover:bg-yellow-500/15 transition"
          >
            <RefreshCw className="h-3 w-3" /> Retry
          </motion.button>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? [0, 1, 2, 3].map(i => <SkeletonCard key={i} />)
          : STATS.map((s, i) => (
            <motion.div key={s.label} {...fadeUp(i)}
              whileHover={{ scale: 1.04, y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.35)" }}
              transition={{ duration: 0.2 }}
              className={`rounded-xl border p-4 flex flex-col gap-2 cursor-default ${s.bg} ${s.border}`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </motion.div>
          ))
        }
      </div>

      {/* Projects — click to expand milestones */}
      <motion.div {...fadeUp(4)}>
        <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <FolderKanban className="h-4 w-4 text-[#c21219]" />Active Programmes
          <span className="ml-auto text-[10px] text-gray-500">Click a project to view milestones</span>
        </h2>
        <div className="space-y-2">
          {loading
            ? [0, 1, 2].map(i => <SkeletonProject key={i} />)
            : projects.map((p, i) => {
                const open       = expandedId === p.id;
                const completedM = p.milestones.filter(m => m.status === "completed").length;
                const displayStatus = p.status === "ongoing" ? "active" : p.status;
                return (
                  <motion.div key={p.id} {...fadeUp(5 + i)}
                    whileHover={{ boxShadow: "0 8px 32px rgba(0,0,0,0.45)", borderColor: open ? "rgba(194,18,25,0.4)" : "rgba(255,255,255,0.18)" }}
                    transition={{ duration: 0.2 }}
                    className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                    {/* Row header */}
                    <motion.button
                      onClick={() => toggle(p.id)}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                      whileTap={{ scale: 0.995 }}
                      transition={{ duration: 0.15 }}
                      className="w-full text-left px-5 py-4 flex items-start gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <p className="text-sm font-semibold text-white">{p.title}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border capitalize ${STATUS_STYLE[displayStatus] ?? STATUS_STYLE.open}`}>
                            {displayStatus}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">PM: {p.pm} · Due: {p.deadline} · ${p.budget.toLocaleString()}</p>
                        <div>
                          <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{completedM}/{p.milestones.length} milestones · {p.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                            <motion.div className="h-full rounded-full bg-[#c21219]"
                              initial={{ width: 0 }} animate={{ width: `${p.progress}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 + i * 0.1 }} />
                          </div>
                        </div>
                      </div>
                      <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 mt-1">
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </motion.div>
                    </motion.button>

                    {/* Expanded milestone + detail panel */}
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          key="panel"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden border-t border-white/10"
                        >
                          <div className="px-5 py-5 space-y-5">
                            {/* Description */}
                            {p.description && (
                              <div>
                                <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-1">Description</p>
                                <p className="text-sm text-gray-300 leading-relaxed">{p.description}</p>
                              </div>
                            )}

                            {/* Skills */}
                            {p.skills?.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {p.skills.map(s => (
                                  <span key={s} className="rounded-full border border-[#c21219]/30 bg-[#c21219]/10 px-3 py-0.5 text-[11px] text-[#c21219]">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Milestones */}
                            {p.milestones.length > 0 && (
                              <div>
                                <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-3">
                                  Milestones — {completedM} of {p.milestones.length} complete
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                  {p.milestones.map((m, mi) => {
                                    const cfg = MILESTONE_CONFIG[m.status] ?? MILESTONE_CONFIG.pending;
                                    const pct = m.progress ?? (m.status === "completed" ? 100 : 0);
                                    return (
                                      <motion.div
                                        key={m.id}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{ scale: 1.04, y: -2, boxShadow: cfg.shadow }}
                                        transition={{ delay: mi * 0.05, duration: 0.15 }}
                                        className={`rounded-xl border px-3 py-3 cursor-default ${cfg.card}`}
                                      >
                                        <div className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full border mb-2 capitalize ${cfg.badge}`}>
                                          <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                                          {m.status.replace("_", " ")}
                                        </div>
                                        <div className="flex items-start gap-1 mb-2.5">
                                          <span className="text-[10px] text-gray-500 mt-0.5 flex-shrink-0">#{mi + 1}</span>
                                          <p className="text-xs text-white font-medium leading-snug line-clamp-2">{m.title}</p>
                                        </div>
                                        <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden mb-1.5">
                                          <motion.div
                                            className={`h-full rounded-full ${cfg.bar}`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            transition={{ duration: 0.6, ease: "easeOut", delay: mi * 0.07 }}
                                          />
                                        </div>
                                        <div className="flex items-center justify-between">
                                          <span className={`text-[10px] font-semibold ${cfg.pct}`}>{pct}%</span>
                                          {m.dueDate && (
                                            <span className="text-[10px] text-gray-600">
                                              {new Date(m.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                                            </span>
                                          )}
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Action row */}
                            <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-white/10">
                              <motion.div whileHover={{ scale: 1.05, y: -2, boxShadow: "0 6px 20px rgba(194,18,25,0.25)" }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.15 }}>
                                <Link
                                  href={`/projects/${p.id}/workspace`}
                                  className="flex items-center gap-1.5 rounded-lg border border-[#c21219]/30 bg-[#c21219]/10 px-4 py-2 text-xs font-semibold text-[#c21219] transition hover:bg-[#c21219]/20"
                                >
                                  Open Workspace <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.15 }}>
                                <Link
                                  href={`/projects/${p.id}/workspace?tab=escrow`}
                                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-400 transition hover:text-white hover:bg-white/10"
                                >
                                  <Lock className="h-3.5 w-3.5" /> Escrow
                                </Link>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.04, y: -1 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.15 }}>
                                <Link
                                  href={`/projects/${p.id}/workspace?tab=chat`}
                                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-400 transition hover:text-white hover:bg-white/10"
                                >
                                  <MessageSquare className="h-3.5 w-3.5" /> Messages
                                </Link>
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
          }
        </div>
      </motion.div>

      {/* Recent activity — from real project data */}
      {!loading && projects.length > 0 && (
        <motion.div {...fadeUp(9)}>
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#c21219]" />Recent Activity
          </h2>
          <div className="space-y-2">
            {projects
              .flatMap(p => (p.activity ?? []).map(a => ({ ...a, project: p.title })))
              .slice(0, 5)
              .map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ x: 4, boxShadow: "0 4px 16px rgba(0,0,0,0.3)", borderColor: "rgba(255,255,255,0.16)" }}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 cursor-default"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-200">{a.text}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{a.time} · {a.project}</p>
                  </div>
                </motion.div>
              ))
            }
          </div>
        </motion.div>
      )}
    </div>
  );
}
