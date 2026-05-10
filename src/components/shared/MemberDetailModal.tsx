"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Mail, Calendar, Briefcase, TrendingUp, AlertTriangle,
  CheckCircle2, Clock, FolderOpen, ShieldAlert, ExternalLink,
} from "lucide-react";
import Link from "next/link";
import type { Project, Milestone } from "@/types/project";

/* ── Types ──────────────────────────────────────────────────────── */
export interface MemberProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  badge?: { label: string; color: string };
  status?: "active" | "pending" | "suspended";
  joinedAt?: string;
  skills?: string[];
}

/* ── Local shape for project + progress (fetched at runtime) ─────── */
interface ProjectWithProgress extends Project {
  progress?: number;
  disputeReason?: string;   // on individual milestones only — carried forward
}

// disputeReason lives on milestones, not on Project — we extend Milestone inline

interface Props {
  member: MemberProfile | null;
  onClose: () => void;
  accent?: string;
}

/* ── Milestone colour config (same as overview) ─────────────────── */
const M_CFG: Record<string, { card: string; badge: string; dot: string; bar: string; pct: string }> = {
  completed:   { card: "border-green-500/30  bg-green-500/8",  badge: "text-green-400  border-green-500/30  bg-green-500/10",  dot: "bg-green-400",  bar: "bg-green-500",  pct: "text-green-400"  },
  in_progress: { card: "border-yellow-500/30 bg-yellow-500/8", badge: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10", dot: "bg-yellow-400", bar: "bg-yellow-500", pct: "text-yellow-400" },
  disputed:    { card: "border-red-500/40    bg-red-500/10",   badge: "text-red-400    border-red-500/30    bg-red-500/10",    dot: "bg-red-400",    bar: "bg-red-500",    pct: "text-red-400"    },
  funded:      { card: "border-purple-500/30 bg-purple-500/8", badge: "text-purple-400 border-purple-500/30 bg-purple-500/10", dot: "bg-purple-400", bar: "bg-purple-500", pct: "text-purple-400" },
  pending:     { card: "border-white/10      bg-white/5",       badge: "text-gray-400   border-gray-500/20   bg-gray-500/10",   dot: "bg-gray-500",   bar: "bg-gray-600",   pct: "text-gray-400"   },
  cancelled:   { card: "border-white/8       bg-white/3",       badge: "text-gray-500   border-gray-600/20   bg-gray-600/10",   dot: "bg-gray-600",   bar: "bg-gray-700",   pct: "text-gray-500"   },
};

const STATUS_DOT: Record<string, string> = {
  active:    "bg-green-500",
  pending:   "bg-yellow-500",
  suspended: "bg-red-500",
};

/* ── Mock fallback data (shown when API returns nothing) ─────────── */
const MOCK_PROJECTS: ProjectWithProgress[] = [
  {
    _id: "mock-proj-1",
    title: "UNDP Community Health Programme",
    status: "ongoing",
    budget: 85000,
    deadline: "2026-08-31",
    description: "Strengthening community health systems across 6 states through training and digital monitoring.",
    progress: 68,
    milestones: [
      { id: "m1", title: "Baseline Assessment",          status: "completed",   progress: 100, dueDate: "2026-02-28" },
      { id: "m2", title: "Stakeholder Engagement",       status: "completed",   progress: 100, dueDate: "2026-03-31" },
      { id: "m3", title: "Phase 1 Training Rollout",     status: "in_progress", progress: 68,  dueDate: "2026-06-30" },
      { id: "m4", title: "Digital Monitoring Deployment",status: "funded",      progress: 20,  dueDate: "2026-07-31" },
      { id: "m5", title: "Mid-Term Evaluation",          status: "pending",     progress: 0,   dueDate: "2026-09-30" },
    ],
  },
  {
    _id: "mock-proj-2",
    title: "Federal HR Transformation",
    status: "ongoing",
    budget: 120000,
    deadline: "2026-12-15",
    description: "End-to-end HR system overhaul including policy reform and HRIS deployment.",
    progress: 35,
    milestones: [
      { id: "m1", title: "HR Audit & Gap Analysis",    status: "completed",   progress: 100, dueDate: "2026-03-15" },
      { id: "m2", title: "Policy Framework Design",    status: "in_progress", progress: 60,  dueDate: "2026-05-31" },
      { id: "m3", title: "HRIS Vendor Selection",      status: "disputed",    progress: 0,   dueDate: "2026-07-31", disputeReason: "Vendor deliverables did not meet agreed specifications. Awaiting mediation." },
      { id: "m4", title: "System Configuration",       status: "pending",     progress: 0,   dueDate: "2026-09-30" },
      { id: "m5", title: "National Rollout & Training", status: "pending",    progress: 0,   dueDate: "2026-12-15" },
    ],
  },
];

/* ── Helpers ─────────────────────────────────────────────────────── */
function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function overallProgress(milestones: Milestone[]) {
  if (!milestones.length) return 0;
  return Math.round(milestones.reduce((s, m) => s + (m.progress ?? (m.status === "completed" ? 100 : 0)), 0) / milestones.length);
}

/* ── ProjectCardHeader (internal sub-component) ─────────────────── */
function ProjectCardHeader({ p, pct, completedMs, milestones, hasDispute, accent }: {
  p: ProjectWithProgress; pct: number; completedMs: number;
  milestones: Milestone[]; hasDispute: boolean; accent: string;
}) {
  return (
    <>
      <div className="px-4 py-3.5 flex items-start justify-between gap-3 transition-colors group-hover:bg-white/5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-white truncate group-hover:text-white/90 transition-colors">
              {p.title}
            </p>
            {hasDispute && (
              <span className="flex items-center gap-1 text-[10px] text-red-400 border border-red-500/30 bg-red-500/10 px-2 py-0.5 rounded-full">
                <AlertTriangle className="h-2.5 w-2.5" /> Dispute
              </span>
            )}
          </div>
          {p.description && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{p.description}</p>
          )}
          <div className="flex items-center gap-3 mt-1.5 flex-wrap text-[11px] text-gray-500">
            {p.budget && <span className="text-green-400 font-medium">${p.budget.toLocaleString()}</span>}
            {p.deadline && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(p.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            )}
            <span>{completedMs}/{milestones.length} milestones</span>
          </div>
        </div>
        <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-gray-600 transition-colors group-hover:text-gray-300 mt-1" />
      </div>
      {/* Progress bar */}
      <div className="px-4 pb-3 transition-colors group-hover:bg-white/5">
        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
          <span>Overall progress</span>
          <span>{pct}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: hasDispute ? "#ef4444" : accent }}
          />
        </div>
      </div>
    </>
  );
}

/* ── Component ───────────────────────────────────────────────────── */
export default function MemberDetailModal({ member, onClose, accent = "#c12129" }: Props) {
  const [projects, setProjects] = useState<ProjectWithProgress[]>([]);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    if (!member) return;
    setLoading(true);

    async function fetchProjects() {
      try {
        const res = await fetch(`/api/projects?userId=${member!.id}&limit=10`);
        if (res.ok) {
          const { data } = await res.json();
          const list: Project[] = Array.isArray(data) ? data : [];
          // For each project fetch milestones if not embedded
          const enriched = await Promise.all(list.map(async p => {
            if (p.milestones?.length) return p;
            try {
              const mr = await fetch(`/api/projects/${p._id ?? p.id}/milestones`);
              if (mr.ok) {
                const { data: ms } = await mr.json();
                return { ...p, milestones: ms ?? [] };
              }
            } catch { /* silent */ }
            return p;
          }));
          setProjects(enriched.length ? enriched : MOCK_PROJECTS);
        } else {
          setProjects(MOCK_PROJECTS);
        }
      } catch {
        setProjects(MOCK_PROJECTS);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [member?.id]);

  // Collect all disputes across all projects
  const disputes = projects.flatMap(p =>
    (p.milestones ?? [])
      .filter(m => m.status === "disputed")
      .map(m => ({
        project: p.title,
        projectId: p._id ?? p.id ?? "",
        milestone: m.title,
        reason: m.disputeReason,
      }))
  );

  const totalMilestones  = projects.flatMap(p => p.milestones ?? []).length;
  const completedCount   = projects.flatMap(p => p.milestones ?? []).filter(m => m.status === "completed").length;
  const inProgressCount  = projects.flatMap(p => p.milestones ?? []).filter(m => m.status === "in_progress").length;
  const disputeCount     = disputes.length;

  return (
    <AnimatePresence>
      {member && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 16 }}
            transition={{ duration: 0.22, ease: [0.33, 1, 0.68, 1] }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl"
          >
            {/* ── Header ─────────────────────────────────────────── */}
            <div
              className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-[#0d1117]/95 backdrop-blur-md px-5 py-4"
              style={{ borderTopColor: `${accent}30` }}
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div
                  className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-lg"
                  style={{ background: `${accent}20`, border: `1px solid ${accent}40` }}
                >
                  {initials(member.name)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold text-white">{member.name}</h2>
                    {member.status && (
                      <span className="flex items-center gap-1.5 text-[10px] text-gray-400">
                        <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[member.status] ?? "bg-gray-500"}`} />
                        <span className="capitalize">{member.status}</span>
                      </span>
                    )}
                  </div>
                  <p className="flex items-center gap-1.5 text-sm text-gray-400 mt-0.5">
                    <Mail className="h-3.5 w-3.5" /> {member.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Briefcase className="h-3 w-3" /> {member.role}
                    </span>
                    {member.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${member.badge.color}`}>
                        {member.badge.label}
                      </span>
                    )}
                    {member.joinedAt && (
                      <span className="text-[10px] text-gray-600 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Joined {new Date(member.joinedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.15 }}
                onClick={onClose}
                className="flex-shrink-0 rounded-xl border border-white/10 bg-white/5 p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>

            {/* ── Body ──────────────────────────────────────────── */}
            <div className="px-5 py-4 space-y-4">

              {/* ── Dispute banner ─────────────────────────────── */}
              {disputeCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3.5"
                >
                  <ShieldAlert className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-300">
                      {disputeCount} Active Dispute{disputeCount > 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-red-400/80 mt-0.5">
                      Mediation team has been notified. Review details below.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ── Summary strip ──────────────────────────────── */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Projects",    value: projects.length,  color: "text-white",          icon: FolderOpen },
                  { label: "Milestones",  value: totalMilestones,  color: "text-white",          icon: TrendingUp },
                  { label: "Completed",   value: completedCount,   color: "text-green-400",      icon: CheckCircle2 },
                  { label: "Disputes",    value: disputeCount,     color: disputeCount > 0 ? "text-red-400" : "text-gray-500", icon: AlertTriangle },
                ].map(({ label, value, color, icon: Icon }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    whileHover={{ scale: 1.04, y: -2 }}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center cursor-default"
                  >
                    <Icon className={`h-4 w-4 mx-auto mb-1 ${color}`} />
                    <p className={`text-xl font-bold ${color}`}>{loading ? "…" : value}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{label}</p>
                  </motion.div>
                ))}
              </div>

              {/* ── Skills ──────────────────────────────────────── */}
              {member.skills && member.skills.length > 0 && (
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.map(s => (
                      <span key={s} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-gray-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Disputes detail ─────────────────────────────── */}
              {disputes.length > 0 && (
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-red-400 mb-3 flex items-center gap-1.5">
                    <ShieldAlert className="h-3.5 w-3.5" /> Dispute Details
                  </p>
                  <div className="space-y-2">
                    {disputes.map((d, i) => {
                      const disputeHref = d.projectId ? `/projects/${d.projectId}/workspace` : null;
                      const inner = (
                        <motion.div
                          initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                          whileHover={{ scale: 1.02, x: 3, boxShadow: "0 6px 20px rgba(239,68,68,0.2)" }}
                          whileTap={{ scale: 0.98 }}
                          className={`rounded-xl border border-red-500/30 bg-red-500/8 px-4 py-3.5 ${disputeHref ? "cursor-pointer" : ""}`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-start gap-2 min-w-0">
                              <AlertTriangle className="h-3.5 w-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-red-300 truncate">{d.milestone}</p>
                                <p className="text-[11px] text-red-400/70">on {d.project}</p>
                              </div>
                            </div>
                            {disputeHref && <ExternalLink className="h-3.5 w-3.5 text-red-500/50 flex-shrink-0 mt-0.5" />}
                          </div>
                          {d.reason && (
                            <p className="text-xs text-red-300/80 leading-relaxed mt-1 pl-5">{d.reason}</p>
                          )}
                        </motion.div>
                      );
                      return disputeHref ? (
                        <Link key={i} href={disputeHref} className="block">{inner}</Link>
                      ) : <div key={i}>{inner}</div>;
                    })}
                  </div>
                </div>
              )}

              {/* ── Projects & milestones ───────────────────────── */}
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-3">
                  Projects & Milestones
                </p>

                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: accent }} />
                  </div>
                ) : projects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                    <FolderOpen className="h-8 w-8 mb-2" />
                    <p className="text-sm">No projects assigned.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {projects.map((p, pi) => {
                      const pId = p._id ?? p.id ?? "";
                      const milestones = p.milestones ?? [];
                      const pct = p.progress ?? overallProgress(milestones);
                      const completedMs = milestones.filter(m => m.status === "completed").length;
                      const hasDispute  = milestones.some(m => m.status === "disputed");

                      const workspaceHref = pId ? `/projects/${pId}/workspace` : null;

                      return (
                        <motion.div
                          key={pId || pi}
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: pi * 0.07 }}
                          className={`rounded-xl border bg-white/5 overflow-hidden ${hasDispute ? "border-red-500/30" : "border-white/10"}`}
                        >
                          {/* ── Project header + progress — entire block is a link ── */}
                          {workspaceHref ? (
                            <Link href={workspaceHref} className="block group">
                              <ProjectCardHeader
                                p={p} pct={pct} completedMs={completedMs}
                                milestones={milestones} hasDispute={hasDispute} accent={accent}
                              />
                            </Link>
                          ) : (
                            <ProjectCardHeader
                              p={p} pct={pct} completedMs={completedMs}
                              milestones={milestones} hasDispute={hasDispute} accent={accent}
                            />
                          )}

                          {/* ── Milestone cards — each card links to the project ── */}
                          {milestones.length > 0 && (
                            <div className="border-t border-white/8 px-4 pt-3 pb-4">
                              <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-2">Milestones</p>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                                {milestones.map((m, mi) => {
                                  const cfg = M_CFG[m.status] ?? M_CFG.pending;
                                  const mpct = m.progress ?? (m.status === "completed" ? 100 : 0);
                                  const card = (
                                    <motion.div
                                      key={m.id ?? m._id ?? mi}
                                      initial={{ opacity: 0, scale: 0.94 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: pi * 0.05 + mi * 0.04 }}
                                      whileHover={{ scale: 1.05, y: -2, boxShadow: "0 6px 20px rgba(0,0,0,0.4)" }}
                                      whileTap={{ scale: 0.97 }}
                                      className={`rounded-xl border px-3 py-2.5 cursor-pointer ${cfg.card}`}
                                    >
                                      <div className={`inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full border mb-1.5 capitalize ${cfg.badge}`}>
                                        <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                                        {m.status.replace("_", " ")}
                                      </div>
                                      <div className="flex items-start gap-1 mb-1.5">
                                        <span className="text-[9px] text-gray-500 mt-0.5 flex-shrink-0">#{mi + 1}</span>
                                        <p className="text-[11px] text-white font-medium leading-snug line-clamp-2">{m.title}</p>
                                      </div>
                                      {m.status === "disputed" && m.disputeReason && (
                                        <p className="text-[10px] text-red-300/80 leading-snug mb-1.5 line-clamp-2">
                                          {m.disputeReason}
                                        </p>
                                      )}
                                      <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden mb-1">
                                        <motion.div
                                          className={`h-full rounded-full ${cfg.bar}`}
                                          initial={{ width: 0 }}
                                          animate={{ width: `${mpct}%` }}
                                          transition={{ duration: 0.5, ease: "easeOut", delay: mi * 0.05 }}
                                        />
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span className={`text-[9px] font-bold ${cfg.pct}`}>{mpct}%</span>
                                        {m.dueDate && (
                                          <span className="text-[9px] text-gray-600">
                                            {new Date(m.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                                          </span>
                                        )}
                                      </div>
                                    </motion.div>
                                  );
                                  return workspaceHref ? (
                                    <Link key={m.id ?? m._id ?? mi} href={workspaceHref} className="block">
                                      {card}
                                    </Link>
                                  ) : card;
                                })}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
