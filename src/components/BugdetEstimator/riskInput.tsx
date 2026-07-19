"use client";

import { useState } from "react";
import Tooltip from "./tooltip";
import { useFieldRecommendation } from "@/hooks/useField";

type RiskLevel = "low" | "medium" | "high" | "";

const RISK_OPTS: { value: RiskLevel; label: string; color: string }[] = [
  { value: "low",    label: "Low",    color: "text-green-400" },
  { value: "medium", label: "Medium", color: "text-yellow-400" },
  { value: "high",   label: "High",   color: "text-blue-400" },
];

const inputCls = "w-full rounded-lg border border-gray-700 bg-black/60 px-3 py-2 text-sm text-white transition focus:border-blue-500/60 focus:outline-none";
const cardBase = (active: boolean) => `relative rounded-xl border p-4 transition ${active ? "border-blue-500/50 bg-blue-500/5 shadow-[0_0_10px_rgba(37,99,235,0.1)]" : "border-gray-800 bg-black/40 hover:border-gray-700"}`;
const label = (color: string) => `mb-1.5 block text-xs font-semibold uppercase tracking-widest ${color}`;

export default function RiskInput() {
  const [risk, setRisk] = useState({ riskLevel: "medium" as RiskLevel, contingencyPercent: 15, notes: "" });
  const [activeField, setActiveField] = useState<string | null>(null);

  const rec = useFieldRecommendation({
    enabled: activeField !== null,
    industry: "it", complexity: "medium",
    field: activeField ?? "",
    keyword: activeField ? String(risk[activeField as keyof typeof risk] ?? "") : "",
  });

  const selected = RISK_OPTS.find((o) => o.value === risk.riskLevel);

  return (
    <div className="space-y-3">
      {/* Risk Level */}
      <div className={cardBase(activeField === "riskLevel")}>
        <label className={label("text-blue-400")}>Risk Level</label>
        <div className="flex gap-2 mt-2">
          {RISK_OPTS.map((o) => (
            <button key={o.value} type="button"
              onFocus={() => setActiveField("riskLevel")} onBlur={() => setActiveField(null)}
              onClick={() => setRisk((p) => ({ ...p, riskLevel: o.value }))}
              className={`flex-1 rounded-lg border py-2 text-xs font-semibold transition ${
                risk.riskLevel === o.value
                  ? `${o.color} border-current bg-current/10`
                  : "border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
        {selected && (
          <p className={`mt-2 text-xs ${selected.color}`}>
            {selected.value === "low" && "Low risk — minimal contingency needed."}
            {selected.value === "medium" && "Medium risk — standard 10–20% contingency recommended."}
            {selected.value === "high" && "High risk — consider 25%+ contingency buffer."}
          </p>
        )}
        <Tooltip visible={activeField === "riskLevel"} loading={rec.loading}
          recommendation={rec.data?.recommendation || "Most projects: medium risk"} source={rec.data?.source} confidence={rec.data?.confidence} />
      </div>

      {/* Contingency */}
      <div className={cardBase(activeField === "contingencyPercent")}>
        <label className={label("text-orange-400")}>Contingency %</label>
        <div className="mt-2 flex items-center gap-3">
          <input type="range" min={0} max={50} value={risk.contingencyPercent}
            onFocus={() => setActiveField("contingencyPercent")} onBlur={() => setActiveField(null)}
            onChange={(e) => setRisk((p) => ({ ...p, contingencyPercent: Number(e.target.value) }))}
            className="flex-1 accent-[#2563EB]"
          />
          <span className="w-12 text-right text-sm font-bold text-orange-400">{risk.contingencyPercent}%</span>
        </div>
        <Tooltip visible={activeField === "contingencyPercent"} loading={rec.loading}
          recommendation={rec.data?.recommendation || "Typical contingency: 10–20%"} source={rec.data?.source} confidence={rec.data?.confidence} />
      </div>

      {/* Notes */}
      <div className={cardBase(activeField === "notes")}>
        <label className={label("text-gray-400")}>Risk Notes</label>
        <textarea value={risk.notes} rows={3}
          onFocus={() => setActiveField("notes")} onBlur={() => setActiveField(null)}
          onChange={(e) => setRisk((p) => ({ ...p, notes: e.target.value }))}
          placeholder="Document known risks: delays, compliance gaps, vendor dependencies…"
          className={`${inputCls} mt-2 resize-none`}
        />
        <Tooltip visible={activeField === "notes"} loading={rec.loading}
          recommendation={rec.data?.recommendation || "Document: delays, compliance, vendors"} source={rec.data?.source} confidence={rec.data?.confidence} />
      </div>
    </div>
  );
}
