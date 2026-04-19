// components/RegulatoryInput.tsx
import { useState, useEffect } from "react";
import Tooltip from "./tooltip";
import { fetchRecommendation } from "../../utils/api";

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
    const [activeField, setActiveField] = useState<string | null>(null);
    const [tooltipData, setTooltipData] = useState<any>(null);

    useEffect(() => {
        if (activeField) {
            fetchRecommendation("construction", "medium", activeField).then((data) =>
                setTooltipData(data)
            );
        }
    }, [activeField]);

    return (
        <div className="space-y-4">
            <div
                className={`relative p-4 rounded-lg shadow transition ${activeField === "permitsCost" ? "bg-red-50 border border-[#c12129]" : "bg-white"
                    }`}
            >
                <label className="block text-sm font-semibold mb-2">Permits Cost</label>
                <input
                    type="number"
                    value={regulatory.permitsCost}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-40"
                    onFocus={() => setActiveField("permitsCost")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setRegulatory({ ...regulatory, permitsCost: Number(e.target.value) })
                    }
                />
                <Tooltip
                    recommendation={tooltipData?.recommendation || "Typical permits cost: $4k–6k"}
                    source={tooltipData?.source || "Based on 10 similar construction projects"}
                    confidence={tooltipData?.confidence || 0.78}
                    visible={activeField === "permitsCost"}
                />
            </div>

            <div
                className={`relative p-4 rounded-lg shadow transition ${activeField === "complianceCost" ? "bg-red-50 border border-[#c12129]" : "bg-white"
                    }`}
            >
                <label className="block text-sm font-semibold mb-2">Compliance Cost</label>
                <input
                    type="number"
                    value={regulatory.complianceCost}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-40"
                    onFocus={() => setActiveField("complianceCost")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setRegulatory({ ...regulatory, complianceCost: Number(e.target.value) })
                    }
                />
                <Tooltip
                    recommendation={tooltipData?.recommendation || "Compliance typically adds 5–10% of project cost"}
                    source={tooltipData?.source || "Based on 12 similar projects"}
                    confidence={tooltipData?.confidence || 0.75}
                    visible={activeField === "complianceCost"}
                />
            </div>

            <div
                className={`relative p-4 rounded-lg shadow transition ${activeField === "legalFees" ? "bg-red-50 border border-[#c12129]" : "bg-white"
                    }`}
            >
                <label className="block text-sm font-semibold mb-2">Legal Fees</label>
                <input
                    type="number"
                    value={regulatory.legalFees}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-40"
                    onFocus={() => setActiveField("legalFees")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setRegulatory({ ...regulatory, legalFees: Number(e.target.value) })
                    }
                />
                <Tooltip
                    recommendation={tooltipData?.recommendation || "Legal fees average $1.5k–3k"}
                    source={tooltipData?.source || "Based on 8 similar projects"}
                    confidence={tooltipData?.confidence || 0.72}
                    visible={activeField === "legalFees"}
                />
            </div>
        </div>
    );
}
