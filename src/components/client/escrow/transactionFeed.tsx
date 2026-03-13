"use client";

import React from "react";
import type { EscrowTransaction } from "@/types/escrow";

type ActionType = "release" | "refund" | "dispute";

function statusBadge(status: string) {
    const map: Record<string, string> = {
        funded: "bg-yellow-600 text-black",
        released: "bg-green-600 text-white",
        disputed: "bg-red-700 text-white",
        pending: "bg-blue-600 text-white",
    };
    return map[status] ?? "bg-gray-600 text-white";
}

interface TransactionFeedProps {
    transactions: EscrowTransaction[];
    onAction: (type: ActionType, tx: EscrowTransaction) => void;
}

export default function TransactionFeed({ transactions, onAction }: TransactionFeedProps) {
    return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <h4 className="text-sm text-gray-300 font-medium mb-3">Transaction Feed</h4>
            <div className="space-y-2 max-h-96 overflow-auto">
                {transactions.map((tx) => (
                    <div key={tx.id} className="bg-gray-800 border border-gray-700 rounded-md p-3 hover:bg-gray-750 transition flex items-start justify-between">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <div className={`px-2 py-1 rounded text-xs font-medium ${statusBadge(tx.status)}`}>{tx.status.toUpperCase()}</div>
                                <div className="text-sm text-white font-medium truncate">{(tx.type || "TX").toUpperCase()} • {tx.amount} {tx.currency}</div>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">Project: {tx.projectId ?? "—"} • Milestone: {tx.milestoneId ?? "—"}</div>
                            <div className="text-xs text-gray-400">Created: {new Date(tx.createdAt).toLocaleString()}</div>
                            {tx.notes && <div className="text-xs text-gray-500 mt-1">Note: {tx.notes}</div>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <button onClick={() => onAction("release", tx)} className="px-2 py-1 rounded-md bg-green-600 text-xs text-white">Release</button>
                            <button onClick={() => onAction("dispute", tx)} className="px-2 py-1 rounded-md bg-red-700 text-xs text-white">Dispute</button>
                        </div>
                    </div>
                ))}
                {transactions.length === 0 && <div className="text-gray-400 text-sm">No transactions for selected currency.</div>}
            </div>
        </div>
    );
}
