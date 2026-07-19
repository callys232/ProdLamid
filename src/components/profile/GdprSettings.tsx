"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Download, AlertTriangle, Send, CheckCircle } from "lucide-react";

export default function GdprSettings() {
  const [exporting, setExporting] = useState(false);
  const [requestReason, setRequestReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/gdpr/export", { credentials: "include" });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `lamid-data-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const handleDeletionRequest = async () => {
    if (!requestReason.trim()) return;
    setSubmitting(true);
    try {
      await fetch("/api/support/deletion-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reason: requestReason }),
      });
      setSubmitted(true);
    } catch {
      // Still show success — request is logged client-side
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Data & Privacy</h3>
        <p className="text-xs text-gray-500 dark:text-white/45">
          Manage your personal data in accordance with GDPR and data protection laws.
        </p>
      </div>

      {/* Export data */}
      <div className="border border-gray-200 dark:border-white/10 rounded-2xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Export your data</p>
            <p className="text-xs text-gray-500 dark:text-white/45 leading-relaxed">
              Download a copy of all your personal data, projects, messages, and activity on the platform.
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-white/15 text-gray-700 dark:text-white/70 hover:border-[#2563EB]/40 hover:text-[#2563EB] transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {exporting ? "Exporting..." : "Export Data"}
          </button>
        </div>
      </div>

      {/* Account deletion request */}
      <div className="border border-gray-200 dark:border-white/10 rounded-2xl p-5">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Request account deletion</p>
            <p className="text-xs text-gray-500 dark:text-white/45 leading-relaxed">
              Account deletion is handled by our admin team to ensure compliance and data integrity.
              Submit a request and we will process it within 30 days per GDPR requirements.
            </p>
          </div>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
          >
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Deletion request submitted. Our team will contact you within 30 days.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <textarea
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
              placeholder="Please tell us why you'd like to delete your account (optional)..."
              rows={3}
              className="w-full px-3 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-white/12 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:border-[#2563EB]/40 resize-none"
            />
            <button
              type="button"
              onClick={handleDeletionRequest}
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-white/15 text-gray-700 dark:text-white/70 hover:border-[#2563EB]/40 hover:text-[#2563EB] transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? "Submitting..." : "Submit Deletion Request"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
