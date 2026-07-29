"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Zap, TrendingDown, TrendingUp, ShoppingCart } from "lucide-react";
import PurchasePoints from "./PurchasePoints";

interface Transaction {
  _id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  createdAt: string;
}

interface Props {
  compact?: boolean;  // small chip for header use
}

export default function PointsBalance({ compact = false }: Props) {
  const [balance, setBalance]       = useState<number | null>(null);
  const [history, setHistory]       = useState<Transaction[]>([]);
  const [showModal, setShowModal]   = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  async function fetchPoints() {
    try {
      const res  = await fetch("/api/points");
      if (!res.ok) return;
      const { data } = await res.json();
      setBalance(data.balance);
      setHistory(data.transactions ?? []);
    } catch {}
  }

  useEffect(() => { fetchPoints(); }, []);

  // ── Compact chip (for sidebar / header) ──────────────────────────
  if (compact) {
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-full border border-[#2563EB]/30 bg-[#2563EB]/10 px-3 py-1 text-xs font-semibold text-[#2563EB] transition hover:bg-[#2563EB]/20"
        >
          <Zap className="h-3 w-3" />
          {balance !== null ? balance.toLocaleString() : "—"} pts
        </motion.button>
        <PurchasePoints open={showModal} onClose={() => { setShowModal(false); fetchPoints(); }} />
      </>
    );
  }

  // ── Full card (for dashboard tab / settings) ─────────────────────
  return (
    <>
      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        {/* Header row */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#2563EB]" />
            <span className="text-sm font-semibold text-white">Points Balance</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#2563EB]/30 bg-[#2563EB]/10 px-3 py-1.5 text-xs font-semibold text-[#2563EB] hover:bg-[#2563EB]/20"
          >
            <ShoppingCart className="h-3 w-3" /> Buy Points
          </motion.button>
        </div>

        {/* Balance */}
        <div className="mb-5 text-center">
          <p className="text-5xl font-black text-white">
            {balance !== null ? balance.toLocaleString() : "—"}
          </p>
          <p className="mt-1 text-xs text-gray-500">available points</p>
        </div>

        {/* Cost info */}
        <div className="mb-5 grid grid-cols-2 gap-3">
          {[
            { label: "Post a project", cost: 50, icon: TrendingDown },
            { label: "Place a bid",    cost: 20, icon: TrendingDown },
          ].map(({ label, cost, icon: Icon }) => (
            <div key={label} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                <Icon className="h-3 w-3 text-[#2563EB]" /> {label}
              </div>
              <p className="mt-1 text-sm font-bold text-white">{cost} pts</p>
            </div>
          ))}
        </div>

        {/* History toggle */}
        <button
          onClick={() => setShowHistory(v => !v)}
          className="text-xs text-gray-500 hover:text-white transition"
        >
          {showHistory ? "Hide history ▲" : "Show history ▼"}
        </button>

        {showHistory && (
          <ul className="mt-3 max-h-52 overflow-y-auto divide-y divide-white/5">
            {history.length === 0 ? (
              <p className="py-4 text-center text-xs text-gray-600">No transactions yet</p>
            ) : history.map((tx) => (
              <motion.li
                key={tx._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between py-2.5 text-xs"
              >
                <div className="flex items-center gap-2">
                  {tx.type === "credit"
                    ? <TrendingUp className="h-3.5 w-3.5 text-green-400" />
                    : <TrendingDown className="h-3.5 w-3.5 text-[#2563EB]" />}
                  <span className="text-gray-600">{tx.description}</span>
                </div>
                <span className={`font-semibold ${tx.type === "credit" ? "text-green-400" : "text-[#2563EB]"}`}>
                  {tx.type === "credit" ? "+" : "-"}{tx.amount}
                </span>
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      <PurchasePoints
        open={showModal}
        onClose={() => { setShowModal(false); fetchPoints(); }}
      />
    </>
  );
}
