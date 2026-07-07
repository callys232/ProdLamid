"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export interface DeliverableSubmitFormProps {
  milestoneId: string;
  projectId: string;
  userId?: string;
  onSubmit?: (data: { note: string; fileUrl?: string }) => void;
}

export default function DeliverableSubmitForm({
  milestoneId,
  projectId,
  userId,
  onSubmit,
}: DeliverableSubmitFormProps) {
  const [note, setNote] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-gray-800 bg-gray-900 p-6"
    >
      <h3 className="text-white font-semibold text-sm mb-1">Submit Deliverable</h3>
      <p className="text-gray-500 text-xs mb-4">
        This form is initializing — deliverable submission for milestone{" "}
        <span className="font-mono text-gray-300">{milestoneId}</span> will be
        available shortly.
      </p>

      <div className="space-y-3 opacity-50 pointer-events-none select-none">
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note for the client..."
          className="w-full rounded-lg bg-gray-800 border border-gray-700 text-white text-sm px-3 py-2 resize-none focus:outline-none"
        />
        <button
          type="button"
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Submit Deliverable
        </button>
      </div>
    </motion.div>
  );
}
