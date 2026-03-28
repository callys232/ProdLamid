"use client";

import { useState } from "react";
import ScoreBar from "./scoreBar";
import ExplainabilityPanel from "./explainer";
import { ProjectMatchResult } from "@/types/aiProjectmatch";

interface Props {
    result: ProjectMatchResult;
    selected: boolean;
    onSelect: () => void;
    onApply: () => Promise<void> | void;
}

export default function ProjectResultCard({
    result,
    selected,
    onSelect,
    onApply,
}: Props) {
    const { project, score } = result;

    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [showExplain, setShowExplain] = useState(false);

    /* ---------------- APPLY HANDLER ---------------- */
    const handleApply = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (applying || applied) return;

        try {
            setApplying(true);
            await onApply();
            setApplied(true);
        } catch (err) {
            console.error("Apply failed:", err);
        } finally {
            setApplying(false);
        }
    };

    /* ---------------- SCORE COLOR ---------------- */
    const getScoreColor = () => {
        const pct = score.total * 100;
        if (pct >= 80) return "text-green-600";
        if (pct >= 60) return "text-amber-600";
        return "text-[#c12129]";
    };

    /* ---------------- MATCH LABEL ---------------- */
    const getMatchLabel = () => {
        const pct = score.total * 100;
        if (pct >= 85) return "Excellent Match";
        if (pct >= 70) return "Strong Match";
        if (pct >= 50) return "Moderate Match";
        return "Weak Match";
    };

    return (
        <div
            onClick={onSelect}
            className={`
                group cursor-pointer border rounded-xl p-5 bg-white
                transition-all duration-300
                hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.01]
                ${selected ? "ring-2 ring-[#c12129]" : ""}
            `}
        >
            {/* HEADER */}
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold text-black text-sm">{project.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                        {project.categories} • {project.location || "Remote"}
                    </p>
                </div>

                {/* MATCH BADGE */}
                <span className={`text-xs font-semibold ${getScoreColor()}`}>
                    {getMatchLabel()}
                </span>
            </div>

            {/* DESCRIPTION */}
            <p className="text-xs text-gray-500 mt-2 line-clamp-3">{project.description}</p>

            {/* META TAGS */}
            <div className="flex flex-wrap gap-2 mt-3 text-xs">
                {project.budget && (
                    <span className="bg-gray-100 px-2 py-1 rounded font-medium">
                        ₦{project.budget.toLocaleString()}
                    </span>
                )}
                {project.type && (
                    <span className="bg-gray-100 px-2 py-1 rounded capitalize font-medium">
                        {project.type.replace("-", " ")}
                    </span>
                )}
            </div>

            {/* SCORES */}
            <div className="mt-4 space-y-2">
                <ScoreBar label="AI Match" value={score.semantic} />
                <ScoreBar label="Skills" value={score.skillMatch} />
                <ScoreBar label="Experience" value={score.experience} />
                <ScoreBar label="Rating" value={score.rating} />
            </div>

            {/* TOTAL MATCH */}
            <div className={`mt-4 text-sm font-bold ${getScoreColor()}`}>
                {(score.total * 100).toFixed(1)}% Match
            </div>

            {/* CTA BUTTON */}
            <button
                onClick={handleApply}
                disabled={applying || applied}
                className={`
                    mt-4 w-full py-2 rounded-lg font-semibold transition-all
                    ${applied
                        ? "bg-green-600 text-white shadow-inner"
                        : applying
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-[#c12129] text-white hover:bg-red-700 hover:shadow-lg hover:-translate-y-[1px]"
                    }
                `}
            >
                {applied ? "Applied ✓" : applying ? "Applying..." : "Apply"}
            </button>

            {/* EXPLAIN TOGGLE */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setShowExplain((prev) => !prev);
                }}
                className="mt-3 text-xs text-gray-400 hover:text-[#c12129] transition"
            >
                {showExplain ? "Hide AI Insight" : "Why this match?"}
            </button>

            {/* EXPLAINABILITY PANEL */}
            {showExplain && (
                <div className="mt-3 animate-fadeIn">
                    <ExplainabilityPanel score={score} />
                </div>
            )}
        </div>
    );
}