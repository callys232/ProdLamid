"use client";

import React from "react";
import ResultCard from "./resultCard";
import { MatchResult } from "@/types/aiMatch";

/**
 * MatchResults
 * Renders a grid of AI-matched consultant cards.
 * Handles selection highlighting and displays explainability insights inside each card.
 */
export default function MatchResults({
    results,
    selectedResults,
    onSelect,
}: {
    results: MatchResult[];
    selectedResults: MatchResult[];
    onSelect: (result: MatchResult) => void;
}) {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((r) => (
                <ResultCard
                    key={r.consultant.id}
                    result={r}
                    selected={selectedResults.some(
                        (s) => s.consultant.id === r.consultant.id
                    )}
                    onSelect={() => onSelect(r)}
                />
            ))}
        </div>
    );
}