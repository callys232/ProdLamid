import { useEffect, useRef, useState } from "react";
import Tooltip from "./tooltip";
import { fetchRecommendation } from "../../utils/api";

interface TechnologyItem {
    tool: string;
    monthlyCost: number;
    durationMonths: number;
}

interface TooltipData {
    recommendation: string;
    source: string;
    confidence: number;
}

export default function TechnologyInput() {
    const [tools, setTools] = useState<TechnologyItem[]>([
        { tool: "AWS EC2", monthlyCost: 200, durationMonths: 12 },
    ]);

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const [tooltips, setTooltips] = useState<Record<number, TooltipData>>({});
    const [loading, setLoading] = useState<Record<number, boolean>>({});

    // ✅ FIX: detect outside clicks
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setActiveIndex(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getRecommendation = async (index: number, tool: string) => {
        if (tooltips[index]) return;

        setLoading((p) => ({ ...p, [index]: true }));

        const data = await fetchRecommendation(
            "it",
            "medium",
            "monthlyCost",
            tool || "cloud service"
        );

        setTooltips((p) => ({ ...p, [index]: data }));
        setLoading((p) => ({ ...p, [index]: false }));
    };

    const activate = (i: number, tool: string) => {
        setActiveIndex(i);
        getRecommendation(i, tool);
    };

    const updateField = (
        index: number,
        field: keyof TechnologyItem,
        value: any
    ) => {
        const copy = [...tools];
        copy[index] = { ...copy[index], [field]: value };
        setTools(copy);

        // invalidate cache if tool changes
        if (field === "tool") {
            setTooltips((prev) => {
                const updated = { ...prev };
                delete updated[index];
                return updated;
            });
        }
    };

    return (
        <div ref={containerRef} className="space-y-4">

            {tools.map((t, i) => (
                <div
                    key={i}
                    className={`relative flex items-center space-x-4 p-4 rounded-lg shadow transition ${activeIndex === i
                        ? "bg-red-50 border border-[#c12129]"
                        : "bg-white"
                        }`}
                >

                    {/* TOOL */}
                    <input
                        type="text"
                        value={t.tool}
                        placeholder="Technology Tool"
                        className="border-b-2 border-gray-300 focus:border-[#c12129] flex-1"
                        onFocus={() => activate(i, t.tool)}
                        onChange={(e) =>
                            updateField(i, "tool", e.target.value)
                        }
                    />

                    {/* COST */}
                    <input
                        type="number"
                        value={t.monthlyCost}
                        placeholder="Monthly Cost"
                        className="border-b-2 border-gray-300 focus:border-[#c12129] w-32"
                        onFocus={() => setActiveIndex(i)}
                        onChange={(e) =>
                            updateField(i, "monthlyCost", Number(e.target.value))
                        }
                    />

                    {/* DURATION */}
                    <input
                        type="number"
                        value={t.durationMonths}
                        placeholder="Duration"
                        className="border-b-2 border-gray-300 focus:border-[#c12129] w-32"
                        onFocus={() => setActiveIndex(i)}
                        onChange={(e) =>
                            updateField(
                                i,
                                "durationMonths",
                                Number(e.target.value)
                            )
                        }
                    />

                    {/* TOOLTIP */}
                    <Tooltip
                        visible={activeIndex === i}
                        recommendation={
                            loading[i]
                                ? "Analyzing cloud cost patterns..."
                                : tooltips[i]?.recommendation ||
                                "Typical SaaS cost: $150–250/month"
                        }
                        source={tooltips[i]?.source || ""}
                        confidence={tooltips[i]?.confidence || 0.8}
                    />
                </div>
            ))}

            <button
                onClick={() =>
                    setTools([
                        ...tools,
                        { tool: "", monthlyCost: 0, durationMonths: 0 },
                    ])
                }
                className="bg-[#c12129] text-white px-4 py-2 rounded hover:bg-black hover:text-[#c12129] transition"
            >
                + Add Technology
            </button>
        </div>
    );
}