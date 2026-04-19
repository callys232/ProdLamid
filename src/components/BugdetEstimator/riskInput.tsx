// components/RiskInput.tsx
import { useState, useEffect } from "react";
import Tooltip from "./tooltip";
import { fetchRecommendation } from "../../utils/api";

interface RiskItem {
    riskLevel: "low" | "medium" | "high" | "";
    contingencyPercent: number;
    notes: string;
}

export default function RiskInput() {
    const [risk, setRisk] = useState<RiskItem>({
        riskLevel: "medium",
        contingencyPercent: 15,
        notes: "",
    });
    const [activeField, setActiveField] = useState<string | null>(null);
    const [tooltipData, setTooltipData] = useState<any>(null);

    useEffect(() => {
        if (activeField) {
            fetchRecommendation("it", "medium", activeField).then((data) =>
                setTooltipData(data)
            );
        }
    }, [activeField]);

    return (
        <div className="space-y-4">
            <div
                className={`relative p-4 rounded-lg shadow transition ${activeField === "riskLevel" ? "bg-red-50 border border-[#c12129]" : "bg-white"
                    }`}
            >
                <label className="block text-sm font-semibold mb-2">Risk Level</label>
                <select
                    value={risk.riskLevel}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-40"
                    onFocus={() => setActiveField("riskLevel")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setRisk({ ...risk, riskLevel: e.target.value as RiskItem["riskLevel"] })
                    }
                >
                    <option value="">Select risk</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <Tooltip
                    recommendation={tooltipData?.recommendation || "Most projects set risk at medium"}
                    source={tooltipData?.source || "Based on 18 similar IT projects"}
                    confidence={tooltipData?.confidence || 0.8}
                    visible={activeField === "riskLevel"}
                />
            </div>

            <div
                className={`relative p-4 rounded-lg shadow transition ${activeField === "contingencyPercent" ? "bg-red-50 border border-[#c12129]" : "bg-white"
                    }`}
            >
                <label className="block text-sm font-semibold mb-2">Contingency (%)</label>
                <input
                    type="number"
                    value={risk.contingencyPercent}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-32"
                    onFocus={() => setActiveField("contingencyPercent")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setRisk({ ...risk, contingencyPercent: Number(e.target.value) })
                    }
                />
                <Tooltip
                    recommendation={tooltipData?.recommendation || "Typical contingency: 10–20% of budget"}
                    source={tooltipData?.source || "Based on 12 similar IT projects"}
                    confidence={tooltipData?.confidence || 0.75}
                    visible={activeField === "contingencyPercent"}
                />
            </div>

            <div
                className={`relative p-4 rounded-lg shadow transition ${activeField === "notes" ? "bg-red-50 border border-[#c12129]" : "bg-white"
                    }`}
            >
                <label className="block text-sm font-semibold mb-2">Risk Notes</label>
                <textarea
                    value={risk.notes}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-full"
                    onFocus={() => setActiveField("notes")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => setRisk({ ...risk, notes: e.target.value })}
                />
                <Tooltip
                    recommendation={tooltipData?.recommendation || "Document key risks: vendor delays, compliance issues"}
                    source={tooltipData?.source || "Based on 10 similar IT projects"}
                    confidence={tooltipData?.confidence || 0.7}
                    visible={activeField === "notes"}
                />
            </div>
        </div>
    );
}
