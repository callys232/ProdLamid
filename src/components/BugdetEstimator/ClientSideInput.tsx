// components/ClientSideInput.tsx
import { useState, useEffect } from "react";
import Tooltip from "./tooltip";
import { fetchRecommendation } from "../../utils/api";

interface ClientSideItem {
    trainingHours: number;
    workshopCost: number;
    adoptionBudget: number;
}

export default function ClientSideInput() {
    const [clientSide, setClientSide] = useState<ClientSideItem>({
        trainingHours: 40,
        workshopCost: 3000,
        adoptionBudget: 5000,
    });
    const [activeField, setActiveField] = useState<string | null>(null);
    const [tooltipData, setTooltipData] = useState<any>(null);

    useEffect(() => {
        if (activeField) {
            fetchRecommendation("consulting", "medium", activeField).then((data) =>
                setTooltipData(data)
            );
        }
    }, [activeField]);

    return (
        <div className="space-y-4">
            <div
                className={`relative p-4 rounded-lg shadow transition ${activeField === "trainingHours" ? "bg-red-50 border border-[#c12129]" : "bg-white"
                    }`}
            >
                <label className="block text-sm font-semibold mb-2">Training Hours</label>
                <input
                    type="number"
                    value={clientSide.trainingHours}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-40"
                    onFocus={() => setActiveField("trainingHours")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setClientSide({ ...clientSide, trainingHours: Number(e.target.value) })
                    }
                />
                <Tooltip
                    recommendation={tooltipData?.recommendation || "Typical training: 30–50 hours"}
                    source={tooltipData?.source || "Based on 12 similar consulting projects"}
                    confidence={tooltipData?.confidence || 0.8}
                    visible={activeField === "trainingHours"}
                />
            </div>

            <div
                className={`relative p-4 rounded-lg shadow transition ${activeField === "workshopCost" ? "bg-red-50 border border-[#c12129]" : "bg-white"
                    }`}
            >
                <label className="block text-sm font-semibold mb-2">Workshop Cost</label>
                <input
                    type="number"
                    value={clientSide.workshopCost}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-40"
                    onFocus={() => setActiveField("workshopCost")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setClientSide({ ...clientSide, workshopCost: Number(e.target.value) })
                    }
                />
                <Tooltip
                    recommendation={tooltipData?.recommendation || "Workshops typically cost $2k–4k"}
                    source={tooltipData?.source || "Based on 10 similar projects"}
                    confidence={tooltipData?.confidence || 0.75}
                    visible={activeField === "workshopCost"}
                />
            </div>

            <div
                className={`relative p-4 rounded-lg shadow transition ${activeField === "adoptionBudget" ? "bg-red-50 border border-[#c12129]" : "bg-white"
                    }`}
            >
                <label className="block text-sm font-semibold mb-2">Adoption Budget</label>
                <input
                    type="number"
                    value={clientSide.adoptionBudget}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-40"
                    onFocus={() => setActiveField("adoptionBudget")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setClientSide({ ...clientSide, adoptionBudget: Number(e.target.value) })
                    }
                />
                <Tooltip
                    recommendation={tooltipData?.recommendation || "Adoption budgets average $4k–6k"}
                    source={tooltipData?.source || "Based on 8 similar projects"}
                    confidence={tooltipData?.confidence || 0.72}
                    visible={activeField === "adoptionBudget"}
                />
            </div>
        </div>
    );
}
