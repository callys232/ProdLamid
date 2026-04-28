"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import Tooltip from "./tooltip";
import { useFieldRecommendation } from "@/hooks/useField";

const SLA_OPTIONS = ["3 months", "6 months", "12 months", "18 months", "24 months", "36 months"];

const FIELDS = [
  { key: "maintenanceCost", label: "Maintenance Cost",  color: "text-sky-400",   hint: "Maintenance averages $3k–5k annually",       isNumber: true },
  { key: "supportSLA",      label: "Support SLA",       color: "text-blue-400",  hint: "Typical SLA: 12–24 months",                  isNumber: false },
  { key: "upgradeBudget",   label: "Upgrade Budget",    color: "text-indigo-400",hint: "Upgrades: ~8–12% of project budget",         isNumber: true },
] as const;

type FieldKey = "maintenanceCost" | "supportSLA" | "upgradeBudget";

const cardBase = (active: boolean) =>
  `relative rounded-xl border p-4 transition ${active ? "border-sky-500/50 bg-sky-500/5" : "border-gray-800 bg-black/40 hover:border-gray-700"}`;

export default function LifecycleInput() {
  const [lifecycle, setLifecycle] = useState({ maintenanceCost: 4000, supportSLA: "12 months", upgradeBudget: 6000 });
  const [activeField, setActiveField] = useState<FieldKey | null>(null);
  const [slaOpen, setSlaOpen] = useState(false);

  const keyword = useMemo(() => activeField ? String(lifecycle[activeField] ?? "") : "", [activeField, lifecycle]);

  const rec = useFieldRecommendation({ enabled: activeField !== null, industry: "it", complexity: "medium", field: activeField ?? "", keyword });

  return (
    <div className="space-y-3">
      {FIELDS.map((f) => (
        <div key={f.key} className={cardBase(activeField === f.key)}>
          <div className="flex items-center justify-between mb-2">
            <label className={`text-xs font-semibold uppercase tracking-widest ${f.color}`}>{f.label}</label>
            <span className={`text-xs font-bold ${f.color}`}>
              {f.isNumber ? `$${(lifecycle[f.key] as number).toLocaleString()}` : lifecycle[f.key]}
            </span>
          </div>

          {f.isNumber ? (
            <div className="relative">
              <span className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs ${f.color}`}>$</span>
              <input type="number" min={0} value={lifecycle[f.key] as number}
                onFocus={() => setActiveField(f.key)} onBlur={() => setActiveField(null)}
                onChange={(e) => setLifecycle((p) => ({ ...p, [f.key]: Number(e.target.value) }))}
                className="w-full rounded-lg border border-gray-700 bg-black/60 py-2 pl-7 pr-3 text-sm text-white transition focus:border-sky-500/60 focus:outline-none"
              />
            </div>
          ) : (
            <div className="relative">
              <button type="button" onFocus={() => setActiveField(f.key)} onBlur={() => setActiveField(null)}
                onClick={() => setSlaOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-700 bg-black/60 px-3 py-2 text-sm transition hover:border-sky-500/50"
              >
                <span className="text-sky-400 font-medium">{lifecycle.supportSLA}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-gray-500 transition ${slaOpen ? "rotate-180" : ""}`} />
              </button>
              {slaOpen && (
                <div className="absolute top-full left-0 z-50 mt-1 w-40 rounded-xl border border-gray-700 bg-[#0f0f0f] py-1 shadow-2xl">
                  {SLA_OPTIONS.map((opt) => (
                    <button key={opt} type="button"
                      onClick={() => { setLifecycle((p) => ({ ...p, supportSLA: opt })); setSlaOpen(false); }}
                      className={`flex w-full items-center justify-between px-4 py-1.5 text-xs transition hover:bg-white/5 ${opt === lifecycle.supportSLA ? "text-sky-400" : "text-gray-300"}`}
                    >
                      {opt}{opt === lifecycle.supportSLA && <span className="opacity-60">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <p className="mt-1.5 text-[10px] text-gray-600">{f.hint}</p>
          <Tooltip visible={activeField === f.key} loading={rec.loading}
            recommendation={rec.data?.recommendation || f.hint}
            source={rec.data?.source} confidence={rec.data?.confidence || 0.78}
          />
        </div>
      ))}
    </div>
  );
}
