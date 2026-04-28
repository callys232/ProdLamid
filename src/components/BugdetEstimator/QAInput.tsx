"use client";

import { useState } from "react";
import Tooltip from "./tooltip";
import { useFieldRecommendation } from "@/hooks/useField";

type Field = "testingHours" | "auditCost" | "bugFixBudget";

const FIELDS: { key: Field; label: string; color: string; unit: string; hint: string; min: number; max: number }[] = [
  { key: "testingHours", label: "Testing Hours",   color: "text-green-400",  unit: "hrs",  hint: "Typical QA effort: 100–150 hours",      min: 0, max: 500 },
  { key: "auditCost",    label: "Audit Cost",       color: "text-teal-400",   unit: "$",    hint: "Code / security audits: $4k–6k",        min: 0, max: 50000 },
  { key: "bugFixBudget", label: "Bug Fix Budget",   color: "text-emerald-400",unit: "$",    hint: "Bug fixes: ~10–15% of dev cost",        min: 0, max: 50000 },
];

const cardBase = (active: boolean) =>
  `relative rounded-xl border p-4 transition ${active ? "border-green-500/50 bg-green-500/5" : "border-gray-800 bg-black/40 hover:border-gray-700"}`;

export default function QAInput() {
  const [qa, setQA] = useState({ testingHours: 120, auditCost: 5000, bugFixBudget: 8000 });
  const [activeField, setActiveField] = useState<Field | null>(null);

  const rec = useFieldRecommendation({
    enabled: activeField !== null,
    industry: "it", complexity: "medium",
    field: activeField ?? "",
    keyword: activeField ? String(qa[activeField]) : "",
  });

  return (
    <div className="space-y-3">
      {FIELDS.map((f) => (
        <div key={f.key} className={cardBase(activeField === f.key)}>
          <div className="flex items-center justify-between mb-3">
            <label className={`text-xs font-semibold uppercase tracking-widest ${f.color}`}>{f.label}</label>
            <span className={`text-sm font-bold ${f.color}`}>
              {f.unit === "$" ? `$${qa[f.key].toLocaleString()}` : `${qa[f.key]} hrs`}
            </span>
          </div>

          <input type="range" min={f.min} max={f.max}
            step={f.unit === "hrs" ? 5 : 500}
            value={qa[f.key]}
            onFocus={() => setActiveField(f.key)} onBlur={() => setActiveField(null)}
            onChange={(e) => setQA((p) => ({ ...p, [f.key]: Number(e.target.value) }))}
            className={`w-full accent-green-500`}
          />

          <div className="mt-1 flex items-center justify-between">
            <p className="text-[10px] text-gray-600">{f.hint}</p>
            <input type="number" min={f.min} value={qa[f.key]}
              onFocus={() => setActiveField(f.key)} onBlur={() => setActiveField(null)}
              onChange={(e) => setQA((p) => ({ ...p, [f.key]: Number(e.target.value) }))}
              className="w-24 rounded-lg border border-gray-700 bg-black/60 px-2 py-1 text-right text-xs text-white focus:border-green-500/50 focus:outline-none"
            />
          </div>

          <Tooltip visible={activeField === f.key} loading={rec.loading}
            recommendation={rec.data?.recommendation || f.hint}
            source={rec.data?.source} confidence={rec.data?.confidence || 0.8}
          />
        </div>
      ))}
    </div>
  );
}
