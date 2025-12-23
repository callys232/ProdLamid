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
    <div className="bg-white border border-[#c21219] rounded-lg p-4 space-y-3">
      <h4 className="font-semibold text-[#c21219]">Open Dispute</h4>

      <textarea
        placeholder="Describe the issue..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full px-3 py-2 rounded-md border border-[#c21219] focus:ring-2 focus:ring-[#c21219] text-black"
        rows={3}
      />

      <input
        aria-label="file-upload"
        type="file"
        multiple
        onChange={handleFiles}
        className="text-sm"
      />

      <button
        onClick={submit}
        disabled={submitting}
        className={`px-4 py-2 rounded-md text-white ${
          submitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-[#c21219] hover:bg-red-700"
        }`}
      >
        {submitting ? "Submitting..." : "Submit Dispute"}
      </button>
    </div>
  );
}
