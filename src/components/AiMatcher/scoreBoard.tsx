"use client";

import React from "react";

/**
 * ScoreBar
 * Renders a labeled horizontal progress bar with percentage.
 *
 * @param label - The metric name (e.g., "Skills", "Experience")
 * @param value - Value between 0 and 1 (e.g., 0.85 for 85%)
 */
export default function ScoreBar({
    label,
    value,
}: {
    label: string;
    value: number;
}) {
    return (
        <div>
            {/* Label + Percentage */}
            <div className="flex justify-between text-xs text-gray-500">
                <span>{label}</span>
                <span>{Math.round(value * 100)}%</span>
            </div>

            {/* Bar Background */}
            <div className="h-2 bg-gray-200 rounded mt-1 overflow-hidden">
                {/* Bar Fill */}
                <div
                    className="h-2 bg-[#2563EB] rounded transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(Math.max(value, 0), 1) * 100}%` }}
                />
            </div>
        </div>
    );
}