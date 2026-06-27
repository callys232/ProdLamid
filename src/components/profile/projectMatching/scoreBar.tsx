"use client";

import { useEffect, useMemo, useState } from "react";

interface ScoreBarProps {
    label: string;
    value: number; // 0 → 1
    color?: string;
    showGlow?: boolean;
}

/* ---------------- UTIL: CLAMP ---------------- */
function clamp(num: number, min = 0, max = 1) {
    return Math.max(min, Math.min(num, max));
}

export default function ScoreBar({
    label,
    value,
    color,
    showGlow = true,
}: ScoreBarProps) {

    const [width, setWidth] = useState(0);

    /* ---------------- NORMALIZE ---------------- */
    const normalized = clamp(value);
    const percentage = Math.round(normalized * 100);

    /* ---------------- DYNAMIC COLOR SYSTEM ---------------- */
    const dynamicColor = useMemo(() => {
        if (color) return color;

        if (percentage >= 80) return "#16a34a"; // green (strong match)
        if (percentage >= 60) return "#ca8a04"; // amber (mid)
        return "#c12129"; // red (weak)
    }, [percentage, color]);

    /* ---------------- TEXT INTENSITY ---------------- */
    const intensityClass = useMemo(() => {
        if (percentage >= 80) return "font-semibold text-black";
        if (percentage >= 60) return "font-medium text-gray-700";
        return "text-gray-500";
    }, [percentage]);

    /* ---------------- ANIMATION ---------------- */
    useEffect(() => {
        const t = setTimeout(() => {
            setWidth(normalized * 100);
        }, 60);

        return () => clearTimeout(t);
    }, [normalized]);

    /* ---------------- RENDER ---------------- */
    return (
        <div className="group space-y-1">

            {/* LABEL */}
            <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 group-hover:text-black transition">
                    {label}
                </span>

                <span
                    className={`transition ${intensityClass}`}
                >
                    {percentage}%
                </span>
            </div>

            {/* BAR */}
            <div
                className="
                    relative h-2 rounded-full overflow-hidden
                    bg-gray-200
                "
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percentage}
                aria-label={`${label} score`}
            >
                {/* FILL */}
                <div
                    className="
                        h-full rounded-full
                        transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                        will-change-[width]
                        group-hover:brightness-110
                    "
                    style={{
                        width: `${width}%`,
                        backgroundColor: dynamicColor,
                    }}
                />

                {/* GLOW */}
                {showGlow && (
                    <div
                        className="
                            absolute top-0 left-0 h-full
                            blur-md opacity-0
                            group-hover:opacity-40
                            transition-all duration-300
                            pointer-events-none
                        "
                        style={{
                            width: `${width}%`,
                            backgroundColor: dynamicColor,
                        }}
                    />
                )}
            </div>
        </div>
    );
}