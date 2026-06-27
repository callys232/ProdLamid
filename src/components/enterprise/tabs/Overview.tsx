"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderPlus, UserPlus, ArrowRight, Clock, CheckCircle,
  AlertCircle, ChevronDown, Lock, MessageSquare, FolderKanban,
} from "lucide-react";
import Link from "next/link";
import type { EnterpriseDashboardStats, OrgTier } from "@/types/enterprise";
import type { MilestoneStatus } from "@/types/project";

const normMilestone = (raw: string): MilestoneStatus => ({
  started: "in_progress", dispute: "disputed",
  stopped: "cancelled",   approved: "completed",
} as Record<string, MilestoneStatus>)[raw] ?? (raw as MilestoneStatus);

interface Props {
  stats: EnterpriseDashboardStats | null;
  tier: OrgTier;
  orgName: string;
  onTabChange: (tab: string) => void;
}

const MOCK_ACTIVITY = [
  { type: "project",   text: "New project posted: ERP System Integration",      time: "2h ago",  status: "open"      },
  { type: "member",    text: "Sarah O. accepted team invite",                    time: "5h ago",  status: "joined"    },
  { type: "milestone", text: "Milestone approved: Data Warehouse — Phase 1",     time: "1d ago",  status: "completed" },
  { type: "bid",       text: "3 new consultant bids on Marketing Strategy",      time: "1d ago",  status: "pending"   },
  { type: "payment",   text: "Escrow released: $22,000 — SaaS Dashboard Build", time: "2d ago",  status: "paid"      },
];

const MOCK_CONSULTANTS = [
  { name: "Amara Nwosu",    cat: "Technology & Software", projects: 4, rating: 4.9 },
  { name: "James Thornton", cat: "Finance & Accounting",  projects: 3, rating: 4.8 },
  { name: "Priya Sharma",   cat: "Data & Analytics",      projects: 2, rating: 5.0 },
];

const MILESTONE_CONFIG: Record<string, { card: string; badge: string; dot: string; bar: string; pct: string; shadow: string }> = {
  completed:   { card: "border-green-500/30  bg-green-500/8",   badge: "text-green-400  border-green-500/30  bg-green-500/10",   dot: "bg-green-400",   bar: "bg-green-500",   pct: "text-green-400",   shadow: "0 6px 20px rgba(34,197,94,0.2)"   },
  in_progress: { card: "border-yellow-500/30 bg-yellow-500/8",  badge: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",  dot: "bg-yellow-400",  bar: "bg-yellow-500",  pct: "text-yellow-400",  shadow: "0 6px 20px rgba(234,179,8,0.2)"   },
  disputed:    { card: "border-red-500/30    bg-red-500/8",     badge: "text-red-400    border-red-500/30    bg-red-500/10",     dot: "bg-red-400",     bar: "bg-red-500",     pct: "text-red-400",     shadow: "0 6px 20px rgba(239,68,68,0.2)"   },
  funded:      { card: "border-purple-500/30 bg-purple-500/8",  badge: "text-purple-400 border-purple-500/30 bg-purple-500/10",  dot: "bg-purple-400",  bar: "bg-purple-500",  pct: "text-purple-400",  shadow: "0 6px 20px rgba(168,85,247,0.2)"  },
  pending:     { card: "border-white/10      bg-white/5",        badge: "text-gray-400   border-gray-500/20   bg-gray-500/10",   dot: "bg-gray-500",    bar: "bg-gray-600",    pct: "text-gray-400",    shadow: "0 6px 20px rgba(0,0,0,0.3)"       },
  cancelled:   { card: "border-white/8       bg-white/3",        badge: "text-gray-500   border-gray-600/20   bg-gray-600/10",   dot: "bg-gray-600",    bar: "bg-gray-700",    pct: "text-gray-500",    shadow: "0 6px 20px rgba(0,0,0,0.2)"       },
};

const PROJECTS = [
  {
    id: "job-tech-001",
    title: "Enterprise SaaS Dashboard Rebuild",
    status: "ongoing",
    budget: 28000,
    deadline: "2026-06-15",
    category: "Technology & Software",
    description: "Rebuild a legacy enterprise dashboard into a modern SaaS product with real-time analytics and role-based access.",
    skills: ["Next.js", "TypeScript", "PostgreSQL"],
    milestones: [
      { id: "m1", title: "Discovery & Requirements Gathering", status: "completed",   progress: 100, dueDate: "2026-02-10" },
      { id: "m2", title: "UI/UX Design & Prototyping",        status: "completed",   progress: 100, dueDate: "2026-03-15" },
      { id: "m3", title: "Frontend Development — Phase 1",    status: "in_progress", progress: 70,  dueDate: "2026-05-01" },
      { id: "m4", title: "Backend API Integration",           status: "funded",      progress: 30,  dueDate: "2026-05-31" },
      { id: "m5", title: "QA, Testing & Launch",              status: "pending",     progress: 0,   dueDate: "2026-06-15" },
    ],
  },
  {
    id: "job-fin-001",
    title: "Financial Reporting Automation",
    status: "open",
    budget: 18500,
    deadline: "2026-07-30",
    category: "Finance & Accounting",
    description: "Automate monthly financial reporting workflows, reducing manual effort by 80% and ensuring audit-ready output.",
    skills: ["Power BI", "Python", "SQL"],
    milestones: [
      { id: "m1", title: "Process Mapping & Audit",        status: "completed",   progress: 100, dueDate: "2026-03-01" },
      { id: "m2", title: "Data Pipeline Architecture",     status: "in_progress", progress: 45,  dueDate: "2026-05-15" },
      { id: "m3", title: "Dashboard Build & Validation",   status: "pending",     progress: 0,   dueDate: "2026-06-30" },
      { id: "m4", title: "Training & Handover",            status: "pending",     progress: 0,   dueDate: "2026-07-30" },
    ],
  },
  {
    id: "job-data-001",
    title: "Customer Analytics Platform",
    status: "ongoing",
    budget: 42000,
    deadline: "2026-08-31",
    category: "Data & Analytics",
    description: "Build a unified customer analytics layer across CRM, support, and product usage data to drive retention decisions.",
    skills: ["dbt", "Snowflake", "Tableau"],
    milestones: [
      { id: "m1", title: "Data Source Inventory",          status: "completed",   progress: 100, dueDate: "2026-02-28" },
      { id: "m2", title: "Data Model & Schema Design",     status: "completed",   progress: 100, dueDate: "2026-04-01" },
      { id: "m3", title: "ETL Pipeline Development",       status: "in_progress", progress: 55,  dueDate: "2026-06-01" },
      { id: "m4", title: "Dashboard & Visualisation",      status: "pending",     progress: 0,   dueDate: "2026-07-15" },
      { id: "m5", title: "Stakeholder Training",           status: "pending",     progress: 0,   dueDate: "2026-08-31" },
    ],
  },
];

const STATUS_STYLE: Record<string, string> = {
  open:      "border-blue-500/30 bg-blue-500/10 text-blue-400",
  ongoing:   "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  completed: "border-gray-500/30 bg-gray-500/10 text-gray-400",
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  open:      <AlertCircle className="h-3.5 w-3.5 text-blue-400" />,
  joined:    <CheckCircle className="h-3.5 w-3.5 text-green-400" />,
  completed: <CheckCircle className="h-3.5 w-3.5 text-green-400" />,
  pending:   <Clock       className="h-3.5 w-3.5 text-yellow-400" />,
  paid:      <CheckCircle className="h-3.5 w-3.5 text-[#c12129]" />,
};

const card = "rounded-xl border border-white/10 bg-white/5 p-5";

export default function Overview({ stats, tier, orgName, onTabChange }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) =>
    setExpandedId(prev => (prev === id ? null : id));

  return (
    <div className="space-y-4 p-4">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-[#c12129]/20 bg-[#c12129]/5 px-5 py-4"
      >
        <h2 className="text-base font-semibold text-white">Welcome back, {orgName}</h2>
        <p className="mt-0.5 text-sm text-gray-400">
          {tier === "enterprise_plus"
            ? "Enterprise+ workspace · 100+ member capacity"
            : "Enterprise workspace · 50 member capacity"}
        </p>
      </motion.div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          { label: "Post a Project", icon: FolderPlus, tab: "projects", desc: "Source consultants across 20 categories" },
          { label: "Invite a Member", icon: UserPlus,  tab: "members",  desc: `${stats ? stats.maxMembers - stats.memberCount : 50} slots remaining` },
        ].map(({ label, icon: Icon, tab, desc }) => (
          <motion.button
            key={label}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTabChange(tab)}
            className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-[#c12129]/30 hover:bg-[#c12129]/5"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black group-hover:border-[#c12129]/30 group-hover:bg-[#c12129]/10">
              <Icon className="h-5 w-5 text-[#c12129]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-white">{label}</p>
              <p className="text-xs text-gray-500">{desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 flex-shrink-0 text-gray-600 transition group-hover:translate-x-0.5 group-hover:text-[#c12129]" />
          </motion.button>
        ))}
      </div>

      {/* Active Projects — click to expand milestones */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <FolderKanban className="h-4 w-4 text-[#c12129]" /> Active Projects
          </h3>
          <button
            onClick={() => onTabChange("projects")}
            className="text-[11px] text-[#c12129] hover:underline"
          >
            View all →
          </button>
        </div>
        <div className="space-y-2">
          {PROJECTS.map((p, i) => {
            const open = expandedId === p.id;
            const completedM = p.milestones.filter(m => m.status === "completed").length;
            const overallPct = Math.round(
              p.milestones.reduce((s, m) => s + (m.progress ?? 0), 0) / p.milestones.length
            );
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ boxShadow: "0 8px 32px rgba(0,0,0,0.45)", borderColor: open ? "rgba(193,33,41,0.4)" : "rgba(255,255,255,0.18)" }}
                transition={{ delay: i * 0.06, duration: 0.2 }}
                className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
              >
                {/* Clickable header row */}
                <motion.button
                  onClick={() => toggle(p.id)}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                  whileTap={{ scale: 0.995 }}
                  transition={{ duration: 0.15 }}
                  className="w-full text-left px-5 py-4 flex items-start gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1.5">
                      <p className="text-sm font-semibold text-white">{p.title}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border capitalize ${STATUS_STYLE[p.status] ?? STATUS_STYLE.open}`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">
                      {p.category} · ${p.budget.toLocaleString()} · Due {new Date(p.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    <div>
                      <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                        <span>{completedM}/{p.milestones.length} milestones complete</span>
                        <span>{overallPct}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-[#c12129]"
                          initial={{ width: 0 }}
                          animate={{ width: `${overallPct}%` }}
                          transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.08 }}
                        />
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
                        <div>
                          <p className="text-[11px] uppercase tracking-widest text-gray-500 mb-1">Description</p>
                          <p className="text-sm text-gray-300 leading-relaxed">{p.description}</p>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2">
                          {p.skills.map(s => (
                            <span key={s} className="rounded-full border border-[#c12129]/30 bg-[#c12129]/10 px-3 py-0.5 text-[11px] text-[#c12129]">
                              {s}
                            </span>
                          ))}
                        </div>

                        {/* Milestones */}
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
                                  {/* Status badge */}
                                  <div className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full border mb-2 capitalize ${cfg.badge}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                                    {m.status.replace("_", " ")}
                                  </div>
                                  {/* Number + title */}
                                  <div className="flex items-start gap-1 mb-2.5">
                                    <span className="text-[10px] text-gray-500 mt-0.5 flex-shrink-0">#{mi + 1}</span>
                                    <p className="text-xs text-white font-medium leading-snug line-clamp-2">{m.title}</p>
                                  </div>
                                  {/* Progress bar */}
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

                        {/* Action row */}
                        <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-white/10">
                          <motion.div whileHover={{ scale: 1.05, y: -2, boxShadow: "0 6px 20px rgba(193,33,41,0.25)" }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.15 }}>
                            <Link
                              href={`/projects/${p.id}/workspace`}
                              className="flex items-center gap-1.5 rounded-lg border border-[#c12129]/30 bg-[#c12129]/10 px-4 py-2 text-xs font-semibold text-[#c12129] transition hover:bg-[#c12129]/20"
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
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Activity feed */}
        <div className={card}>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">Recent Activity</h3>
          <ul className="space-y-3">
            {MOCK_ACTIVITY.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.03)" }}
                transition={{ delay: i * 0.05, duration: 0.15 }}
                className="flex items-start gap-3 rounded-lg px-2 py-1.5 -mx-2 cursor-default"
              >
                <span className="mt-0.5 flex-shrink-0">{STATUS_ICON[item.status]}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-300">{item.text}</p>
                  <p className="text-[11px] text-gray-600">{item.time}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Top consultants */}
        <div className={card}>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-400">Top Consultants</h3>
          <ul className="space-y-3">
            {MOCK_CONSULTANTS.map((c, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02, y: -2, boxShadow: "0 6px 20px rgba(0,0,0,0.3)", borderColor: "rgba(255,255,255,0.14)" }}
                transition={{ delay: i * 0.07, duration: 0.15 }}
                className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 px-3 py-2.5 cursor-default"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#c12129]/10 text-xs font-bold text-[#c12129]">
                  {c.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">{c.name}</p>
                  <p className="truncate text-[11px] text-gray-500">{c.cat}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">★ {c.rating}</p>
                  <p className="text-[11px] text-gray-500">{c.projects} projects</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
