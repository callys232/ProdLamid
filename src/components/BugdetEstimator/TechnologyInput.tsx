// components/TechnologyInput.tsx
import { useState, useEffect } from "react";
import Tooltip from "./tooltip";
import { fetchRecommendation } from "../../utils/api";

interface TechnologyItem {
    tool: string;
    monthlyCost: number;
    durationMonths: number;
}

export default function TechnologyInput() {
    const [tools, setTools] = useState<TechnologyItem[]>([
        { tool: "AWS EC2", monthlyCost: 200, durationMonths: 12 },
    ]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [tooltipData, setTooltipData] = useState<any>(null);

    useEffect(() => {
        if (activeIndex !== null) {
            const tool = tools[activeIndex].tool || "cloud service";
            fetchRecommendation("it", "medium", "monthlyCost", tool).then((data) =>
                setTooltipData(data)
            );
        }
    }, [activeIndex]);

    return (
        <div className="space-y-4">
            {tools.map((t, i) => (
                <div
                    key={i}
                    className={`relative flex items-center space-x-4 p-4 rounded-lg shadow transition ${activeIndex === i ? "bg-red-50 border border-[#c12129]" : "bg-white"
                        }`}
                >
                    <input
                        type="text"
                        value={t.tool}
                        placeholder="Technology Tool"
                        className="border-b-2 border-gray-300 focus:border-[#c12129] transition flex-1"
                        onFocus={() => setActiveIndex(i)}
                        onBlur={() => setActiveIndex(null)}
                        onChange={(e) => {
                            const newTools = [...tools];
                            newTools[i].tool = e.target.value;
                            setTools(newTools);
                        }}
                    />

                    <input
                        type="number"
                        value={t.monthlyCost}
                        placeholder="Monthly Cost"
                        className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-32"
                        onFocus={() => setActiveIndex(i)}
                        onBlur={() => setActiveIndex(null)}
                        onChange={(e) => {
                            const newTools = [...tools];
                            newTools[i].monthlyCost = Number(e.target.value);
                            setTools(newTools);
                        }}
                    />

                    <input
                        type="number"
                        value={t.durationMonths}
                        placeholder="Duration (months)"
                        className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-32"
                        onFocus={() => setActiveIndex(i)}
                        onBlur={() => setActiveIndex(null)}
                        onChange={(e) => {
                            const newTools = [...tools];
                            newTools[i].durationMonths = Number(e.target.value);
                            setTools(newTools);
                        }}
                    />

                    {/* Tooltip appears when input is focused */}
                    <Tooltip
                        recommendation={tooltipData?.recommendation || "Typical SaaS cost: $150–250/month"}
                        source={tooltipData?.source || "Based on 15 similar IT projects"}
                        confidence={tooltipData?.confidence || 0.8}
                        visible={activeIndex === i}
                    />
                </div>
            ))}

            <button
                onClick={() =>
                    setTools([...tools, { tool: "", monthlyCost: 0, durationMonths: 0 }])
                }
                className="bg-[#c12129] text-white px-4 py-2 rounded hover:bg-black hover:text-[#c12129] transition"
            >
                + Add Technology
            </button>
        </div>
    );
}
