// components/escrow/LedgerHistory.tsx
"use client";
import type { LedgerEntry } from "@/types/project";

interface LedgerHistoryProps {
  entries: LedgerEntry[];
}

export default function LedgerHistory({ entries }: LedgerHistoryProps) {
  return (
    <div className="bg-[#1a0d0d] border border-gray-800 rounded-xl p-6 space-y-4">
      <h4 className="font-semibold text-lg text-white">Ledger History</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="border-b border-gray-800 text-gray-500 uppercase text-xs">
            <tr>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Movement</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {entries.map((e) => (
              <tr key={e.id} className="hover:bg-gray-800/30 transition text-gray-400">
                <td className="py-4">
                  {new Date(e.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 font-medium text-gray-300">
                  {e.debitAccount} <span className="text-red-500 mx-1">→</span> {e.creditAccount}
                </td>
                <td className="py-4 font-semibold text-white">
                  {e.currency} {e.amount.toLocaleString()}
                </td>
                <td className="py-4 text-xs font-mono">
                  {e.referenceId || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
