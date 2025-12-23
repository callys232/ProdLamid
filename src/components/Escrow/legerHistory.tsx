// components/escrow/LedgerHistory.tsx
"use client";
import type { LedgerEntry } from "@/types/project";

interface LedgerHistoryProps {
  entries: LedgerEntry[];
}

export default function LedgerHistory({ entries }: LedgerHistoryProps) {
  return (
    <div className="bg-white border border-[#c21219] rounded-lg p-4">
      <h4 className="font-semibold text-[#c21219]">Ledger History</h4>
      <ul className="divide-y divide-gray-200 text-sm">
        {entries.map((e: LedgerEntry) => (
          <li key={e.id} className="py-2 grid grid-cols-4 gap-2">
            <span>{new Date(e.createdAt).toLocaleString()}</span>
            <span>
              {e.debitAccount} → {e.creditAccount}
            </span>
            <span>
              {e.currency} {e.amount.toLocaleString()}
            </span>
            <span className="text-gray-500">{e.referenceId || "-"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
