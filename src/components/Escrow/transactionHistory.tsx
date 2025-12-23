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
    <div className="bg-white border border-[#c21219] rounded-lg p-4 space-y-2">
      <h4 className="font-semibold text-[#c21219]">Transaction History</h4>
      <ul className="divide-y divide-gray-200">
        {transactions.map((tx) => (
          <li key={tx.id} className="py-2 flex justify-between text-sm">
            <div>
              <span className="font-medium">{tx.type}</span> – {tx.action}
              <div className="text-xs text-gray-500">
                {new Date(tx.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="font-semibold">
              {tx.currency} {tx.amount.toLocaleString()}
            </div>
            <span
              className={`text-xs px-2 py-1 rounded ${
                tx.status === "released"
                  ? "bg-green-100 text-green-700"
                  : tx.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {tx.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
