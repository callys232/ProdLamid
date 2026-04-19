// components/SustainabilityInput.tsx
import { useState, useEffect } from "react";
import Tooltip from "./tooltip";
import { fetchRecommendation } from "../../utils/api";

interface SustainabilityItem {
    carbonOffsetCost: number;
    greenComplianceCost: number;
    renewableIntegrationBudget: number;
}

export default function SustainabilityInput() {
    const [sustainability, setSustainability] = useState<SustainabilityItem>({
        carbonOffsetCost: 2000,
        greenComplianceCost: 3500,
        renewableIntegrationBudget: 5000,
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
                className={`relative p-4 rounded-lg shadow transition ${activeField === "carbonOffsetCost" ? "bg-red-50 border border-[#c12129]" : "bg-white"
                    }`}
            >
                <label className="block text-sm font-semibold mb-2">Carbon Offset Cost</label>
                <input
                    type="number"
                    value={sustainability.carbonOffsetCost}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-40"
                    onFocus={() => setActiveField("carbonOffsetCost")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setSustainability({ ...sustainability, carbonOffsetCost: Number(e.target.value) })
                    }
                />
                <Tooltip
                    recommendation={tooltipData?.recommendation || "Carbon offsets average $1.5k–2.5k"}
                    source={tooltipData?.source || "Based on 10 similar projects"}
                    confidence={tooltipData?.confidence || 0.78}
                    visible={activeField === "carbonOffsetCost"}
                />
            </div>

            <div
                className={`relative p-4 rounded-lg shadow transition ${activeField === "greenComplianceCost" ? "bg-red-50 border border-[#c12129]" : "bg-white"
                    }`}
            >
                <label className="block text-sm font-semibold mb-2">Green Compliance Cost</label>
                <input
                    type="number"
                    value={sustainability.greenComplianceCost}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-40"
                    onFocus={() => setActiveField("greenComplianceCost")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setSustainability({ ...sustainability, greenComplianceCost: Number(e.target.value) })
                    }
                />
                <Tooltip
                    recommendation={tooltipData?.recommendation || "Compliance typically adds $3k–4k"}
                    source={tooltipData?.source || "Based on 12 similar projects"}
                    confidence={tooltipData?.confidence || 0.74}
                    visible={activeField === "greenComplianceCost"}
                />
            </div>

            <div
                className={`relative p-4 rounded-lg shadow transition ${activeField === "renewableIntegrationBudget" ? "bg-red-50 border border-[#c12129]" : "bg-white"
                    }`}
            >
                <label className="block text-sm font-semibold mb-2">Renewable Integration Budget</label>
                <input
                    type="number"
                    value={sustainability.renewableIntegrationBudget}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-40"
                    onFocus={() => setActiveField("renewableIntegrationBudget")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setSustainability({ ...sustainability, renewableIntegrationBudget: Number(e.target.value) })
                    }
                />
                <Tooltip
                    recommendation={tooltipData?.recommendation || "Renewable integration adds 10–15% of infra cost"}
                    source={tooltipData?.source || "Based on 8 similar projects"}
                    confidence={tooltipData?.confidence || 0.7}
                    visible={activeField === "renewableIntegrationBudget"}
                />
            </div>
        </div>
    );
}
