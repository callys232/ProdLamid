"use client";

import React from "react";
import { Score } from "@/types/aiMatch";


export default function ExplainabilityPanel({ score }: { score: Score }) {
    return (
        <div className="mt-4 bg-gray-50 border rounded-lg p-3">

            {/* Title */}
            <h4 className="text-sm font-semibold text-[#2563EB] mb-2">
                Why this match
            </h4>

            {/* Reasons for match */}
            <ul className="text-xs text-gray-700 space-y-1 list-none">
                {score.reasons.map((reason, index) => (
                    <li key={index}>• {reason}</li>
                ))}
            </ul>

            {/* Strengths */}
            {score.matchedSkills.length > 0 && (
                <div className="mt-3">
                    <p className="text-xs font-semibold text-black">Strengths</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {score.matchedSkills.map((skill) => (
                            <span
                                key={skill}
                                className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Skill Gaps */}
            {score.missingSkills.length > 0 && (
                <div className="mt-3">
                    <p className="text-xs font-semibold text-black">Gaps</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {score.missingSkills.map((skill) => (
                            <span
                                key={skill}
                                className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}