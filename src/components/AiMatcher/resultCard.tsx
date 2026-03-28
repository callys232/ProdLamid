"use client";

import React from "react";
import ScoreBar from "./scoreBoard";
import ExplainabilityPanel from "./explianer";
import { MatchResult } from "@/types/aiMatch";

/**
 * ResultCard
 * Displays consultant info, scores as bars, and explainability insights.
 * Highlights when selected. Clicking triggers onSelect callback.
 */
export default function ResultCard({
    result,
    selected,
    onSelect,
}: {
    result: MatchResult;
    selected: boolean;
    onSelect: () => void;
}) {
    const { consultant, score } = result;

    return (
        <div
            onClick={onSelect}
            className={`cursor-pointer border rounded-lg p-4 bg-white transition hover:shadow-md hover:scale-[1.01] ${selected ? "ring-2 ring-[#c12129]" : ""
                }`}
        >
            {/* Consultant Info */}
            <h3 className="font-semibold text-black">{consultant.name}</h3>
            <p className="text-sm text-gray-500">{consultant.title}</p>

            {/* Score Bars */}
            <div className="mt-3 space-y-2">
                <ScoreBar label="AI Match" value={score.semantic} />
                <ScoreBar label="Skills" value={score.skillMatch} />
                <ScoreBar label="Experience" value={score.experience} />
                <ScoreBar label="Rating" value={score.rating} />
            </div>

            {/* Total Match */}
            <div className="mt-2 text-sm font-semibold text-[#c12129]">
                {(score.total * 100).toFixed(1)}% Match
            </div>

            {/* Explainability Panel */}
            <ExplainabilityPanel score={score} />
        </div>
    );
}