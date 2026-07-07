"use client";

import { motion } from "framer-motion";

export interface MilestoneAgentPanelProps {
  milestoneId: string;
  projectId: string;
  userId?: string;
}

export default function MilestoneAgentPanel({
  milestoneId,
  projectId,
  userId,
}: MilestoneAgentPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-gray-800 bg-gray-900 p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-8 w-8 rounded-full bg-red-600/20 flex items-center justify-center">
          <span className="text-red-400 text-sm font-bold">AI</span>
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">Milestone Agent</h3>
          <p className="text-gray-500 text-xs">Initializing...</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-2 w-full rounded bg-gray-800 overflow-hidden">
          <motion.div
            className="h-full bg-red-600/60 rounded"
            initial={{ width: "0%" }}
            animate={{ width: "60%" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        </div>
        <p className="text-gray-500 text-xs">
          Milestone Agent is initializing for milestone{" "}
          <span className="text-gray-300 font-mono">{milestoneId}</span>.
        </p>
      </div>
    </motion.div>
  );
}
