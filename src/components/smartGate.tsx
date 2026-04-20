"use client";

import React from "react";
import { evaluateGate, UserContext } from "../utils/gateHelper";

interface SmartGateProps {
    user: UserContext;

    /** What free users see */
    preview: React.ReactNode;

    /** What premium users see */
    children: React.ReactNode;

    /** Upgrade action (routing / modal / stripe trigger) */
    onUpgrade?: () => void;

    /** Optional title override (keeps messaging consistent if used) */
    featureTitle?: string;
}

export default function SmartGate({
    user,
    preview,
    children,
    onUpgrade,
    featureTitle = "Premium Feature",
}: SmartGateProps) {
    const gate = evaluateGate(user);

    // PREMIUM → FULL ACCESS
    if (gate.allowed) {
        return <>{children}</>;
    }

    // FREE → PREVIEW MODE (consistent UX everywhere)
    return (
        <div className="relative border rounded-xl bg-white overflow-hidden">

            {/* PREVIEW CONTENT (blurred / disabled interaction) */}
            <div className="opacity-60 blur-[1.5px] pointer-events-none select-none">
                {preview}
            </div>

            {/* GLOBAL OVERLAY */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm text-center px-4">

                <div className="max-w-xs">
                    <p className="text-sm font-semibold text-gray-800">
                        {featureTitle}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                        This is a premium feature preview.
                        Upgrade to unlock full access.
                    </p>

                    <button
                        onClick={onUpgrade}
                        className="mt-3 px-4 py-2 bg-black text-white text-sm rounded-md hover:bg-gray-800 transition"
                    >
                        Upgrade
                    </button>
                </div>

            </div>
        </div>
    );
}