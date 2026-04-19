// components/TimelineInput.tsx
import { useState, useEffect } from "react";
import Tooltip from "./tooltip";
import { fetchRecommendation } from "../../utils/api";

interface TimelineItem {
    durationWeeks: number;
    milestones: string;
    urgencyLevel: "low" | "medium" | "high" | "";
}

export default function TimelineInput() {
    const [timeline, setTimeline] = useState<TimelineItem>({
        durationWeeks: 12,
        milestones: "Design, Development, Testing",
        urgencyLevel: "medium",
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
                className={`relative p-4 rounded-lg shadow transition ${activeField === "durationWeeks" ? "bg-red-50 border border-[#c12129]" : "bg-white"
                    }`}
            >
                <label className="block text-sm font-semibold mb-2">Duration (weeks)</label>
                <input
                    type="number"
                    value={timeline.durationWeeks}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-32"
                    onFocus={() => setActiveField("durationWeeks")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setTimeline({ ...timeline, durationWeeks: Number(e.target.value) })
                    }
                />
                <Tooltip
                    recommendation={tooltipData?.recommendation || "Typical project duration: 10–16 weeks"}
                    source={tooltipData?.source || "Based on 20 similar IT projects"}
                    confidence={tooltipData?.confidence || 0.8}
                    visible={activeField === "durationWeeks"}
                />
            </div>

            <div
                className={`relative p-4 rounded-lg shadow transition ${activeField === "milestones" ? "bg-red-50 border border-[#c12129]" : "bg-white"
                    }`}
            >
                <label className="block text-sm font-semibold mb-2">Milestones</label>
                <input
                    type="text"
                    value={timeline.milestones}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-full"
                    onFocus={() => setActiveField("milestones")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) => setTimeline({ ...timeline, milestones: e.target.value })}
                />
                <Tooltip
                    recommendation={tooltipData?.recommendation || "Typical milestones: Design → Dev → QA → Launch"}
                    source={tooltipData?.source || "Based on 15 similar IT projects"}
                    confidence={tooltipData?.confidence || 0.75}
                    visible={activeField === "milestones"}
                />
            </div>

            <div
                className={`relative p-4 rounded-lg shadow transition ${activeField === "urgencyLevel" ? "bg-red-50 border border-[#c12129]" : "bg-white"
                    }`}
            >
                <label className="block text-sm font-semibold mb-2">Urgency Level</label>
                <select
                    value={timeline.urgencyLevel}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] transition w-40"
                    onFocus={() => setActiveField("urgencyLevel")}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setTimeline({ ...timeline, urgencyLevel: e.target.value as TimelineItem["urgencyLevel"] })
                    }
                >
                    <option value="">Select urgency</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <Tooltip
                    recommendation={tooltipData?.recommendation || "Urgency impacts cost: High urgency adds 20–30%"}
                    source={tooltipData?.source || "Based on 12 similar IT projects"}
                    confidence={tooltipData?.confidence || 0.7}
                    visible={activeField === "urgencyLevel"}
                />
            </div>
        </div>
    );
}
