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
      className="rounded-xl border border-white/10 bg-white/[0.04] p-5 text-center transition hover:border-[#2563EB]/20"
    >
      <p className="text-2xl font-bold text-[#2563EB]">{value}</p>
      <p className="mt-1 text-xs text-gray-600">{label}</p>
    </motion.div>
  );
}
