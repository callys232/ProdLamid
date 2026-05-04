"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, CheckCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const PACKAGES = [
  { id: "p100",  points: 100,  priceNgn: 500,   label: "100 Points",   popular: false },
  { id: "p500",  points: 500,  priceNgn: 2000,  label: "500 Points",   popular: true  },
  { id: "p1000", points: 1000, priceNgn: 3500,  label: "1,000 Points", popular: false },
  { id: "p5000", points: 5000, priceNgn: 15000, label: "5,000 Points", popular: false },
];

interface Props {
  open:     boolean;
  onClose:  () => void;
  onSuccess?: (points: number) => void;
}

export default function PurchasePoints({ open, onClose, onSuccess }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  async function handlePurchase() {
    if (!selected) return;
    setLoading(true);
    try {
      const res  = await fetch("/api/points/purchase", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ packageId: selected }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      // Redirect to Paystack checkout
      window.location.href = data.authorizationUrl;
    } catch (e: any) {
      toast.error(e.message || "Purchase failed");
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.95, y: 8  }}
            transition={{ duration: 0.2 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0F19] p-6 text-white shadow-2xl"
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#c12129]" />
                <h2 className="text-base font-bold">Purchase Points</h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>

            <p className="mb-5 text-xs text-gray-500">
              Points are used to post projects (50 pts) and place bids (20 pts).
              Purchased points never expire.
            </p>

            {/* Packages */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {PACKAGES.map(pkg => (
                <motion.button
                  key={pkg.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelected(pkg.id)}
                  className={`relative rounded-xl border p-4 text-left transition ${
                    selected === pkg.id
                      ? "border-[#c12129] bg-[#c12129]/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-2 left-3 rounded-full bg-[#c12129] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                      Popular
                    </span>
                  )}
                  <p className="text-base font-bold text-white">{pkg.label}</p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    ₦{pkg.priceNgn.toLocaleString()}
                  </p>
                  {selected === pkg.id && (
                    <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-[#c12129]" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Cost breakdown */}
            {selected && (() => {
              const pkg = PACKAGES.find(p => p.id === selected)!;
              return (
                <div className="mb-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-gray-400">
                  <div className="flex justify-between"><span>Points</span><span className="font-semibold text-white">{pkg.points.toLocaleString()}</span></div>
                  <div className="flex justify-between mt-1"><span>Amount</span><span className="font-semibold text-white">₦{pkg.priceNgn.toLocaleString()}</span></div>
                  <div className="flex justify-between mt-1"><span>Per point</span><span className="text-gray-500">₦{(pkg.priceNgn / pkg.points).toFixed(1)}</span></div>
                </div>
              );
            })()}

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handlePurchase}
              disabled={!selected || loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#c12129] py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-40"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
              {loading ? "Redirecting…" : "Pay with Paystack"}
            </motion.button>

            <p className="mt-3 text-center text-[10px] text-gray-600">
              Secure payment via Paystack · Points credited instantly on success
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
