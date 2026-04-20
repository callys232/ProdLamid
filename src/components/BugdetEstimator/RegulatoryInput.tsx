import { useState } from "react";
import Tooltip from "./tooltip";
import { useFieldRecommendation } from "@/hooks/useField";

interface RegulatoryItem {
    permitsCost: number;
    complianceCost: number;
    legalFees: number;
}

export default function RegulatoryInput() {
    const [regulatory, setRegulatory] = useState<RegulatoryItem>({
        permitsCost: 5000,
        complianceCost: 3000,
        legalFees: 2000,
    });

    const [activeField, setActiveField] = useState<keyof RegulatoryItem | null>(null);

    const updateField = (field: keyof RegulatoryItem, value: number) => {
        setRegulatory((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const recommendation = useFieldRecommendation(
        {
            enabled: activeField !== null,
            industry: "construction",
            complexity: "medium",
            field: activeField || "",
            keyword: activeField ? String(regulatory[activeField]) : "",
        }
    );

    return (
        <div className="space-y-4">

            {/* ================= PERMITS ================= */}
            <div className={`relative p-4 rounded-lg shadow bg-white`}>
                <label className="block text-sm font-semibold mb-2">
                    Permits Cost
                </label>

                <input
                    type="number"
                    value={regulatory.permitsCost}
                    onFocus={() => setActiveField("permitsCost")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        updateField("permitsCost", Number(e.target.value))
                    }
                    className="border-b-2 w-40"
                />

                <Tooltip
                    visible={activeField === "permitsCost"}
                    recommendation={
                        recommendation.data?.recommendation ||
                        "Typical permits cost: $4k–6k"
                    }
                    source={recommendation.data?.source}
                    confidence={recommendation.data?.confidence || 0.78}
                    loading={recommendation.loading}
                />
            </div>

            {/* ================= COMPLIANCE ================= */}
            <div className="relative p-4 rounded-lg shadow bg-white">
                <label className="block text-sm font-semibold mb-2">
                    Compliance Cost
                </label>

                <input
                    type="number"
                    value={regulatory.complianceCost}
                    onFocus={() => setActiveField("complianceCost")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        updateField("complianceCost", Number(e.target.value))
                    }
                    className="border-b-2 w-40"
                />

                <Tooltip
                    visible={activeField === "complianceCost"}
                    recommendation={
                        recommendation.data?.recommendation ||
                        "Adds ~5–10% of project cost"
                    }
                    source={recommendation.data?.source}
                    confidence={recommendation.data?.confidence || 0.75}
                    loading={recommendation.loading}
                />
            </div>

            {/* ================= LEGAL ================= */}
            <div className="relative p-4 rounded-lg shadow bg-white">
                <label className="block text-sm font-semibold mb-2">
                    Legal Fees
                </label>

                <input
                    type="number"
                    value={regulatory.legalFees}
                    onFocus={() => setActiveField("legalFees")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        updateField("legalFees", Number(e.target.value))
                    }
                    className="border-b-2 w-40"
                />

                <Tooltip
                    visible={activeField === "legalFees"}
                    recommendation={
                        recommendation.data?.recommendation ||
                        "Average $1.5k–3k"
                    }
                    source={recommendation.data?.source}
                    confidence={recommendation.data?.confidence || 0.72}
                    loading={recommendation.loading}
                />
            </div>
        </div>
    );
}