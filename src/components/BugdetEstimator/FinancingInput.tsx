"use client";

import { useState } from "react";
import Tooltip from "./tooltip";
import { useFieldRecommendation } from "@/hooks/useField";

type Field = "interestRate" | "currencyExchangeImpact" | "insuranceCost";

const FIELDS: { key: Field; label: string; color: string; unit: "$" | "%"; hint: string; max: number }[] = [
  { key: "interestRate",           label: "Interest Rate",      color: "text-pink-400",   unit: "%", hint: "Typical financing rates: 4–6%",    max: 30 },
  { key: "currencyExchangeImpact", label: "FX / Exchange Impact",color: "text-rose-400",   unit: "$", hint: "Average FX impact: $1.5k–2.5k",    max: 20000 },
  { key: "insuranceCost",          label: "Insurance Cost",      color: "text-fuchsia-400",unit: "$", hint: "Project insurance avg: $1k–2k",    max: 20000 },
];

const cardBase = (active: boolean) =>
  `relative rounded-xl border p-4 transition ${active ? "border-pink-500/50 bg-pink-500/5" : "border-gray-800 bg-black/40 hover:border-gray-700"}`;

export default function FinancingInput() {
  const [financing, setFinancing] = useState({ interestRate: 5, currencyExchangeImpact: 2000, insuranceCost: 1500 });
  const [activeField, setActiveField] = useState<Field | null>(null);

  const interest  = useFieldRecommendation({ enabled: activeField === "interestRate",           industry: "finance", complexity: "medium", field: "interestRate",           keyword: String(financing.interestRate) });
  const exchange  = useFieldRecommendation({ enabled: activeField === "currencyExchangeImpact", industry: "finance", complexity: "medium", field: "currencyExchangeImpact", keyword: String(financing.currencyExchangeImpact) });
  const insurance = useFieldRecommendation({ enabled: activeField === "insuranceCost",          industry: "finance", complexity: "medium", field: "insuranceCost",          keyword: String(financing.insuranceCost) });

  const recMap = { interestRate: interest, currencyExchangeImpact: exchange, insuranceCost: insurance };

  const total = financing.currencyExchangeImpact + financing.insuranceCost;

  return (
    <div className="space-y-3">
      {FIELDS.map((f) => {
        const rec = recMap[f.key];
        const val = financing[f.key];
        return (
          <div key={f.key} className={cardBase(activeField === f.key)}>
            <div className="flex items-center justify-between mb-3">
              <label className={`text-xs font-semibold uppercase tracking-widest ${f.color}`}>{f.label}</label>
              <span className={`text-sm font-bold ${f.color}`}>
                {f.unit === "%" ? `${val}%` : `$${val.toLocaleString()}`}
              </span>
            </div>

            <input type="range" min={0} max={f.max} step={f.unit === "%" ? 0.5 : 100} value={val}
              onFocus={() => setActiveField(f.key)} onBlur={() => setActiveField(null)}
              onChange={(e) => setFinancing((p) => ({ ...p, [f.key]: Number(e.target.value) }))}
              className="w-full accent-pink-500"
            />

            <div className="mt-2 flex items-center justify-between">
              <p className="text-[10px] text-gray-600">{f.hint}</p>
              <input type="number" min={0} max={f.max} value={val}
                onFocus={() => setActiveField(f.key)} onBlur={() => setActiveField(null)}
                onChange={(e) => setFinancing((p) => ({ ...p, [f.key]: Number(e.target.value) }))}
                className="w-24 rounded-lg border border-gray-700 bg-black/60 px-2 py-1 text-right text-xs text-white focus:border-pink-500/50 focus:outline-none"
              />
            </div>

            <Tooltip visible={activeField === f.key} loading={rec.loading}
              recommendation={rec.data?.recommendation || f.hint}
              source={rec.data?.source} confidence={rec.data?.confidence || 0.75}
            />
          </div>
        );
      })}

      <div className="flex justify-end rounded-xl border border-gray-800 bg-black/40 px-4 py-3">
        <div className="text-right">
          <p className="text-[10px] text-gray-500">Total Financing Costs</p>
          <p className="text-base font-bold text-pink-400">${total.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
