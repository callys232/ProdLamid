"use client";

import React, { useState } from "react";

interface AIMatchEntryProps {
    isPremiumUser: boolean;
    buildPayload: () => any;
}

export default function AIMatchEntry({
    isPremiumUser,
    buildPayload,
}: AIMatchEntryProps) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAIMatch = async () => {
        try {
            setLoading(true);
            setError(null);

            const payload = buildPayload();

            // Save raw project as fallback
            localStorage.setItem("projectDraft", JSON.stringify(payload));

            /* ---------------- API CALL ---------------- */
            const res = await fetch("/api/ai/match", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error("Failed to fetch AI matches");
            }

            const data = await res.json();

            /* ---------------- STORE RESULTS ---------------- */
            localStorage.setItem("aiMatchResults", JSON.stringify(data));

            /* ---------------- NAVIGATE ---------------- */
            window.location.href = "/postjobs/match";

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleUpgrade = () => {
        alert("Upgrade to Premium to unlock AI matching");
    };

    return (
        <div className="border rounded-lg p-4 bg-gray-50 hover:shadow-md hover:scale-[1.01] transition">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                <div>
                    <h3 className="font-semibold text-black flex items-center gap-2">
                        AI Consultant Matching
                        <span className="text-xs bg-[#c12129] text-white px-2 py-1 rounded">
                            PRO
                        </span>
                    </h3>

                    <p className="text-sm text-gray-500">
                        Instantly find and compare the best consultants for your project using AI.
                    </p>
                </div>

                {isPremiumUser ? (
                    <button
                        type="button"
                        onClick={handleAIMatch}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${loading
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-[#c12129] text-white hover:bg-red-700"
                            }`}
                    >
                        {loading ? "Matching..." : "Find Matches"}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleUpgrade}
                        className="px-4 py-2 rounded-lg border border-[#c12129] text-[#c12129] hover:bg-red-50 transition font-semibold"
                    >
                        Unlock AI Match
                    </button>
                )}
            </div>

            {/* ERROR */}
            {error && (
                <p className="text-xs text-red-500 mt-2">
                    {error}
                </p>
            )}

            {/* PREMIUM NOTICE */}
            {!isPremiumUser && (
                <p className="text-xs text-gray-400 mt-2">
                    🔒 Premium feature — includes AI insights, scoring & consultant comparison
                </p>
            )}
        </div>
    );
}