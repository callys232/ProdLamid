"use client";

import { useState, useMemo } from "react";
import { useOrganizationProfile, useProfileSeed } from "@/hooks/useOrganizationProfile";
import { motion } from "framer-motion";
import { Loader2, Plus, Trash2, TriangleAlert, Trophy, Shield } from "lucide-react";
import type { ScenarioOption } from "@/lib/intelligence/scenario";
import { computeScenarios, scenariosToPrompt } from "@/lib/intelligence/scenario";
import type { ScenarioSummary } from "@/lib/intelligence/scenario";

const ACCENT = "#2563EB";

const inputCls =
  "w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-black " +
  "text-black dark:text-white text-sm px-3 py-2 placeholder-gray-500 dark:placeholder-white/40 " +
  "focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition";

const cellCls =
  "w-full rounded-md border border-gray-200 dark:border-white/15 bg-white dark:bg-black " +
  "text-black dark:text-white text-sm px-2 py-1.5 text-right tabular-nums " +
  "focus:outline-none focus:border-[#2563EB] transition";

const uid = () => `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const seed = (): ScenarioOption[] => [
  { id: uid(), name: "Build in-house",    probability: 60, upside: 500000, downside: 200000, cost: 150000, horizon: 12 },
  { id: uid(), name: "Acquire capability", probability: 75, upside: 400000, downside: 120000, cost: 300000, horizon: 6 },
  { id: uid(), name: "Partner",            probability: 55, upside: 250000, downside:  60000, cost:  50000, horizon: 3 },
];

export default function ScenarioIntake({
  engineName, onSubmit, loading, initial,
}: {
  engineName: string;
  onSubmit: (payload: {
    context: Record<string, string>;
    measured: string;
    summary: ScenarioSummary;
    /** Echoed back so the options can be revised rather than re-entered. */
    seed: { decision: string; options: ScenarioOption[] };
  }) => void;
  initial?: { decision?: string; options?: ScenarioOption[] };
  loading: boolean;
}) {
  const [orgName, setOrgName] = useState("");
  const [decision, setDecision] = useState(initial?.decision ?? "");

  const { profile, ready, update: saveOrg } = useOrganizationProfile();
  useProfileSeed(ready, profile, (p) => {
    if (p.organisationName) setOrgName(p.organisationName);
  });
  const [options, setOptions] = useState<ScenarioOption[]>(
    initial?.options?.length ? initial.options : seed,
  );

  const summary = useMemo(() => computeScenarios(options), [options]);

  const update = (id: string, patch: Partial<ScenarioOption>) =>
    setOptions((os) => os.map((o) => (o.id === id ? { ...o, ...patch } : o)));

  const canSubmit = orgName.trim() && decision.trim() && summary.options.length > 0 && !loading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }} className="mx-auto flex max-w-4xl flex-col gap-6"
    >
      <div className="rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black p-6">
        <p className="mb-5 text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
          The Decision
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="sc-org" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50">
              Organisation <span style={{ color: ACCENT }}>*</span>
            </label>
            <input id="sc-org" className={inputCls} value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="e.g. Horizon Capital" />
          </div>
          <div>
            <label htmlFor="sc-dec" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50">
              What are you deciding? <span style={{ color: ACCENT }}>*</span>
            </label>
            <input id="sc-dec" className={inputCls} value={decision} onChange={(e) => setDecision(e.target.value)} placeholder="e.g. How to add data capability" />
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black">
        <div className="border-b border-gray-200 dark:border-white/15 px-6 py-4">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>Options</p>
          <p className="mt-1 text-[11px] text-gray-600 dark:text-white/50">
            Expected value is calculated as (probability × upside) − (1 − probability) × downside, less cost.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/15">
                {["Option", "Likely %", "Upside", "Downside", "Cost", "Months", "Net EV", ""].map((h, i) => (
                  <th key={h + i} className={`px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-white/50 ${i === 0 ? "text-left" : "text-right"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summary.options.map((o) => (
                <tr key={o.id} className="border-b border-gray-100 dark:border-white/8 last:border-0">
                  <td className="min-w-[170px] px-3 py-2">
                    <input aria-label="Option name" className={cellCls + " text-left"} value={o.name}
                      onChange={(e) => update(o.id, { name: e.target.value })} placeholder="Option" />
                  </td>
                  {([
                    ["probability", 0, 100] as const,
                    ["upside", 0, undefined] as const,
                    ["downside", 0, undefined] as const,
                    ["cost", 0, undefined] as const,
                    ["horizon", 1, 120] as const,
                  ]).map(([key, min, max]) => (
                    <td key={key} className="w-24 px-2 py-2">
                      <input type="number" min={min} max={max} className={cellCls}
                        aria-label={`${o.name || "Option"} ${key}`}
                        value={o[key] as number}
                        onChange={(e) => update(o.id, { [key]: Number(e.target.value) || 0 } as Partial<ScenarioOption>)} />
                    </td>
                  ))}
                  <td className="w-28 px-3 py-2 text-right text-xs font-bold tabular-nums"
                    style={{ color: o.netExpected >= 0 ? "#059669" : "#DC2626" }}>
                    {o.netExpected.toLocaleString()}
                  </td>
                  <td className="w-10 px-3 py-2">
                    <button type="button" aria-label={`Remove ${o.name || "option"}`}
                      onClick={() => setOptions((os) => os.filter((x) => x.id !== o.id))}
                      className="p-1 text-gray-400 transition hover:text-red-500 dark:text-white/55">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-200 dark:border-white/15 px-6 py-3">
          <button type="button"
            onClick={() => setOptions((os) => [...os, { id: uid(), name: "", probability: 50, upside: 0, downside: 0, cost: 0, horizon: 6 }])}
            className="inline-flex items-center gap-1.5 text-xs font-semibold transition hover:opacity-70" style={{ color: ACCENT }}>
            <Plus className="h-3.5 w-3.5" />Add option
          </button>
        </div>
      </div>

      {/* Verdict */}
      {(summary.best || summary.safest) && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {summary.best && (
            <div className="rounded-2xl border-2 p-5" style={{ borderColor: "rgba(5,150,105,0.35)", background: "rgba(5,150,105,0.04)" }}>
              <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                <Trophy className="h-3.5 w-3.5" />Highest expected value
              </p>
              <p className="text-lg font-bold text-black dark:text-white">{summary.best.name}</p>
              <p className="mt-0.5 text-xs text-gray-600 dark:text-white/50 tabular-nums">
                Net EV {summary.best.netExpected.toLocaleString()} · {summary.best.horizon} months
              </p>
            </div>
          )}
          {summary.safest && (
            <div className="rounded-2xl border-2 p-5" style={{ borderColor: "rgba(37,99,235,0.35)", background: "rgba(37,99,235,0.04)" }}>
              <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
                <Shield className="h-3.5 w-3.5" />Narrowest risk spread
              </p>
              <p className="text-lg font-bold text-black dark:text-white">{summary.safest.name}</p>
              <p className="mt-0.5 text-xs text-gray-600 dark:text-white/50 tabular-nums">
                Spread {summary.safest.range.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      )}

      {summary.warnings.length > 0 && (
        <div className="rounded-2xl border border-amber-400/40 bg-amber-50 p-5 dark:bg-amber-950/20">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
            <TriangleAlert className="h-3.5 w-3.5" />Decision checks
          </p>
          <ul className="flex flex-col gap-1.5">
            {summary.warnings.map((w) => (
              <li key={w} className="text-sm text-amber-800 dark:text-amber-300/90">• {w}</li>
            ))}
          </ul>
        </div>
      )}

      <button type="button" disabled={!canSubmit}
        onClick={() => {
          saveOrg({ organisationName: orgName });
          onSubmit({
            context: {
              organisationName: orgName,
              challenge: decision,
              goal: "Choose the option with the best risk-adjusted outcome",
            },
            measured: scenariosToPrompt(summary),
            summary,
            seed: { decision, options },
          });
        }}
        className="w-full rounded-2xl py-3.5 text-sm font-extrabold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
        style={{ background: ACCENT }}>
        {loading
          ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Modelling options…</span>
          : <>Run {engineName}</>}
      </button>
    </motion.div>
  );
}
