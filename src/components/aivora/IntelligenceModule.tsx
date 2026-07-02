"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Loader2, AlertCircle, ArrowUpRight, RefreshCw, Copy, CheckCheck,
  Building2, Briefcase, Users, Target, MessageSquare, ChevronDown, ChevronUp,
} from "lucide-react";
import type { ModuleConfig } from "@/lib/intelligence/moduleRegistry";

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
  const [form, setForm] = useState({
    organisationName:  "",
    industry:          "",
    size:              "",
    challenge:         "",
    goal:              "",
    additionalContext: "",
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const inputCls  = "w-full rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm px-4 py-2.5 focus:outline-none focus:border-[#C12129]/60 focus:ring-1 focus:ring-[#C12129]/20 placeholder-gray-400 dark:placeholder-gray-600 transition";
  const selectCls = inputCls + " appearance-none cursor-pointer bg-white dark:bg-[#111]";

  return (
    <motion.div {...fadeUp(0)} className="max-w-2xl mx-auto">
      {/* Module intro */}
      <div className="aivora-card border rounded-2xl p-6 mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#C12129] mb-2">{config.seriesName} · {config.id}</p>
        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2">{config.engineName}</h2>
        <p className="text-sm text-gray-500 dark:text-white/50 leading-relaxed">{config.purpose}</p>
      </div>

      {/* Context form */}
      <div className="aivora-card border rounded-2xl p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-5">Enterprise Context</p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-white/40 block mb-1.5">
              Organisation Name <span className="text-[#C12129]">*</span>
            </label>
            <input value={form.organisationName} onChange={set("organisationName")}
              placeholder="e.g. Horizon Capital Group" className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-white/40 block mb-1.5">Industry</label>
              <select value={form.industry} onChange={set("industry")} className={selectCls}>
                <option value="">Select…</option>
                {["Financial Services","Technology","Healthcare","FMCG & Retail","Energy","Manufacturing","Professional Services","Government","NGO / Non-profit","Education","Real Estate","Other"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-white/40 block mb-1.5">Organisation Size</label>
              <select value={form.size} onChange={set("size")} className={selectCls}>
                <option value="">Select…</option>
                {["1–50 employees","51–200","201–500","500–2,000","2,000–10,000","10,000+"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-white/40 block mb-1.5">
              Primary Challenge <span className="text-[#C12129]">*</span>
            </label>
            <textarea rows={2} value={form.challenge} onChange={set("challenge")}
              placeholder={`What is your main challenge in this ${config.id} dimension?`}
              className={inputCls + " resize-none"} />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-white/40 block mb-1.5">
              Strategic Goal <span className="text-[#C12129]">*</span>
            </label>
            <textarea rows={2} value={form.goal} onChange={set("goal")}
              placeholder="What does success look like in this dimension for your enterprise?"
              className={inputCls + " resize-none"} />
          </div>

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-white/40 block mb-1.5">Additional Context</label>
            <textarea rows={2} value={form.additionalContext} onChange={set("additionalContext")}
              placeholder="Any additional context that would help generate a more accurate assessment…"
              className={inputCls + " resize-none"} />
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!form.organisationName || !form.challenge || !form.goal) return;
            onSubmit(form);
          }}
          disabled={loading || !form.organisationName || !form.challenge || !form.goal}
          className="mt-5 w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#C12129] to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold text-sm shadow-[0_8px_32px_rgba(194,18,25,0.35)] disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
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
function ResultDisplay({ result, config, onReset, orgName }: {
  result: IntelligenceResult;
  config: ModuleConfig;
  onReset: () => void;
  orgName: string;
}) {
  const [copied,       setCopied]       = useState(false);
  const [planExpanded, setPlanExpanded] = useState(false);

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
    High:   "text-[#C12129] bg-[#C12129]/10 border-[#C12129]/20",
  }[result.distortionIndex] ?? "text-gray-500";

  return (
    <motion.div {...fadeUp(0)} className="max-w-5xl mx-auto flex flex-col gap-6">

      {/* Report toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#C12129] mb-0.5">{config.id} · {config.seriesName}</p>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{orgName} — {config.engineName}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={copyReport} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-[#C12129]/30 hover:text-[#C12129] transition">
            {copied ? <><CheckCheck className="h-3.5 w-3.5 text-emerald-500" />Copied</> : <><Copy className="h-3.5 w-3.5" />Copy Report</>}
          </button>
          <button onClick={onReset} className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-[#C12129]/30 hover:text-[#C12129] transition">
            <RefreshCw className="h-3.5 w-3.5" />New Assessment
          </button>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="aivora-card border rounded-2xl p-6" style={{ borderColor: "rgba(193,33,41,0.15)" }}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-3">Executive Summary</p>
        <p className="text-sm text-gray-700 dark:text-white/80 leading-relaxed">{result.executiveSummary}</p>
        <div className="flex items-center gap-2 mt-3">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${distortionColor}`}>
            Distortion: {result.distortionIndex}
          </span>
          <span className="text-[9px] text-gray-500 dark:text-white/40">Priority correction: {result.correctionPriority}</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {result.kpis.map((k, i) => (
          <motion.div key={i} {...fadeUp(i * 0.05)} className="aivora-card border rounded-2xl p-5">
            <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none mb-1.5">{k.value}</p>
            <p className="text-xs text-gray-500 dark:text-white/45 mb-1">{k.label}</p>
            <p className="text-[10px] text-gray-400 dark:text-white/30 leading-snug">{k.trend}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Signals */}
        <motion.div {...fadeUp(0.1)} className="aivora-card border rounded-2xl p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Intelligence Signals</p>
          <div className="flex flex-col gap-3">
            {result.signals.map((s, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-white/6 last:border-0 last:pb-0">
                <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${s.severity === "High" ? "text-[#C12129]" : s.severity === "Medium" ? "text-amber-500" : "text-gray-400 dark:text-white/30"}`} strokeWidth={2} />
                <div>
                  <p className="text-sm text-gray-900 dark:text-white leading-snug">{s.title}</p>
                  <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">{s.action}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Dimensions */}
        <motion.div {...fadeUp(0.15)} className="aivora-card border rounded-2xl p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Dimension Assessment</p>
          <div className="flex flex-col gap-4">
            {result.dimensions.map((d, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm text-gray-700 dark:text-white/70">{d.label}</p>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">{d.value}%</p>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-[#C12129]"
                    initial={{ width: 0 }}
                    animate={{ width: `${d.value}%` }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.1 }}
                  />
                </div>
                {d.insight && <p className="text-[10px] text-gray-500 dark:text-white/35 mt-1 leading-snug">{d.insight}</p>}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Correction Priority */}
      <motion.div {...fadeUp(0.2)} className="aivora-card border rounded-2xl p-6" style={{ borderColor: "rgba(193,33,41,0.15)" }}>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-3">Correction Priority</p>
        <div className="flex items-start gap-3">
          <span className="text-[9px] font-black text-[#C12129] bg-[#C12129]/10 px-2 py-1 rounded-full border border-[#C12129]/20 shrink-0 mt-0.5">
            Activate
          </span>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{result.correctionPriority}</p>
            <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">{result.correctionReason}</p>
          </div>
        </div>
      </motion.div>

      {/* Action Plans */}
      <motion.div {...fadeUp(0.25)} className="aivora-card border rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setPlanExpanded(p => !p)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30">Action Plans</p>
          {planExpanded
            ? <ChevronUp className="w-4 h-4 text-gray-400 dark:text-white/30" />
            : <ChevronDown className="w-4 h-4 text-gray-400 dark:text-white/30" />}
        </button>

        {planExpanded && (
          <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-100 dark:border-white/8 pt-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#C12129] mb-3">30-Day Plan</p>
              <ol className="flex flex-col gap-2">
                {result.thirtyDayPlan.map((a, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[9px] font-black text-[#C12129] shrink-0 mt-0.5 w-4">{i + 1}.</span>
                    <p className="text-xs text-gray-700 dark:text-white/65 leading-snug">{a}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-3">90-Day Plan</p>
              <ol className="flex flex-col gap-2">
                {result.ninetyDayPlan.map((a, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[9px] font-black text-gray-400 dark:text-white/30 shrink-0 mt-0.5 w-4">{i + 1}.</span>
                    <p className="text-xs text-gray-500 dark:text-white/45 leading-snug">{a}</p>
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
          <Link href={config.nextHref} className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#C12129] hover:bg-[#a01a20] transition-colors shadow-[0_0_14px_rgba(193,33,41,0.35)] inline-flex items-center gap-1.5">
            {config.nextLabel} <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        )}
        <Link href={config.backHref} className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#C12129]/25 text-[#C12129] hover:bg-[#C12129]/8 transition-colors">
          {config.backLabel}
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Component ───────────────────────────────────────── */
export default function IntelligenceModule({ config }: IntelligenceModuleProps) {
  const [result,  setResult]  = useState<IntelligenceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [orgName, setOrgName] = useState("");

  const run = async (context: Record<string, string>) => {
    setLoading(true);
    setError("");
    setOrgName(context.organisationName);

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
        }),
      });
      const data = await res.json();
      if (res.status === 429) throw new Error(data.message + " Create a free account for higher limits.");
      if (!res.ok) throw new Error(data.message ?? "Assessment failed. Please try again.");
      setResult(data.result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Assessment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aivora-section min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Module header */}
        <motion.div {...fadeUp(0)} className="mb-10">
          <p className="aivora-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">
            {config.seriesName} · {config.id}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">{config.engineName}</h1>
          <p className="text-gray-500 dark:text-white/45 text-sm max-w-xl">{config.purpose}</p>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div {...fadeUp(0)} className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-[#C12129]/8 border border-[#C12129]/20 text-sm text-[#C12129]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </motion.div>
        )}

        {/* Intake or Results */}
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="intake" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <IntakeForm config={config} onSubmit={run} loading={loading} />
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ResultDisplay result={result} config={config} onReset={() => setResult(null)} orgName={orgName} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
