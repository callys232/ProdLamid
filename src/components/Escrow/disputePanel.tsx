// components/escrow/EscrowDisputePanel.tsx
"use client";
import { useState } from "react";

export interface EscrowDisputePanelProps {
  projectId: string;

  milestoneId?: string;
  onOpenDispute: (payload: {
    reason: string;
    evidence: File[];
    projectId: string;
    milestoneId?: string;
  }) => Promise<void> | void;
}

export default function EscrowDisputePanel({
  projectId,
  milestoneId,
  onOpenDispute,
}: EscrowDisputePanelProps) {
  const [reason, setReason] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  const submit = async () => {
    if (!reason.trim()) return;
    setSubmitting(true);

    try {
      await onOpenDispute({
        reason,
        evidence: files,
        projectId,
        milestoneId,
      });
      // reset form after successful submission
      setReason("");
      setFiles([]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#1a0d0d] border border-gray-800 rounded-xl p-6 space-y-4">
      <h4 className="font-semibold text-lg text-white">Open Dispute</h4>

      <div className="space-y-4">
        <textarea
          placeholder="Describe the issue in detail..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-white outline-none transition"
          rows={3}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Evidence / Documentation</label>
            <input
              aria-label="file-upload"
              type="file"
              multiple
              onChange={handleFiles}
              className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-800 file:text-gray-300 hover:file:bg-gray-700 transition cursor-pointer"
            />
          </div>

          <button
            onClick={submit}
            disabled={submitting || !reason.trim()}
            className={`px-6 py-2 rounded-lg font-bold text-white transition shadow-lg ${submitting || !reason.trim()
                ? "bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700"
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-900/20"
              }`}
          >
            {submitting ? "Submitting..." : "Submit Dispute"}
          </button>
        </div>
      </div>
    </div>
  );
}
