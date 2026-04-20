import { useState } from "react";
import Tooltip from "./tooltip";
import { fetchRecommendation } from "../../utils/api";

interface TimelineItem {
    durationWeeks: number;
    milestones: string;
    urgencyLevel: "low" | "medium" | "high" | "";
}

interface TooltipData {
    recommendation: string;
    source: string;
    confidence: number;
}

type FieldKey = "durationWeeks" | "milestones" | "urgencyLevel";

export default function TimelineInput() {
    const [timeline, setTimeline] = useState<TimelineItem>({
        durationWeeks: 12,
        milestones: "Design, Development, Testing",
        urgencyLevel: "medium",
    });

    const [activeField, setActiveField] = useState<FieldKey | null>(null);

    const [tooltips, setTooltips] = useState<
        Partial<Record<FieldKey, TooltipData>>
    >({});

    const [loading, setLoading] = useState<
        Partial<Record<FieldKey, boolean>>
    >({});

    const getRecommendation = async (field: FieldKey) => {
        if (tooltips[field]) return;

        setLoading((p) => ({ ...p, [field]: true }));

        const value = String(timeline[field] ?? "");

        const data = await fetchRecommendation(
            "it",
            "medium",
            field,
            value
        );

        setTooltips((p) => ({ ...p, [field]: data }));
        setLoading((p) => ({ ...p, [field]: false }));
    };

    const baseClass = (field: FieldKey) =>
        `relative p-4 rounded-lg shadow transition ${activeField === field
            ? "bg-red-50 border border-[#c12129]"
            : "bg-white"
        }`;

    return (
        <div className="space-y-4">

            {/* ================= DURATION ================= */}
            <div className={baseClass("durationWeeks")}>
                <label className="block text-sm font-semibold mb-2">
                    Duration (weeks)
                </label>

                <input
                    type="number"
                    value={timeline.durationWeeks}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] w-32"
                    onFocus={() => {
                        setActiveField("durationWeeks");
                        getRecommendation("durationWeeks");
                    }}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setTimeline({
                            ...timeline,
                            durationWeeks: Number(e.target.value),
                        })
                    }
                />

                <Tooltip
                    visible={activeField === "durationWeeks"}
                    recommendation={
                        loading.durationWeeks
                            ? "Analyzing timeline patterns..."
                            : tooltips.durationWeeks?.recommendation ||
                            "Typical project duration: 10–16 weeks"
                    }
                    source={tooltips.durationWeeks?.source || ""}
                    confidence={tooltips.durationWeeks?.confidence || 0.8}
                />
            </div>

            {/* ================= MILESTONES ================= */}
            <div className={baseClass("milestones")}>
                <label className="block text-sm font-semibold mb-2">
                    Milestones
                </label>

                <input
                    type="text"
                    value={timeline.milestones}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] w-full"
                    onFocus={() => {
                        setActiveField("milestones");
                        getRecommendation("milestones");
                    }}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setTimeline({
                            ...timeline,
                            milestones: e.target.value,
                        })
                    }
                />

                <Tooltip
                    visible={activeField === "milestones"}
                    recommendation={
                        loading.milestones
                            ? "Mapping milestone structures..."
                            : tooltips.milestones?.recommendation ||
                            "Design → Dev → QA → Launch"
                    }
                    source={tooltips.milestones?.source || ""}
                    confidence={tooltips.milestones?.confidence || 0.75}
                />
            </div>

            {/* ================= URGENCY ================= */}
            <div className={baseClass("urgencyLevel")}>
                <label className="block text-sm font-semibold mb-2">
                    Urgency Level
                </label>

                <select
                    value={timeline.urgencyLevel}
                    className="border-b-2 border-gray-300 focus:border-[#c12129] w-40"
                    onFocus={() => {
                        setActiveField("urgencyLevel");
                        getRecommendation("urgencyLevel");
                    }}
                    onBlur={() => setActiveField(null)}
                    onChange={(e) =>
                        setTimeline({
                            ...timeline,
                            urgencyLevel:
                                e.target.value as TimelineItem["urgencyLevel"],
                        })
                    }
                >
                    <option value="">Select urgency</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>

                <Tooltip
                    visible={activeField === "urgencyLevel"}
                    recommendation={
                        loading.urgencyLevel
                            ? "Evaluating schedule pressure..."
                            : tooltips.urgencyLevel?.recommendation ||
                            "High urgency adds 20–30% cost impact"
                    }
                    source={tooltips.urgencyLevel?.source || ""}
                    confidence={tooltips.urgencyLevel?.confidence || 0.7}
                />
            </div>
        </div>
    );
}