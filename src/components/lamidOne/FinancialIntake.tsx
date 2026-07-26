"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Loader2, TriangleAlert, ChevronDown, ChevronUp } from "lucide-react";
import type { FinancialInputs, FinancialSummary, OpexBreakdown } from "@/lib/intelligence/financial";
import { computeFinancials, OPEX_CATEGORIES } from "@/lib/intelligence/financial";

const ACCENT = "#2563EB";

const CURRENCIES = [
  "USD", "EUR", "GBP", "JPY", "CNY", "CHF", "CAD", "AUD", "SGD", "AED",
  "INR", "BRL", "MXN", "ZAR", "NGN", "KES", "SEK", "PLN", "TRY", "KRW",
];

const inputCls =
  "w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-black " +
  "text-black dark:text-white text-sm px-3 py-2 " +
  "placeholder-gray-500 dark:placeholder-white/40 " +
  "focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition";

const cellCls =
  "w-full rounded-md border border-gray-200 dark:border-white/15 bg-white dark:bg-black " +
  "text-black dark:text-white text-sm px-2 py-1.5 text-right tabular-nums " +
  "focus:outline-none focus:border-[#2563EB] transition";

const ROWS = [
  { key: "revenue" as const, label: "Revenue",            hint: "Total income for the period" },
  { key: "cogs"    as const, label: "Cost of delivery",   hint: "Direct costs — COGS" },
  { key: "opex"    as const, label: "Operating expenses", hint: "Salaries, rent, tooling, overhead" },
];

export default function FinancialIntake({
  periodLabel = "Month", defaultPeriods = 6, engineName, onSubmit, loading,
}: {
  periodLabel?:    string;
  defaultPeriods?: number;
  engineName:      string;
  onSubmit: (payload: { context: Record<string, string>; summary: FinancialSummary }) => void;
  loading: boolean;
}) {
  const [orgName, setOrgName]   = useState("");
  const [industry, setIndustry] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [count, setCount]       = useState(defaultPeriods);
  const [cash, setCash]         = useState(0);
  const [headcount, setHead]    = useState(0);

  const [rows, setRows] = useState<Record<string, number[]>>(() => ({
    revenue: Array(defaultPeriods).fill(0),
    cogs:    Array(defaultPeriods).fill(0),
    opex:    Array(defaultPeriods).fill(0),
  }));

  /* Optional cost split. Without it the engine can report total operating cost
     and nothing more — you cannot locate waste inside a single number. */
  const [showSplit, setShowSplit] = useState(false);
  const [split, setSplit] = useState<Record<string, number[]>>(() => {
    const init: Record<string, number[]> = {};
    for (const c of OPEX_CATEGORIES) init[c] = Array(defaultPeriods).fill(0);
    return init;
  });

  const inputs: FinancialInputs = useMemo(() => ({
    currency, periodLabel,
    cashBalance: cash,
    headcount,
    periods: Array.from({ length: count }, (_, i) => {
      const breakdown: OpexBreakdown = {};
      if (showSplit) {
        for (const c of OPEX_CATEGORIES) {
          const v = split[c]?.[i] ?? 0;
          if (v > 0) breakdown[c] = v;
        }
      }
      return {
        revenue: rows.revenue?.[i] ?? 0,
        cogs:    rows.cogs?.[i]    ?? 0,
        opex:    rows.opex?.[i]    ?? 0,
        ...(Object.keys(breakdown).length ? { opexBreakdown: breakdown } : {}),
      };
    }),
  }), [currency, periodLabel, cash, headcount, count, rows, showSplit, split]);

  /* A split that does not reconcile to the opex total is worse than none —
     every percentage downstream would be measured against the wrong base. */
  const splitMismatch = useMemo(() => {
    if (!showSplit) return [] as number[];
    const off: number[] = [];
    for (let i = 0; i < count; i++) {
      const total = OPEX_CATEGORIES.reduce((a, c) => a + (split[c]?.[i] ?? 0), 0);
      const opex  = rows.opex?.[i] ?? 0;
      if (total > 0 && Math.abs(total - opex) > Math.max(1, opex * 0.01)) off.push(i + 1);
    }
    return off;
  }, [showSplit, split, rows, count]);

  const summary = useMemo(() => computeFinancials(inputs), [inputs]);

  const money = (n: number) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency", currency, maximumFractionDigits: 0,
      }).format(n);
    } catch {
      return `${currency} ${n.toLocaleString()}`;
    }
  };

  const setCell = (key: string, i: number, raw: string) => {
    const v = Number(raw);
    setRows((r) => {
      const next = [...(r[key] ?? [])];
      next[i] = Number.isFinite(v) ? v : 0;
      return { ...r, [key]: next };
    });
  };

  const setPeriodCount = (n: number) => {
    const c = Math.max(2, Math.min(24, n || 2));
    setCount(c);
    setRows((r) => {
      const next: Record<string, number[]> = {};
      for (const row of ROWS) {
        const cur = r[row.key] ?? [];
        next[row.key] = Array.from({ length: c }, (_, i) => cur[i] ?? 0);
      }
      return next;
    });
  };

  const canSubmit = orgName.trim() && summary.totalRevenue > 0 && !loading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }} className="mx-auto flex max-w-4xl flex-col gap-6"
    >
      {/* Context */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black p-6">
        <p className="mb-5 text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
          Enterprise Context
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="fi-org" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50">
              Organisation <span style={{ color: ACCENT }}>*</span>
            </label>
            <input id="fi-org" className={inputCls} value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="e.g. Horizon Capital" />
          </div>
          <div>
            <label htmlFor="fi-ind" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50">Industry</label>
            <input id="fi-ind" className={inputCls} value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. SaaS" />
          </div>
          <div>
            <label htmlFor="fi-cur" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50">Currency</label>
            <select id="fi-cur" className={inputCls} value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="fi-cnt" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50">{periodLabel}s</label>
            <input id="fi-cnt" type="number" min={2} max={24} className={inputCls} value={count} onChange={(e) => setPeriodCount(Number(e.target.value))} />
          </div>
          <div>
            <label htmlFor="fi-head" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50">Headcount</label>
            <input id="fi-head" type="number" min={0} className={inputCls} value={headcount} onChange={(e) => setHead(Number(e.target.value) || 0)} />
          </div>
        </div>
        <div className="mt-4 max-w-xs">
          <label htmlFor="fi-cash" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50">
            Cash balance (closing)
          </label>
          <input id="fi-cash" type="number" min={0} className={inputCls} value={cash} onChange={(e) => setCash(Number(e.target.value) || 0)} />
        </div>
      </div>

      {/* Financials grid */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black">
        <div className="border-b border-gray-200 dark:border-white/15 px-6 py-4">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
            Financials by {periodLabel}
          </p>
          <p className="mt-1 text-[11px] text-gray-600 dark:text-white/50">
            Oldest period first. Margins, burn and runway are calculated as you type.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/15">
                <th className="min-w-[180px] px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-white/50">Line</th>
                {Array.from({ length: count }, (_, i) => (
                  <th key={i} className="w-24 px-2 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-white/50">
                    {periodLabel.slice(0, 1)}{i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.key} className="border-b border-gray-100 dark:border-white/8 last:border-0">
                  <td className="px-4 py-2.5">
                    <p className="font-medium text-black dark:text-white">{row.label}</p>
                    <p className="text-[10px] text-gray-600 dark:text-white/40">{row.hint}</p>
                  </td>
                  {Array.from({ length: count }, (_, i) => (
                    <td key={i} className="px-1.5 py-2">
                      <input type="number" min={0} className={cellCls}
                        aria-label={`${row.label} — ${periodLabel} ${i + 1}`}
                        value={rows[row.key]?.[i] ?? 0}
                        onChange={(e) => setCell(row.key, i, e.target.value)} />
                    </td>
                  ))}
                </tr>
              ))}
              {/* Derived row — read-only proof the math is happening */}
              <tr className="bg-[#2563EB]/[0.03]">
                <td className="px-4 py-2.5">
                  <p className="font-semibold" style={{ color: ACCENT }}>Operating profit</p>
                  <p className="text-[10px] text-gray-600 dark:text-white/40">Calculated</p>
                </td>
                {summary.periodsDerived.map((p) => (
                  <td key={p.index} className="px-2 py-2.5 text-right text-xs font-semibold tabular-nums"
                    style={{ color: p.operatingProfit >= 0 ? "#059669" : "#DC2626" }}>
                    {p.operatingProfit.toLocaleString()}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Optional operating-cost split ──
          Total opex tells you how much. Only the split tells you where. */}
      <div className="rounded-2xl border border-gray-200 dark:border-white/15">
        <button
          type="button"
          onClick={() => setShowSplit((v) => !v)}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        >
          <span>
            <span className="text-sm font-bold text-black dark:text-white">
              Break down operating costs
            </span>
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600 dark:bg-white/10 dark:text-white/50">
              optional
            </span>
            <span className="mt-0.5 block text-[11px] text-gray-600 dark:text-white/45">
              Required to rank cost lines, measure concentration, and see which costs outgrow revenue.
            </span>
          </span>
          {showSplit
            ? <ChevronUp className="h-4 w-4 shrink-0 text-gray-500" />
            : <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />}
        </button>

        {showSplit && (
          <div className="border-t border-gray-200 dark:border-white/15">
            {splitMismatch.length > 0 && (
              <p className="flex items-start gap-2 px-4 pt-3 text-[11px] text-amber-700 dark:text-amber-300/90">
                <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                The split does not add up to operating expenses in {periodLabel.toLowerCase()}{" "}
                {splitMismatch.join(", ")}. Percentages will be measured against the wrong base.
              </p>
            )}
            <div className="overflow-x-auto p-2">
              <table className="w-full text-sm">
                <tbody>
                  {OPEX_CATEGORIES.map((cat) => (
                    <tr key={cat} className="border-b border-gray-100 last:border-0 dark:border-white/8">
                      <td className="min-w-[180px] px-2 py-2 text-xs text-black dark:text-white">{cat}</td>
                      {Array.from({ length: count }, (_, i) => (
                        <td key={i} className="w-24 px-1.5 py-1.5">
                          <input
                            type="number" min={0} className={cellCls}
                            aria-label={`${cat} — ${periodLabel} ${i + 1}`}
                            value={split[cat]?.[i] ?? 0}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              setSplit((s) => {
                                const next = [...(s[cat] ?? Array(count).fill(0))];
                                next[i] = Number.isFinite(v) ? v : 0;
                                return { ...s, [cat]: next };
                              });
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Cost lines — ranked, only once a split exists */}
      {summary.opexLines.length > 0 && (
        <div className="rounded-2xl border border-gray-200 p-4 dark:border-white/15">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-white/50">
            Operating cost by line · {summary.concentrationPct}% in the largest
          </p>
          <ul className="flex flex-col gap-2">
            {summary.opexLines.map((l) => (
              <li key={l.category} className="flex items-center gap-3">
                <span className="w-44 shrink-0 truncate text-xs text-black dark:text-white">{l.category}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                  <span
                    className="block h-full rounded-full"
                    style={{ width: `${Math.min(100, l.pctOfOpex)}%`, background: ACCENT }}
                  />
                </span>
                <span className="w-14 shrink-0 text-right text-[11px] font-semibold tabular-nums text-black dark:text-white">
                  {l.pctOfOpex}%
                </span>
                <span
                  className="w-16 shrink-0 text-right text-[11px] font-semibold tabular-nums"
                  style={{ color: l.outpacingRevenue ? "#B45309" : "#6B7280" }}
                >
                  {l.growthPct >= 0 ? "+" : ""}{l.growthPct}%
                </span>
              </li>
            ))}
          </ul>
          {summary.outpacingLines.length > 0 && (
            <p className="mt-3 text-[11px] text-amber-700 dark:text-amber-300/90">
              Growing faster than revenue: {summary.outpacingLines.join(", ")}.
            </p>
          )}
        </div>
      )}

      {/* Derived KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total revenue",     value: money(summary.totalRevenue),  sub: `${summary.revenueGrowthPct > 0 ? "+" : ""}${summary.revenueGrowthPct}% growth` },
          { label: "Gross margin",      value: `${summary.grossMarginPct}%`, sub: money(summary.grossProfit) },
          { label: "Operating margin",  value: `${summary.operatingMarginPct}%`, sub: money(summary.operatingProfit) },
          {
            label: summary.runwayPeriods !== null ? "Runway" : "Net per period",
            value: summary.runwayPeriods !== null
              ? `${summary.runwayPeriods} ${periodLabel.toLowerCase()}s`
              : money(summary.netBurnPerPeriod),
            sub: summary.runwayPeriods !== null ? "at current burn" : "operating profitably",
          },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black p-5">
            <p className="mb-1 text-lg font-bold tabular-nums leading-none text-black dark:text-white">{k.value}</p>
            <p className="text-[11px] text-gray-600 dark:text-white/50">{k.label}</p>
            <p className="mt-0.5 text-[10px] text-gray-600 dark:text-white/40">{k.sub}</p>
          </div>
        ))}
      </div>

      {summary.warnings.length > 0 && (
        <div className="rounded-2xl border border-amber-400/40 bg-amber-50 p-5 dark:bg-amber-950/20">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
            <TriangleAlert className="h-3.5 w-3.5" />Financial checks
          </p>
          <ul className="flex flex-col gap-1.5">
            {summary.warnings.map((w) => (
              <li key={w} className="text-sm text-amber-800 dark:text-amber-300/90">• {w}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        disabled={!canSubmit}
        onClick={() => onSubmit({
          context: {
            organisationName: orgName,
            industry,
            challenge: `Financial performance across ${count} ${periodLabel.toLowerCase()}s`,
            goal: "Improve financial position and capital efficiency",
          },
          summary,
        })}
        className="w-full rounded-2xl py-3.5 text-sm font-extrabold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
        style={{ background: ACCENT }}
      >
        {loading
          ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Analysing financials…</span>
          : <>Run {engineName}</>}
      </button>
    </motion.div>
  );
}
