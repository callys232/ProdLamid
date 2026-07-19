// components/escrow/EscrowTransactionList.tsx
"use client";
import type { EscrowTransaction } from "@/types/project";

interface EscrowTransactionListProps {
  transactions: EscrowTransaction[];
}

export default function EscrowTransactionList({
  transactions,
}: EscrowTransactionListProps) {
  if (!transactions.length) {
    return <p className="text-gray-500 text-sm">No transactions yet.</p>;
  }

  return (
    <div className="bg-[#1a0d0d] border border-gray-800 rounded-xl p-6 space-y-4">
      <h4 className="font-semibold text-lg text-white">Transaction History</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="border-b border-gray-800 text-gray-500 uppercase text-xs">
            <tr>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Type</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {transactions.map((tx) => (
              <tr key={tx.id} className="group hover:bg-gray-800/30 transition">
                <td className="py-4 text-gray-400">
                  {new Date(tx.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4">
                  <p className="text-white font-medium">{tx.action || tx.type}</p>
                </td>
                <td className="py-4 font-semibold text-white">
                  {tx.currency} {tx.amount.toLocaleString()}
                </td>
                <td className="py-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${tx.status === "released" || tx.status === "completed"
                        ? "bg-green-900/30 text-green-400 border border-green-800/50"
                        : tx.status === "pending" || tx.status === "funded"
                          ? "bg-blue-900/30 text-blue-400 border border-blue-800/50"
                          : tx.status === "disputed"
                            ? "bg-yellow-900/30 text-yellow-400 border border-yellow-800/50"
                            : "bg-blue-900/30 text-blue-400 border border-blue-800/50"
                      }`}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
