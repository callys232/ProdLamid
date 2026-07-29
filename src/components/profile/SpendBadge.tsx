"use client";

import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";

interface Props { totalSpend: number }

function getBadge(spend: number) {
  if (spend >= 500_000) return { label: "$500k+ Spent",  color: "text-yellow-300 border-yellow-400/40 bg-yellow-400/10",  glow: "rgba(234,179,8,0.2)"  };
  if (spend >= 100_000) return { label: "$100k+ Spent",  color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/10",  glow: "rgba(234,179,8,0.15)" };
  if (spend >= 50_000)  return { label: "$50k+ Spent",   color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",glow: "rgba(34,197,94,0.15)" };
  if (spend >= 10_000)  return { label: "$10k+ Spent",   color: "text-blue-400 border-blue-500/30 bg-blue-500/10",        glow: "rgba(59,130,246,0.15)"};
  if (spend >= 1_000)   return { label: "$1k+ Spent",    color: "text-gray-600 border-white/20 bg-white/5",               glow: "rgba(255,255,255,0.05)"};
  return null;
}

export default function SpendBadge({ totalSpend }: Props) {
  const badge = getBadge(totalSpend);
  if (!badge) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: `0 0 16px ${badge.glow}` }}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold cursor-default ${badge.color}`}
    >
      <DollarSign className="h-3 w-3 flex-shrink-0" />
      {badge.label}
    </motion.div>
  );
}
