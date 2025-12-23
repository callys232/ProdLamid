// src/components/project/FinanceCard.tsx
"use client";

import Card from "./card";
import type { EscrowTransaction } from "@/types/client";

export default function FinanceCard({
  transactions,
  budget,
}: {
  transactions: EscrowTransaction[];
  budget?: number;
}) {
  const totalReleased = transactions
    .filter((t) => t.status === "released")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Card title="💵 Finance">
      <p className="text-sm text-gray-300 mb-2">
        Budget: {budget || "N/A"} | Released: ${totalReleased}
      </p>
      {transactions.length > 0 ? (
        <ul className="space-y-2">
          {transactions.map((t) => (
            <li
              key={t.id}
              className="bg-[#0c0000] p-3 rounded-md border border-[#3a1919]"
            >
              <p className="text-sm text-gray-300">
                {t.currency} {t.amount} — {t.status}
              </p>
              <p className="text-xs text-gray-500">
                Milestone: {t.milestoneId} |{" "}
                {new Date(t.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No escrow transactions yet.</p>
      )}
    </Card>
  );
}
