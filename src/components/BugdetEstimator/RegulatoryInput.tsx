"use client";

import { useState } from "react";
import Tooltip from "./tooltip";
import { useFieldRecommendation } from "@/hooks/useField";

type Field = "permitsCost" | "complianceCost" | "legalFees";

const FIELDS: { key: Field; label: string; color: string; placeholder: string; hint: string }[] = [
  { key: "permitsCost",    label: "Permits Cost",     color: "text-orange-400", placeholder: "5000", hint: "Typical permits: $4k–6k" },
  { key: "complianceCost", label: "Compliance Cost",  color: "text-yellow-400", placeholder: "3000", hint: "Adds ~5–10% of project cost" },
  { key: "legalFees",      label: "Legal Fees",       color: "text-red-400",    placeholder: "2000", hint: "Average $1.5k–3k" },
];

const cardBase = (active: boolean) =>
  `relative rounded-xl border p-4 transition ${active ? "border-orange-500/50 bg-orange-500/5" : "border-gray-800 bg-black/40 hover:border-gray-700"}`;

export default function RegulatoryInput() {
  const [regulatory, setRegulatory] = useState({ permitsCost: 5000, complianceCost: 3000, legalFees: 2000 });
  const [activeField, setActiveField] = useState<Field | null>(null);

  const rec = useFieldRecommendation({
    enabled: activeField !== null,
    industry: "construction", complexity: "medium",
    field: activeField ?? "",
    keyword: activeField ? String(regulatory[activeField]) : "",
  });

  const total = regulatory.permitsCost + regulatory.complianceCost + regulatory.legalFees;

  return (
    <div className="space-y-3">
      {FIELDS.map((f) => (
        <div key={f.key} className={cardBase(activeField === f.key)}>
          <div className="flex items-center justify-between mb-2">
            <label className={`text-xs font-semibold uppercase tracking-widest ${f.color}`}>{f.label}</label>
            <span className={`text-xs font-bold ${f.color}`}>${regulatory[f.key].toLocaleString()}</span>
          </div>
          <div className="relative">
            <span className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs ${f.color}`}>$</span>
            <input type="number" min={0} value={regulatory[f.key]}
              onFocus={() => setActiveField(f.key)} onBlur={() => setActiveField(null)}
              onChange={(e) => setRegulatory((p) => ({ ...p, [f.key]: Number(e.target.value) }))}
              className="w-full rounded-lg border border-gray-700 bg-black/60 py-2 pl-7 pr-3 text-sm text-white transition focus:border-orange-500/60 focus:outline-none"
            />
          </div>
          <p className="mt-1.5 text-[10px] text-gray-600">{f.hint}</p>
          <Tooltip visible={activeField === f.key} loading={rec.loading}
            recommendation={rec.data?.recommendation || f.hint}
            source={rec.data?.source} confidence={rec.data?.confidence || 0.75}
          />
        </div>
      ))}

      <div className="flex justify-end rounded-xl border border-gray-800 bg-black/40 px-4 py-3">
        <div className="text-right">
          <p className="text-[10px] text-gray-500">Total Regulatory Cost</p>
          <p className="text-base font-bold text-orange-400">${total.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
