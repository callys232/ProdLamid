"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2, Loader2, ChevronDown } from "lucide-react";

const REASONS = [
  "Work not delivered",
  "Deliverable does not meet agreed scope",
  "No communication from the other party",
  "Milestone completed but payment not released",
  "Fraudulent activity suspected",
  "Other",
];

interface DisputeSubmissionProps {
  escrowId: string;
  raisedBy: string; // userId of the person raising
  amount: number;
  currency?: string;
  onSuccess?: () => void;
}

export default function DisputeSubmission({
  escrowId,
  raisedBy,
  amount,
  currency = "$",
  onSuccess,
}: DisputeSubmissionProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!reason) { setError("Please select a reason."); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/disputes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ escrowId, raisedBy, reason, description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setDone(true);
      onSuccess?.();
    } catch (e: any) {
      setError(e.message || "Failed to submit dispute.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5 flex items-start gap-3"
    >
      <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-white">Dispute submitted</p>
        <p className="text-xs text-gray-400 mt-1">Our team will review and respond within 48 hours. The escrow funds are now frozen pending resolution.</p>
      </div>
    </motion.div>
  );

  return (
    <div className="rounded-xl border border-[#c21219]/30 bg-[#c21219]/5">
      {/* Toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-[#c21219] hover:text-white transition-colors"
      >
        <span className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Raise a dispute · {currency}{amount.toLocaleString()} at stake
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-4 pb-4 space-y-3 border-t border-[#c21219]/20 pt-3">
              {/* Reason */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Reason *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-lg bg-black border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-[#c21219]"
                >
                  <option value="">Select a reason…</option>
                  {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Additional details</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail…"
                  className="w-full rounded-lg bg-black border border-white/10 text-white text-sm px-3 py-2 focus:outline-none focus:border-[#c21219] resize-none"
                />
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-2.5 rounded-lg bg-[#c21219] hover:bg-red-700 text-white text-sm font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" />Submitting…</> : "Submit Dispute"}
              </button>

              <p className="text-[10px] text-gray-500 text-center">
                Funds will be frozen during review. Our team responds within 48 hours.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
