// components/Tooltip.tsx
import React from "react";

interface TooltipProps {
    recommendation: string;
    source: string;
    confidence: number;
    visible: boolean;
}

export default function Tooltip({ recommendation, source, confidence, visible }: TooltipProps) {
    if (!visible) return null;

    return (
        <div className="absolute left-0 top-full mt-2 w-72 bg-black text-white text-sm rounded-lg shadow-lg p-3 z-10 animate-fadeIn">
            <p className="font-semibold text-[#c12129]">Recommendation</p>
            <p>{recommendation}</p>
            <p className="text-gray-400 text-xs">{source}</p>
            <p className="text-green-400 text-xs">Confidence: {Math.round(confidence * 100)}%</p>
        </div>
    );
}
