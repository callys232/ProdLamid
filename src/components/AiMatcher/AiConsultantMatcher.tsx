"use client";

import React, { useEffect, useState } from "react";
import { Project, Consultant, MatchResult } from "@/types/aiMatch";
import { scoreConsultant } from "@/lib/ai/matcher";

import ResultCard from "./resultCard";
import ComparePanel from "./compare";


export default function AIConsultantMatcher({
    project,
    consultants,
    useBackend = true,
}: {
    project: Project;
    consultants?: Consultant[];
    useBackend?: boolean;
}) {
    const [results, setResults] = useState<MatchResult[]>([]);
    const [selected, setSelected] = useState<MatchResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const runMatching = async () => {
            setLoading(true);
            setError(null);

            const list = consultants ?? [];

            if (useBackend || list.length === 0) {
                try {
                    const res = await fetch("/api/ai/match", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(project),
                    });

                    const data = await res.json();
                    const payload = Array.isArray(data) ? data : data?.data;

                    if (!res.ok) {
                        const message = data?.error || data?.message || "Failed to match consultants";
                        throw new Error(message);
                    }

                    if (Array.isArray(payload)) {
                        setResults(payload as MatchResult[]);
                        setLoading(false);
                        return;
                    }

                    throw new Error("Invalid match response");
                } catch (e: any) {
                    if (list.length === 0) {
                        setError(e?.message || "Failed to match consultants");
                        setResults([]);
                        setLoading(false);
                        return;
                    }
                }
            }

            const scored: MatchResult[] = list.map((c) => ({
                consultant: c,
                score: scoreConsultant(project, c),
            }));

            scored.sort((a, b) => b.score.total - a.score.total);

            setResults(scored);
            setLoading(false);
        };

        runMatching();
    }, [project, consultants, useBackend]);

    /* ---------------- SELECT LOGIC ---------------- */
    function handleSelect(result: MatchResult) {
        setSelected((prev) => {
            const exists = prev.find((p) => p.consultant.id === result.consultant.id);

            if (exists) {
                // Deselect if already selected
                return prev.filter((p) => p.consultant.id !== result.consultant.id);
            }

            if (prev.length < 2) {
                return [...prev, result]; // add new selection
            }

            // Keep the last selected + new selection
            return [prev[1], result];
        });
    }

    /* ---------------- RENDER ---------------- */
    return (
        <div className="space-y-6">
            <h1 className="text-xl font-semibold text-black">AI Consultant Matches</h1>

            {loading ? (
                <p className="text-gray-500">Analyzing consultants...</p>
            ) : error ? (
                <p className="text-blue-600">{error}</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.map((r) => (
                        <ResultCard
                            key={r.consultant.id}
                            result={r}
                            selected={selected.some((s) => s.consultant.id === r.consultant.id)}
                            onSelect={() => handleSelect(r)}
                        />
                    ))}
                </div>
            )}

            {/* Compare two selected consultants */}
            <ComparePanel a={selected[0]} b={selected[1]} />
        </div>
    );
}
