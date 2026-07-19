"use client";

import { useState } from "react";

/* -------------------- TYPES -------------------- */
interface ProjectMatchEntryProps {
    isPremiumUser: boolean;
    buildPayload: () => any;
    onResults?: (results: any) => void;
}

/* -------------------- COMPONENT -------------------- */
export default function ProjectMatchEntry({
    isPremiumUser,
    buildPayload,
    onResults,
}: ProjectMatchEntryProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /* -------------------- HANDLE AI MATCH -------------------- */
    const handleMatch = async () => {
        if (loading) return; // prevent double clicks

        try {
            setLoading(true);
            setError(null);

            const payload = buildPayload();

            // Cache user context locally for analytics/fallback
            localStorage.setItem("consultantContext", JSON.stringify(payload));

            const res = await fetch("/api/ai/project-match", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("AI matching failed");

            const data = await res.json();

            // Cache project matches locally
            localStorage.setItem("projectMatches", JSON.stringify(data));

            if (onResults) {
                onResults(data);
                return;
            }

            window.location.href = "/projects/match";
        } catch (err: any) {
            setError(err.message || "Something went wrong while matching projects.");
        } finally {
            setLoading(false);
        }
    };

    /* -------------------- HANDLE UPGRADE -------------------- */
    const handleUpgrade = () => {
        window.location.href = "/pricing";
    };

    /* -------------------- RENDER BUTTONS -------------------- */
    const renderCTA = () => {
        if (isPremiumUser) {
            return (
                <button
                    onClick={handleMatch}
                    disabled={loading}
                    className={`relative px-5 py-2.5 rounded-lg font-semibold text-sm
                                transition-all duration-300 flex items-center gap-2
                                ${loading
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-[#2563EB] text-white hover:bg-blue-700 hover:shadow-md active:scale-[0.97]"
                        }`}
                >
                    {loading && (
                        <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent
                                         rounded-full animate-spin" />
                    )}
                    {loading ? "Analyzing..." : "Find Matches"}
                </button>
            );
        } else {
            return (
                <button
                    onClick={handleUpgrade}
                    className="px-5 py-2.5 rounded-lg text-sm font-semibold
                               border border-[#2563EB] text-[#2563EB]
                               hover:bg-[#2563EB]/5 hover:shadow-sm
                               active:scale-[0.97] transition-all"
                >
                    Unlock AI and Upgrade
                </button>
            );
        }
    };

    /* -------------------- PREMIUM HINT -------------------- */
    const renderPremiumHint = () => {
        if (!isPremiumUser) {
            return (
                <p className="text-[10px] text-gray-400 text-right max-w-[200px]">
                    🔒 Includes AI scoring, smart ranking & bid recommendations
                </p>
            );
        }
        return null;
    };

    /* -------------------- ERROR DISPLAY -------------------- */
    const renderError = () => {
        if (error) {
            return (
                <div className="mt-3 text-xs text-blue-500 bg-blue-50 border border-blue-200
                                px-3 py-2 rounded-md">
                    {error}
                </div>
            );
        }
        return null;
    };

    /* -------------------- MAIN RENDER -------------------- */
    return (
        <div className="relative border rounded-2xl p-5 bg-white
                        shadow-sm hover:shadow-lg transition-all duration-300
                        hover:-translate-y-[2px] group">
            {/* Subtle hover glow */}
            <div className="absolute inset-0 rounded-2xl bg-[#2563EB]/5
                            opacity-0 group-hover:opacity-100 transition-all duration-300" />

            <div className="relative flex flex-col sm:flex-row sm:items-center
                            sm:justify-between gap-4">

                {/* LEFT SECTION */}
                <div className="space-y-1">
                    <h3 className="font-semibold text-black flex items-center gap-2">
                        AI and Personal Advisor Matching
                        <span className="text-[10px] tracking-wide bg-[#2563EB] text-white
                                         px-2 py-[2px] rounded-md shadow-sm">
                            PRO
                        </span>
                    </h3>

                    <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
                        Instantly scan your profile, resume, and skills to surface
                        high-fit projects you should bid on.
                    </p>
                </div>

                {/* RIGHT SECTION */}
                <div className="flex flex-col items-end gap-2">
                    {renderCTA()}
                    {renderPremiumHint()}
                </div>
            </div>

            {/* ERROR MESSAGE */}
            {renderError()}
        </div>
    );
}
