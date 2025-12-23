"use client";

import { useState } from "react";
import { Project } from "@/types/project";

interface Bid {
  amount: number;
  date: string;
}

interface BidSectionProps {
  job: Project;
  isRegisteredUser: boolean;
  onBid: (job: Project, amount: number) => void;
  initialBids?: Bid[];
  onLatestBidChange?: (amount: number | null) => void;
}

export default function BidSection({
  job,
  isRegisteredUser,
  onBid,
  initialBids = [],
  onLatestBidChange,
}: BidSectionProps) {
  const [bidAmount, setBidAmount] = useState<number | "">("");
  const [bids, setBids] = useState<Bid[]>(initialBids);

  const handleBid = () => {
    if (!isRegisteredUser) return;

    if (typeof bidAmount === "number" && bidAmount > 0) {
      if (
        job.suggestedBidRange &&
        (bidAmount < job.suggestedBidRange.min ||
          bidAmount > job.suggestedBidRange.max)
      ) {
        alert(
          `⚠️ Your bid is outside the suggested range (${job.suggestedBidRange.min}–${job.suggestedBidRange.max}).`
        );
      }

      onBid(job, bidAmount);

      const newBid: Bid = {
        amount: bidAmount,
        date: new Date().toLocaleString(),
      };

      setBids((prev) => {
        const updated = [...prev, newBid];
        // ✅ notify parent of latest bid
        if (onLatestBidChange) {
          onLatestBidChange(newBid.amount);
        }
        return updated;
      });

      setBidAmount("");
    }
  };

  return (
    <div className="mt-4">
      {/* Bid input */}
      <div className="flex items-center gap-3 mb-4">
        <input
          type="number"
          value={bidAmount}
          onChange={(e) =>
            setBidAmount(e.target.value === "" ? "" : Number(e.target.value))
          }
          placeholder={
            job.suggestedBidRange
              ? `Enter bid between ${job.suggestedBidRange.min}–${job.suggestedBidRange.max}`
              : "Enter bid amount"
          }
          className="px-3 py-2 bg-white/10 border border-white/20 rounded-md text-sm text-white placeholder-gray-400"
        />
        <button
          className={`px-5 py-2 rounded-md font-semibold transition ${
            isRegisteredUser
              ? "bg-white/10 hover:bg-white/20 border border-white/20 text-gray-200"
              : "bg-gray-700 text-gray-300 cursor-not-allowed"
          }`}
          onClick={handleBid}
          disabled={!isRegisteredUser}
          title={
            !isRegisteredUser ? "Login required to place bids" : "Place bid"
          }
        >
          Place bid
        </button>
      </div>

      {!isRegisteredUser && (
        <p className="text-xs text-gray-400 mb-4">
          Bidding is available to logged-in users. Please sign in to continue.
        </p>
      )}

      {/* User bids */}
      <h3 className="text-lg font-semibold text-white mb-2">Your Bids</h3>
      {bids.length === 0 ? (
        <p className="text-sm text-gray-400">
          You haven’t placed any bids yet.
        </p>
      ) : (
        <ul className="space-y-2">
          {bids.map((bid, i) => (
            <li
              key={i}
              className={`px-4 py-2 rounded-md border transition-all duration-200 ${
                i === bids.length - 1
                  ? "border-[#c21219] bg-[#c21219]/20 text-[#c21219] font-semibold"
                  : "border-white/20 bg-white/5 text-gray-200"
              }`}
            >
              ${bid.amount} —{" "}
              <span className="text-xs text-gray-400">{bid.date}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
