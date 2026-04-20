import { useState } from "react";
import Tooltip from "./tooltip";
import { useFieldRecommendation } from "@/hooks/useField";

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

    const [activeField, setActiveField] = useState<keyof QAItem | null>(null);

    const update = (field: keyof QAItem, value: number) => {
        setQA((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const recommendation = useFieldRecommendation(
        {
            enabled: activeField !== null,
            industry: "it",
            complexity: "medium",
            field: activeField || "",
            keyword: activeField ? String(qa[activeField]) : "",
        }
    );

    return (
        <div className="space-y-4">

            {/* ================= TESTING HOURS ================= */}
            <div className="relative p-4 rounded-lg shadow bg-white">
                <label className="block text-sm font-semibold mb-2">
                    Testing Hours
                </label>

                <input
                    type="number"
                    value={qa.testingHours}
                    onFocus={() => setActiveField("testingHours")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => update("testingHours", Number(e.target.value))}
                    className="border-b-2 w-40"
                />

                <Tooltip
                    visible={activeField === "testingHours"}
                    recommendation={
                        recommendation.data?.recommendation ||
                        "Typical QA effort: 100–150 hours"
                    }
                    source={recommendation.data?.source || "Based on similar IT projects"}
                    confidence={recommendation.data?.confidence || 0.82}
                    loading={recommendation.loading}
                />
            </div>

            {/* ================= AUDIT COST ================= */}
            <div className="relative p-4 rounded-lg shadow bg-white">
                <label className="block text-sm font-semibold mb-2">
                    Audit Cost
                </label>

                <input
                    type="number"
                    value={qa.auditCost}
                    onFocus={() => setActiveField("auditCost")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => update("auditCost", Number(e.target.value))}
                    className="border-b-2 w-40"
                />

                <Tooltip
                    visible={activeField === "auditCost"}
                    recommendation={
                        recommendation.data?.recommendation ||
                        "Audits typically cost $4k–6k"
                    }
                    source={recommendation.data?.source}
                    confidence={recommendation.data?.confidence || 0.76}
                    loading={recommendation.loading}
                />
            </div>

            {/* ================= BUG FIX BUDGET ================= */}
            <div className="relative p-4 rounded-lg shadow bg-white">
                <label className="block text-sm font-semibold mb-2">
                    Bug Fix Budget
                </label>

                <input
                    type="number"
                    value={qa.bugFixBudget}
                    onFocus={() => setActiveField("bugFixBudget")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => update("bugFixBudget", Number(e.target.value))}
                    className="border-b-2 w-40"
                />

                <Tooltip
                    visible={activeField === "bugFixBudget"}
                    recommendation={
                        recommendation.data?.recommendation ||
                        "Bug fixes usually add 10–15% of dev cost"
                    }
                    source={recommendation.data?.source}
                    confidence={recommendation.data?.confidence || 0.74}
                    loading={recommendation.loading}
                />
            </div>
        </div>
    );
}