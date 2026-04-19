"use client";

import React from "react";

interface StatusCardProps {
    title: string;
    status: string;
    action?: () => void;
    actionLabel?: string;
    readonly?: boolean;
    children?: React.ReactNode;
}

export default function StatusCard({ title, status, action, actionLabel, readonly, children }: StatusCardProps) {
    return (
        <div className="bg-gray-900 rounded-lg p-4 shadow-md flex flex-col justify-between border border-gray-700 hover:border-[#c12129] transition">
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-white font-semibold">{title}</h4>
                <span className="text-xs text-gray-400">{status}</span>
            </div>
            {!readonly && action && (
                <button
                    onClick={action}
                    className="mt-2 text-sm bg-[#c12129] hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                >
                    {actionLabel}
                </button>
            )}
            {children}
        </div>
    );
}