"use client";

import { useState, useMemo } from "react";
import { useOrganizationProfile, useProfileSeed } from "@/hooks/useOrganizationProfile";
import { motion } from "framer-motion";
import { Loader2, Plus, Trash2, TriangleAlert } from "lucide-react";
import type { RoleRow } from "@/lib/intelligence/roster";
import { computeRoster, rosterToPrompt } from "@/lib/intelligence/roster";
import type { RosterSummary } from "@/lib/intelligence/roster";

const ACCENT = "#2563EB";

const inputCls =
  "w-full rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-black " +
  "text-black dark:text-white text-sm px-3 py-2 placeholder-gray-500 dark:placeholder-white/40 " +
  "focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/30 transition";

const cellCls =
  "w-full rounded-md border border-gray-200 dark:border-white/15 bg-white dark:bg-black " +
  "text-black dark:text-white text-sm px-2 py-1.5 tabular-nums " +
  "focus:outline-none focus:border-[#2563EB] transition";

const uid = () => `r-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const seed = (): RoleRow[] => [
  { id: uid(), role: "Engineering Lead", headcount: 4,  capability: 4, attritionRisk: 2, successors: 1, critical: true  },
  { id: uid(), role: "Account Manager",  headcount: 12, capability: 3, attritionRisk: 4, successors: 3, critical: false },
  { id: uid(), role: "Head of Finance",  headcount: 1,  capability: 5, attritionRisk: 3, successors: 0, critical: true  },
];

export default function RosterIntake({
  engineName, onSubmit, loading, initial,
}: {
  engineName: string;
  onSubmit: (payload: {
    context: Record<string, string>;
    measured: string;
    summary: RosterSummary;
    /** Echoed back so the roster can be revisited without retyping it. */
    seed: { rows: RoleRow[] };
  }) => void;
  initial?: { rows?: RoleRow[] };
  loading: boolean;
}) {
  const [orgName, setOrgName]   = useState("");
  const [industry, setIndustry] = useState("");
  const [rows, setRows]         = useState<RoleRow[]>(initial?.rows?.length ? initial.rows : seed);

  const { profile, ready, update: saveOrg } = useOrganizationProfile();
  useProfileSeed(ready, profile, (p) => {
    if (p.organisationName) setOrgName(p.organisationName);
    if (p.industry)         setIndustry(p.industry);
  });

  const summary = useMemo(() => computeRoster(rows), [rows]);

  const update = (id: string, patch: Partial<RoleRow>) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const canSubmit = orgName.trim() && summary.roleCount > 0 && !loading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }} className="mx-auto flex max-w-4xl flex-col gap-6"
    >
      <div className="rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black p-6">
        <p className="mb-5 text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>
          Enterprise Context
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="ro-org" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50">
              Organisation <span style={{ color: ACCENT }}>*</span>
            </label>
            <input id="ro-org" className={inputCls} value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="e.g. Horizon Capital" />
          </div>
          <div>
            <label htmlFor="ro-ind" className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-600 dark:text-white/50">Industry</label>
            <input id="ro-ind" className={inputCls} value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Professional Services" />
          </div>
        </div>
      </div>

      {/* Roster */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black">
        <div className="border-b border-gray-200 dark:border-white/15 px-6 py-4">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: ACCENT }}>Workforce Roster</p>
          <p className="mt-1 text-[11px] text-gray-600 dark:text-white/50">
            Capability and attrition risk on a 1–5 scale. Mark roles the business cannot operate without.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/15">
                {["Role", "Headcount", "Capability 1-5", "Attrition 1-5", "Ready successors", "Critical", ""].map((h, i) => (
                  <th key={h + i} className={`px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-white/50 ${i === 0 ? "text-left" : "text-center"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-gray-100 dark:border-white/8 last:border-0">
                  <td className="min-w-[180px] px-3 py-2">
                    <input aria-label="Role name" className={cellCls} value={r.role}
                      onChange={(e) => update(r.id, { role: e.target.value })} placeholder="Role title" />
                  </td>
                  {([
                    ["headcount", 0, 100000] as const,
                    ["capability", 1, 5] as const,
                    ["attritionRisk", 1, 5] as const,
                    ["successors", 0, 100] as const,
                  ]).map(([key, min, max]) => (
                    <td key={key} className="w-28 px-3 py-2">
                      <input type="number" min={min} max={max} className={cellCls + " text-right"}
                        aria-label={`${r.role || "Role"} ${key}`}
                        value={r[key] as number}
                        onChange={(e) => update(r.id, { [key]: Number(e.target.value) || 0 } as Partial<RoleRow>)} />
                    </td>
                  ))}
                  <td className="w-20 px-3 py-2 text-center">
                    <input type="checkbox" checked={r.critical} aria-label={`${r.role || "Role"} is critical`}
                      onChange={(e) => update(r.id, { critical: e.target.checked })}
                      className="h-4 w-4 accent-[#2563EB]" />
                  </td>
                  <td className="w-10 px-3 py-2">
                    <button type="button" aria-label={`Remove ${r.role || "role"}`}
                      onClick={() => setRows((rs) => rs.filter((x) => x.id !== r.id))}
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
            onClick={() => setRows((rs) => [...rs, { id: uid(), role: "", headcount: 1, capability: 3, attritionRisk: 3, successors: 0, critical: false }])}
            className="inline-flex items-center gap-1.5 text-xs font-semibold transition hover:opacity-70" style={{ color: ACCENT }}>
            <Plus className="h-3.5 w-3.5" />Add role
          </button>
        </div>
      </div>

      {/* Derived */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total headcount",     value: String(summary.totalHeadcount),          sub: `${summary.roleCount} roles` },
          { label: "Weighted capability", value: `${summary.weightedCapability}/5`,       sub: `${summary.capabilityGapPct}% gap` },
          { label: "Headcount at risk",   value: `${summary.atRiskPct}%`,                 sub: `${summary.headcountAtRisk} people` },
          { label: "Bench coverage",      value: `${summary.benchCoveragePct}%`,          sub: `${summary.criticalRoleCount} critical roles` },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl border border-gray-200 dark:border-white/15 bg-white dark:bg-black p-5">
            <p className="mb-1 text-lg font-bold tabular-nums leading-none text-black dark:text-white">{k.value}</p>
            <p className="text-[11px] text-gray-600 dark:text-white/50">{k.label}</p>
            <p className="mt-0.5 text-[10px] text-gray-600 dark:text-white/55">{k.sub}</p>
          </div>
        ))}
      </div>

      {summary.warnings.length > 0 && (
        <div className="rounded-2xl border border-amber-400/40 bg-amber-50 p-5 dark:bg-amber-950/20">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
            <TriangleAlert className="h-3.5 w-3.5" />Workforce checks
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
          saveOrg({ organisationName: orgName, industry, headcount: summary.totalHeadcount || null });
          onSubmit({
            context: {
              organisationName: orgName, industry,
              challenge: `Workforce structure across ${summary.roleCount} roles`,
              goal: "Strengthen capability, succession and retention",
            },
            measured: rosterToPrompt(summary),
            summary,
            seed: { rows },
          });
        }}
        className="w-full rounded-2xl py-3.5 text-sm font-extrabold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
        style={{ background: ACCENT }}>
        {loading
          ? <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Analysing workforce…</span>
          : <>Run {engineName}</>}
      </button>
    </motion.div>
  );
}
