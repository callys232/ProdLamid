"use client";

import React from "react";
import type { EscrowTransaction } from "@/types/escrow";

export type ActionType = "fund" | "release" | "refund" | "dispute";

const STATUS_BADGE: Record<string, string> = {
  funded:   "bg-yellow-600 text-black",
  released: "bg-green-600 text-white",
  disputed: "bg-blue-700 text-white",
  pending:  "bg-blue-600 text-white",
  refunded: "bg-orange-600 text-white",
};

const ACTIONS: { type: ActionType; label: string; cls: string }[] = [
  { type: "fund",    label: "Fund",    cls: "bg-blue-600 hover:bg-blue-700" },
  { type: "release", label: "Release", cls: "bg-green-600 hover:bg-green-700" },
  { type: "refund",  label: "Refund",  cls: "bg-yellow-700 hover:bg-yellow-600" },
  { type: "dispute", label: "Dispute", cls: "bg-blue-700 hover:bg-blue-800" },
];

interface TransactionFeedProps {
  transactions: EscrowTransaction[];
  onAction: (type: ActionType, tx: EscrowTransaction) => void;
}

export default function TransactionFeed({ transactions, onAction }: TransactionFeedProps) {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
      <h4 className="mb-3 text-sm font-medium text-gray-300">Transaction Feed</h4>

      <div className="max-h-96 space-y-2 overflow-auto">
        {transactions.length === 0 && (
          <p className="text-sm text-gray-400">No transactions for selected currency.</p>
        )}

        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-start justify-between gap-3 rounded-md border border-gray-700 bg-gray-800 p-3 transition hover:bg-gray-750"
          >
            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[tx.status] ?? "bg-gray-600 text-white"}`}>
                  {tx.status.toUpperCase()}
                </span>
                <span className="truncate text-sm font-medium text-white">
                  {(tx.type ?? "TX").toUpperCase()} · {tx.amount} {tx.currency}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Project: {tx.projectId ?? "—"} · Milestone: {tx.milestoneId ?? "—"}
              </p>
              <p className="text-xs text-gray-400">
                Created: {new Date(tx.createdAt).toLocaleString()}
              </p>
              {tx.notes && (
                <p className="mt-1 text-xs text-gray-500">Note: {tx.notes}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-1.5">
              {ACTIONS.map(({ type, label, cls }) => {
                const disabled =
                  (type === "fund"    && tx.status !== "in_progress") ||
                  (type === "release" && tx.status !== "funded")  ||
                  (type === "refund"  && !["funded", "in_progress"].includes(tx.status)) ||
                  (type === "dispute" && ["released", "refunded", "disputed"].includes(tx.status));

                return (
                  <button
                    key={type}
                    onClick={() => onAction(type, tx)}
                    disabled={disabled}
                    className={`rounded-md px-2 py-1 text-xs text-white transition ${cls} disabled:cursor-not-allowed disabled:opacity-30`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
