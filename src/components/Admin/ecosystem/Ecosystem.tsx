"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  RefreshCw, Activity, Layers, AlertTriangle, TrendingUp, Users, Cpu, FileText,
} from "lucide-react";

/**
 * Ecosystem administration.
 *
 * Reads the ToolUsage rows written on every engine run and joins them against
 * the registry, so an administrator can see which engines are actually earning
 * their place and where the registry has drifted from the routes.
 */

interface EngineRow {
  moduleId:      string;
  engineName:    string;
  series:        string;
  route:         string | null;
  computeBacked: boolean;
  runs:          number;
  runsInWindow:  number;
  uniqueUsers:   number;
  lastRun:       string | null;
}

interface SeriesRow {
  series: string; total: number; used: number; runs: number; computeBacked: number;
}

interface EcosystemData {
  windowDays: number;
  totals: {
    engines: number; computeBacked: number; narrativeOnly: number;
    enginesUsed: number; enginesUnused: number;
    totalRuns: number; uniqueUsers: number; runsInWindow: number;
  };
  topEngines:    EngineRow[];
  unusedEngines: EngineRow[];
  series:        SeriesRow[];
  health: { missingRoute: string[]; orphanRoute: string[]; danglingSpecs: string[] };
}

const CARD = "rounded-xl border border-[#1f1f1f] bg-[#0a0a0a] p-5";
const WINDOWS = [7, 30, 90] as const;

const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function Ecosystem() {
  const [data, setData]       = useState<EcosystemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [days, setDays]       = useState<number>(30);

  const load = useCallback(async (window: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/ecosystem?days=${window}`, { credentials: "include" });
      if (res.status === 403) throw new Error("Administrator access required.");
      if (!res.ok) throw new Error("Could not load ecosystem data.");
      setData(await res.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not load ecosystem data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(days); }, [load, days]);

  if (loading && !data) {
    return (
      <div className="flex items-center gap-2 p-6 text-sm text-gray-400">
        <RefreshCw className="h-4 w-4 animate-spin" /> Loading ecosystem…
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-6 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
        <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
      </div>
    );
  }
  if (!data) return null;

  const { totals, health } = data;
  const coverage = totals.engines ? Math.round((totals.enginesUsed / totals.engines) * 100) : 0;
  const healthIssues = health.missingRoute.length + health.orphanRoute.length + health.danglingSpecs.length;

  const STATS = [
    { label: "Engines in registry", value: totals.engines,      sub: `${totals.computeBacked} compute-backed · ${totals.narrativeOnly} narrative`, Icon: Layers },
    { label: "Ever run",            value: totals.enginesUsed,  sub: `${coverage}% of the catalogue`,                                              Icon: Activity },
    { label: "Never opened",        value: totals.enginesUnused, sub: "candidates for retirement",                                                 Icon: FileText },
    { label: "Total runs",          value: totals.totalRuns,    sub: `${totals.runsInWindow} in the last ${data.windowDays} days`,                 Icon: TrendingUp },
    { label: "Members running",     value: totals.uniqueUsers,  sub: "unique accounts",                                                            Icon: Users },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }} className="flex flex-col gap-6 p-6"
    >
      {/* Header + window selector */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white">Ecosystem</h2>
          <p className="text-xs text-gray-500">Engine usage, coverage and registry health.</p>
        </div>
        <div className="flex items-center gap-2">
          {WINDOWS.map((w) => (
            <button
              key={w} type="button" onClick={() => setDays(w)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                days === w ? "bg-[#2563EB] text-white" : "border border-[#1f1f1f] text-gray-400 hover:text-white"
              }`}
            >
              {w}d
            </button>
          ))}
          <button
            type="button" onClick={() => load(days)} aria-label="Refresh"
            className="rounded-lg border border-[#1f1f1f] p-2 text-gray-400 transition hover:text-white"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Headline numbers */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {STATS.map((s) => (
          <div key={s.label} className={CARD}>
            <s.Icon className="mb-3 h-4 w-4 text-[#2563EB]" />
            <p className="text-2xl font-bold tabular-nums text-white">{s.value.toLocaleString()}</p>
            <p className="mt-1 text-[11px] font-semibold text-gray-300">{s.label}</p>
            <p className="mt-0.5 text-[10px] text-gray-500">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Registry health — only shown when something has drifted */}
      {healthIssues > 0 && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/[0.06] p-5">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-yellow-400">
            <AlertTriangle className="h-3.5 w-3.5" /> Registry health · {healthIssues} issue{healthIssues > 1 ? "s" : ""}
          </p>
          <ul className="flex flex-col gap-1.5 text-xs text-yellow-200/90">
            {health.missingRoute.length > 0 && (
              <li>{health.missingRoute.length} module{health.missingRoute.length > 1 ? "s" : ""} in the registry with no route: {health.missingRoute.slice(0, 8).join(", ")}{health.missingRoute.length > 8 ? "…" : ""}</li>
            )}
            {health.orphanRoute.length > 0 && (
              <li>{health.orphanRoute.length} route{health.orphanRoute.length > 1 ? "s" : ""} with no registry entry: {health.orphanRoute.slice(0, 8).join(", ")}{health.orphanRoute.length > 8 ? "…" : ""}</li>
            )}
            {health.danglingSpecs.length > 0 && (
              <li>{health.danglingSpecs.length} typed-input ID{health.danglingSpecs.length > 1 ? "s" : ""} that no longer exist: {health.danglingSpecs.join(", ")} — these silently match nothing.</li>
            )}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Most used */}
        <div className={CARD}>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">Most used engines</p>
          {data.topEngines.length === 0 ? (
            <p className="text-xs text-gray-500">No engine has been run yet.</p>
          ) : (
            <ul className="flex flex-col">
              {data.topEngines.map((e) => (
                <li key={e.moduleId} className="flex items-center gap-3 border-b border-[#141414] py-2.5 last:border-0">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-white">{e.engineName}</span>
                    <span className="text-[10px] text-gray-500">
                      {e.series} · {e.uniqueUsers} member{e.uniqueUsers === 1 ? "" : "s"} · last {fmtDate(e.lastRun)}
                    </span>
                  </span>
                  {e.computeBacked && (
                    <Cpu className="h-3 w-3 shrink-0 text-emerald-500" aria-label="Compute-backed" />
                  )}
                  <span className="shrink-0 text-right">
                    <span className="block text-sm font-bold tabular-nums text-white">{e.runs}</span>
                    <span className="text-[10px] text-gray-500">{e.runsInWindow} in {data.windowDays}d</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* By series */}
        <div className={CARD}>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">Coverage by series</p>
          <ul className="flex flex-col gap-3">
            {data.series.map((s) => {
              const pct = s.total ? Math.round((s.used / s.total) * 100) : 0;
              return (
                <li key={s.series}>
                  <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
                    <span className="text-white">{s.series}</span>
                    <span className="tabular-nums text-gray-500">
                      {s.used}/{s.total} used · {s.runs} run{s.runs === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#181818]">
                    <div
                      className="h-full rounded-full bg-[#2563EB] transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-gray-600">{s.computeBacked} of {s.total} compute-backed</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Never opened */}
      <div className={CARD}>
        <div className="mb-1 flex items-baseline justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Never opened</p>
          <p className="text-[10px] text-gray-500">
            {totals.enginesUnused} engine{totals.enginesUnused === 1 ? "" : "s"}
            {data.unusedEngines.length < totals.enginesUnused && ` · showing first ${data.unusedEngines.length}`}
          </p>
        </div>
        <p className="mb-4 text-[11px] text-gray-500">
          Compute-backed engines are listed first — those are the surprising ones, since they do real work nobody has asked for yet.
        </p>

        {data.unusedEngines.length === 0 ? (
          <p className="text-xs text-emerald-400">Every engine in the registry has been run at least once.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {data.unusedEngines.map((e) => (
              <span
                key={e.moduleId}
                title={`${e.series}${e.route ? ` · ${e.route}` : " · no route"}`}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] ${
                  e.computeBacked
                    ? "border-emerald-500/30 bg-emerald-500/[0.07] text-emerald-300"
                    : "border-[#1f1f1f] bg-[#111] text-gray-400"
                }`}
              >
                {e.computeBacked && <Cpu className="h-2.5 w-2.5" />}
                {e.engineName}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
