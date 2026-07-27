"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Loader2, AlertCircle, ArrowUpRight, RefreshCw, Copy, CheckCheck,
  Building2, Briefcase, Users, Target, MessageSquare, ChevronDown, ChevronUp,
  Download, Printer, History,
} from "lucide-react";
import type { ModuleConfig } from "@/lib/intelligence/moduleRegistry";
import { useGate } from "@/contexts/GateContext";
import EngineResultsGate from "./EngineResultsGate";
import TimeSeriesIntake from "./TimeSeriesIntake";
import FinancialIntake from "./FinancialIntake";
import RosterIntake from "./RosterIntake";
import ScenarioIntake from "./ScenarioIntake";
import { financialsToPrompt } from "@/lib/intelligence/financial";
import type { SeriesStats } from "@/lib/intelligence/inputSpec";
import { seriesStatsToPrompt } from "@/lib/intelligence/inputSpec";
import type { ComputedDimension } from "@/lib/intelligence/dimensions";
import {
  seriesDimensions, financialDimensions, rosterDimensions, scenarioDimensions,
} from "@/lib/intelligence/dimensions";
import { savePendingRun, loadPendingRun, clearPendingRun } from "@/lib/intelligence/pendingRun";

/* ── Types ────────────────────────────────────────────────── */
interface KPI        { label: string; value: string; trend: string }
interface Signal     { severity: "High" | "Medium" | "Low"; title: string; action: string }
interface Dimension  { label: string; value: number; insight?: string }

interface IntelligenceResult {
  executiveSummary:    string;
  kpis:                KPI[];
  signals:             Signal[];
  dimensions:          Dimension[];
  distortionIndex:     string;
  correctionPriority:  string;
  correctionReason:    string;
  thirtyDayPlan:       string[];
  ninetyDayPlan:       string[];
}

interface PastRun {
  _id:               string;
  organisationName?: string;
  runAt:             string;
  scores?:           { label: string; value: number }[];
}

interface IntelligenceModuleProps {
  config: ModuleConfig;
}

const fadeUp = (d = 0) => ({ initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.45, delay: d } });

/* ── Intake Form ──────────────────────────────────────────── */
function IntakeForm({ config, onSubmit, loading }: {
  config: ModuleConfig;
  onSubmit: (context: Record<string, string>) => void;
  loading: boolean;
}) {
  const STORAGE_KEY = "lamid-intake-context";

  const [form, setForm] = useState({
    organisationName:  "",
    industry:          "",
    size:              "",
    challenge:         "",
    goal:              "",
    additionalContext: "",
  });

  /* Organisation context is the same across every module — restore it so users
     aren't retyping the same four fields on each run. Module-specific fields
     (challenge, goal) stay blank deliberately. */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const { organisationName, industry, size } = JSON.parse(saved);
      setForm((f) => ({ ...f, organisationName: organisationName ?? "", industry: industry ?? "", size: size ?? "" }));
    } catch {
      /* corrupt or unavailable storage — fall back to an empty form */
    }
  }, []);

  const persistContext = (f: typeof form) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        organisationName: f.organisationName, industry: f.industry, size: f.size,
      }));
    } catch { /* storage full or blocked — not worth interrupting the run */ }
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const inputCls  = "w-full rounded-xl bg-white dark:bg-black border border-gray-300 dark:border-white/20 text-black dark:text-white text-sm px-4 py-2.5 focus:outline-none focus:border-[#2563EB]/60 focus:ring-1 focus:ring-[#2563EB]/20 placeholder-gray-500 dark:placeholder-white/40 transition";
  const selectCls = inputCls + " appearance-none cursor-pointer bg-white dark:bg-black";

  return (
    <motion.div {...fadeUp(0)} className="max-w-2xl mx-auto">
      {/* Module intro */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black p-6 mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB] mb-2">{config.seriesName}</p>
        <h2 className="text-base font-bold text-black dark:text-white mb-2">{config.engineName}</h2>
        <p className="text-sm text-gray-600 dark:text-white/60 leading-relaxed">{config.purpose}</p>
      </div>

      {/* Context form */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-white/50 mb-5">Enterprise Context</p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/60 block mb-1.5">
              Organisation Name <span className="text-[#2563EB]">*</span>
            </label>
            <input value={form.organisationName} onChange={set("organisationName")}
              placeholder="e.g. Horizon Capital Group" className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/60 block mb-1.5">Industry</label>
              <select aria-label="Industry" value={form.industry} onChange={set("industry")} className={selectCls}>
                <option value="">Select…</option>
                {["Financial Services","Technology","Healthcare","FMCG & Retail","Energy","Manufacturing","Professional Services","Government","NGO / Non-profit","Education","Real Estate","Other"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/60 block mb-1.5">Organisation Size</label>
              <select aria-label="Organisation size" value={form.size} onChange={set("size")} className={selectCls}>
                <option value="">Select…</option>
                {["1–50 employees","51–200","201–500","500–2,000","2,000–10,000","10,000+"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/60 block mb-1.5">
              Primary Challenge <span className="text-[#2563EB]">*</span>
            </label>
            <textarea rows={2} value={form.challenge} onChange={set("challenge")}
              placeholder={`What is your main challenge in this area?`}
              className={inputCls + " resize-none"} />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/60 block mb-1.5">
              Strategic Goal <span className="text-[#2563EB]">*</span>
            </label>
            <textarea rows={2} value={form.goal} onChange={set("goal")}
              placeholder="What does success look like in this dimension for your enterprise?"
              className={inputCls + " resize-none"} />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/60 block mb-1.5">Additional Context</label>
            <textarea rows={2} value={form.additionalContext} onChange={set("additionalContext")}
              placeholder="Any additional context that would help generate a more accurate assessment…"
              className={inputCls + " resize-none"} />
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!form.organisationName || !form.challenge || !form.goal) return;
            persistContext(form);
            onSubmit(form);
          }}
          disabled={loading || !form.organisationName || !form.challenge || !form.goal}
          className="mt-5 w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#2563EB] to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-extrabold text-sm shadow-[0_8px_32px_rgba(194,18,25,0.35)] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          {loading
            ? <><Loader2 className="h-4 w-4 animate-spin" />Running {config.engineName}…</>
            : <>Run {config.engineName}</>}
        </button>
      </div>
    </motion.div>
  );
}

/* ── Result Display ───────────────────────────────────────── */
function ResultDisplay({ result, config, onReset, orgName, baseline }: {
  result: IntelligenceResult;
  config: ModuleConfig;
  onReset: () => void;
  orgName: string;
  baseline: { at: string; scores: Record<string, number> } | null;
}) {
  const [copied,       setCopied]       = useState(false);
  const [planExpanded, setPlanExpanded] = useState(false);

  /* Mean of the dimension scores — computed here, never asked of the model. */
  const overallScore = result.dimensions.length
    ? Math.round(result.dimensions.reduce((sum, d) => sum + d.value, 0) / result.dimensions.length)
    : 0;

  const slug = `${config.engineName}-${orgName || "assessment"}`.replace(/\s+/g, "-").toLowerCase();

  /** CSV — the format that opens in Excel and gets forwarded. */
  const exportCSV = () => {
    const esc = (v: unknown) => {
      const s = String(v ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows: string[] = [
      esc(`${config.engineName} — ${orgName}`),
      esc(`Series,${config.seriesName}`),
      esc(`Overall score,${overallScore}`),
      esc(`Distortion,${result.distortionIndex}`),
      "",
      ["Dimension", "Score %", "Insight"].map(esc).join(","),
      ...result.dimensions.map(d => [d.label, d.value, d.insight ?? ""].map(esc).join(",")),
      "",
      ["KPI", "Value", "Trend"].map(esc).join(","),
      ...result.kpis.map(k => [k.label, k.value, k.trend].map(esc).join(",")),
      "",
      ["Severity", "Signal", "Action"].map(esc).join(","),
      ...result.signals.map(s => [s.severity, s.title, s.action].map(esc).join(",")),
      "",
      ["Horizon", "#", "Action"].map(esc).join(","),
      ...result.thirtyDayPlan.map((a, i) => ["30-day", i + 1, a].map(esc).join(",")),
      ...result.ninetyDayPlan.map((a, i) => ["90-day", i + 1, a].map(esc).join(",")),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = `${slug}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  /** Print dialog — the browser's own "Save as PDF" avoids shipping a PDF lib. */
  const exportPDF = () => window.print();

  const copyReport = () => {
    const lines = [
      `${config.engineName} — Intelligence Assessment`,
      `Organisation: ${orgName}`,
      `Generated by LAMID ONE`,
      "",
      "EXECUTIVE SUMMARY",
      result.executiveSummary,
      "",
      "KEY PERFORMANCE INDICATORS",
      ...result.kpis.map(k => `  ${k.label}: ${k.value} — ${k.trend}`),
      "",
      "INTELLIGENCE SIGNALS",
      ...result.signals.map(s => `  [${s.severity}] ${s.title}\n  Action: ${s.action}`),
      "",
      "DIMENSION ASSESSMENT",
      ...result.dimensions.map(d => `  ${d.label}: ${d.value}%${d.insight ? ` — ${d.insight}` : ""}`),
      "",
      `DISTORTION INDEX: ${result.distortionIndex}`,
      `CORRECTION PRIORITY: ${result.correctionPriority}`,
      `REASON: ${result.correctionReason}`,
      "",
      "30-DAY PLAN",
      ...result.thirtyDayPlan.map((a, i) => `  ${i + 1}. ${a}`),
      "",
      "90-DAY PLAN",
      ...result.ninetyDayPlan.map((a, i) => `  ${i + 1}. ${a}`),
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const distortionColor = {
    Low:    "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    Medium: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    High:   "text-[#2563EB] bg-[#2563EB]/10 border-[#2563EB]/20",
  }[result.distortionIndex] ?? "text-gray-500";

  return (
    <motion.div {...fadeUp(0)} className="max-w-5xl mx-auto flex flex-col gap-6">

      {/* Report toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB] mb-0.5">{config.seriesName}</p>
          <h2 className="text-lg font-bold text-black dark:text-white">{orgName} — {config.engineName}</h2>
        </div>
        <div className="flex items-center gap-2 print:hidden">
          <button type="button" onClick={exportCSV} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-[#2563EB]/30 hover:text-[#2563EB] transition">
            <Download className="h-3.5 w-3.5" />CSV
          </button>
          <button type="button" onClick={exportPDF} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-[#2563EB]/30 hover:text-[#2563EB] transition">
            <Printer className="h-3.5 w-3.5" />PDF
          </button>
          <button type="button" onClick={copyReport} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-[#2563EB]/30 hover:text-[#2563EB] transition">
            {copied ? <><CheckCheck className="h-3.5 w-3.5 text-emerald-500" />Copied</> : <><Copy className="h-3.5 w-3.5" />Copy</>}
          </button>
          <button type="button" onClick={onReset} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-[#2563EB]/30 hover:text-[#2563EB] transition">
            <RefreshCw className="h-3.5 w-3.5" />New
          </button>
        </div>
      </div>

      {/* Headline score — the page is scanned, so lead with the number */}
      <div className="rounded-2xl border-2 p-6" style={{ borderColor: "rgba(37,99,235,0.35)", background: "rgba(37,99,235,0.04)" }}>
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB] mb-2">Overall Score</p>
            <p className="text-5xl font-extrabold leading-none tabular-nums text-[#2563EB]">
              {overallScore}
              <span className="text-lg font-semibold text-gray-600 dark:text-white/50"> / 100</span>
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${distortionColor}`}>
                Distortion: {result.distortionIndex}
              </span>
              <span className="text-[9px] text-gray-600 dark:text-white/60">
                Priority: {result.correctionPriority}
              </span>
            </div>
          </div>

          {/* Dimension scores with prior-run delta as the reference point */}
          <div className="flex flex-1 flex-wrap gap-4 min-w-[260px]">
            {result.dimensions.map((d) => {
              const prev  = baseline?.scores[d.label];
              const delta = typeof prev === "number" ? d.value - prev : null;
              return (
                <div key={d.label} className="min-w-[110px] flex-1">
                  <p className="text-lg font-bold tabular-nums text-black dark:text-white leading-none">
                    {d.value}%
                    {delta !== null && delta !== 0 && (
                      <span
                        className="ml-1.5 text-[11px] font-semibold tabular-nums"
                        style={{ color: delta > 0 ? "#059669" : "#DC2626" }}
                      >
                        {delta > 0 ? "▲" : "▼"}{Math.abs(delta)}
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-[10px] leading-snug text-gray-600 dark:text-white/50">{d.label}</p>
                  <div className="relative mt-1.5 h-1 rounded-full bg-gray-200 dark:bg-white/10">
                    <div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${d.value}%` }} />
                    {/* Ghost marker showing where this score sat last run */}
                    {typeof prev === "number" && (
                      <span
                        className="absolute top-[-2px] h-[8px] w-[2px] rounded-full bg-gray-500 dark:bg-white/50"
                        style={{ left: `${prev}%` }}
                        title={`Previous: ${prev}%`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black p-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-white/50 mb-3">Executive Summary</p>
        <p className="text-sm text-black dark:text-white leading-relaxed">{result.executiveSummary}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {result.kpis.map((k, i) => (
          <motion.div key={i} {...fadeUp(i * 0.05)} className="rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black p-5">
            <p className="text-2xl font-bold text-black dark:text-white leading-none mb-1.5">{k.value}</p>
            <p className="text-xs text-gray-600 dark:text-white/60 mb-1">{k.label}</p>
            <p className="text-[10px] text-gray-600 dark:text-white/50 leading-snug">{k.trend}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signals */}
        <motion.div {...fadeUp(0.1)} className="rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-white/50 mb-4">Intelligence Signals</p>
          <div className="flex flex-col gap-3">
            {result.signals.map((s, i) => {
              // Severity encoded in form as well as colour, so it reads at a glance.
              const sev = s.severity === "High"
                ? { rail: "#DC2626", chip: "text-red-700 dark:text-red-400 bg-red-500/10" }
                : s.severity === "Medium"
                ? { rail: "#D97706", chip: "text-amber-700 dark:text-amber-400 bg-amber-500/10" }
                : { rail: "#6B7280", chip: "text-gray-600 dark:text-white/50 bg-gray-500/10" };
              return (
                <div key={i} className="flex items-stretch gap-3 pb-3 border-b border-gray-100 dark:border-white/6 last:border-0 last:pb-0">
                  <span className="w-1 shrink-0 rounded-full" style={{ background: sev.rail }} aria-hidden="true" />
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${sev.chip}`}>
                        {s.severity}
                      </span>
                    </div>
                    <p className="text-sm text-black dark:text-white leading-snug">{s.title}</p>
                    <p className="text-xs text-gray-600 dark:text-white/60 mt-0.5">{s.action}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Dimensions */}
        <motion.div {...fadeUp(0.15)} className="rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-white/50 mb-4">Dimension Assessment</p>
          <div className="flex flex-col gap-4">
            {result.dimensions.map((d, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm text-black dark:text-white">{d.label}</p>
                  <p className="text-xs font-semibold text-black dark:text-white">{d.value}%</p>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-[#2563EB]"
                    initial={{ width: 0 }}
                    animate={{ width: `${d.value}%` }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.1 }}
                  />
                </div>
                {d.insight && <p className="text-[10px] text-gray-600 dark:text-white/60 mt-1 leading-snug">{d.insight}</p>}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Correction Priority */}
      <motion.div {...fadeUp(0.2)} className="rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black p-6" style={{ borderColor: "rgba(37,99,235,0.15)" }}>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-white/50 mb-3">Correction Priority</p>
        <div className="flex items-start gap-3">
          <span className="text-[9px] font-black text-[#2563EB] bg-[#2563EB]/10 px-2 py-1 rounded-full border border-[#2563EB]/20 shrink-0 mt-0.5">
            Activate
          </span>
          <div>
            <p className="text-sm font-semibold text-black dark:text-white">{result.correctionPriority}</p>
            <p className="text-xs text-gray-600 dark:text-white/60 mt-0.5">{result.correctionReason}</p>
          </div>
        </div>
      </motion.div>

      {/* Action Plans */}
      <motion.div {...fadeUp(0.25)} className="rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black overflow-hidden">
        <button
          type="button"
          onClick={() => setPlanExpanded(p => !p)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-white/50">Action Plans</p>
          {planExpanded
            ? <ChevronUp className="w-4 h-4 text-gray-600 dark:text-white/50" />
            : <ChevronDown className="w-4 h-4 text-gray-600 dark:text-white/50" />}
        </button>

        {planExpanded && (
          <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-100 dark:border-white/8 pt-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB] mb-3">30-Day Plan</p>
              <ol className="flex flex-col gap-2">
                {result.thirtyDayPlan.map((a, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[9px] font-black text-[#2563EB] shrink-0 mt-0.5 w-4">{i + 1}.</span>
                    <p className="text-xs text-black dark:text-white leading-snug">{a}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-white/50 mb-3">90-Day Plan</p>
              <ol className="flex flex-col gap-2">
                {result.ninetyDayPlan.map((a, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[9px] font-black text-gray-600 dark:text-white/50 shrink-0 mt-0.5 w-4">{i + 1}.</span>
                    <p className="text-xs text-gray-600 dark:text-white/60 leading-snug">{a}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </motion.div>

      {/* Navigation */}
      <motion.div {...fadeUp(0.3)} className="flex flex-wrap gap-3">
        {config.nextHref && (
          <Link href={config.nextHref} className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors shadow-[0_0_14px_rgba(37,99,235,0.35)] inline-flex items-center gap-1.5">
            {config.nextLabel} <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        )}
        <Link href={config.backHref} className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#2563EB]/25 text-[#2563EB] hover:bg-[#2563EB]/8 transition-colors">
          {config.backLabel}
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* ── Preview placeholder shown blurred for non-members ────── */
const PREVIEW_RESULT: IntelligenceResult = {
  executiveSummary: "Your intelligence assessment has been generated. Sign up or upgrade to a LAMID membership to view the full analysis, signals, and strategic recommendations.",
  kpis: [
    { label: "Overall Score",    value: "74 / 100", trend: "+12 pts vs industry baseline" },
    { label: "Performance",      value: "68%",      trend: "Moderate — improvement identified" },
    { label: "Risk Index",       value: "Medium",   trend: "2 high-priority signals flagged" },
    { label: "Growth Potential", value: "High",     trend: "Strong upside in 3 dimensions" },
  ],
  signals: [
    { severity: "High",   title: "Strategic misalignment detected across key functions",   action: "Immediate leadership alignment session recommended." },
    { severity: "Medium", title: "Operational efficiency gap identified",                  action: "Process audit across top 3 bottleneck areas." },
    { severity: "Low",    title: "Growth indicator present in adjacent market",            action: "Exploratory review within 90-day window." },
  ],
  dimensions: [
    { label: "Strategic Clarity",        value: 68, insight: "Alignment gap in execution layer" },
    { label: "Execution Alignment",      value: 45, insight: "Critical — requires immediate attention" },
    { label: "Operational Performance",  value: 82, insight: "Strong — sustain current momentum" },
    { label: "Leadership Effectiveness", value: 57, insight: "Development opportunity identified" },
  ],
  distortionIndex: "Medium",
  correctionPriority: "Execution Alignment",
  correctionReason: "Significant gap between strategy intent and operational reality. Upgrade to view the full correction protocol.",
  thirtyDayPlan: [
    "Conduct leadership alignment diagnostic across all business units",
    "Identify and resolve top 3 execution bottlenecks",
    "Establish weekly strategy-to-execution review cadence",
  ],
  ninetyDayPlan: [
    "Deploy enterprise-wide operational alignment framework",
    "Launch performance intelligence tracking across all dimensions",
    "Review and reset strategic priorities based on intelligence data",
  ],
};

/* ── Main Component ───────────────────────────────────────── */
export default function IntelligenceModule({ config }: IntelligenceModuleProps) {
  const { mode } = useGate();
  const [result,  setResult]  = useState<IntelligenceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [orgName, setOrgName] = useState("");
  const [history, setHistory] = useState<PastRun[]>([]);

  /* Past runs of THIS module — powers "vs last run" deltas and re-open. */
  useEffect(() => {
    if (mode !== "full") return;
    fetch(`/api/tools/usage?moduleId=${encodeURIComponent(config.id)}&limit=10`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.data) setHistory(d.data); })
      .catch(() => {});
  }, [config.id, mode]);

  /* Scores from the most recent previous run, for comparison. */
  const baseline = useMemo(() => {
    const prev = history[0];
    if (!prev?.scores?.length) return null;
    const map: Record<string, number> = {};
    for (const s of prev.scores) map[s.label] = s.value;
    return { at: prev.runAt, scores: map };
  }, [history]);

  const openPastRun = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tools/usage/${id}`, { credentials: "include" });
      const d = await res.json();
      if (res.ok && d?.data?.result) {
        setResult(d.data.result);
        setOrgName(d.data.organisationName ?? "");
      }
    } catch {
      /* non-fatal — the form stays available */
    } finally {
      setLoading(false);
    }
  };

  /**
   * @param stats            Archetype B — time-series statistics
   * @param measuredOverride Archetype C/E/F — pre-formatted deterministic summary
   * @param computedDims     Dimension scores derived from the compute layer.
   *   When present these replace whatever the model returned, so the four
   *   headline scores are the same arithmetic the tables below them show.
   *   Narrative modules pass nothing and keep the model's dimensions.
   */
  const run = async (
    context: Record<string, string>,
    stats?: SeriesStats[],
    measuredOverride?: string,
    computedDims?: ComputedDimension[],
  ) => {
    setOrgName(context.organisationName);

    /* Non-members see a preview and get sent to sign up. Keep the computed run
       so signing up returns them to results rather than to an empty form. */
    if (mode !== "full") {
      savePendingRun({
        moduleId:   config.id,
        context,
        measured:   measuredOverride,
        stats:      stats as unknown[] | undefined,
        dimensions: computedDims,
      });
      setResult(PREVIEW_RESULT);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res  = await fetch("/api/ai/intelligence", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          moduleId:            config.id,
          engineName:          config.engineName,
          seriesName:          config.seriesName,
          purpose:             config.purpose,
          dimensionLabels:     config.dimensionLabels,
          driverContext:       config.driverContext,
          correctionProtocols: config.correctionProtocols,
          context,
          // Deterministic figures computed client-side; the model interprets only.
          ...(measuredOverride
            ? { measuredData: measuredOverride }
            : stats?.length
            ? {
                measuredData: seriesStatsToPrompt(
                  stats,
                  config.inputs?.kind === "timeseries" ? config.inputs.periodLabel : "period",
                ),
              }
            : {}),
        }),
      });
      const data = await res.json();
      if (res.status === 429) throw new Error(data.message + " Create a free account for higher limits.");
      if (!res.ok) throw new Error(data.message ?? "Assessment failed. Please try again.");

      /* The model writes the narrative; TypeScript owns the numbers. Where a
         compute layer ran, its dimensions win — including in the stored
         history, so a past run never redisplays a model-invented score. */
      const finalResult: IntelligenceResult = computedDims?.length
        ? { ...data.result, dimensions: computedDims }
        : data.result;

      setResult(finalResult);

      // Record the run against this member's tool history — fire and forget
      fetch("/api/tools/usage", {
        method:      "POST",
        headers:     { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          moduleId:         config.id,
          engineName:       config.engineName,
          seriesName:       config.seriesName,
          organisationName: context.organisationName,
          result:           finalResult,
          href:             typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      }).catch(() => {});
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Assessment failed.");
    } finally {
      setLoading(false);
    }
  };

  /* Resume a run held over the sign-up detour.
     Fires once the gate has opened — the analysis was already computed before
     the user was interrupted, so this replays it rather than asking them to
     fill the form in a second time. */
  const resumed = useRef(false);
  useEffect(() => {
    if (mode !== "full" || resumed.current) return;

    const pending = loadPendingRun(config.id);
    if (!pending) return;

    resumed.current = true;
    clearPendingRun();
    void run(
      pending.context,
      pending.stats as SeriesStats[] | undefined,
      pending.measured,
      pending.dimensions,
    );
    // `run` is stable for the lifetime of this component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, config.id]);

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Module header */}
        <motion.div {...fadeUp(0)} className="mb-10">
          <p className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">
            {config.seriesName}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">{config.engineName}</h1>
          <p className="text-gray-600 dark:text-white/60 text-sm max-w-xl">{config.purpose}</p>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div {...fadeUp(0)} className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#2563EB]/8 border border-[#2563EB]/20 text-sm text-[#2563EB]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </motion.div>
        )}

        {/* Intake or Results */}
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="intake" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Past runs — re-open a stored assessment instead of re-running it */}
              {history.length > 0 && (
                <div className="max-w-2xl mx-auto mb-6 rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black p-5">
                  <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-600 dark:text-white/50">
                    <History className="h-3.5 w-3.5 text-[#2563EB]" />
                    Previous runs ({history.length})
                  </p>
                  <ul className="flex flex-col">
                    {history.slice(0, 5).map((h) => {
                      const avg = h.scores?.length
                        ? Math.round(h.scores.reduce((s, x) => s + x.value, 0) / h.scores.length)
                        : null;
                      return (
                        <li key={h._id}>
                          <button
                            type="button"
                            onClick={() => openPastRun(h._id)}
                            className="group flex w-full items-center gap-3 rounded-lg px-1 py-2.5 text-left transition hover:bg-[#2563EB]/[0.04] border-b border-gray-100 dark:border-white/8 last:border-0"
                          >
                            {avg !== null && (
                              <span className="shrink-0 rounded-md bg-[#2563EB]/10 px-2 py-1 font-mono text-[11px] font-bold tabular-nums text-[#2563EB]">
                                {avg}
                              </span>
                            )}
                            <span className="min-w-0 flex-1 truncate text-sm text-black dark:text-white group-hover:text-[#2563EB]">
                              {h.organisationName || "Untitled assessment"}
                            </span>
                            <span className="shrink-0 text-[11px] tabular-nums text-gray-600 dark:text-white/40">
                              {new Date(h.runAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {config.inputs?.kind === "timeseries" ? (
                <TimeSeriesIntake
                  spec={config.inputs}
                  engineName={config.engineName}
                  loading={loading}
                  onSubmit={({ context, stats }) =>
                    run(context, stats, undefined, seriesDimensions(stats))
                  }
                />
              ) : config.inputs?.kind === "financial" ? (
                <FinancialIntake
                  periodLabel={config.inputs.periodLabel}
                  defaultPeriods={config.inputs.periods}
                  engineName={config.engineName}
                  loading={loading}
                  onSubmit={({ context, summary }) =>
                    run(context, undefined, financialsToPrompt(summary), financialDimensions(summary))
                  }
                />
              ) : config.inputs?.kind === "roster" ? (
                <RosterIntake
                  engineName={config.engineName}
                  loading={loading}
                  onSubmit={({ context, measured, summary }) =>
                    run(context, undefined, measured, rosterDimensions(summary))
                  }
                />
              ) : config.inputs?.kind === "scenario" ? (
                <ScenarioIntake
                  engineName={config.engineName}
                  loading={loading}
                  onSubmit={({ context, measured, summary }) =>
                    run(context, undefined, measured, scenarioDimensions(summary))
                  }
                />
              ) : (
                <IntakeForm config={config} onSubmit={run} loading={loading} />
              )}
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EngineResultsGate>
                <ResultDisplay result={result} config={config} onReset={() => setResult(null)} orgName={orgName} baseline={baseline} />
              </EngineResultsGate>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
