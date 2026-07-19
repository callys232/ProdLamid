"use client";

import { Scale } from "lucide-react";
import type { Escrow } from "@/types/escrow";
import { StatusBadge } from "./statusBadge";
import { EscrowActions } from "./actions";

export function EscrowCard({ escrow }: { escrow: Escrow }) {
  return (
    <aside className="w-full max-w-sm rounded-2xl border border-blue-600 bg-black/70 backdrop-blur-lg p-6 text-white shadow-xl">

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-semibold uppercase text-blue-500">
            Escrow
          </span>
        </div>
        <StatusBadge status={escrow.status} />
      </div>

      {/* Balance */}
      <div className="mb-4 text-xl font-bold">
        {formatMoney(escrow.balance)}
      </div>

      {/* Details */}
      <div className="space-y-3 text-sm">
        <Row label="Team" value={escrow.teamNumber ?? "—"} />
        <Row label="Milestone" value={escrow.milestone ?? "—"} />
        <Row label="Amount Paid" value={formatMoney(escrow.amountPaid)} />
        <Row label="Project Fund" value={formatMoney(escrow.projectFund)} />
        <Row label="Duration" value={escrow.projectDuration ?? "—"} />
      </div>

      {/* Actions */}
      <div className="mt-6">
        <EscrowActions status={escrow.status} />
      </div>
    </aside>
  );
}

/* ------------------ Row Component ------------------ */
function Row({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="flex justify-between text-gray-400">
      <span>{label}</span>
      <span className="text-white">{value ?? "—"}</span>
    </div>
  );
}

/* ------------------ Money Formatter ------------------ */
function formatMoney(amount?: number | null) {
  // Safely format a number with commas, fallback to "—"
  return amount != null ? `$${amount.toLocaleString()}` : "—";
}