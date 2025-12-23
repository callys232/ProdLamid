// components/escrow/AdminDisputeResolver.tsx
"use client";
import { useState } from "react";

// ✅ Define a type alias for clarity
type DisputeOutcome = "refund" | "release" | "split";

interface AdminDisputeResolverProps {
  disputeId: string;
  amount: number;
  currency: string;
  onResolve: (payload: {
    outcome: DisputeOutcome;
    ratio?: number;
    notes?: string;
  }) => Promise<void> | void;
}

export default function AdminDisputeResolver({
  disputeId,
  amount,
  currency,
  onResolve,
}: AdminDisputeResolverProps) {
  const [outcome, setOutcome] = useState<DisputeOutcome>("split");
  const [ratio, setRatio] = useState<number>(0.5);
  const [notes, setNotes] = useState("");

  const clientPart =
    Math.round(
      amount *
        (outcome === "split" ? ratio : outcome === "refund" ? 1 : 0) *
        100
    ) / 100;
  const freelancerPart = amount - clientPart;

  return (
    <div className="bg-white border border-[#c21219] rounded-lg p-4 space-y-3">
      <h4 className="font-semibold text-[#c21219]">Resolve Dispute</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="text-sm">Outcome</label>
          <select
            aria-label="outcome"
            value={outcome}
            onChange={(e) => setOutcome(e.target.value as DisputeOutcome)}
            className="w-full px-3 py-2 rounded-md border border-[#c21219] focus:ring-2 focus:ring-[#c21219] text-black"
          >
            <option value="refund">Refund to client</option>
            <option value="release">Release to freelancer</option>
            <option value="split">Split</option>
          </select>
        </div>
        {outcome === "split" && (
          <div>
            <label className="text-sm">Client ratio</label>
            <input
              aria-label="number"
              type="number"
              min={0}
              max={1}
              step={0.05}
              value={ratio}
              onChange={(e) => setRatio(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-md border border-[#c21219] focus:ring-2 focus:ring-[#c21219] text-black"
            />
          </div>
        )}
        <div>
          <label className="text-sm">Notes</label>
          <input
            aria-label="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-[#c21219] focus:ring-2 focus:ring-[#c21219] text-black"
          />
        </div>
      </div>

      <div className="text-sm text-gray-700">
        Amount: {currency} {amount.toLocaleString()} • Client: {currency}{" "}
        {clientPart.toLocaleString()} • Freelancer: {currency}{" "}
        {freelancerPart.toLocaleString()}
      </div>

      <button
        onClick={() =>
          onResolve({
            outcome,
            ratio: outcome === "split" ? ratio : undefined,
            notes,
          })
        }
        className="px-4 py-2 bg-[#c21219] text-white rounded-md hover:bg-red-700"
      >
        Confirm resolution
      </button>
    </div>
  );
}
