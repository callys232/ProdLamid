"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Mail, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

export default function DeleteAccount() {
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    if (!reason.trim()) { toast.error("Please provide a reason."); return; }
    setLoading(true);
    try {
      await fetch("/api/support/deletion-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      setSubmitted(true);
    } catch {
      toast.error("Failed to send request. Please email us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl w-full space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-blue-500 mb-1">Delete Account</h2>
        <p className="text-xs text-gray-500">Request account removal through our admin team.</p>
      </div>

      {/* Why admin-only */}
      <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 flex gap-3">
        <ShieldAlert className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-white mb-1">Only admins can delete accounts</p>
          <p className="text-xs text-gray-400 leading-relaxed">
            To protect against accidental or unauthorised deletion, account removal must be
            approved and executed by a Lamid administrator. This ensures your data, active
            projects, and escrow balances are handled correctly before closure.
          </p>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-blue-600/40 bg-blue-900/10 p-5 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-blue-400">Danger Zone</h3>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          Deletion permanently removes your profile, project history, wallet balance, and all
          associated data. This cannot be undone. Active escrow must be resolved before
          deletion can proceed.
        </p>

        <AnimatePresence mode="wait" initial={false}>
          {submitted ? (
            <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-white">Request submitted</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Our team will review and contact you within 48 hours.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Reason for deletion *</label>
                <textarea rows={3} value={reason} onChange={e => setReason(e.target.value)}
                  placeholder="Tell us why you'd like to delete your account…"
                  className="w-full rounded-xl bg-black border border-white/10 text-white text-sm px-4 py-2.5 focus:outline-none focus:border-blue-600/50 resize-none placeholder-gray-600" />
              </div>
              <button onClick={handleRequest} disabled={loading || !reason.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold transition disabled:opacity-40">
                {loading
                  ? <><Loader2 className="h-4 w-4 animate-spin" />Sending…</>
                  : "Send Deletion Request to Admin"}
              </button>
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                Or email:{" "}
                <a href="mailto:hq@lamidconsulting.com?subject=Account Deletion Request"
                  className="text-blue-400 hover:underline">hq@lamidconsulting.com</a>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
