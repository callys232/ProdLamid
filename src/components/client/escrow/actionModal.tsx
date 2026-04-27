"use client";

import React, { useEffect, useRef, useState } from "react";
import type { EscrowTransaction } from "@/types/escrow";
import type { ActionType } from "./transactionFeed";

interface ActionModalProps {
  type: ActionType;
  tx?: EscrowTransaction;
  onClose: () => void;
  onConfirm: (payload: { notes?: string; approver?: string }) => void;
  isPremium?: boolean;
}

const CONFIG: Record<ActionType, { title: string; confirmLabel: string; confirmCls: string; notesPlaceholder: string }> = {
  fund:    { title: "Fund Milestone",    confirmLabel: "Confirm Funding",  confirmCls: "bg-blue-600 hover:bg-blue-700",   notesPlaceholder: "Optional notes about funding…" },
  release: { title: "Release Funds",     confirmLabel: "Confirm Release",  confirmCls: "bg-green-600 hover:bg-green-700", notesPlaceholder: "Reason for releasing funds…" },
  refund:  { title: "Refund Funds",      confirmLabel: "Confirm Refund",   confirmCls: "bg-yellow-700 hover:bg-yellow-600", notesPlaceholder: "Reason for refund…" },
  dispute: { title: "Raise Dispute",     confirmLabel: "Submit Dispute",   confirmCls: "bg-red-700 hover:bg-red-800",     notesPlaceholder: "Describe the issue clearly…" },
};

export default function ActionModal({ type, tx, onClose, onConfirm, isPremium = false }: ActionModalProps) {
  const [notes, setNotes] = useState("");
  const [approver, setApprover] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const cfg = CONFIG[type];

  useEffect(() => { ref.current?.focus(); }, []);

  const isDisputeWithoutReason = type === "dispute" && !notes.trim();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog" aria-modal="true" aria-labelledby="action-modal-title"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div
        ref={ref} tabIndex={-1}
        className="relative z-10 w-full max-w-lg rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-2xl focus:outline-none"
      >
        <h3 id="action-modal-title" className="mb-1 text-lg font-semibold text-white">
          {cfg.title}
        </h3>

        <p className="mb-5 text-sm text-gray-400">
          {tx ? `Transaction ${tx.id} · ${tx.amount} ${tx.currency}` : "Demo flow — no transaction attached"}
        </p>

        <div className="space-y-4">
          {/* Notes / reason */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-300">
              {type === "dispute" ? "Dispute Reason *" : "Notes"}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={cfg.notesPlaceholder}
              rows={3}
              className="w-full resize-none rounded-md border border-gray-700 bg-gray-800 p-2.5 text-sm text-gray-200 focus:border-red-600 focus:outline-none"
            />
          </div>

          {/* Release-only: approver */}
          {type === "release" && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-300">
                Approver (email or ID)
              </label>
              <input
                value={approver}
                onChange={(e) => setApprover(e.target.value)}
                placeholder="approver@example.com"
                className="w-full rounded-md border border-gray-700 bg-gray-800 p-2.5 text-sm text-gray-200 focus:border-green-600 focus:outline-none"
              />
              {!isPremium && (
                <p className="mt-1 text-xs text-gray-500">
                  Multi-approver workflows are available for Premium users.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md bg-gray-700 px-4 py-2 text-sm text-white transition hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            disabled={isDisputeWithoutReason}
            onClick={() => onConfirm({ notes, approver })}
            className={`rounded-md px-4 py-2 text-sm text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${cfg.confirmCls}`}
          >
            {cfg.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
