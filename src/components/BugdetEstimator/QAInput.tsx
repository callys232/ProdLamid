// components/QAInput.tsx
import { useState, useEffect } from "react";
import Tooltip from "./tooltip";
import { fetchRecommendation } from "../../utils/api";

interface QAItem {
    testingHours: number;
    auditCost: number;
    bugFixBudget: number;
}

export default function QAInput() {
    const [qa, setQA] = useState<QAItem>({
        testingHours: 120,
        auditCost: 5000,
        bugFixBudget: 8000,
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
                className={`relative p-4 rounded-lg shadow transition ${activeField === "testingHours" ? "bg-red-50 border border-[#c12129]" : "bg-white"
                    }`}
            >
                <label className="block text-sm font-semibold mb-2">Testing Hours</label>
                <input
                    type="number"
                    value={qa.testingHours}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-40"
                    onFocus={() => setActiveField("testingHours")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setQA({ ...qa, testingHours: Number(e.target.value) })
                    }
                />
                <Tooltip
                    recommendation={tooltipData?.recommendation || "Typical QA effort: 100–150 hours"}
                    source={tooltipData?.source || "Based on 14 similar IT projects"}
                    confidence={tooltipData?.confidence || 0.82}
                    visible={activeField === "testingHours"}
                />
            </div>

            <div
                className={`relative p-4 rounded-lg shadow transition ${activeField === "auditCost" ? "bg-red-50 border border-[#c12129]" : "bg-white"
                    }`}
            >
                <label className="block text-sm font-semibold mb-2">Audit Cost</label>
                <input
                    type="number"
                    value={qa.auditCost}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-40"
                    onFocus={() => setActiveField("auditCost")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setQA({ ...qa, auditCost: Number(e.target.value) })
                    }
                />
                <Tooltip
                    recommendation={tooltipData?.recommendation || "Audits typically cost $4k–6k"}
                    source={tooltipData?.source || "Based on 10 similar projects"}
                    confidence={tooltipData?.confidence || 0.76}
                    visible={activeField === "auditCost"}
                />
            </div>

            <div
                className={`relative p-4 rounded-lg shadow transition ${activeField === "bugFixBudget" ? "bg-red-50 border border-[#c12129]" : "bg-white"
                    }`}
            >
                <label className="block text-sm font-semibold mb-2">Bug Fix Budget</label>
                <input
                    type="number"
                    value={qa.bugFixBudget}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-40"
                    onFocus={() => setActiveField("bugFixBudget")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setQA({ ...qa, bugFixBudget: Number(e.target.value) })
                    }
                />
                <Tooltip
                    recommendation={tooltipData?.recommendation || "Bug fixes usually add 10–15% of dev cost"}
                    source={tooltipData?.source || "Based on 12 similar IT projects"}
                    confidence={tooltipData?.confidence || 0.74}
                    visible={activeField === "bugFixBudget"}
                />
            </div>
        </div>
    );
}
