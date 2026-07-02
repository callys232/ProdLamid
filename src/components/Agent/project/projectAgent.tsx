"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, ChevronRight, CheckCircle2, AlertCircle,
  Clock, RefreshCw, Loader2, Plus, Lightbulb,
} from "lucide-react";

/* ── Step audit types ───────────────────────────────────────── */
interface StepField {
  label:    string;
  value:    string | null;
  required: boolean;
}

interface Step {
  id:     number;
  label:  string;
  icon:   string;
  fields: StepField[];
}

interface ProjectMeta {
  _id:   string;
  title: string;
}

interface FullProject {
  _id:         string;
  title?:      string;
  category?:   string;
  deadline?:   string;
  tags?:       string[];
  budget?:     number;
  hourlyRate?: number;
  type?:       string;
  description?:string;
  skills?:     string[];
  workPhases?: any[];
  milestones?: any[];
  purpose?:    string;
  extraField?: string;
  images?:     string[];
  status?:     string;
  consultants?:any[];
  milestoneProgress?: number;
}

/* ── Step builder: maps project → 5 posting steps ────────────── */
function buildSteps(p: FullProject): Step[] {
  return [
    {
      id: 0, label: "Details", icon: "📝",
      fields: [
        { label: "Title",    value: p.title    || null, required: true },
        { label: "Category", value: p.category || null, required: true },
        { label: "Deadline", value: p.deadline || null, required: false },
        { label: "Tags",     value: p.tags?.length ? `${p.tags.length} tag${p.tags.length > 1 ? "s" : ""}` : null, required: false },
      ],
    },
    {
      id: 1, label: "Budget", icon: "💰",
      fields: [
        { label: "Budget",      value: p.budget     ? `$${p.budget.toLocaleString()}` : null, required: false },
        { label: "Hourly Rate", value: p.hourlyRate ? `$${p.hourlyRate}/hr`           : null, required: false },
        { label: "Type",        value: p.type       || null,                                  required: false },
      ],
    },
    {
      id: 2, label: "Description", icon: "📄",
      fields: [
        { label: "Description", value: p.description ? `${p.description.slice(0, 40)}…` : null, required: true },
        { label: "Skills",      value: p.skills?.length ? `${p.skills.length} skill${p.skills.length > 1 ? "s" : ""}` : null, required: false },
        { label: "Phases",      value: p.workPhases?.length ? `${p.workPhases.length} phase${p.workPhases.length > 1 ? "s" : ""}` : null, required: false },
        { label: "Milestones",  value: p.milestones?.length ? `${p.milestones.length} milestone${p.milestones.length > 1 ? "s" : ""}` : null, required: false },
      ],
    },
    {
      id: 3, label: "Extras", icon: "✨",
      fields: [
        { label: "Purpose",    value: p.purpose    || null, required: false },
        { label: "Extra Info", value: p.extraField || null, required: false },
        { label: "Images",     value: p.images?.length ? `${p.images.length} image${p.images.length > 1 ? "s" : ""}` : null, required: false },
      ],
    },
    {
      id: 4, label: "Team", icon: "👥",
      fields: [
        { label: "Status",      value: p.status     || null, required: true },
        { label: "Consultants", value: p.consultants?.length ? `${p.consultants.length} assigned` : "None assigned", required: false },
        { label: "Progress",    value: p.milestoneProgress != null ? `${p.milestoneProgress}%` : null, required: false },
      ],
    },
  ];
}

/* ── Score a step ─────────────────────────────────────────────── */
function stepScore(step: Step) {
  const total  = step.fields.length;
  const filled = step.fields.filter(f => f.value !== null).length;
  return { filled, total, pct: Math.round((filled / total) * 100) };
}

/* ── Recommendations based on missing data ───────────────────── */
function getRecommendations(steps: Step[], p: FullProject): string[] {
  const tips: string[] = [];
  if (!p.deadline)                         tips.push("Add a deadline — it increases bid quality by 40%.");
  if (!p.budget && !p.hourlyRate)          tips.push("Set a budget or hourly rate to attract the right consultants.");
  if (!p.description)                      tips.push("Write a description — it's the #1 factor consultants read.");
  if (!p.skills?.length)                   tips.push("Add required skills so AI matching works correctly.");
  if (!p.milestones?.length)               tips.push("Break the project into milestones to unlock escrow payments.");
  if (!p.workPhases?.length)               tips.push("Define work phases to give consultants a clear execution map.");
  if (!p.consultants?.length && p.status === "open")
                                           tips.push("No consultants assigned — run AI Match to find the best fit.");
  if (p.consultants?.length && !p.milestones?.length)
                                           tips.push("Consultants are assigned but there are no milestones — add milestones to track progress.");
  if ((p.milestoneProgress ?? 0) === 0 && p.status === "ongoing")
                                           tips.push("Project is ongoing but milestone progress is 0% — update milestone statuses.");
  return tips.slice(0, 3);
}

/* ── Component ───────────────────────────────────────────────── */
interface MilestoneItem {
  title: string;
  description: string;
  durationDays: number;
  payment_percentage: number;
  acceptance_criteria: string;
}

interface Phase {
  name: string;
  duration: string;
  milestones: MilestoneItem[];
}

interface MilestonePlan {
  phases: Phase[];
  totalDurationWeeks: number;
  riskFlags: string[];
  recommendations: string;
}

export default function ProjectAgent() {
  const [projects,   setProjects]   = useState<ProjectMeta[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [project,    setProject]    = useState<FullProject | null>(null);
  const [steps,      setSteps]      = useState<Step[]>([]);
  const [openStep,   setOpenStep]   = useState<number | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [tips,       setTips]       = useState<string[]>([]);
  const [plan,       setPlan]       = useState<MilestonePlan | null>(null);
  const [planOpen,   setPlanOpen]   = useState(false);
  const [generating, setGenerating] = useState(false);

  const generateMilestonePlan = async () => {
    if (!project || generating) return;
    setGenerating(true);
    setPlan(null);
    setPlanOpen(false);
    try {
      const res  = await fetch("/api/ai/milestones", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          title:       project.title,
          description: project.description,
          category:    project.category,
          skills:      project.skills,
          budget:      project.budget,
          timeline:    project.deadline,
        }),
      });
      const data = await res.json();
      if (data.plan) { setPlan(data.plan); setPlanOpen(true); }
    } catch {
      /* silent — user can retry */
    } finally {
      setGenerating(false);
    }
  };

  // Fetch project list
  useEffect(() => {
    fetch("/api/projects?role=owner&limit=10")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        const list: ProjectMeta[] = (d?.data ?? []).map((p: any) => ({
          _id: p._id ?? p.id, title: p.title,
        }));
        setProjects(list);
        if (list.length) setSelectedId(list[0]._id);
      })
      .catch(() => {});
  }, []);

  // Fetch full project when selection changes
  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    setProject(null);
    fetch(`/api/projects/${selectedId}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        const p: FullProject = d?.data ?? d ?? null;
        if (p) {
          setProject(p);
          const s = buildSteps(p);
          setSteps(s);
          setTips(getRecommendations(s, p));
          // Auto-open first incomplete required step
          const firstIncomplete = s.find(step =>
            step.fields.some(f => f.required && f.value === null)
          );
          setOpenStep(firstIncomplete?.id ?? null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedId]);

  // Overall project health score
  const health = steps.length
    ? Math.round(steps.reduce((acc, s) => acc + stepScore(s).pct, 0) / steps.length)
    : 0;

  const healthColor = health >= 80 ? "#10b981" : health >= 50 ? "#eab308" : "#ef4444";

  return (
    <div className="space-y-2 text-white text-xs">

      {/* Project selector */}
      {projects.length > 0 && (
        <div className="flex items-center gap-2">
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            className="flex-1 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-xs text-gray-100 px-2.5 py-1.5 focus:outline-none focus:border-[#3b82f6]/50 [&>option]:bg-[#1a1a1a] [&>option]:text-gray-100"
          >
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.title}</option>
            ))}
          </select>
          <button
            onClick={() => setSelectedId(prev => { const s = prev; setSelectedId(""); setTimeout(() => setSelectedId(s), 10); return prev; })}
            className="p-1.5 rounded-lg text-gray-600 hover:text-white transition-colors"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
        </div>
      )}

      {!loading && project && (
        <>
          {/* Health score bar */}
          <div className="bg-[#111] rounded-lg border border-[#1f1f1f] px-3 py-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">Project Health</span>
              <span className="font-bold text-xs" style={{ color: healthColor }}>{health}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#222] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: healthColor }}
                initial={{ width: 0 }}
                animate={{ width: `${health}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Step audit accordion */}
          <div className="space-y-1">
            {steps.map(step => {
              const { filled, total, pct } = stepScore(step);
              const isOpen    = openStep === step.id;
              const allFilled = filled === total;
              const hasMissing = step.fields.some(f => f.required && !f.value);

              return (
                <div key={step.id} className="rounded-lg border border-[#1f1f1f] bg-[#111] overflow-hidden">
                  {/* Step header */}
                  <button
                    onClick={() => setOpenStep(isOpen ? null : step.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/[0.03] transition-colors"
                  >
                    <span className="text-sm leading-none">{step.icon}</span>
                    <span className="flex-1 font-medium text-[11px] text-white">{step.label}</span>

                    {/* Mini progress */}
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1 rounded-full bg-[#222] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, backgroundColor: allFilled ? "#10b981" : hasMissing ? "#ef4444" : "#eab308" }}
                        />
                      </div>
                      <span className="text-[9px] text-gray-600 w-8 text-right">{filled}/{total}</span>
                    </div>

                    {hasMissing
                      ? <AlertCircle className="h-3 w-3 text-red-400 flex-shrink-0" />
                      : <CheckCircle2 className="h-3 w-3 text-emerald-400 flex-shrink-0" />}
                    {isOpen ? <ChevronDown className="h-3 w-3 text-gray-600 flex-shrink-0" /> : <ChevronRight className="h-3 w-3 text-gray-600 flex-shrink-0" />}
                  </button>

                  {/* Step fields */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden border-t border-[#1f1f1f]"
                      >
                        <div className="px-3 py-2 space-y-1.5">
                          {step.fields.map(field => (
                            <div key={field.label} className="flex items-center justify-between gap-2">
                              <span className="text-[10px] text-gray-600 flex-shrink-0">
                                {field.required && !field.value
                                  ? <span className="text-red-500">* </span>
                                  : null
                                }
                                {field.label}
                              </span>
                              {field.value
                                ? <span className="text-[10px] text-gray-300 truncate max-w-[120px] text-right">{field.value}</span>
                                : <span className="text-[10px] text-gray-700 italic">{field.required ? "Required" : "Not set"}</span>
                              }
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* AI recommendations */}
          {tips.length > 0 && (
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-3 py-2 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Lightbulb className="h-3 w-3 text-yellow-400" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-yellow-400">Agent Insights</span>
              </div>
              {tips.map((tip, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="text-[10px] text-gray-400 pl-4 border-l border-yellow-500/20"
                >
                  {tip}
                </motion.p>
              ))}
            </div>
          )}

          {tips.length === 0 && health === 100 && (
            <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <p className="text-[10px] text-emerald-400">Project is fully set up — no gaps detected.</p>
            </div>
          )}

          {/* ── AI Milestone Generator ── */}
          <div className="rounded-lg border border-[#3b82f6]/20 bg-[#3b82f6]/5 px-3 py-2.5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">🗂️</span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#3b82f6]">AI Milestone Plan</span>
              </div>
              <button
                type="button"
                onClick={generateMilestonePlan}
                disabled={generating}
                className="flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-md bg-[#3b82f6]/20 hover:bg-[#3b82f6]/35 text-[#3b82f6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating
                  ? <><Loader2 className="h-2.5 w-2.5 animate-spin" /> Generating…</>
                  : <><Plus className="h-2.5 w-2.5" /> Generate</>}
              </button>
            </div>

            {!plan && !generating && (
              <p className="text-[10px] text-gray-600">
                Let AI break this project into phases, milestones, and payment percentages.
              </p>
            )}

            {/* Generated plan */}
            <AnimatePresence>
              {plan && planOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden space-y-1.5 pt-1"
                >
                  <div className="flex items-center justify-between text-[9px] text-gray-500 pb-1 border-b border-white/5">
                    <span>{plan.phases.length} phases · {plan.totalDurationWeeks}w total</span>
                    <button type="button" onClick={() => setPlanOpen(false)} className="hover:text-white transition-colors">collapse</button>
                  </div>
                  {plan.phases.map((phase, pi) => (
                    <div key={pi} className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold text-[#3b82f6]">{phase.name}</span>
                        <span className="text-[8px] text-gray-600">· {phase.duration}</span>
                      </div>
                      {phase.milestones.map((m, mi) => (
                        <div key={mi} className="ml-2 pl-2 border-l border-[#3b82f6]/20 space-y-0.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[9px] text-gray-300 font-medium">{m.title}</span>
                            <span className="text-[8px] text-[#3b82f6] shrink-0">{m.payment_percentage}%</span>
                          </div>
                          <p className="text-[8px] text-gray-600 leading-snug">{m.acceptance_criteria}</p>
                        </div>
                      ))}
                    </div>
                  ))}
                  {plan.recommendations && (
                    <p className="text-[9px] text-yellow-400/70 pt-1 border-t border-white/5">
                      💡 {plan.recommendations}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {plan && !planOpen && (
              <button type="button" onClick={() => setPlanOpen(true)} className="text-[9px] text-[#3b82f6] hover:underline">
                Show {plan.phases.length}-phase plan →
              </button>
            )}
          </div>
        </>
      )}

      {!loading && projects.length === 0 && (
        <div className="text-center py-6 text-gray-600">
          <p className="text-[11px]">No projects found.</p>
          <a href="/postjobs" className="text-[10px] text-[#3b82f6] hover:underline mt-1 inline-flex items-center gap-1">
            <Plus className="h-3 w-3" /> Post your first project
          </a>
        </div>
      )}
    </div>
  );
}
