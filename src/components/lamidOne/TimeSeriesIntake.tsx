"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Loader2, TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";
import type { TimeSeriesInputSpec, SeriesStats, SeriesTrend } from "@/lib/intelligence/inputSpec";
import { computeSeriesStats } from "@/lib/intelligence/inputSpec";

const ACCENT = "#2563EB";

const inputCls =
  "w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-black " +
  "text-black dark:text-white text-sm px-3 py-2 " +
  "placeholder-gray-500 dark:placeholder-white/40 " +
  "focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition";

const cellCls =
  "w-full rounded-md border border-gray-200 dark:border-white/15 bg-white dark:bg-black " +
  "text-black dark:text-white text-sm px-2 py-1.5 text-right tabular-nums " +
  "focus:outline-none focus:border-[#2563EB] transition";

const TREND_META = {
  rising:   { Icon: TrendingUp,   label: "Rising"   },
  falling:  { Icon: TrendingDown, label: "Falling"  },
  flat:     { Icon: Minus,        label: "Flat"     },
  volatile: { Icon: Activity,     label: "Volatile" },
} as const;

const GOOD = "#059669";
const BAD  = "#DC2626";
const NEUTRAL = "#6B7280";
const WARN = "#D97706";

/**
 * Direction alone does not say whether a trend is good.
 * Cycle time falling is progress; meeting load rising is not. Colour follows
 * the metric's own polarity rather than the direction of the line.
 */
function trendColour(trend: SeriesTrend, betterWhen: "higher" | "lower"): string {
  if (trend === "volatile") return WARN;
  if (trend === "flat")     return NEUTRAL;
  const improving = betterWhen === "higher" ? trend === "rising" : trend === "falling";
  return improving ? GOOD : BAD;
}

/** Sparkline over the entered values — no library, just a polyline. */
function Spark({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * 100},${28 - ((v - min) / span) * 24}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-7 w-full" aria-hidden="true">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default function TimeSeriesIntake({
  spec, engineName, onSubmit, loading,
}: {
  spec:       TimeSeriesInputSpec;
  engineName: string;
  onSubmit:   (payload: { context: Record<string, string>; stats: SeriesStats[] }) => void;
  loading:    boolean;
}) {
  const [orgName, setOrgName] = useState("");
  const [industry, setIndustry] = useState("");
  const [goal, setGoal] = useState("");
  const [periods, setPeriods] = useState(spec.periods);

  // Seed from sample values so the grid is never blank on first load.
  const [data, setData] = useState<Record<string, number[]>>(() => {
    const init: Record<string, number[]> = {};
    for (const m of spec.metrics) {
      init[m.key] = Array.from({ length: spec.periods }, (_, i) => m.sample?.[i] ?? 0);
    }
    return init;
  });

  /* Targets seed from the metric defaults and are editable per run — a trend
     with nothing to measure against can be described but not judged. */
  const [targets, setTargets] = useState<Record<string, number | null>>(() => {
    const init: Record<string, number | null> = {};
    for (const m of spec.metrics) init[m.key] = m.target ?? null;
    return init;
  });

  const stats = useMemo(
    () => spec.metrics.map((m) =>
      computeSeriesStats(m, (data[m.key] ?? []).slice(0, periods), targets[m.key])
    ),
    [spec.metrics, data, periods, targets],
  );

  const setCell = (key: string, idx: number, raw: string) => {
    const v = Number(raw);
    setData((d) => {
      const next = [...(d[key] ?? [])];
      next[idx] = Number.isFinite(v) ? v : 0;
      return { ...d, [key]: next };
    });
  };

  const setPeriodCount = (n: number) => {
    const count = Math.max(3, Math.min(24, n || 3));
    setPeriods(count);
    setData((d) => {
      const next: Record<string, number[]> = {};
      for (const m of spec.metrics) {
        const cur = d[m.key] ?? [];
        next[m.key] = Array.from({ length: count }, (_, i) => cur[i] ?? 0);
      }
      return next;
    });
  };

  const canSubmit = orgName.trim() && !loading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }} className="max-w-4xl mx-auto flex flex-col gap-6"
    >
      {/* Context */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black p-6">
        <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: ACCENT }}>
          Enterprise Context
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="ts-org" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50">
              Organisation <span style={{ color: ACCENT }}>*</span>
            </label>
            <input id="ts-org" className={inputCls} value={orgName}
              onChange={(e) => setOrgName(e.target.value)} placeholder="e.g. Horizon Capital" />
          </div>
          <div>
            <label htmlFor="ts-ind" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50">
              Industry
            </label>
            <input id="ts-ind" className={inputCls} value={industry}
              onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Financial Services" />
          </div>
          <div>
            <label htmlFor="ts-per" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50">
              {spec.periodLabel}s tracked
            </label>
            <input id="ts-per" type="number" min={3} max={24} className={inputCls} value={periods}
              onChange={(e) => setPeriodCount(Number(e.target.value))} />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="ts-goal" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50">
            What are you trying to improve?
          </label>
          <input id="ts-goal" className={inputCls} value={goal}
            onChange={(e) => setGoal(e.target.value)} placeholder="Optional — sharpens the analysis" />
        </div>
      </div>

      {/* Measured data */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/15">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
            Measured Data
          </p>
          <p className="mt-1 text-[11px] text-gray-600 dark:text-white/50">
            Enter one value per {spec.periodLabel.toLowerCase()}, oldest first. Pre-filled with
            example figures — replace with your own.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/15">
                <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-white/50 min-w-[200px]">
                  Metric
                </th>
                {Array.from({ length: periods }, (_, i) => (
                  <th key={i} className="px-2 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-white/50 w-20">
                    {spec.periodLabel.slice(0, 1)}{i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {spec.metrics.map((m) => (
                <tr key={m.key} className="border-b border-gray-100 dark:border-white/8 last:border-0">
                  <td className="px-4 py-2.5">
                    <p className="font-medium text-black dark:text-white">{m.label}</p>
                    {m.hint && <p className="text-[10px] text-gray-600 dark:text-white/40">{m.hint}</p>}
                  </td>
                  {Array.from({ length: periods }, (_, i) => (
                    <td key={i} className="px-1.5 py-2">
                      <input
                        type="number"
                        aria-label={`${m.label} — ${spec.periodLabel} ${i + 1}`}
                        className={cellCls}
                        value={data[m.key]?.[i] ?? 0}
                        onChange={(e) => setCell(m.key, i, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Derived stats — computed locally, before any AI call */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => {
          const meta = TREND_META[s.trend];
          const colour = trendColour(s.trend, s.betterWhen);
          return (
            <div key={s.key} className="rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black p-5">
              <div className="mb-2 flex items-start justify-between gap-2">
                <p className="text-[11px] font-semibold text-gray-700 dark:text-white/60 leading-snug">{s.label}</p>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{ color: colour, background: `${colour}14` }}>
                  <meta.Icon className="h-3 w-3" />{meta.label}
                </span>
              </div>
              <p className="mb-1 text-xl font-bold tabular-nums text-black dark:text-white">
                {s.last}{s.unit}
                <span className="ml-2 text-xs font-semibold" style={{ color: colour }}>
                  {s.changePct > 0 ? "+" : ""}{s.changePct}%
                </span>
              </p>
              <Spark values={s.values} color={colour} />
              <p className="mt-1 text-[10px] text-gray-600 dark:text-white/40 tabular-nums">
                range {s.min}–{s.max}{s.unit} · mean {s.mean}{s.unit}
              </p>

              {/* Target — editable, and the only thing that turns a trend into a verdict */}
              <label className="mt-2 flex items-center gap-1.5 border-t border-gray-100 pt-2 dark:border-white/8">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-600 dark:text-white/40">
                  Target
                </span>
                <input
                  type="number"
                  value={targets[s.key] ?? ""}
                  placeholder="none"
                  onChange={(e) =>
                    setTargets((t) => ({
                      ...t,
                      [s.key]: e.target.value === "" ? null : Number(e.target.value),
                    }))
                  }
                  className="w-14 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[11px] tabular-nums text-black outline-none focus:border-[#2563EB] dark:border-white/15 dark:bg-black dark:text-white"
                />
                {s.attainment !== null && (
                  <span
                    className="ml-auto rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums"
                    style={{
                      background: s.onTarget ? "#04785715" : "#B4530915",
                      color:      s.onTarget ? "#047857"   : "#B45309",
                    }}
                  >
                    {s.onTarget ? "met" : "missed"} · {s.attainment}%
                  </span>
                )}
              </label>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!canSubmit}
        onClick={() =>
          onSubmit({
            context: {
              organisationName: orgName,
              industry,
              goal,
              challenge: goal || `Understand ${engineName.toLowerCase()} patterns`,
            },
            stats,
          })
        }
        className="w-full rounded-2xl py-3.5 text-sm font-extrabold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
        style={{ background: ACCENT }}
      >
        {loading
          ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Analysing {periods} {spec.periodLabel.toLowerCase()}s…</span>
          : <>Run {engineName}</>}
      </button>
    </motion.div>
  );
}
