"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, AlertTriangle, XCircle, Plus, X,
  Clock, CheckCircle2, RefreshCw, Calendar,
} from "lucide-react";
import { mockConciergeProjects } from "@/mocks/mockConciergeProjects";
import type { ConciergeProject } from "@/mocks/mockConciergeProjects";

/* ── Types ─────────────────────────────────────────────────────── */
export type SLAType = "response_time" | "delivery" | "milestone" | "reporting";

export interface SLAItem {
  id: string;
  projectId: string;
  projectTitle: string;
  slaType: SLAType;
  target: string;
  dueDate: Date;
  status: "on_track" | "at_risk" | "breached";
  lastUpdated: Date;
  resolved?: boolean;
}

/* ── Helpers ────────────────────────────────────────────────────── */
const SLA_TYPE_LABEL: Record<SLAType, string> = {
  response_time: "Response Time",
  delivery:      "Delivery",
  milestone:     "Milestone",
  reporting:     "Reporting",
};

function computeStatus(dueDate: Date): "on_track" | "at_risk" | "breached" {
  const now    = Date.now();
  const due    = dueDate.getTime();
  const diff   = due - now;
  const dayMs  = 86_400_000;
  if (diff < 0)              return "breached";
  if (diff < 3 * dayMs)      return "at_risk";
  return "on_track";
}

function generateSLAsFromProjects(projects: ConciergeProject[]): SLAItem[] {
  const slas: SLAItem[] = [];

  projects.forEach(p => {
    // Every project gets a 24h response SLA (due 24h after "now" for demo)
    const responseDate = new Date(Date.now() + 20 * 3_600_000); // 20h from now → at_risk
    slas.push({
      id:           `sla-resp-${p.id}`,
      projectId:    p.id,
      projectTitle: p.title,
      slaType:      "response_time",
      target:       "24h response",
      dueDate:      responseDate,
      status:       computeStatus(responseDate),
      lastUpdated:  new Date(),
    });

    // Overdue milestones → breached milestone SLAs
    p.milestones.forEach(m => {
      if (!m.dueDate) return;
      const due = new Date(m.dueDate);
      const stat = computeStatus(due);
      if (stat === "breached" && m.status !== "completed" && m.status !== "cancelled") {
        slas.push({
          id:           `sla-ms-${p.id}-${m.id}`,
          projectId:    p.id,
          projectTitle: p.title,
          slaType:      "milestone",
          target:       m.title,
          dueDate:      due,
          status:       "breached",
          lastUpdated:  new Date(),
        });
      }
    });

    // Weekly reporting SLA — due next Monday (simulated)
    const nextMon = new Date();
    const day = nextMon.getDay();
    const toMon = day === 0 ? 1 : 8 - day;
    nextMon.setDate(nextMon.getDate() + toMon);
    nextMon.setHours(17, 0, 0, 0);
    if (p.status === "ongoing") {
      slas.push({
        id:           `sla-rpt-${p.id}`,
        projectId:    p.id,
        projectTitle: p.title,
        slaType:      "reporting",
        target:       "Weekly status report",
        dueDate:      nextMon,
        status:       computeStatus(nextMon),
        lastUpdated:  new Date(),
      });
    }
  });

  return slas;
}

/* ── Status badge colours ──────────────────────────────────────── */
const STATUS_STYLE: Record<SLAItem["status"], { badge: string; text: string; icon: any }> = {
  on_track: { badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", text: "On Track", icon: ShieldCheck  },
  at_risk:  { badge: "text-amber-400  bg-amber-500/10   border-amber-500/30",    text: "At Risk",  icon: AlertTriangle },
  breached: { badge: "text-red-400    bg-red-500/10     border-red-500/30",       text: "Breached", icon: XCircle       },
};

const SLA_TYPE_COLORS: Record<SLAType, string> = {
  response_time: "text-blue-400   bg-blue-500/10   border-blue-500/20",
  delivery:      "text-purple-400 bg-purple-500/10 border-purple-500/20",
  milestone:     "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  reporting:     "text-cyan-400   bg-cyan-500/10   border-cyan-500/20",
};

const STORAGE_KEY = (userId: string) => `lamid-slas-${userId}`;

const fadeUp = (i = 0) => ({
  initial:    { opacity: 0, y: 12 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.35, delay: i * 0.06, ease: [0.33, 1, 0.68, 1] as const },
});

/* ── Main Component ─────────────────────────────────────────────── */
export default function SLATracker({ userId = "demo" }: { userId?: string }) {
  const [slas, setSlas]             = useState<SLAItem[]>([]);
  const [projects, setProjects]     = useState<ConciergeProject[]>([]);
  const [showAdd, setShowAdd]       = useState(false);
  const [filter, setFilter]         = useState<"all" | SLAItem["status"]>("all");
  const [refreshing, setRefreshing] = useState(false);

  /* ── Add SLA form state ─────────────────────────────────────── */
  const [form, setForm] = useState({
    projectId: "",
    slaType:   "response_time" as SLAType,
    target:    "",
    dueDate:   "",
  });

  /* ── Load projects (real API → mock fallback) ─────────────── */
  const loadProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects?role=owner&limit=20");
      if (res.ok) {
        const d = await res.json();
        if (Array.isArray(d?.data) && d.data.length) {
          const mapped: ConciergeProject[] = d.data.map((p: any) => ({
            id:          p._id ?? p.id,
            title:       p.title,
            status:      p.status,
            category:    p.category ?? "General",
            budget:      p.budget ?? 0,
            spent:       p.spent ?? 0,
            progress:    p.milestoneProgress ?? 0,
            pm:          p.pm ?? "",
            deadline:    p.deadline ?? "",
            description: p.description ?? "",
            skills:      p.skills ?? [],
            consultants: [],
            milestones: (p.milestones ?? []).map((m: any) => ({
              id:       m._id ?? m.id,
              title:    m.title,
              status:   m.status ?? "pending",
              progress: m.progress ?? 0,
              dueDate:  m.dueDate ?? "",
            })),
            activity: [],
          }));
          setProjects(mapped);
          return mapped;
        }
      }
    } catch { /* silent */ }
    setProjects(mockConciergeProjects);
    return mockConciergeProjects;
  }, []);

  /* ── Merge persisted SLAs + auto-generated ones ───────────── */
  const buildSLAs = useCallback((projs: ConciergeProject[]) => {
    const generated = generateSLAsFromProjects(projs);

    // Load user-added SLAs from localStorage
    let persisted: SLAItem[] = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY(userId));
      if (raw) persisted = JSON.parse(raw).map((s: any) => ({
        ...s,
        dueDate:     new Date(s.dueDate),
        lastUpdated: new Date(s.lastUpdated),
        status:      computeStatus(new Date(s.dueDate)),
      }));
    } catch { /* ignore */ }

    // Merge: persisted override generated by id, but resolved ones are hidden
    const merged = [
      ...generated.filter(g => !persisted.find(p => p.id === g.id)),
      ...persisted,
    ].filter(s => !s.resolved);

    setSlas(merged);
  }, [userId]);

  /* ── Init ───────────────────────────────────────────────────── */
  useEffect(() => {
    loadProjects().then(buildSLAs);
  }, [loadProjects, buildSLAs]);

  /* ── Persist user-added SLAs ─────────────────────────────── */
  const persistSLA = (item: SLAItem) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY(userId));
      const existing: SLAItem[] = raw ? JSON.parse(raw) : [];
      const idx = existing.findIndex(s => s.id === item.id);
      if (idx >= 0) existing[idx] = item; else existing.push(item);
      localStorage.setItem(STORAGE_KEY(userId), JSON.stringify(existing));
    } catch { /* ignore */ }
  };

  /* ── Mark resolved ──────────────────────────────────────────── */
  const resolve = (id: string) => {
    setSlas(prev => prev.filter(s => s.id !== id));
    // Persist resolved state
    try {
      const raw = localStorage.getItem(STORAGE_KEY(userId));
      const existing: SLAItem[] = raw ? JSON.parse(raw) : [];
      const idx = existing.findIndex(s => s.id === id);
      if (idx >= 0) {
        existing[idx].resolved = true;
      } else {
        existing.push({ id, resolved: true } as any);
      }
      localStorage.setItem(STORAGE_KEY(userId), JSON.stringify(existing));
    } catch { /* ignore */ }
  };

  /* ── Add new SLA ────────────────────────────────────────────── */
  const addSLA = () => {
    if (!form.projectId || !form.target || !form.dueDate) return;
    const proj = projects.find(p => p.id === form.projectId);
    if (!proj) return;
    const due = new Date(form.dueDate);
    const newItem: SLAItem = {
      id:           `sla-custom-${Date.now()}`,
      projectId:    form.projectId,
      projectTitle: proj.title,
      slaType:      form.slaType,
      target:       form.target,
      dueDate:      due,
      status:       computeStatus(due),
      lastUpdated:  new Date(),
    };
    setSlas(prev => [newItem, ...prev]);
    persistSLA(newItem);
    setShowAdd(false);
    setForm({ projectId: "", slaType: "response_time", target: "", dueDate: "" });
  };

  /* ── Refresh ────────────────────────────────────────────────── */
  const refresh = async () => {
    setRefreshing(true);
    const projs = await loadProjects();
    buildSLAs(projs);
    setRefreshing(false);
  };

  /* ── Computed KPIs ──────────────────────────────────────────── */
  const onTrack  = slas.filter(s => s.status === "on_track").length;
  const atRisk   = slas.filter(s => s.status === "at_risk").length;
  const breached = slas.filter(s => s.status === "breached").length;

  const filtered = filter === "all" ? slas : slas.filter(s => s.status === filter);

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────────────── */}
      <motion.div {...fadeUp(0)} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">SLA Tracking</span>
          </div>
          <h2 className="text-xl font-bold text-white">Service Level Agreements</h2>
          <p className="text-sm text-gray-400 mt-0.5">Monitor your white-glove service commitments</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={refresh}
            disabled={refreshing}
            className="p-2 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:text-white transition"
            title="Refresh SLAs"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 6px 20px rgba(201,168,76,0.25)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-semibold transition hover:bg-amber-500/20"
          >
            <Plus className="h-4 w-4" /> Add SLA
          </motion.button>
        </div>
      </motion.div>

      {/* ── KPI Cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "On Track", count: onTrack,  color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: ShieldCheck,   filter: "on_track"  as const },
          { label: "At Risk",  count: atRisk,   color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/20",   icon: AlertTriangle, filter: "at_risk"   as const },
          { label: "Breached", count: breached, color: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/20",     icon: XCircle,       filter: "breached"  as const },
        ].map((card, i) => (
          <motion.button
            key={card.label}
            {...fadeUp(i + 1)}
            whileHover={{ scale: 1.04, y: -3, boxShadow: "0 10px 28px rgba(0,0,0,0.35)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setFilter(f => f === card.filter ? "all" : card.filter)}
            className={`rounded-xl border p-4 flex flex-col gap-2 text-left transition ${card.bg} ${card.border} ${filter === card.filter ? "ring-1 ring-offset-0 ring-offset-transparent " + card.border.replace("border-", "ring-") : ""}`}
          >
            <card.icon className={`h-5 w-5 ${card.color}`} />
            <p className={`text-2xl font-bold ${card.color}`}>{card.count}</p>
            <p className="text-xs text-gray-400">{card.label}</p>
          </motion.button>
        ))}
      </div>

      {/* ── Filter pills ──────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["all", "on_track", "at_risk", "breached"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
              filter === f
                ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                : "text-gray-500 border-white/10 bg-white/5 hover:text-white"
            }`}
          >
            {f === "all" ? "All" : f === "on_track" ? "On Track" : f === "at_risk" ? "At Risk" : "Breached"}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-600">{filtered.length} SLA{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* ── SLA Table ─────────────────────────────────────────── */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <motion.div {...fadeUp()} className="rounded-xl border border-white/10 bg-white/5 px-5 py-10 text-center">
            <ShieldCheck className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No SLAs match this filter</p>
          </motion.div>
        ) : (
          filtered.map((sla, i) => {
            const st = STATUS_STYLE[sla.status];
            const StatusIcon = st.icon;
            const typeColor = SLA_TYPE_COLORS[sla.slaType];
            const daysUntil = Math.ceil((sla.dueDate.getTime() - Date.now()) / 86_400_000);

            return (
              <motion.div
                key={sla.id}
                {...fadeUp(i)}
                whileHover={{ x: 2, boxShadow: "0 4px 16px rgba(0,0,0,0.3)", borderColor: "rgba(255,255,255,0.18)" }}
                className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 flex-wrap"
              >
                {/* Project + type */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{sla.projectTitle}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${typeColor}`}>
                      {SLA_TYPE_LABEL[sla.slaType]}
                    </span>
                    <span className="text-xs text-gray-400">{sla.target}</span>
                  </div>
                </div>

                {/* Due date */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 flex-shrink-0">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {sla.dueDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                    {" · "}
                    <span className={daysUntil < 0 ? "text-red-400" : daysUntil < 3 ? "text-amber-400" : "text-gray-400"}>
                      {daysUntil < 0 ? `${Math.abs(daysUntil)}d overdue` : daysUntil === 0 ? "due today" : `${daysUntil}d left`}
                    </span>
                  </span>
                </div>

                {/* Status badge */}
                <span className={`flex-shrink-0 flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${st.badge}`}>
                  <StatusIcon className="h-3 w-3" />
                  {st.text}
                </span>

                {/* Resolve button */}
                <motion.button
                  whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
                  onClick={() => resolve(sla.id)}
                  className="flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Mark Resolved
                </motion.button>
              </motion.div>
            );
          })
        )}
      </div>

      {/* ── Add SLA Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            onClick={() => setShowAdd(false)}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0, y: 16 }}
              animate={{ scale: 1,    opacity: 1, y: 0  }}
              exit={{   scale: 0.93, opacity: 0, y: 16 }}
              transition={{ duration: 0.22, ease: [0.33, 1, 0.68, 1] as const }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-[#222] bg-[#0a0a0a] shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#222]">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <Plus className="h-4 w-4 text-amber-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Add SLA</h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAdd(false)}
                  className="rounded-xl border border-white/10 bg-white/5 p-2 text-gray-400 hover:text-white transition"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>

              {/* Form */}
              <div className="px-5 py-5 space-y-4">
                {/* Project selector */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Project <span className="text-amber-400">*</span></label>
                  <select
                    value={form.projectId}
                    onChange={e => setForm(f => ({ ...f, projectId: e.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition"
                  >
                    <option value="">Select project…</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                {/* SLA Type */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">SLA Type <span className="text-amber-400">*</span></label>
                  <select
                    value={form.slaType}
                    onChange={e => setForm(f => ({ ...f, slaType: e.target.value as SLAType }))}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition"
                  >
                    {(Object.entries(SLA_TYPE_LABEL) as [SLAType, string][]).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>

                {/* Target */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Target / Description <span className="text-amber-400">*</span></label>
                  <input
                    value={form.target}
                    onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
                    placeholder="e.g. 24h response, Weekly report by Friday"
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 transition"
                  />
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Due Date <span className="text-amber-400">*</span></label>
                  <input
                    type="datetime-local"
                    value={form.dueDate}
                    onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="text-sm text-gray-400 hover:text-white transition px-3 py-2"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: "0 4px 16px rgba(201,168,76,0.3)" }}
                    whileTap={{ scale: 0.96 }}
                    onClick={addSLA}
                    disabled={!form.projectId || !form.target || !form.dueDate}
                    className="flex items-center gap-2 rounded-xl bg-amber-500/20 border border-amber-500/30 px-5 py-2.5 text-sm font-semibold text-amber-400 hover:bg-amber-500/30 transition disabled:opacity-40"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add SLA
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
