"use client";

import React, { useEffect, useRef, useState } from "react";
import type { EscrowTransaction } from "@/types/escrow";

type ActionType = "release" | "refund" | "dispute";

interface ActionModalProps {
    type: ActionType;
    tx?: EscrowTransaction;
    onClose: () => void;
    onConfirm: (payload: { notes?: string; approver?: string }) => void;
    isPremium?: boolean;
}

export default function ActionModal({ type, tx, onClose, onConfirm, isPremium = false }: ActionModalProps) {
    const [notes, setNotes] = useState("");
    const [approver, setApprover] = useState("");
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        ref.current?.focus();
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="action-modal-title">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div ref={ref} tabIndex={-1} className="relative z-10 w-full max-w-2xl bg-gray-900 rounded-lg border border-gray-700 p-6">
                <h3 id="action-modal-title" className="text-white text-lg font-semibold mb-2">
                    {type === "release" ? "Release Funds" : type === "refund" ? "Refund Funds" : "Raise Dispute"}
                </h3>

                <p className="text-sm text-gray-400 mb-4">{tx ? `Transaction ${tx.id} • ${tx.amount} ${tx.currency}` : "Demo flow"}</p>

                <div className="space-y-3">
                    <label className="block text-xs text-gray-300">Notes</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add notes or reason" className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-sm text-gray-200" />

                    {type === "release" && (
                        <>
                            <label className="block text-xs text-gray-300">Approver (email or id)</label>
                            <input value={approver} onChange={(e) => setApprover(e.target.value)} placeholder="Approver" className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-sm text-gray-200" />
                            {!isPremium && <div className="text-xs text-gray-400">Multi-approver workflows and scheduled releases are available for Premium users.</div>}
                        </>
                    )}
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button onClick={onClose} className="px-3 py-2 rounded-md bg-gray-700 text-white">Cancel</button>
                    <button onClick={() => onConfirm({ notes, approver })} className="px-3 py-2 rounded-md bg-red-600 text-white">
                        {type === "release" ? "Confirm Release" : type === "refund" ? "Confirm Refund" : "Submit Dispute"}
                    </button>
                </div>
            </div>
        </div>
    );
}
