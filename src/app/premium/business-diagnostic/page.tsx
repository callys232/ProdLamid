"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, Loader2, Copy, CheckCheck, ChevronDown,
  Star, AlertTriangle, TrendingUp, Target, BarChart3,
  Zap, CheckCircle2, Clock, ArrowRight,
} from "lucide-react";

/* ── Types ──────────────────────────────────────────────────────── */
interface Dimension {
  name: string;
  score: number;
  status: "strong" | "moderate" | "weak" | "critical";
  insight: string;
  quickWins: string[];
}

interface DiagnosticReport {
  overallScore: number;
  healthGrade: string;
  headline: string;
  executiveSummary: string;
  dimensions: Dimension[];
  strengths: string[];
  criticalGaps: { gap: string; impact: string; urgency: "high" | "medium" | "low" }[];
  recommendations: {
    title: string;
    description: string;
    effort: "low" | "medium" | "high";
    impact: "low" | "medium" | "high";
    timeframe: string;
  }[];
  actionPlan: { thirtyDays: string[]; ninetyDays: string[]; sixMonths: string[] };
  recommendedServices: { service: string; name: string; reason: string }[];
  benchmarkInsight: string;
  callToAction: string;
}

/* ── Score helpers ──────────────────────────────────────────────── */
function scoreColor(score: number) {
  if (score >= 80) return { text: "text-emerald-400", stroke: "#10b981", badge: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" };
  if (score >= 65) return { text: "text-amber-400",   stroke: "#f59e0b", badge: "bg-amber-500/15 border-amber-500/30 text-amber-400" };
  if (score >= 50) return { text: "text-orange-400",  stroke: "#f97316", badge: "bg-orange-500/15 border-orange-500/30 text-orange-400" };
  return           { text: "text-red-400",            stroke: "#ef4444", badge: "bg-red-500/15 border-red-500/30 text-red-400" };
}

function statusCls(status: string) {
  switch (status) {
    case "strong":   return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    case "moderate": return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    case "weak":     return "bg-orange-500/15 text-orange-400 border-orange-500/30";
    default:         return "bg-red-500/15 text-red-400 border-red-500/30";
  }
}

function levelCls(level: string) {
  switch (level) {
    case "low":    return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    case "medium": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    default:       return "text-red-400 bg-red-500/10 border-red-500/20";
  }
}

function urgencyCls(u: string) {
  switch (u) {
    case "high":   return "bg-red-500/15 text-red-400 border-red-500/30";
    case "medium": return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    default:       return "bg-gray-500/15 text-gray-400 border-gray-500/30";
  }
}

/* ── Score Ring ─────────────────────────────────────────────────── */
function ScoreRing({ score }: { score: number }) {
  const r = 46;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const { stroke, text } = scoreColor(score);
  return (
    <div className="relative flex items-center justify-center w-36 h-36 shrink-0">
      <svg viewBox="0 0 108 108" className="absolute inset-0 w-full h-full -rotate-90">
        <circle cx="54" cy="54" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <motion.circle
          cx="54" cy="54" r={r}
          fill="none" stroke={stroke} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
      </svg>
      <div className="flex flex-col items-center">
        <motion.span
          className={`text-4xl font-extrabold ${text}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-[9px] uppercase tracking-widest text-gray-500 mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

/* ── Collapsible Section ────────────────────────────────────────── */
function Section({ icon: Icon, title, color = "text-[#c21219]", badge, children }: {
  icon: React.ElementType; title: string; color?: string; badge?: string; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-white/[0.03] transition"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-white">
          <Icon className={`h-4 w-4 shrink-0 ${color}`} />
          {title}
          {badge && (
            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-white/10 text-gray-400 border border-white/10">
              {badge}
            </span>
          )}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-gray-600" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            transition={{ duration: 0.22 }} style={{ overflow: "hidden" }}
          >
            <div className="px-5 pb-5 border-t border-white/[0.06] pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function BusinessDiagnostic() {
  const [form, setForm] = useState({
    businessName: "", industry: "", stage: "", yearsInOperation: "",
    teamSize: "", revenueRange: "", primaryMarket: "",
    challenges: "", goals: "", strengths: "", motivation: "",
  });
  const [report,  setReport]  = useState<DiagnosticReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [copied,  setCopied]  = useState(false);

  const set = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const REQUIRED = ["businessName", "challenges", "goals"] as const;
  const filled   = REQUIRED.filter((k) => form[k].trim()).length;
  const progress = Math.round((filled / REQUIRED.length) * 100);

  const run = async () => {
    if (!form.businessName) { setError("Business name is required."); return; }
    if (!form.challenges)   { setError("Please describe your key challenges."); return; }
    if (!form.goals)        { setError("Please describe your strategic goals."); return; }
    setLoading(true); setError(""); setReport(null);
    try {
      const res  = await fetch("/api/ai/diagnose", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setReport(data.report);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate diagnostic.");
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    if (!report) return;
    const lines = [
      `BUSINESS DIAGNOSTIC REPORT — ${form.businessName.toUpperCase()}`,
      `Generated by Lamid Consulting`,
      ``,
      `OVERALL SCORE: ${report.overallScore}/100  |  Grade: ${report.healthGrade}`,
      ``,
      report.headline,
      ``,
      `${"═".repeat(40)}`,
      `EXECUTIVE SUMMARY`,
      `${"═".repeat(40)}`,
      report.executiveSummary,
      ``,
      `DIMENSION SCORES`,
      `${"─".repeat(40)}`,
      ...report.dimensions.map((d) => `  ${d.name}: ${d.score}/100 [${d.status.toUpperCase()}]\n  ${d.insight}`),
      ``,
      `STRENGTHS`,
      `${"─".repeat(40)}`,
      ...report.strengths.map((s) => `  ✓ ${s}`),
      ``,
      `CRITICAL GAPS`,
      `${"─".repeat(40)}`,
      ...report.criticalGaps.map((g) => `  [${g.urgency.toUpperCase()}] ${g.gap}\n  Impact: ${g.impact}`),
      ``,
      `RECOMMENDATIONS`,
      `${"─".repeat(40)}`,
      ...report.recommendations.map((r) => `  • ${r.title} (${r.timeframe})\n  ${r.description}`),
      ``,
      `ACTION PLAN`,
      `${"─".repeat(40)}`,
      `First 30 Days:`, ...report.actionPlan.thirtyDays.map((a) => `  → ${a}`),
      `30–90 Days:`,    ...report.actionPlan.ninetyDays.map((a) => `  → ${a}`),
      `3–6 Months:`,    ...report.actionPlan.sixMonths.map((a) => `  → ${a}`),
      ``,
      `RECOMMENDED SERVICES`,
      `${"─".repeat(40)}`,
      ...report.recommendedServices.map((s) => `  [${s.service}] ${s.name}\n  ${s.reason}`),
      ``,
      report.benchmarkInsight,
      ``,
      `NEXT STEPS`,
      `${"─".repeat(40)}`,
      report.callToAction,
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const inputCls  = "w-full rounded-xl bg-black border border-white/10 text-white text-sm px-4 py-2.5 focus:outline-none focus:border-[#c21219]/60 focus:ring-1 focus:ring-[#c21219]/20 placeholder-gray-600 transition";
  const selectCls = inputCls + " appearance-none cursor-pointer bg-[#111111]";
  const textaCls  = inputCls + " resize-none";

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10 md:px-12">

      {/* ── Page Header ── */}
      <div className="max-w-6xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#c21219] border border-[#c21219]/30 bg-[#c21219]/10 px-3 py-1 rounded-full mb-3">
          <Star className="h-3 w-3" /> Premium Feature
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent leading-tight">
          AI Business Diagnostic
        </h1>
        <p className="mt-2 text-sm text-gray-400 max-w-xl">
          Get a comprehensive health assessment across 7 business dimensions — scored insights,
          critical gap analysis, and a prioritised action plan. Powered by Claude Sonnet&nbsp;4.6.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Claude Sonnet 4.6 · 7 Dimensions · via OpenRouter
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">

        {/* ── LEFT: Form ── */}
        <div className="flex flex-col gap-5">

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#c21219] to-red-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <span className="text-[10px] font-bold text-gray-500 shrink-0">{progress}% complete</span>
          </div>

          {/* Section 1: Business Profile */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 flex flex-col gap-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Business Profile</h2>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block mb-1.5">
                Business Name <span className="text-[#c21219]">*</span>
              </label>
              <input value={form.businessName} onChange={set("businessName")}
                placeholder="e.g. Apex Logistics Ltd" className={inputCls} />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block mb-1.5">Industry / Sector</label>
              <select value={form.industry} onChange={set("industry")} className={selectCls} aria-label="Industry" title="Industry">
                <option value="" className="bg-[#111111]">Select industry…</option>
                {[
                  "Financial Services", "Technology & Software", "Healthcare & Pharma",
                  "FMCG & Retail", "Real Estate & Construction", "Energy & Utilities",
                  "Agriculture & Agritech", "Logistics & Supply Chain", "Education & EdTech",
                  "Media & Entertainment", "Professional Services", "Manufacturing",
                  "NGO / Non-profit", "Government & Public Sector", "Other",
                ].map((o) => <option key={o} className="bg-[#111111]">{o}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block mb-1.5">Stage</label>
                <select value={form.stage} onChange={set("stage")} className={selectCls} aria-label="Stage" title="Stage">
                  <option value="" className="bg-[#111111]">Select…</option>
                  {["Startup", "Growth", "Scale-up", "Mature", "Turnaround"].map((o) => (
                    <option key={o} className="bg-[#111111]">{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block mb-1.5">Years Operating</label>
                <select value={form.yearsInOperation} onChange={set("yearsInOperation")} className={selectCls} aria-label="Years Operating" title="Years Operating">
                  <option value="" className="bg-[#111111]">Select…</option>
                  {["Less than 1 year", "1–2 years", "3–5 years", "6–10 years", "11–20 years", "20+ years"].map((o) => (
                    <option key={o} className="bg-[#111111]">{o}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Scale & Market */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 flex flex-col gap-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Scale & Market</h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block mb-1.5">Team Size</label>
                <select value={form.teamSize} onChange={set("teamSize")} className={selectCls} aria-label="Team Size" title="Team Size">
                  <option value="" className="bg-[#111111]">Select…</option>
                  {["1–5", "6–15", "16–50", "51–200", "201–500", "500+"].map((o) => (
                    <option key={o} className="bg-[#111111]">{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block mb-1.5">Annual Revenue</label>
                <select value={form.revenueRange} onChange={set("revenueRange")} className={selectCls} aria-label="Annual Revenue" title="Annual Revenue">
                  <option value="" className="bg-[#111111]">Select…</option>
                  {["Pre-revenue", "< ₦10M", "₦10M–₦50M", "₦50M–₦250M", "₦250M–₦1B", "₦1B–₦5B", "₦5B+"].map((o) => (
                    <option key={o} className="bg-[#111111]">{o}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block mb-1.5">Primary Market</label>
              <select value={form.primaryMarket} onChange={set("primaryMarket")} className={selectCls} aria-label="Primary Market" title="Primary Market">
                <option value="" className="bg-[#111111]">Select…</option>
                {["Nigeria", "West Africa", "East Africa", "Southern Africa", "Pan-Africa", "Global"].map((o) => (
                  <option key={o} className="bg-[#111111]">{o}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 3: Challenges & Goals */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 flex flex-col gap-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Challenges & Goals</h2>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block mb-1.5">
                Key Challenges <span className="text-[#c21219]">*</span>
              </label>
              <textarea rows={3} value={form.challenges} onChange={set("challenges")}
                placeholder="What are the 2–3 biggest challenges holding your business back right now?"
                className={textaCls} />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block mb-1.5">
                Strategic Goals <span className="text-[#c21219]">*</span>
              </label>
              <textarea rows={3} value={form.goals} onChange={set("goals")}
                placeholder="What does success look like in the next 12 months?"
                className={textaCls} />
            </div>
          </div>

          {/* Section 4: Additional Context */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 flex flex-col gap-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Additional Context</h2>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block mb-1.5">What's working well?</label>
              <textarea rows={2} value={form.strengths} onChange={set("strengths")}
                placeholder="Share current strengths, competitive advantages, or recent wins…"
                className={textaCls} />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 block mb-1.5">What prompted this diagnostic?</label>
              <textarea rows={2} value={form.motivation} onChange={set("motivation")}
                placeholder="e.g. Planning a fundraise, launching in a new market, restructuring…"
                className={textaCls} />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 flex items-center gap-1.5 px-1">
              <span className="inline-block w-1 h-1 rounded-full bg-red-400 shrink-0" />{error}
            </p>
          )}

          <button
            type="button"
            onClick={run}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#c21219] to-red-700
                       hover:from-red-700 hover:to-red-800 text-white font-extrabold text-sm
                       shadow-[0_8px_32px_rgba(194,18,25,0.35)]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition flex items-center justify-center gap-2"
          >
            {loading
              ? <><Loader2 className="h-4 w-4 animate-spin" />Running diagnostic…</>
              : <><Activity className="h-4 w-4" />Run Diagnostic</>}
          </button>
        </div>

        {/* ── RIGHT: Report ── */}
        <div className="flex flex-col gap-4 min-h-[400px]">

          {/* Empty state */}
          {!report && !loading && (
            <div className="flex-1 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center p-16 text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                <Activity className="h-7 w-7 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-400">Your diagnostic report will appear here</p>
                <p className="text-xs text-gray-600 mt-1">Claude will score 7 business dimensions and build an action plan</p>
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col items-center justify-center p-16 gap-4">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-2 border-[#c21219]/20" />
                <div className="absolute inset-0 rounded-full border-t-2 border-[#c21219] animate-spin" />
                <Activity className="absolute inset-0 m-auto w-5 h-5 text-[#c21219]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-300">Analysing your business…</p>
                <p className="text-xs text-gray-600 mt-1">Scoring 7 dimensions · Building action plan</p>
              </div>
            </div>
          )}

          {/* Report */}
          <AnimatePresence>
            {report && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3"
              >
                {/* Toolbar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Report ready</span>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      7 dimensions
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={copyAll}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border border-white/15 text-gray-300 hover:border-white/40 hover:text-white transition"
                  >
                    {copied
                      ? <><CheckCheck className="h-3.5 w-3.5 text-emerald-400" />Copied!</>
                      : <><Copy className="h-3.5 w-3.5" />Copy report</>}
                  </button>
                </div>

                {/* ── Overall Score Card ── */}
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <ScoreRing score={report.overallScore} />
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex items-center gap-2 mb-2 justify-center sm:justify-start flex-wrap">
                        <span className={`text-3xl font-extrabold ${scoreColor(report.overallScore).text}`}>
                          {report.healthGrade}
                        </span>
                        <span className="text-xs text-gray-500">Business Health Grade</span>
                      </div>
                      <p className="text-sm font-semibold text-white leading-snug">{report.headline}</p>
                      <div className="flex gap-2 mt-3 flex-wrap justify-center sm:justify-start">
                        {report.dimensions.slice(0, 5).map((d) => (
                          <span key={d.name} className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${scoreColor(d.score).badge}`}>
                            {d.score}
                          </span>
                        ))}
                        <span className="text-[9px] text-gray-600 self-center">dim scores</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Executive Summary ── */}
                <Section icon={BarChart3} title="Executive Summary">
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line text-justify">
                    {report.executiveSummary}
                  </p>
                </Section>

                {/* ── 7 Dimensions Grid ── */}
                <Section icon={Activity} title="Dimension Scores" color="text-blue-400" badge="7 areas">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {report.dimensions.map((d) => {
                      const c = scoreColor(d.score);
                      return (
                        <div key={d.name} className="rounded-xl bg-white/[0.03] border border-white/[0.07] px-4 py-3 flex flex-col gap-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-white">{d.name}</span>
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${statusCls(d.status)}`}>
                              {d.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: c.stroke }}
                                initial={{ width: 0 }}
                                animate={{ width: `${d.score}%` }}
                                transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
                              />
                            </div>
                            <span className={`text-xs font-bold shrink-0 ${c.text}`}>{d.score}</span>
                          </div>
                          <p className="text-[11px] text-gray-400 leading-relaxed">{d.insight}</p>
                          {d.quickWins?.length > 0 && (
                            <div className="flex flex-col gap-1 pt-1.5 border-t border-white/[0.05]">
                              {d.quickWins.map((w, i) => (
                                <p key={i} className="text-[10px] text-gray-500 flex gap-1.5 leading-relaxed">
                                  <Zap className="w-3 h-3 text-amber-500/60 shrink-0 mt-0.5" />{w}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Section>

                {/* ── Strengths ── */}
                <Section icon={CheckCircle2} title="Business Strengths" color="text-emerald-400">
                  <ul className="space-y-1.5">
                    {report.strengths.map((s, i) => (
                      <li key={i} className="text-xs text-gray-300 flex gap-2 leading-relaxed">
                        <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>{s}
                      </li>
                    ))}
                  </ul>
                </Section>

                {/* ── Critical Gaps ── */}
                <Section icon={AlertTriangle} title="Critical Gaps" color="text-orange-400">
                  <div className="flex flex-col gap-3">
                    {report.criticalGaps.map((g, i) => (
                      <div key={i} className="rounded-xl bg-white/[0.03] border border-white/[0.07] px-4 py-3">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <p className="text-xs font-semibold text-white">{g.gap}</p>
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${urgencyCls(g.urgency)}`}>
                            {g.urgency}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-relaxed">{g.impact}</p>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* ── Recommendations ── */}
                <Section icon={Target} title="Priority Recommendations" color="text-[#c21219]">
                  <div className="flex flex-col gap-3">
                    {report.recommendations.map((r, i) => (
                      <div key={i} className="rounded-xl bg-white/[0.03] border border-white/[0.07] px-4 py-3">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                            <span className="text-[#c21219] shrink-0">▸</span>{r.title}
                          </p>
                          <span className="text-[9px] text-gray-500 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                            {r.timeframe}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-relaxed mb-2">{r.description}</p>
                        <div className="flex gap-2 flex-wrap">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${levelCls(r.effort)}`}>
                            Effort: {r.effort}
                          </span>
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${levelCls(r.impact)}`}>
                            Impact: {r.impact}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* ── Action Plan ── */}
                <Section icon={Clock} title="Action Plan" color="text-purple-400" badge="3 horizons">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {([
                      { label: "First 30 Days", key: "thirtyDays", color: "text-emerald-400", border: "border-emerald-500/20" },
                      { label: "30–90 Days",    key: "ninetyDays", color: "text-amber-400",   border: "border-amber-500/20" },
                      { label: "3–6 Months",    key: "sixMonths",  color: "text-purple-400",  border: "border-purple-500/20" },
                    ] as { label: string; key: keyof typeof report.actionPlan; color: string; border: string }[]).map(({ label, key, color, border }) => (
                      <div key={key} className={`rounded-xl bg-white/[0.03] border ${border} p-3`}>
                        <p className={`text-[10px] font-black uppercase tracking-wider ${color} mb-2`}>{label}</p>
                        <ul className="space-y-1.5">
                          {report.actionPlan[key].map((a, i) => (
                            <li key={i} className="text-[10px] text-gray-400 flex gap-1.5 leading-relaxed">
                              <ArrowRight className={`w-3 h-3 ${color} shrink-0 mt-0.5`} />{a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* ── Recommended Services ── */}
                <Section icon={Star} title="Recommended Lamid Services" color="text-[#c21219]">
                  <div className="flex flex-col gap-3">
                    {report.recommendedServices.map((s, i) => (
                      <div key={i} className="rounded-xl bg-white/[0.03] border border-white/[0.07] px-4 py-3 flex items-start gap-3">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-[#c21219]/15 text-[#c21219] border border-[#c21219]/30 shrink-0">
                          {s.service}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-white mb-0.5">{s.name}</p>
                          <p className="text-[11px] text-gray-400 leading-relaxed">{s.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>

                {/* ── Benchmark ── */}
                {report.benchmarkInsight && (
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-400" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Market Benchmark</p>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{report.benchmarkInsight}</p>
                  </div>
                )}

                {/* ── CTA ── */}
                <div className="rounded-2xl border border-[#c21219]/30 bg-gradient-to-br from-[#c21219]/[0.07] to-transparent px-6 py-5">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-[#c21219]" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#c21219]">Next Steps</p>
                  </div>
                  <p className="text-sm text-gray-200 leading-relaxed">{report.callToAction}</p>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
