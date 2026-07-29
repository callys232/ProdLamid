"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Brain, Plus, Trash2, AlertCircle, ArrowUpRight,
  ChevronRight, CheckCircle2, Loader2, BookOpen,
} from "lucide-react";
import DashboardTierGate from "@/components/lamidOne/DashboardTierGate";

type Skill = { name: string; currentLevel: number; targetLevel: number };
type PageState = "form" | "loading" | "result";

const LEVEL_LABELS = ["", "Beginner", "Basic", "Intermediate", "Advanced", "Expert"];
const PRIORITY_COLOR: Record<string, string> = {
  High:   "text-[#2563EB] border-[#2563EB]/30 bg-[#2563EB]/6",
  Medium: "text-amber-500 border-amber-500/30 bg-amber-500/6",
  Low:    "text-gray-600 dark:text-white/55 border-gray-200 dark:border-white/10 bg-transparent",
};

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/* ── Skill row ── */
function SkillRow({ skill, index, onUpdate, onRemove }: {
  skill: Skill;
  index: number;
  onUpdate: (i: number, f: keyof Skill, v: string | number) => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
      <input
        value={skill.name}
        onChange={e => onUpdate(index, "name", e.target.value)}
        placeholder="Skill (e.g. Strategic Planning)"
        className="flex-1 min-w-0 px-3 py-2 rounded-xl text-sm bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-[#2563EB]/50 transition-colors"
      />
      <select
        value={skill.currentLevel}
        onChange={e => onUpdate(index, "currentLevel", Number(e.target.value))}
        title="Current level"
        className="px-2 py-2 rounded-xl text-xs border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-gray-700 dark:text-white/70 focus:outline-none shrink-0"
      >
        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} – {LEVEL_LABELS[n]}</option>)}
      </select>
      <ChevronRight className="w-3.5 h-3.5 text-gray-600 dark:text-white/50 shrink-0 hidden sm:block" />
      <select
        value={skill.targetLevel}
        onChange={e => onUpdate(index, "targetLevel", Number(e.target.value))}
        title="Target level"
        className="px-2 py-2 rounded-xl text-xs border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-gray-700 dark:text-white/70 focus:outline-none shrink-0"
      >
        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} – {LEVEL_LABELS[n]}</option>)}
      </select>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="p-1.5 rounded-lg text-gray-600 hover:text-[#2563EB] transition-colors cursor-pointer shrink-0"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/* ── Score ring ── */
function ScoreRing({ score }: { score: number }) {
  const r = 46;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg viewBox="0 0 108 108" className="absolute inset-0 w-full h-full -rotate-90">
        <circle cx="54" cy="54" r={r} fill="none" stroke="rgba(37,99,235,0.12)" strokeWidth="8" />
        <motion.circle
          cx="54" cy="54" r={r} fill="none" stroke="#2563EB" strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - score / 100) }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold lamidone-gradient-text leading-none">{score}</span>
        <span className="text-[9px] text-gray-600 dark:text-white/55 tracking-wide mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

/* ── Page content (rendered only for premium users) ── */
function CapabilityContent() {
  const [state, setState]   = useState<PageState>("form");
  const [error, setError]   = useState("");
  const [result, setResult] = useState<any>(null);

  const [role, setRole]   = useState("");
  const [industry, setIndustry] = useState("");
  const [years, setYears] = useState("");
  const [goals, setGoals] = useState("");
  const [skills, setSkills] = useState<Skill[]>([
    { name: "", currentLevel: 2, targetLevel: 4 },
    { name: "", currentLevel: 2, targetLevel: 4 },
  ]);

  const addSkill    = () => setSkills(p => [...p, { name: "", currentLevel: 2, targetLevel: 4 }]);
  const removeSkill = (i: number) => setSkills(p => p.filter((_, j) => j !== i));
  const updateSkill = (i: number, f: keyof Skill, v: string | number) =>
    setSkills(p => p.map((s, j) => j === i ? { ...s, [f]: v } : s));

  const validSkills = skills.filter(s => s.name.trim());
  const canSubmit   = role.trim() && goals.trim() && validSkills.length > 0;

  const submit = async () => {
    if (!canSubmit) return;
    setState("loading");
    setError("");
    try {
      const res  = await fetch("/api/talent/capability", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, industry, yearsExperience: Number(years) || 0, skills: validSkills, goals }),
      });
      const data = await res.json();
      if (data.success) { setResult(data.result); setState("result"); }
      else { setError(data.message || "Assessment failed."); setState("form"); }
    } catch { setError("Network error. Please try again."); setState("form"); }
  };

  /* ── Loading ── */
  if (state === "loading") {
    return (
      <main className="lamidone-section min-h-screen flex items-center justify-center">
        <motion.div {...fadeUp()} className="flex flex-col items-center gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/25 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-[#2563EB] animate-spin" strokeWidth={2} />
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">Running capability diagnostic…</p>
          <p className="text-xs text-gray-600 dark:text-white/55">Analysing skill gaps and building your development plan</p>
        </motion.div>
      </main>
    );
  }

  /* ── Results ── */
  if (state === "result" && result) {
    return (
      <main className="lamidone-section min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp(0)} className="mb-10">
            <p className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">LAMID TALENT · Capability Diagnostics</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Diagnostic Report</h1>
            <p className="text-sm text-gray-600 dark:text-white/55">{result.executiveSummary}</p>
          </motion.div>

          {/* Score + readiness */}
          <motion.div {...fadeUp(0.05)} className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            <div className="lamidone-card border rounded-2xl p-6 flex flex-col items-center justify-center gap-3">
              <ScoreRing score={result.overallScore ?? 0} />
              <p className="text-xs text-gray-600 dark:text-white/55">Capability Score</p>
            </div>
            <div className="lamidone-card border rounded-2xl p-6 flex flex-col justify-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-white/55">Readiness Level</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{result.readinessLevel}</p>
              {result.strengths?.map((s: string, i: number) => (
                <div key={i} className="flex items-start gap-2 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 dark:text-white/60 leading-snug">{s}</p>
                </div>
              ))}
            </div>
            <div className="lamidone-card border rounded-2xl p-6 flex flex-col justify-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-white/55">Well-suited For</p>
              {result.recommendedRoles?.map((r: string, i: number) => (
                <p key={i} className="text-sm text-gray-800 dark:text-white/80 leading-snug">→ {r}</p>
              ))}
            </div>
          </motion.div>

          {/* Skill scores */}
          {result.skillScores?.length > 0 && (
            <motion.div {...fadeUp(0.1)} className="lamidone-card border rounded-2xl p-6 mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-white/55 mb-4">Skill Scores</p>
              <div className="flex flex-col gap-4">
                {result.skillScores.map((s: any) => (
                  <div key={s.skill}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-800 dark:text-white/80">{s.skill}</p>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${PRIORITY_COLOR[s.priority] ?? ""}`}>{s.priority}</span>
                      </div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">{s.score}%</p>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-[#2563EB]"
                        initial={{ width: 0 }}
                        animate={{ width: `${s.score}%` }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                      />
                    </div>
                    {s.insight && <p className="text-[11px] text-gray-600 dark:text-white/55 mt-1 leading-snug">{s.insight}</p>}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Top gaps + plans */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {result.topGaps?.length > 0 && (
              <motion.div {...fadeUp(0.15)} className="lamidone-card border rounded-2xl p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-white/55 mb-4">Priority Gaps</p>
                <div className="flex flex-col gap-3">
                  {result.topGaps.map((g: any) => (
                    <div key={g.skill} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-white/6 last:border-0 last:pb-0">
                      <AlertCircle className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" strokeWidth={2} />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{g.skill}</p>
                        <p className="text-xs text-gray-600 dark:text-white/55 mt-0.5 leading-snug">{g.insight}</p>
                        <p className="text-xs text-[#2563EB] mt-1">→ {g.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            <motion.div {...fadeUp(0.2)} className="lamidone-card border rounded-2xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-white/55 mb-4">Action Plans</p>
              {result.thirtyDayPlan?.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] font-semibold text-gray-600 dark:text-white/55 mb-2">30-Day</p>
                  <ol className="flex flex-col gap-1.5 list-decimal list-inside">
                    {result.thirtyDayPlan.map((a: string, i: number) => (
                      <li key={i} className="text-xs text-gray-700 dark:text-white/70 leading-snug">{a}</li>
                    ))}
                  </ol>
                </div>
              )}
              {result.ninetyDayPlan?.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold text-gray-600 dark:text-white/55 mb-2">90-Day</p>
                  <ol className="flex flex-col gap-1.5 list-decimal list-inside">
                    {result.ninetyDayPlan.map((a: string, i: number) => (
                      <li key={i} className="text-xs text-gray-700 dark:text-white/70 leading-snug">{a}</li>
                    ))}
                  </ol>
                </div>
              )}
            </motion.div>
          </div>

          <motion.div {...fadeUp(0.25)} className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => { setState("form"); setResult(null); }}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-[0_0_14px_rgba(37,99,235,0.35)]"
            >
              Run New Diagnostic
            </button>
            <Link href="/talent/mentorship" className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#2563EB]/25 text-[#2563EB] hover:bg-[#2563EB]/8 transition-colors inline-flex items-center gap-1.5">
              Find a Mentor <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/talent/lms" className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/55 hover:border-[#2563EB]/30 hover:text-[#2563EB] transition-colors inline-flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Learning Platform
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  /* ── Form ── */
  return (
    <main className="lamidone-section min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div {...fadeUp(0)} className="mb-10">
          <p className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">LAMID TALENT · A1</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Capability Diagnostics Engine</h1>
          <p className="text-sm text-gray-600 dark:text-white/55 max-w-lg">
            Map your current skills against your target levels. Our AI identifies gaps and builds you a personalised development plan.
          </p>
        </motion.div>

        {error && (
          <motion.div {...fadeUp()} className="mb-6 flex items-start gap-3 rounded-2xl border border-[#2563EB]/20 bg-[#2563EB]/5 px-5 py-4">
            <AlertCircle className="w-4 h-4 text-[#2563EB] mt-0.5 shrink-0" />
            <p className="text-sm text-gray-700 dark:text-white/70">{error}</p>
          </motion.div>
        )}

        <motion.div {...fadeUp(0.05)} className="lamidone-card border rounded-2xl p-6 flex flex-col gap-5">

          {/* Role & industry */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-white/60 mb-1.5 block">Current Role *</label>
              <input
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="e.g. Senior Strategy Manager"
                className="w-full px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-[#2563EB]/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-white/60 mb-1.5 block">Industry</label>
              <input
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                placeholder="e.g. Financial Services"
                className="w-full px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-[#2563EB]/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-white/60 mb-1.5 block">Years of Experience</label>
            <input
              type="number"
              min="0"
              max="50"
              value={years}
              onChange={e => setYears(e.target.value)}
              placeholder="e.g. 7"
              className="w-32 px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-[#2563EB]/50 transition-colors"
            />
          </div>

          {/* Skills */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-600 dark:text-white/60">Skills to Assess *</label>
              <p className="text-[10px] text-gray-600 dark:text-white/55">Current → Target (1–5)</p>
            </div>
            <div className="flex flex-col gap-2">
              {skills.map((s, i) => (
                <SkillRow key={i} skill={s} index={i} onUpdate={updateSkill} onRemove={removeSkill} />
              ))}
            </div>
            <button
              type="button"
              onClick={addSkill}
              className="mt-3 flex items-center gap-1.5 text-xs text-[#2563EB] hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add skill
            </button>
          </div>

          {/* Goals */}
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-white/60 mb-1.5 block">Career Goals *</label>
            <textarea
              value={goals}
              onChange={e => setGoals(e.target.value)}
              rows={3}
              placeholder="What do you want to achieve in the next 12 months? (e.g. transition into a VP role, lead cross-functional projects…)"
              className="w-full px-3 py-2.5 rounded-xl text-sm bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 focus:outline-none focus:border-[#2563EB]/50 transition-colors resize-none"
            />
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className="self-start px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-[0_0_14px_rgba(37,99,235,0.35)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Brain className="w-4 h-4" /> Run Capability Diagnostic
          </button>
        </motion.div>

        <motion.div {...fadeUp(0.12)} className="mt-6 flex flex-wrap gap-3">
          <Link href="/talent/mentorship" className="text-xs text-gray-600 dark:text-white/55 hover:text-[#2563EB] transition-colors inline-flex items-center gap-1">
            Mentorship Matching <ArrowUpRight className="w-3 h-3" />
          </Link>
          <span className="text-gray-600 dark:text-white/50">·</span>
          <Link href="/talent/workforce-analytics" className="text-xs text-gray-600 dark:text-white/55 hover:text-[#2563EB] transition-colors inline-flex items-center gap-1">
            Workforce Analytics <ArrowUpRight className="w-3 h-3" />
          </Link>
          <span className="text-gray-600 dark:text-white/50">·</span>
          <Link href="/talent/lms" className="text-xs text-gray-600 dark:text-white/55 hover:text-[#2563EB] transition-colors inline-flex items-center gap-1">
            Learning Platform <ArrowUpRight className="w-3 h-3" />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}

export default function CapabilityDiagnosticsPage() {
  return (
    <DashboardTierGate pillar="LAMID TALENT" backHref="/talent" backLabel="Back to LAMID TALENT">
      <CapabilityContent />
    </DashboardTierGate>
  );
}
