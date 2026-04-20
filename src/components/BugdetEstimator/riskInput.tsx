import { useEffect, useRef, useState } from "react";
import Tooltip from "./tooltip";
import { fetchRecommendation } from "../../utils/api";

interface RiskItem {
    riskLevel: "low" | "medium" | "high" | "";
    contingencyPercent: number;
    notes: string;
}

interface TooltipData {
    recommendation: string;
    source: string;
    confidence: number;
}

type FieldKey = "riskLevel" | "contingencyPercent" | "notes";

export default function RiskInput() {
    const [risk, setRisk] = useState<RiskItem>({
        riskLevel: "medium",
        contingencyPercent: 15,
        notes: "",
    });

    const [activeField, setActiveField] = useState<FieldKey | null>(null);

    const [tooltips, setTooltips] = useState<
        Partial<Record<FieldKey, TooltipData>>
    >({});

    const [loading, setLoading] = useState<
        Partial<Record<FieldKey, boolean>>
    >({});

    const containerRef = useRef<HTMLDivElement>(null);

    const getRecommendation = async (field: FieldKey) => {
        if (tooltips[field]) return;

        setLoading((p) => ({ ...p, [field]: true }));

        const value = String(risk[field] ?? "");

        const data = await fetchRecommendation(
            "it",
            "medium",
            field,
            value
        );

        setTooltips((p) => ({ ...p, [field]: data }));
        setLoading((p) => ({ ...p, [field]: false }));
    };

    /* ================= OUTSIDE CLICK CLOSE ================= */
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!containerRef.current?.contains(e.target as Node)) {
                setActiveField(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const baseClass = (field: FieldKey) =>
        `relative p-4 rounded-lg shadow transition ${activeField === field
            ? "bg-red-50 border border-[#c12129]"
            : "bg-white"
        }`;

    return (
        <div className="space-y-4" ref={containerRef}>

            {/* ================= RISK LEVEL ================= */}
            <div className={baseClass("riskLevel")}>
                <label className="block text-sm font-semibold mb-2">
                    Risk Level
                </label>

                <select
                    value={risk.riskLevel}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] w-40"
                    onFocus={() => {
                        setActiveField("riskLevel");
                        getRecommendation("riskLevel");
                    }}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setRisk({
                            ...risk,
                            riskLevel: e.target.value as RiskItem["riskLevel"],
                        })
                    }
                >
                    <option value="">Select risk</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>

                <Tooltip
                    visible={activeField === "riskLevel"}
                    recommendation={
                        loading.riskLevel
                            ? "Analyzing risk patterns..."
                            : tooltips.riskLevel?.recommendation ||
                            "Most projects set risk at medium"
                    }
                    source={tooltips.riskLevel?.source || ""}
                    confidence={tooltips.riskLevel?.confidence || 0.8}
                />
            </div>

            {/* ================= CONTINGENCY ================= */}
            <div className={baseClass("contingencyPercent")}>
                <label className="block text-sm font-semibold mb-2">
                    Contingency (%)
                </label>

                <input
                    type="number"
                    value={risk.contingencyPercent}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] w-32"
                    onFocus={() => {
                        setActiveField("contingencyPercent");
                        getRecommendation("contingencyPercent");
                    }}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setRisk({
                            ...risk,
                            contingencyPercent: Number(e.target.value),
                        })
                    }
                />

                <Tooltip
                    visible={activeField === "contingencyPercent"}
                    recommendation={
                        loading.contingencyPercent
                            ? "Calculating buffer requirements..."
                            : tooltips.contingencyPercent?.recommendation ||
                            "Typical contingency: 10–20%"
                    }
                    source={tooltips.contingencyPercent?.source || ""}
                    confidence={tooltips.contingencyPercent?.confidence || 0.75}
                />
            </div>

            {/* ================= NOTES ================= */}
            <div className={baseClass("notes")}>
                <label className="block text-sm font-semibold mb-2">
                    Risk Notes
                </label>

                <textarea
                    value={risk.notes}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] w-full"
                    onFocus={() => {
                        setActiveField("notes");
                        getRecommendation("notes");
                    }}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setRisk({ ...risk, notes: e.target.value })
                    }
                />

                <Tooltip
                    visible={activeField === "notes"}
                    recommendation={
                        loading.notes
                            ? "Scanning risk documentation..."
                            : tooltips.notes?.recommendation ||
                            "Document risks: delays, compliance, vendors"
                    }
                    source={tooltips.notes?.source || ""}
                    confidence={tooltips.notes?.confidence || 0.7}
                />
            </div>
        </div>
    );
}