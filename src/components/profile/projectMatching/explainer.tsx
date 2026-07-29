"use client";

import { useMemo } from "react";
import { Score } from "@/types/aiMatch";

interface Props {
    score: Score;
}

export default function ExplainabilityPanel({ score }: Props) {

    /* ---------------- SAFETY NORMALIZATION ---------------- */
    const reasons = score?.reasons ?? [];
    const matchedSkills = score?.matchedSkills ?? [];
    const missingSkills = score?.missingSkills ?? [];

    /* ---------------- PRIORITIZED INSIGHT ---------------- */
    const primaryInsight = useMemo(() => {
        if (score.skillMatch > 0.8) return "Strong skill alignment";
        if (score.semantic > 0.8) return "Highly relevant experience";
        if (score.experience > 0.8) return "Senior-level experience";
        return "Moderate alignment overall";
    }, [score]);

    /* ---------------- RENDER ---------------- */
    return (
        <div
            className="
            mt-4 rounded-xl p-4
            bg-gradient-to-br from-gray-50 to-white
            border border-gray-200
            shadow-sm
            hover:shadow-md hover:-translate-y-[2px]
            transition-all duration-200
        "
        >

            {/* HEADER */}
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-[#2563EB]">
                    AI Insight
                </h4>

                <span className="text-[10px] text-gray-600">
                    Explainable Match
                </span>
            </div>

            {/* PRIMARY INSIGHT */}
            <div className="mb-3 p-2 rounded-md bg-blue-50 border border-blue-100">
                <p className="text-xs font-medium text-[#2563EB]">
                    {primaryInsight}
                </p>
            </div>

            {/* REASONS */}
            {reasons.length > 0 && (
                <ul className="text-xs text-gray-700 space-y-2">
                    {reasons.slice(0, 4).map((r, i) => (
                        <li
                            key={i}
                            className="flex items-start gap-2 hover:text-black transition"
                        >
                            <span className="text-[#2563EB] mt-[2px]">•</span>
                            <span>{r}</span>
                        </li>
                    ))}
                </ul>
            )}

            {/* EMPTY STATE */}
            {reasons.length === 0 && (
                <p className="text-xs text-gray-600">
                    No detailed insights available.
                </p>
            )}

            {/* STRENGTHS */}
            {matchedSkills.length > 0 && (
                <div className="mt-4">
                    <p className="text-xs font-semibold text-black mb-1">
                        Strengths
                    </p>

                    <div className="flex flex-wrap gap-1">
                        {matchedSkills.slice(0, 6).map((skill) => (
                            <span
                                key={skill}
                                className="
                                px-2 py-1 text-xs rounded-md
                                bg-green-100 text-green-700
                                hover:bg-green-200 hover:scale-[1.05]
                                transition
                                cursor-default
                            "
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* GAPS */}
            {missingSkills.length > 0 && (
                <div className="mt-4">
                    <p className="text-xs font-semibold text-black mb-1">
                        Gaps
                    </p>

                    <div className="flex flex-wrap gap-1">
                        {missingSkills.slice(0, 6).map((skill) => (
                            <span
                                key={skill}
                                className="
                                px-2 py-1 text-xs rounded-md
                                bg-gray-200 text-gray-600
                                hover:bg-gray-300 hover:scale-[1.05]
                                transition
                                cursor-default
                            "
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* ACTIONABLE INSIGHT */}
            {missingSkills.length > 0 && (
                <div className="mt-4 text-[11px] text-gray-600 bg-gray-50 p-2 rounded-md border">
                    Consider improving:{" "}
                    <span className="font-medium">
                        {missingSkills.slice(0, 2).join(", ")}
                    </span>
                </div>
            )}

            {/* FOOTER */}
            <div className="mt-4 text-[10px] text-gray-600 border-t pt-2">
                AI score is based on skill match, experience, rating, and semantic relevance.
            </div>
        </div>
    );
}