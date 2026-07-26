"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Loader2, Plus, Trash2, Download, Sparkles, AlertCircle,
  RefreshCw, ArrowUpRight, TriangleAlert,
} from "lucide-react";
import { PROJECT_TYPES, COST_CATEGORIES } from "@/lib/budget/types";
import type { LineItem, BudgetSettings, CostCategory, ProjectType } from "@/lib/budget/types";
import { computeBudget, formatMoney, budgetToCSV, lineTotal } from "@/lib/budget/compute";
import EngineResultsGate from "./EngineResultsGate";

const ACCENT = "#2563EB";

const CURRENCIES = [
  "USD", "EUR", "GBP", "JPY", "CNY", "CHF", "CAD", "AUD", "NZD", "SGD",
  "HKD", "AED", "SAR", "INR", "BRL", "MXN", "ZAR", "NGN", "KES", "GHS",
  "EGP", "SEK", "NOK", "DKK", "PLN", "TRY", "KRW", "IDR", "MYR", "PHP",
];

const uid = () => `li-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const blankItem = (): LineItem => ({
  id: uid(), category: "Personnel", name: "", quantity: 1, unit: "unit", unitCost: 0,
});

/* Shared field styling — white ground in light, black in dark, text inverts to match. */
const inputCls =
  "w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-black " +
  "text-black dark:text-white text-sm px-3 py-2 " +
  "placeholder-gray-400 dark:placeholder-white/30 " +
  "focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition";

const cellCls =
  "w-full rounded-md border border-transparent hover:border-gray-300 dark:hover:border-white/20 " +
  "bg-transparent text-black dark:text-white text-sm px-2 py-1.5 " +
  "focus:outline-none focus:border-[#2563EB] focus:bg-white dark:focus:bg-black transition";

export default function BudgetEngine() {
  const [settings, setSettings] = useState<BudgetSettings>({
    projectName: "", projectType: "Software / IT Build", currency: "USD",
    periods: 6, periodLabel: "Month",
    overheadPct: 12, contingencyPct: 10, taxPct: 7.5, taxOnOverhead: false,
  });

  const [scope, setScope]         = useState("");
  const [region, setRegion]       = useState("");
  const [teamSize, setTeamSize]   = useState("");
  const [targetBudget, setTarget] = useState("");

  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [assumptions, setAssumptions] = useState<string[]>([]);
  const [risks, setRisks]         = useState<string[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [generated, setGenerated] = useState(false);

  /* Every figure on screen comes from here — recomputed on any edit. */
  const budget = useMemo(() => computeBudget(lineItems, settings), [lineItems, settings]);

  const set = <K extends keyof BudgetSettings>(k: K, v: BudgetSettings[K]) =>
    setSettings((s) => ({ ...s, [k]: v }));

  const updateItem = (id: string, patch: Partial<LineItem>) =>
    setLineItems((items) => items.map((li) => (li.id === id ? { ...li, ...patch } : li)));

  const removeItem = (id: string) =>
    setLineItems((items) => items.filter((li) => li.id !== id));

  const generate = async () => {
    if (!settings.projectName.trim() || !scope.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/budget/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          projectName: settings.projectName,
          projectType: settings.projectType,
          scope, currency: settings.currency,
          periods: settings.periods, periodLabel: settings.periodLabel,
          targetBudget: Number(targetBudget) || undefined,
          region, teamSize,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Generation failed.");
      setLineItems(data.lineItems);
      setAssumptions(data.assumptions ?? []);
      setRisks(data.risks ?? []);
      setGenerated(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const blob = new Blob([budgetToCSV(budget)], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `${settings.projectName || "budget"}-budget.csv`.replace(/\s+/g, "-").toLowerCase();
    a.click();
    URL.revokeObjectURL(url);
  };

  const money = (n: number) => formatMoney(n, settings.currency);
  const canGenerate = settings.projectName.trim() && scope.trim() && !loading;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ── Header — platform colours ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }} className="mb-10"
        >
          <p className="lamidone-gradient-text text-[10px] tracking-[0.4em] uppercase font-bold mb-3">
            F-Series · F02
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: ACCENT }}>
            Budgeting &amp; Forecasting Engine
          </h1>
          <p className="text-gray-600 dark:text-white/60 text-sm max-w-2xl">
            Build a costed, itemised budget for any project type. Generate a starting
            scaffold, then edit every line — totals, overhead, contingency, tax, and
            phasing recalculate instantly.
          </p>
        </motion.div>

        {error && (
          <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl border border-[#2563EB]/30 bg-[#2563EB]/5 text-sm" style={{ color: ACCENT }}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* ── Project setup ── */}
        <section className="rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black p-6 mb-6">
          <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: ACCENT }}>
            Project Setup
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="lg:col-span-2">
              <label htmlFor="bp-name" className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50 mb-1.5">
                Project Name <span style={{ color: ACCENT }}>*</span>
              </label>
              <input id="bp-name" className={inputCls} value={settings.projectName}
                onChange={(e) => set("projectName", e.target.value)}
                placeholder="e.g. Regional Data Centre Build" />
            </div>
            <div>
              <label htmlFor="bp-type" className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50 mb-1.5">
                Project Type
              </label>
              <select id="bp-type" className={inputCls} value={settings.projectType}
                onChange={(e) => set("projectType", e.target.value as ProjectType)}>
                {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="bp-scope" className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50 mb-1.5">
              Scope &amp; Deliverables <span style={{ color: ACCENT }}>*</span>
            </label>
            <textarea id="bp-scope" rows={3} className={inputCls + " resize-none"} value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="What is being delivered? Include size, volume, headcount, key milestones, and anything unusual that drives cost." />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label htmlFor="bp-cur" className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50 mb-1.5">Currency</label>
              <select id="bp-cur" className={inputCls} value={settings.currency}
                onChange={(e) => set("currency", e.target.value)}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="bp-plabel" className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50 mb-1.5">Phase Unit</label>
              <select id="bp-plabel" className={inputCls} value={settings.periodLabel}
                onChange={(e) => set("periodLabel", e.target.value)}>
                {["Month", "Quarter", "Phase", "Week"].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="bp-periods" className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50 mb-1.5">Duration</label>
              <input id="bp-periods" type="number" min={1} max={60} className={inputCls} value={settings.periods}
                onChange={(e) => set("periods", Math.max(1, Number(e.target.value) || 1))} />
            </div>
            <div>
              <label htmlFor="bp-oh" className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50 mb-1.5">Overhead %</label>
              <input id="bp-oh" type="number" min={0} step={0.5} className={inputCls} value={settings.overheadPct}
                onChange={(e) => set("overheadPct", Number(e.target.value) || 0)} />
            </div>
            <div>
              <label htmlFor="bp-cont" className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50 mb-1.5">Contingency %</label>
              <input id="bp-cont" type="number" min={0} step={0.5} className={inputCls} value={settings.contingencyPct}
                onChange={(e) => set("contingencyPct", Number(e.target.value) || 0)} />
            </div>
            <div>
              <label htmlFor="bp-tax" className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50 mb-1.5">Tax / VAT %</label>
              <input id="bp-tax" type="number" min={0} step={0.5} className={inputCls} value={settings.taxPct}
                onChange={(e) => set("taxPct", Number(e.target.value) || 0)} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label htmlFor="bp-region" className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50 mb-1.5">Region / Market</label>
              <input id="bp-region" className={inputCls} value={region}
                onChange={(e) => setRegion(e.target.value)} placeholder="e.g. Western Europe, or a specific city" />
            </div>
            <div>
              <label htmlFor="bp-team" className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50 mb-1.5">Team Size</label>
              <input id="bp-team" className={inputCls} value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)} placeholder="e.g. 8 engineers, 2 PMs" />
            </div>
            <div>
              <label htmlFor="bp-target" className="block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50 mb-1.5">Target Budget (optional)</label>
              <input id="bp-target" type="number" min={0} className={inputCls} value={targetBudget}
                onChange={(e) => setTarget(e.target.value)} placeholder="Leave blank to estimate freely" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button type="button" onClick={generate} disabled={!canGenerate}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: ACCENT }}>
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" />Building budget…</>
                : <><Sparkles className="w-4 h-4" />{generated ? "Regenerate" : "Generate Budget"}</>}
            </button>
            <button type="button" onClick={() => setLineItems((i) => [...i, blankItem()])}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border border-gray-300 dark:border-white/20 text-black dark:text-white hover:border-[#2563EB] transition">
              <Plus className="w-4 h-4" />Add Line
            </button>
            {lineItems.length > 0 && (
              <button type="button" onClick={exportCSV}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border border-gray-300 dark:border-white/20 text-black dark:text-white hover:border-[#2563EB] transition">
                <Download className="w-4 h-4" />Export CSV
              </button>
            )}
            {lineItems.length > 0 && (
              <button type="button" onClick={() => { setLineItems([]); setAssumptions([]); setRisks([]); setGenerated(false); }}
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-white/40 hover:text-[#2563EB] transition">
                <RefreshCw className="w-3.5 h-3.5" />Clear
              </button>
            )}
          </div>
        </section>

        {/* ── Results ── */}
        {lineItems.length > 0 && (
          <EngineResultsGate>
            <div className="flex flex-col gap-6">

              {/* Totals — platform colours */}
              <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { label: "Direct Costs", value: budget.totals.directCosts },
                  { label: `Overhead ${settings.overheadPct}%`, value: budget.totals.overhead },
                  { label: `Contingency ${settings.contingencyPct}%`, value: budget.totals.contingency },
                  { label: `Tax ${settings.taxPct}%`, value: budget.totals.tax },
                ].map((t) => (
                  <div key={t.label} className="rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black p-5">
                    <p className="text-lg font-bold text-black dark:text-white leading-none mb-1.5 tabular-nums">
                      {money(t.value)}
                    </p>
                    <p className="text-[11px] text-gray-600 dark:text-white/50">{t.label}</p>
                  </div>
                ))}
                <div className="rounded-2xl border-2 p-5" style={{ borderColor: ACCENT, background: `${ACCENT}0D` }}>
                  <p className="text-lg font-extrabold leading-none mb-1.5 tabular-nums" style={{ color: ACCENT }}>
                    {money(budget.totals.grandTotal)}
                  </p>
                  <p className="text-[11px] font-semibold" style={{ color: ACCENT }}>Grand Total</p>
                </div>
              </section>

              {/* Warnings */}
              {budget.warnings.length > 0 && (
                <section className="rounded-2xl border border-amber-400/40 bg-amber-50 dark:bg-amber-950/20 p-5">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-3">
                    <TriangleAlert className="w-3.5 h-3.5" />Budget Checks
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {budget.warnings.map((w) => (
                      <li key={w} className="text-sm text-amber-800 dark:text-amber-300/90">• {w}</li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Line items — editable */}
              <section className="rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-white/15 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
                    Line Items ({lineItems.length})
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-white/40">Every field is editable</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[860px] text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-white/15">
                        {["Category", "Item", "Qty", "Unit", "Unit Cost", "Total", settings.periodLabel, ""].map((h, i) => (
                          <th key={h + i} className={`px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-white/50 ${i >= 2 && i <= 5 ? "text-right" : "text-left"}`}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {lineItems.map((li) => (
                        <tr key={li.id} className="border-b border-gray-100 dark:border-white/8 last:border-0">
                          <td className="px-3 py-1.5">
                            <select aria-label="Category" className={cellCls} value={li.category}
                              onChange={(e) => updateItem(li.id, { category: e.target.value as CostCategory })}>
                              {COST_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </td>
                          <td className="px-3 py-1.5 min-w-[220px]">
                            <input aria-label="Item name" className={cellCls} value={li.name}
                              onChange={(e) => updateItem(li.id, { name: e.target.value })} placeholder="Cost item" />
                          </td>
                          <td className="px-3 py-1.5 w-20">
                            <input aria-label="Quantity" type="number" min={0} className={cellCls + " text-right tabular-nums"} value={li.quantity}
                              onChange={(e) => updateItem(li.id, { quantity: Number(e.target.value) || 0 })} />
                          </td>
                          <td className="px-3 py-1.5 w-24">
                            <input aria-label="Unit" className={cellCls} value={li.unit}
                              onChange={(e) => updateItem(li.id, { unit: e.target.value })} />
                          </td>
                          <td className="px-3 py-1.5 w-32">
                            <input aria-label="Unit cost" type="number" min={0} step="0.01" className={cellCls + " text-right tabular-nums"} value={li.unitCost}
                              onChange={(e) => updateItem(li.id, { unitCost: Number(e.target.value) || 0 })} />
                          </td>
                          <td className="px-3 py-1.5 text-right font-semibold tabular-nums text-black dark:text-white whitespace-nowrap">
                            {money(lineTotal(li))}
                          </td>
                          <td className="px-3 py-1.5 w-20">
                            <input aria-label="Period" type="number" min={1} max={settings.periods} className={cellCls + " text-right tabular-nums"}
                              value={li.period ?? ""} placeholder="—"
                              onChange={(e) => updateItem(li.id, { period: Number(e.target.value) || undefined })} />
                          </td>
                          <td className="px-3 py-1.5 w-10">
                            <button type="button" aria-label={`Remove ${li.name || "line item"}`} onClick={() => removeItem(li.id)}
                              className="text-gray-400 dark:text-white/30 hover:text-red-500 transition p-1">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-6 py-3 border-t border-gray-200 dark:border-white/15">
                  <button type="button" onClick={() => setLineItems((i) => [...i, blankItem()])}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold transition hover:opacity-70" style={{ color: ACCENT }}>
                    <Plus className="w-3.5 h-3.5" />Add line item
                  </button>
                </div>
              </section>

              {/* Category rollup + phasing */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section className="rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black p-6">
                  <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: ACCENT }}>
                    Cost by Category
                  </p>
                  <div className="flex flex-col gap-3">
                    {budget.categories.map((c) => (
                      <div key={c.category}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm text-black dark:text-white">{c.category}</p>
                          <p className="text-sm font-semibold tabular-nums text-black dark:text-white">{money(c.subtotal)}</p>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${c.pctOfDirect}%`, background: ACCENT }} />
                        </div>
                        <p className="text-[10px] text-gray-500 dark:text-white/40 mt-0.5">
                          {c.pctOfDirect}% of direct · {c.itemCount} item{c.itemCount > 1 ? "s" : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black p-6">
                  <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: ACCENT }}>
                    Spend by {settings.periodLabel}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-white/15">
                          <th className="text-left px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-white/50">{settings.periodLabel}</th>
                          <th className="text-right px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-white/50">Direct</th>
                          <th className="text-right px-2 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-white/50">Loaded</th>
                        </tr>
                      </thead>
                      <tbody>
                        {budget.periods.map((p) => (
                          <tr key={p.period} className="border-b border-gray-100 dark:border-white/8 last:border-0">
                            <td className="px-2 py-2 text-black dark:text-white">{p.label}</td>
                            <td className="px-2 py-2 text-right tabular-nums text-gray-700 dark:text-white/70">{money(p.direct)}</td>
                            <td className="px-2 py-2 text-right tabular-nums font-semibold text-black dark:text-white">{money(p.loaded)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-white/40 mt-3">
                    Loaded spreads overhead, contingency, and tax pro-rata across direct spend.
                  </p>
                </section>
              </div>

              {/* Assumptions & risks */}
              {(assumptions.length > 0 || risks.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {assumptions.length > 0 && (
                    <section className="rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black p-6">
                      <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: ACCENT }}>Assumptions</p>
                      <ul className="flex flex-col gap-2">
                        {assumptions.map((a) => (
                          <li key={a} className="text-sm text-gray-700 dark:text-white/70 leading-snug">• {a}</li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {risks.length > 0 && (
                    <section className="rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black p-6">
                      <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: ACCENT }}>Cost Risks</p>
                      <ul className="flex flex-col gap-2">
                        {risks.map((r) => (
                          <li key={r} className="text-sm text-gray-700 dark:text-white/70 leading-snug">• {r}</li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Link href="/finance-dashboard"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-1.5"
                  style={{ background: ACCENT }}>
                  Finance Dashboard <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/f01-financial-visibility"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#2563EB]/30 transition hover:bg-[#2563EB]/5"
                  style={{ color: ACCENT }}>
                  Financial Visibility
                </Link>
              </div>
            </div>
          </EngineResultsGate>
        )}
      </div>
    </div>
  );
}
