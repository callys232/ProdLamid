// components/LifecycleInput.tsx
import { useState, useEffect } from "react";
import Tooltip from "./tooltip";
import { fetchRecommendation } from "../../utils/api";

interface LifecycleItem {
    maintenanceCost: number;
    supportSLA: string;
    upgradeBudget: number;
}

export default function LifecycleInput() {
    const [lifecycle, setLifecycle] = useState<LifecycleItem>({
        maintenanceCost: 4000,
        supportSLA: "12 months",
        upgradeBudget: 6000,
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
                className={`relative p-4 rounded-lg shadow transition ${activeField === "maintenanceCost" ? "bg-red-50 border border-[#c12129]" : "bg-white"
                    }`}
            >
                <label className="block text-sm font-semibold mb-2">Maintenance Cost</label>
                <input
                    type="number"
                    value={lifecycle.maintenanceCost}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-40"
                    onFocus={() => setActiveField("maintenanceCost")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setLifecycle({ ...lifecycle, maintenanceCost: Number(e.target.value) })
                    }
                />
                <Tooltip
                    recommendation={tooltipData?.recommendation || "Maintenance averages $3k–5k annually"}
                    source={tooltipData?.source || "Based on 14 similar IT projects"}
                    confidence={tooltipData?.confidence || 0.8}
                    visible={activeField === "maintenanceCost"}
                />
            </div>

            <div
                className={`relative p-4 rounded-lg shadow transition ${activeField === "supportSLA" ? "bg-red-50 border border-[#c12129]" : "bg-white"
                    }`}
            >
                <label className="block text-sm font-semibold mb-2">Support SLA</label>
                <input
                    type="text"
                    value={lifecycle.supportSLA}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-40"
                    onFocus={() => setActiveField("supportSLA")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setLifecycle({ ...lifecycle, supportSLA: e.target.value })
                    }
                />
                <Tooltip
                    recommendation={tooltipData?.recommendation || "Typical SLA: 12–24 months"}
                    source={tooltipData?.source || "Based on 10 similar IT projects"}
                    confidence={tooltipData?.confidence || 0.76}
                    visible={activeField === "supportSLA"}
                />
            </div>

            <div
                className={`relative p-4 rounded-lg shadow transition ${activeField === "upgradeBudget" ? "bg-red-50 border border-[#c12129]" : "bg-white"
                    }`}
            >
                <label className="block text-sm font-semibold mb-2">Upgrade Budget</label>
                <input
                    type="number"
                    value={lifecycle.upgradeBudget}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-40"
                    onFocus={() => setActiveField("upgradeBudget")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setLifecycle({ ...lifecycle, upgradeBudget: Number(e.target.value) })
                    }
                />
                <Tooltip
                    recommendation={tooltipData?.recommendation || "Upgrades typically cost 8–12% of project budget"}
                    source={tooltipData?.source || "Based on 9 similar IT projects"}
                    confidence={tooltipData?.confidence || 0.74}
                    visible={activeField === "upgradeBudget"}
                />
            </div>
        </div>
    );
}
