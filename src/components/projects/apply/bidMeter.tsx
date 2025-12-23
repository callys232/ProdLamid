"use client";

import { motion } from "framer-motion";

interface BidMeterProps {
  amount: number;
  min: number;
  max: number;
}

const getConfidenceLevel = (bid: number, min: number, max: number) => {
  if (bid < min * 0.8)
    return { label: "Too Low", color: "bg-red-500", score: 20 };
  if (bid >= min && bid <= max)
    return { label: "Competitive", color: "bg-green-500", score: 80 };
  if (bid > max * 1.2)
    return { label: "Too High", color: "bg-yellow-500", score: 40 };
  return { label: "Moderate", color: "bg-blue-500", score: 60 };
};

export default function BidMeter({ amount, min, max }: BidMeterProps) {
  const confidence = getConfidenceLevel(amount, min, max);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4"
    >
      <p className="text-sm text-gray-300 mb-1">Bid Confidence</p>
      <div className="w-full bg-white/10 rounded-full h-3">
        <div
          className={`h-3 rounded-full ${confidence.color}`}
          style={{ width: `${confidence.score}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">{confidence.label}</p>
    </motion.div>
  );
}
