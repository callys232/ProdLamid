"use client";

import { ReactNode, useState } from "react";

interface TooltipProps {
    text: string;          // The tooltip text to display
    children?: ReactNode;  // Optional: wrap around an icon or element
}

export default function Tooltip({ text, children }: TooltipProps) {
    const [visible, setVisible] = useState(false);

    return (
        <span
            className="relative inline-flex items-center"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {/* The element you want to hover over */}
            {children ?? <span className="text-gray-400 cursor-help">ℹ️</span>}

            {/* Tooltip bubble */}
            {visible && (
                <span
                    className="absolute bottom-full mb-2 w-max max-w-xs px-2 py-1 rounded-md 
                     bg-gray-800 text-white text-xs shadow-lg z-50"
                >
                    {text}
                </span>
            )}
        </span>
    );
}
