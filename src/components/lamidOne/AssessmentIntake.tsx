"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Loader2, TriangleAlert, FileCheck2, FileQuestion, FileX2 } from "lucide-react";
import type { AssessmentRow, AssessmentSummary, EvidenceLevel } from "@/lib/intelligence/assessment";
import { computeAssessment, assessmentToPrompt } from "@/lib/intelligence/assessment";

/**
 * Archetype G intake.
 *
 * Rates the module's own dimensions rather than a generic questionnaire. The
 * evidence column is the part that matters: it is what separates this from a
 * self-flattering score, and it visibly discounts anything asserted without
 * something to show for it.
 */

const ACCENT = "#2563EB";

const RATING_ANCHORS = [
  "Not in place",
  "Ad hoc, one-off",
  "Inconsistent across teams",
  "Mostly consistent",
  "Consistent and managed",
  "Consistent, measured and improving",
];

const EVIDENCE_META: { level: EvidenceLevel; label: string; hint: string; Icon: typeof FileX2 }[] = [
  { level: 0, label: "None",       hint: "A view, with nothing to point at",  Icon: FileX2 },
  { level: 1, label: "Anecdotal",  hint: "Examples, but nothing recorded",    Icon: FileQuestion },
  { level: 2, label: "Documented", hint: "Something a reviewer could check",  Icon: FileCheck2 },
];

const inputCls =
  "w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-black " +
  "text-black dark:text-white text-sm px-3 py-2 placeholder-gray-500 dark:placeholder-white/40 " +
  "focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition";

const uid = () => `a-${Math.random().toString(36).slice(2, 9)}`;

export default function AssessmentIntake({
  dimensions, engineName, onSubmit, loading,
}: {
  dimensions: string[];
  engineName: string;
  onSubmit: (payload: {
    context: Record<string, string>;
    measured: string;
    summary: AssessmentSummary;
  }) => void;
  loading: boolean;
}) {
  const [orgName, setOrgName]   = useState("");
  const [industry, setIndustry] = useState("");
  const [goal, setGoal]         = useState("");

  const [rows, setRows] = useState<AssessmentRow[]>(() =>
    dimensions.map((label) => ({ id: uid(), label, rating: 3, weight: 2, evidence: 1 as EvidenceLevel })),
  );

  const summary = useMemo(() => computeAssessment(rows), [rows]);

  const update = (id: string, patch: Partial<AssessmentRow>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const canSubmit = orgName.trim() && !loading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }} className="mx-auto flex max-w-4xl flex-col gap-6"
    >
      {/* Context */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/15 dark:bg-black">
        <p className="mb-5 text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
          Enterprise Context
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="as-org" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50">
              Organisation <span style={{ color: ACCENT }}>*</span>
            </label>
            <input id="as-org" className={inputCls} value={orgName}
              onChange={(e) => setOrgName(e.target.value)} placeholder="e.g. Horizon Capital" />
          </div>
          <div>
            <label htmlFor="as-ind" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50">
              Industry
            </label>
            <input id="as-ind" className={inputCls} value={industry}
              onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Financial Services" />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="as-goal" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50">
            What are you trying to improve?
          </label>
          <input id="as-goal" className={inputCls} value={goal}
            onChange={(e) => setGoal(e.target.value)} placeholder="Optional — sharpens the analysis" />
        </div>
      </div>

      {/* Ratings */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/15">
        <div className="border-b border-gray-200 px-6 py-4 dark:border-white/15">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
            Rate each dimension
          </p>
          <p className="mt-1 text-[11px] text-gray-600 dark:text-white/50">
            Weight what matters most, and say what backs each rating up. Anything
            rated highly with no evidence is discounted, not taken at face value.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-gray-100 dark:divide-white/8">
          {rows.map((r) => {
            const d = summary.dimensions.find((x) => x.label === r.label);
            return (
              <div key={r.id} className="p-5">
                <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-semibold text-black dark:text-white">{r.label}</p>
                  {d && (
                    <span
                      className="rounded-md px-2 py-0.5 text-[11px] font-bold tabular-nums"
                      style={{
                        background: d.unsupported ? "#B4530915" : `${ACCENT}12`,
                        color:      d.unsupported ? "#B45309"   : ACCENT,
                      }}
                    >
                      {d.adjustedPct}%{d.unsupported && " · unsupported"}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_0.8fr_1fr]">
                  {/* Rating */}
                  <div>
                    <label htmlFor={`r-${r.id}`} className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/40">
                      Rating — {RATING_ANCHORS[r.rating] ?? ""}
                    </label>
                    <input
                      id={`r-${r.id}`} type="range" min={0} max={5} step={1} value={r.rating}
                      onChange={(e) => update(r.id, { rating: Number(e.target.value) })}
                      className="w-full accent-[#2563EB]"
                    />
                  </div>

                  {/* Weight */}
                  <div>
                    <label htmlFor={`w-${r.id}`} className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/40">
                      Importance
                    </label>
                    <select
                      id={`w-${r.id}`} className={inputCls} value={r.weight}
                      onChange={(e) => update(r.id, { weight: Number(e.target.value) })}
                    >
                      <option value={1}>Useful</option>
                      <option value={2}>Important</option>
                      <option value={3}>Critical</option>
                    </select>
                  </div>

                  {/* Evidence */}
                  <div>
                    <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/40">
                      Evidence
                    </span>
                    <div className="flex gap-1.5">
                      {EVIDENCE_META.map((e) => (
                        <button
                          key={e.level} type="button" title={e.hint}
                          onClick={() => update(r.id, { evidence: e.level })}
                          className={`flex flex-1 items-center justify-center gap-1 rounded-lg border px-2 py-2 text-[10px] font-semibold transition ${
                            r.evidence === e.level
                              ? "border-[#2563EB] text-[#2563EB]"
                              : "border-gray-200 text-gray-500 hover:border-gray-400 dark:border-white/15 dark:text-white/40"
                          }`}
                        >
                          <e.Icon className="h-3 w-3" />{e.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Derived — proof the arithmetic is happening before anything is sent */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Weighted index",   value: `${summary.indexPct}%`,         sub: "raw ratings" },
          { label: "Evidence-adjusted", value: `${summary.adjustedIndexPct}%`, sub: `${summary.evidenceGapPts} pts discounted` },
          { label: "Spread",           value: `${summary.spreadPts} pts`,     sub: summary.weakest ? `weakest: ${summary.weakest.label}` : "—" },
          { label: "Documented",       value: `${summary.documentedCount}/${summary.dimensions.length}`, sub: "dimensions evidenced" },
        ].map((t) => (
          <div key={t.label} className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/15 dark:bg-black">
            <p className="mb-1 text-lg font-bold tabular-nums text-black dark:text-white">{t.value}</p>
            <p className="text-[11px] font-semibold text-gray-600 dark:text-white/50">{t.label}</p>
            <p className="mt-0.5 text-[10px] text-gray-500 dark:text-white/35">{t.sub}</p>
          </div>
        ))}
      </div>

      {summary.warnings.length > 0 && (
        <div className="rounded-2xl border border-amber-400/40 bg-amber-50 p-5 dark:bg-amber-950/20">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
            <TriangleAlert className="h-3.5 w-3.5" />Assessment checks
          </p>
          <ul className="flex flex-col gap-1.5">
            {summary.warnings.map((w) => (
              <li key={w} className="text-sm text-amber-800 dark:text-amber-300/90">• {w}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button" disabled={!canSubmit}
        onClick={() => onSubmit({
          context: {
            organisationName: orgName,
            industry,
            goal,
            challenge: goal || `Assess ${engineName.toLowerCase()}`,
          },
          measured: assessmentToPrompt(summary),
          summary,
        })}
        className="w-full rounded-2xl py-3.5 text-sm font-extrabold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
        style={{ background: ACCENT }}
      >
        {loading
          ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Analysing…</span>
          : <>Run {engineName}</>}
      </button>
    </motion.div>
  );
}
