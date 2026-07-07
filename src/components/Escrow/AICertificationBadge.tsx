"use client";

import { motion } from "framer-motion";

export interface AICertificationBadgeProps {
  milestoneId: string;
  certified?: boolean;
  certifiedAt?: string;
}

export default function AICertificationBadge({
  milestoneId,
  certified = false,
  certifiedAt,
}: AICertificationBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5"
    >
      <div
        className={`h-2 w-2 rounded-full ${
          certified ? "bg-green-400" : "bg-gray-600"
        }`}
      />
      <span className="text-xs font-medium text-gray-300">
        {certified
          ? `AI Certified${certifiedAt ? ` · ${certifiedAt}` : ""}`
          : "AI Certification Initializing"}
      </span>
    </motion.div>
  );
}
