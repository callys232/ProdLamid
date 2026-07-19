"use client";

import { useState, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BarChart3, X, Plus, AlertCircle, ArrowUpRight,
  Loader2, TrendingUp, ShieldAlert, Users,
} from "lucide-react";
import DashboardTierGate from "@/components/aivora/DashboardTierGate";

type PageState = "form" | "loading" | "result";

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/* ── Tag input ── */
function TagInput({ label, tags, onAdd, onRemove, placeholder }: {
  label: string; tags: string[];
  onAdd: (v: string) => void; onRemove: (v: string) => void; placeholder: string;
}) {
  const [draft, setDraft] = useState("");
  const commit = () => { const v = draft.trim(); if (v && !tags.includes(v)) onAdd(v); setDraft(""); };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); commit(); } };
  return (
    <div>
      <label className="text-xs font-semibold text-gray-600 dark:text-white/60 mb-1.5 block">{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-2 empty:hidden">
        {tags.map(t => (
          <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#2563EB]/10 border border-[#2563EB]/25 text-[#2563EB]">
            {t}
            <button type="button" onClick={() => onRemove(t)} className="cursor-pointer opacity-60 hover:opacity-100"><X className="w-3 h-3" /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={onKey} placeholder={placeholder}
          className="flex-1 px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-[#2563EB]/50 transition-colors" />
        <button type="button" onClick={commit} className="px-3 py-2.5 rounded-xl border border-[#2563EB]/25 text-[#2563EB] hover:bg-[#2563EB]/8 transition-colors cursor-pointer">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <p className="text-[10px] text-gray-400 dark:text-white/25 mt-1">Press Enter or comma to add</p>
    </div>
  );
}

/* ── Score card ── */
function ScoreCard({ label, value, icon: Icon, invert }: { label: string; value: number; icon: any; invert?: boolean }) {
  const color = invert
    ? value > 66 ? "text-[#2563EB]" : value > 33 ? "text-amber-500" : "text-emerald-500"
    : value > 66 ? "text-emerald-500" : value > 33 ? "text-amber-500" : "text-[#2563EB]";

  return (
    <div className="aivora-card border rounded-2xl p-5 flex flex-col gap-2">
      <Icon className="w-4 h-4 text-[#2563EB]" strokeWidth={2} />
      <div className="flex items-end gap-1">
        <span className={`text-2xl font-extrabold leading-none ${color}`}>{value}</span>
        <span className="text-xs text-gray-400 dark:text-white/30 mb-0.5">/ 100</span>
      </div>
      <p className="text-xs text-gray-500 dark:text-white/40">{label}</p>
      <div className="h-1 rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden mt-1">
        <motion.div
          className="h-full rounded-full bg-[#2563EB]"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

const SEVERITY_COLOR: Record<string, string> = {
  High:   "text-[#2563EB]",
  Medium: "text-amber-500",
  Low:    "text-gray-400 dark:text-white/30",
};

/* ── Page content ── */
function WorkforceContent() {
  const [state, setState] = useState<PageState>("form");
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const [orgName, setOrgName]       = useState("");
  const [industry, setIndustry]     = useState("");
  const [teamSize, setTeamSize]     = useState("");
  const [departments, setDepts]     = useState<string[]>([]);
  const [currSkills, setCurrSkills] = useState<string[]>([]);
  const [skillGaps, setSkillGaps]   = useState<string[]>([]);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [challenge, setChallenge]   = useState("");

  const canSubmit = orgName.trim() && teamSize;

  const submit = async () => {
    if (!canSubmit) return;
    setState("loading");
    setError("");
    try {
      const res = await fetch("/api/talent/workforce", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgName, industry, teamSize: Number(teamSize),
          departments, currentSkills: currSkills,
          skillGaps, strategicPriorities: priorities, challenge,
        }),
      });
      const data = await res.json();
      if (data.success) { setResult(data.result); setState("result"); }
      else { setError(data.message || "Analysis failed."); setState("form"); }
    } catch { setError("Network error. Please try again."); setState("form"); }
  };

  if (state === "loading") {
    return (
      <main className="aivora-section min-h-screen flex items-center justify-center">
        <motion.div {...fadeUp()} className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/25 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-[#2563EB] animate-spin" />
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Analysing workforce data…</p>
          <p className="text-xs text-gray-500 dark:text-white/40">Building your workforce health report</p>
        </motion.div>
      </main>
    );
  }

  if (state === "result" && result) {
    return (
      <main className="aivora-section min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp(0)} className="mb-10">
            <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">LAMID TALENT · Workforce Analytics</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Workforce Health Report</h1>
            <p className="text-sm text-gray-500 dark:text-white/45 max-w-2xl">{result.executiveSummary}</p>
          </motion.div>

          {/* Score cards */}
          <motion.div {...fadeUp(0.05)} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <ScoreCard label="Workforce Health"    value={result.workforceHealthScore ?? 0} icon={Users} />
            <ScoreCard label="Skill Coverage"      value={result.skillCoverageScore    ?? 0} icon={BarChart3} />
            <ScoreCard label="Talent Risk"         value={result.talentRiskScore       ?? 0} icon={ShieldAlert} invert />
            <ScoreCard label="Retention Risk"      value={result.retentionRiskScore    ?? 0} icon={TrendingUp} invert />
          </motion.div>

          {/* KPIs */}
          {result.kpis?.length > 0 && (
            <motion.div {...fadeUp(0.1)} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {result.kpis.map((k: any, i: number) => (
                <div key={i} className="aivora-card border rounded-2xl p-4">
                  <p className="text-lg font-bold text-gray-900 dark:text-white leading-none">{k.value}</p>
                  <p className="text-xs text-gray-500 dark:text-white/40 mt-1">{k.label}</p>
                  {k.trend && <p className="text-[10px] text-gray-400 dark:text-white/25 mt-1 leading-snug">{k.trend}</p>}
                </div>
              ))}
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Signals */}
            {result.signals?.length > 0 && (
              <motion.div {...fadeUp(0.12)} className="aivora-card border rounded-2xl p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Workforce Signals</p>
                <div className="flex flex-col gap-3">
                  {result.signals.map((s: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-white/6 last:border-0 last:pb-0">
                      <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${SEVERITY_COLOR[s.severity] ?? ""}`} strokeWidth={2} />
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white leading-snug">{s.title}</p>
                        <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">{s.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Critical gaps */}
            {result.criticalGaps?.length > 0 && (
              <motion.div {...fadeUp(0.15)} className="aivora-card border rounded-2xl p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Critical Capability Gaps</p>
                <div className="flex flex-col gap-3">
                  {result.criticalGaps.map((g: any, i: number) => (
                    <div key={i} className="pb-3 border-b border-gray-100 dark:border-white/6 last:border-0 last:pb-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{g.area}</p>
                      <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5 leading-snug">{g.impact}</p>
                      <p className="text-xs text-[#2563EB] mt-1">→ {g.remedy}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Plans + hiring */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {result.thirtyDayPlan?.length > 0 && (
              <motion.div {...fadeUp(0.18)} className="aivora-card border rounded-2xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-3">30-Day Actions</p>
                <ol className="flex flex-col gap-2 list-decimal list-inside">
                  {result.thirtyDayPlan.map((a: string, i: number) => <li key={i} className="text-xs text-gray-700 dark:text-white/70 leading-snug">{a}</li>)}
                </ol>
              </motion.div>
            )}
            {result.ninetyDayPlan?.length > 0 && (
              <motion.div {...fadeUp(0.2)} className="aivora-card border rounded-2xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-3">90-Day Actions</p>
                <ol className="flex flex-col gap-2 list-decimal list-inside">
                  {result.ninetyDayPlan.map((a: string, i: number) => <li key={i} className="text-xs text-gray-700 dark:text-white/70 leading-snug">{a}</li>)}
                </ol>
              </motion.div>
            )}
            {result.hiringRecommendations?.length > 0 && (
              <motion.div {...fadeUp(0.22)} className="aivora-card border rounded-2xl p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-3">Hiring Priorities</p>
                <div className="flex flex-col gap-2">
                  {result.hiringRecommendations.map((r: string, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="aivora-gradient-text text-xs shrink-0 mt-0.5">+</span>
                      <p className="text-xs text-gray-700 dark:text-white/70 leading-snug">{r}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <motion.div {...fadeUp(0.25)} className="flex flex-wrap gap-3">
            <button type="button" onClick={() => { setState("form"); setResult(null); }}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-[0_0_14px_rgba(37,99,235,0.35)]">
              New Analysis
            </button>
            <Link href="/talent/mentorship" className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#2563EB]/25 text-[#2563EB] hover:bg-[#2563EB]/8 transition-colors inline-flex items-center gap-1.5">
              Find Mentors <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/talent/capability-diagnostics" className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/40 hover:border-[#2563EB]/30 hover:text-[#2563EB] transition-colors">
              Capability Diagnostics
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="aivora-section min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div {...fadeUp(0)} className="mb-10">
          <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">LAMID TALENT · Workforce Analytics</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Workforce Analytics Engine</h1>
          <p className="text-sm text-gray-500 dark:text-white/45 max-w-lg">
            Input your organisation's workforce composition and our AI delivers a full health analysis — skill coverage, talent risks, and a strategic hiring plan.
          </p>
        </motion.div>

        {error && (
          <motion.div {...fadeUp()} className="mb-6 flex items-start gap-3 rounded-2xl border border-[#2563EB]/20 bg-[#2563EB]/5 px-5 py-4">
            <AlertCircle className="w-4 h-4 text-[#2563EB] mt-0.5 shrink-0" />
            <p className="text-sm text-gray-700 dark:text-white/70">{error}</p>
          </motion.div>
        )}

        <motion.div {...fadeUp(0.05)} className="aivora-card border rounded-2xl p-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-white/60 mb-1.5 block">Organisation Name *</label>
              <input value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="e.g. Acme Corp"
                className="w-full px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-[#2563EB]/50 transition-colors" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-white/60 mb-1.5 block">Industry</label>
              <input value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g. Financial Services"
                className="w-full px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-[#2563EB]/50 transition-colors" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-white/60 mb-1.5 block">Team Size *</label>
            <input type="number" min="1" value={teamSize} onChange={e => setTeamSize(e.target.value)} placeholder="e.g. 45"
              className="w-32 px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-[#2563EB]/50 transition-colors" />
          </div>

          <TagInput label="Departments" tags={departments} onAdd={v => setDepts(p => [...p, v])} onRemove={v => setDepts(p => p.filter(t => t !== v))} placeholder="e.g. Engineering, Sales" />
          <TagInput label="Current Skill Strengths" tags={currSkills} onAdd={v => setCurrSkills(p => [...p, v])} onRemove={v => setCurrSkills(p => p.filter(t => t !== v))} placeholder="e.g. Data Analysis" />
          <TagInput label="Identified Skill Gaps" tags={skillGaps} onAdd={v => setSkillGaps(p => [...p, v])} onRemove={v => setSkillGaps(p => p.filter(t => t !== v))} placeholder="e.g. AI Literacy" />
          <TagInput label="Strategic Priorities" tags={priorities} onAdd={v => setPriorities(p => [...p, v])} onRemove={v => setPriorities(p => p.filter(t => t !== v))} placeholder="e.g. Digital Transformation" />

          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-white/60 mb-1.5 block">Primary Workforce Challenge</label>
            <textarea value={challenge} onChange={e => setChallenge(e.target.value)} rows={2}
              placeholder="What's the biggest talent challenge you're facing right now?"
              className="w-full px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-[#2563EB]/50 transition-colors resize-none" />
          </div>

          <button type="button" onClick={submit} disabled={!canSubmit}
            className="self-start px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-[0_0_14px_rgba(37,99,235,0.35)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Analyse Workforce
          </button>
        </motion.div>

        <motion.div {...fadeUp(0.12)} className="mt-6 flex flex-wrap gap-3">
          <Link href="/talent/capability-diagnostics" className="text-xs text-gray-500 dark:text-white/40 hover:text-[#2563EB] transition-colors inline-flex items-center gap-1">
            Capability Diagnostic <ArrowUpRight className="w-3 h-3" />
          </Link>
          <span className="text-gray-300 dark:text-white/15">·</span>
          <Link href="/talent/mentorship" className="text-xs text-gray-500 dark:text-white/40 hover:text-[#2563EB] transition-colors inline-flex items-center gap-1">
            Mentorship Matching <ArrowUpRight className="w-3 h-3" />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}

export default function WorkforceAnalyticsPage() {
  return (
    <DashboardTierGate pillar="LAMID TALENT" backHref="/talent" backLabel="Back to LAMID TALENT">
      <WorkforceContent />
    </DashboardTierGate>
  );
}
