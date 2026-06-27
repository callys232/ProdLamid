"use client";

import { motion } from "framer-motion";

interface Props {
  value: string;
  label: string;
}

export default function StatCard({ value, label }: Props) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-xl border border-white/10 bg-white/[0.04] p-5 text-center transition hover:border-[#c12129]/20"
    >
      <p className="text-2xl font-bold text-[#c12129]">{value}</p>
      <p className="mt-1 text-xs text-gray-400">{label}</p>
    </motion.div>
  );
}
