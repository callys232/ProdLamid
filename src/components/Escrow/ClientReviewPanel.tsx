"use client";

import { motion } from "framer-motion";

export interface ClientReviewPanelProps {
  milestoneId: string;
  projectId: string;
  clientId?: string;
  onApprove?: () => void;
  onRequestRevision?: (reason: string) => void;
}

export default function ClientReviewPanel({
  milestoneId,
  projectId,
  clientId,
  onApprove,
  onRequestRevision,
}: ClientReviewPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-gray-800 bg-gray-900 p-6"
    >
      <h3 className="text-white font-semibold text-sm mb-1">Client Review</h3>
      <p className="text-gray-500 text-xs mb-4">
        Review panel for milestone{" "}
        <span className="font-mono text-gray-300">{milestoneId}</span> is
        initializing. Actions will be available once the deliverable is submitted.
      </p>

      <div className="flex gap-3 opacity-50 pointer-events-none select-none">
        <button
          type="button"
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Approve &amp; Release
        </button>
        <button
          type="button"
          className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-semibold text-gray-300"
        >
          Request Revision
        </button>
      </div>
    </motion.div>
  );
}
