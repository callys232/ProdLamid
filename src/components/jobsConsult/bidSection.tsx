"use client";

import { useState } from "react";
import { Zap, Lock, Star } from "lucide-react";
import { Project } from "@/types/project";
import Link from "next/link";
import toast from "react-hot-toast";

interface Bid {
  amount: number;
  boosted: boolean;
  date: string;
}

interface BidSectionProps {
  job: Project;
  isRegisteredUser: boolean;
  isPremiumConsultant?: boolean; // passed from parent
  onBid: (job: Project, amount: number) => void;
  initialBids?: Bid[];
  onLatestBidChange?: (amount: number | null) => void;
}

const PLACE_BID_COST  = 20;
const BOOST_BID_COST  = 60;

export default function BidSection({
  job,
  isRegisteredUser,
  isPremiumConsultant = false,
  onBid,
  initialBids = [],
  onLatestBidChange,
}: BidSectionProps) {
  const [bidAmount, setBidAmount] = useState<number | "">("");
  const [bids,      setBids]      = useState<Bid[]>(initialBids);
  const [boosted,   setBoosted]   = useState(false);

  const handleBid = async () => {
    if (!isRegisteredUser) return;
    if (typeof bidAmount !== "number" || bidAmount <= 0) return;

    if (
      job.suggestedBidRange &&
      (bidAmount < job.suggestedBidRange.min || bidAmount > job.suggestedBidRange.max)
    ) {
      toast.error(`Bid outside suggested range (${job.suggestedBidRange.min}–${job.suggestedBidRange.max}).`);
    }

    // Deduct points via API
    try {
      const pointCost = boosted ? BOOST_BID_COST : PLACE_BID_COST;
      await fetch("/api/points/deduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: pointCost,
          description: boosted ? "Boost Bid placed" : "Bid placed",
        }),
      });
    } catch {
      // Non-blocking — bid still proceeds even if point deduction fails silently
    }

    onBid(job, bidAmount);

    const newBid: Bid = {
      amount: bidAmount,
      boosted,
      date: new Date().toLocaleString(),
    };

    setBids((prev) => {
      const updated = [...prev, newBid];
      onLatestBidChange?.(newBid.amount);
      return updated;
    });

    setBidAmount("");
    setBoosted(false);
  };

  return (
    <div className="mt-4 space-y-4">
      {/* Bid input row */}
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value === "" ? "" : Number(e.target.value))}
          placeholder={
            job.suggestedBidRange
              ? `Suggested ${job.suggestedBidRange.min}–${job.suggestedBidRange.max}`
              : "Enter bid amount"
          }
          className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
        />
        <button
          onClick={handleBid}
          disabled={!isRegisteredUser || bidAmount === ""}
          className={`flex items-center gap-2 px-5 py-2 rounded-md font-semibold transition text-sm ${
            isRegisteredUser && bidAmount !== ""
              ? boosted
                ? "bg-yellow-600 hover:bg-yellow-700 text-white border border-yellow-500"
                : "bg-white/10 hover:bg-white/20 border border-white/20 text-gray-200"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }`}
          title={!isRegisteredUser ? "Login required to place bids" : boosted ? "Place boosted bid" : "Place bid"}
        >
          <Zap className="h-4 w-4" />
          {boosted ? "Boost Bid" : "Place bid"}
        </button>
      </div>

      {/* Points cost indicator */}
      {isRegisteredUser && (
        <p className="text-xs text-gray-500">
          Cost: <span className="text-white font-medium">{boosted ? BOOST_BID_COST : PLACE_BID_COST} pts</span>
          {boosted && <span className="ml-2 text-yellow-400">⚡ 2× visibility</span>}
        </p>
      )}

      {/* Boost Bid toggle — premium only */}
      <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-400" />
            <div>
              <p className="text-sm font-semibold text-white">Boost Bid</p>
              <p className="text-xs text-gray-400">2× visibility · {BOOST_BID_COST} pts · Premium consultants only</p>
            </div>
          </div>

          {isPremiumConsultant ? (
            <button
              onClick={() => setBoosted(v => !v)}
              className={`relative h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none ${
                boosted ? "bg-yellow-500" : "bg-white/20"
              }`}
              aria-checked={boosted}
              role="switch"
            >
              <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                boosted ? "translate-x-5" : "translate-x-0"
              }`} />
            </button>
          ) : (
            <Link href="/pricing" className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 transition">
              <Lock className="h-3 w-3" />Upgrade
            </Link>
          )}
        </div>
      </div>

      {!isRegisteredUser && (
        <p className="text-xs text-gray-400">
          Bidding is available to logged-in users.{" "}
          <Link href="/signin" className="text-[#c21219] hover:underline">Sign in to continue.</Link>
        </p>
      )}

      {/* Bid history */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-2">Your Bids</h3>
        {bids.length === 0 ? (
          <p className="text-sm text-gray-400">No bids placed yet.</p>
        ) : (
          <ul className="space-y-2">
            {bids.map((bid, i) => (
              <li key={i} className={`px-4 py-2 rounded-md border transition-all duration-200 flex items-center justify-between ${
                i === bids.length - 1
                  ? "border-[#c21219] bg-[#c21219]/20 text-[#c21219] font-semibold"
                  : "border-white/20 bg-white/5 text-gray-200"
              }`}>
                <span>${bid.amount}{bid.boosted && <span className="ml-2 text-xs text-yellow-400">⚡ Boosted</span>}</span>
                <span className="text-xs text-gray-400">{bid.date}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
