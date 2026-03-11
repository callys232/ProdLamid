"use client";

import React, { useState } from "react";

type CardProps = {
    type: "contract" | "invoice" | "bill" | "doc";
    title: string;
    status: string;
    uploadedFile?: string;
    docUrl?: string;
    amount?: number;
    dueDate?: string;
    extraInfo?: React.ReactNode;
};

const PremiumCard: React.FC<CardProps> = ({
    title,
    status,
    uploadedFile,
    docUrl,
    amount,
    dueDate,
    type,
    extraInfo,
}) => {
    const [expanded, setExpanded] = useState(false);

    const badgeColor =
        status === "Paid"
            ? "bg-green-700"
            : status === "Pending"
                ? "bg-[#c12129]"
                : "bg-blue-700";

    return (
        <div
            onClick={() => setExpanded(!expanded)}
            className="
        cursor-pointer border border-gray-700 rounded-lg p-4 bg-black 
        shadow-lg transition-transform duration-300 ease-out 
        hover:shadow-2xl hover:scale-105 hover:border-[#c12129]
      "
        >
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>

            <div className="text-sm text-gray-400 mb-4 space-y-1">
                <span
                    className={`px-2 py-1 rounded text-xs font-bold text-white ${badgeColor}`}
                >
                    {status}
                </span>
                {amount !== undefined && <p>Amount: ${amount}</p>}
                {dueDate && <p>Due: {dueDate}</p>}
                <p className="capitalize">Type: {type}</p>
            </div>

            {/* Peek View */}
            {uploadedFile && (
                <iframe
                    src={uploadedFile}
                    className="w-full h-40 border border-[#c12129] rounded-md animate-fadeIn"
                    title="Document Preview"
                    loading="lazy"
                />
            )}
            {docUrl && (
                <a
                    href={docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#c12129] hover:underline mt-2 block relative overflow-hidden"
                >
                    <span className="relative z-10">Open in Google Docs</span>
                    <span className="absolute inset-0 bg-[#c12129]/20 opacity-0 hover:opacity-100 transition-opacity" />
                </a>
            )}

            {/* Expanded details */}
            {expanded && (
                <div className="mt-4 text-sm text-gray-300 space-y-2 animate-fadeIn">
                    {type === "invoice" && <p>Line Items: (mock data)</p>}
                    {type === "contract" && <p>Parties: (mock data)</p>}
                    {type === "bill" && <p>Payment Method: (mock data)</p>}
                    {type === "doc" && <p>Last Edited: (mock data)</p>}
                </div>
            )}

            {extraInfo && <div className="mt-2 border-t border-gray-800 pt-2">{extraInfo}</div>}
        </div>
    );
};

export default PremiumCard;
