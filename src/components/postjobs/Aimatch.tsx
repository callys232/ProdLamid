"use client";

import React, { useState } from "react";
import SmartGate from "@/components/smartGate";

interface AIMatchEntryProps {
    user: {
        id?: string;
        plan: "free" | "premium" | "enterprise";
    };
    buildPayload: () => any;
}

export default function AIMatchEntry({
    user,
    buildPayload,
}: AIMatchEntryProps) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAIMatch = async () => {
        try {
            setLoading(true);
            setError(null);

            const payload = buildPayload();

            // Persist fallback draft
            localStorage.setItem("projectDraft", JSON.stringify(payload));

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

            localStorage.setItem("aiMatchResults", JSON.stringify(data));

            window.location.href = "/postjobs/match";

        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleUpgrade = () => {
        window.location.href = "/upgrade";
    };

    return (
        <div className="border rounded-lg p-4 bg-gray-50 hover:shadow-md hover:scale-[1.01] transition">

            <SmartGate
                user={user}
                featureTitle="AI Consultant Matching"
                onUpgrade={handleUpgrade}

                /* ---------------- FREE USER PREVIEW (ALWAYS SAME UX) ---------------- */
                preview={
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                        <div>
                            <h3 className="font-semibold text-black flex items-center gap-2">
                                AI Consultant Matching
                                <span className="text-xs bg-[#2563EB] text-white px-2 py-1 rounded">
                                    PRO
                                </span>
                            </h3>

                            <p className="text-sm text-gray-500">
                                Instantly find and compare the best consultants for your project using AI.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="px-4 py-2 rounded-lg border border-[#2563EB] text-[#2563EB] hover:bg-blue-50 transition font-semibold"
                        >
                            Unlock AI Match
                        </button>
                    </div>
                }

                /* ---------------- PREMIUM FULL FEATURE ---------------- */
                children={
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                        <div>
                            <h3 className="font-semibold text-black flex items-center gap-2">
                                AI Consultant Matching
                                <span className="text-xs bg-[#2563EB] text-white px-2 py-1 rounded">
                                    PRO
                                </span>
                            </h3>

                            <p className="text-sm text-gray-500">
                                Instantly find and compare the best consultants for your project using AI.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleAIMatch}
                            disabled={loading}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${loading
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "bg-[#2563EB] text-white hover:bg-blue-700"
                                }`}
                        >
                            {loading ? "Matching..." : "Find Matches"}
                        </button>
                    </div>
                }
            />

            {/* ---------------- ERROR STATE (UNCHANGED) ---------------- */}
            {error && (
                <p className="text-xs text-blue-500 mt-2">
                    {error}
                </p>
            )}

            {/* ---------------- GLOBAL PREMIUM INFO (CONSTANT ACROSS APP) ---------------- */}
            <p className="text-xs text-gray-600 mt-2">
                🔒 Premium feature — includes AI insights, scoring & consultant comparison
            </p>

        </div>
    );
}