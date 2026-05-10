"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, Download, TrendingUp, Users, DollarSign, Target,
  X, Send, CheckCircle2, Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  mockConciergeReports, mockConciergeKPIs,
  type ConciergeReport, type ConciergeKPI,
} from "@/mocks/mockConciergeReports";

const KPI_ICONS: Record<string, any> = {
  completion_rate:     Target,
  total_beneficiaries: Users,
  budget_utilisation:  DollarSign,
  consultant_sat:      TrendingUp,
};
const KPI_COLORS: Record<string, string> = {
  completion_rate:     "text-emerald-400",
  total_beneficiaries: "text-blue-400",
  budget_utilisation:  "text-yellow-400",
  consultant_sat:      "text-purple-400",
};

export default function ConciergeReports() {
  const [reports, setReports] = useState<ConciergeReport[]>(mockConciergeReports);
  const [kpis,    setKpis]    = useState<ConciergeKPI[]>(mockConciergeKPIs);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [showRequest, setShowRequest] = useState(false);
  const [reqSubject, setReqSubject]   = useState("");
  const [reqMsg,     setReqMsg]       = useState("");
  const [sending,    setSending]      = useState(false);
  const [sent,       setSent]         = useState(false);

  /* ── Fetch real data, fall back to mock ─────────────────────── */
  useEffect(() => {
    fetch("/api/concierge/reports")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.reports?.length)  setReports(d.reports);
        if (d?.kpis?.length)     setKpis(d.kpis);
      })
      .catch(() => {});
  }, []);

  /* ── Download handler ───────────────────────────────────────── */
  async function handleDownload(report: ConciergeReport) {
    setDownloading(report.id);
    try {
      const res = await fetch(`/api/concierge/reports/${report.id}/download`);
      if (res.ok) {
        const blob = await res.blob();
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href     = url;
        a.download = `${report.title}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`Downloaded: ${report.title}`);
      } else {
        throw new Error("not available");
      }
    } catch {
      // Graceful fallback — show toast explaining it's a demo
      toast(`${report.title} — download will be available once reports are generated from your live projects.`, {
        icon: "📄",
        duration: 4000,
      });
    } finally {
      setDownloading(null);
    }
  }

  /* ── Request custom report ──────────────────────────────────── */
  async function handleRequest(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    const tid = toast.loading("Sending request…");
    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject:  reqSubject || "Custom Report Request",
          message:  reqMsg,
          priority: "medium",
          category: "reports",
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Request submitted — your PM will follow up.", { id: tid });
    } catch {
      toast.dismiss(tid);
      // Mailto fallback
      const subject = encodeURIComponent(reqSubject || "Custom Report Request");
      const body    = encodeURIComponent(reqMsg);
      window.open(`mailto:reports@lamidconsulting.com?subject=${subject}&body=${body}`);
      toast.success("Opening your email client…");
    } finally {
      setSending(false);
      setSent(true);
    }
  }

  function closeRequest() {
    setShowRequest(false);
    setTimeout(() => { setReqSubject(""); setReqMsg(""); setSent(false); }, 300);
  }

  return (
    <>
      <div className="space-y-4">
        {/* KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => {
            const Icon  = KPI_ICONS[kpi.key]   ?? BarChart3;
            const color = KPI_COLORS[kpi.key]  ?? "text-gray-400";
            return (
              <motion.div
                key={kpi.key}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.04, y: -3, boxShadow: "0 10px 28px rgba(0,0,0,0.35)" }}
                className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col items-center text-center cursor-default"
              >
                <Icon className={`h-5 w-5 mb-2 ${color}`} />
                <p className={`text-xl font-bold ${color}`}>{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Reports list */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[#c21219]" /> Generated Reports
          </h3>
          <div className="space-y-3">
            {reports.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.01, y: -1, boxShadow: "0 6px 20px rgba(0,0,0,0.3)", borderColor: "rgba(255,255,255,0.2)" }}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">{r.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{r.date} · {r.type} · {r.size}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.06, boxShadow: "0 4px 14px rgba(194,18,25,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownload(r)}
                  disabled={downloading === r.id}
                  className="flex-shrink-0 ml-4 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#c21219]/30 bg-[#c21219]/10 text-[#c21219] hover:bg-[#c21219]/20 transition disabled:opacity-50"
                >
                  {downloading === r.id
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <Download className="h-3.5 w-3.5" />}
                  {downloading === r.id ? "…" : "Download"}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Request custom report */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-xl border border-dashed border-white/15 bg-white/5 p-5 text-center"
        >
          <p className="text-sm text-gray-400 mb-3">Need a custom impact or progress report?</p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 6px 20px rgba(194,18,25,0.35)" }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowRequest(true)}
            className="px-5 py-2 rounded-xl bg-[#c21219] hover:bg-red-700 text-white text-sm font-semibold transition"
          >
            Request Custom Report
          </motion.button>
        </motion.div>
      </div>

      {/* ── Request custom report modal ──────────────────────────── */}
      <AnimatePresence>
        {showRequest && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
            onClick={closeRequest}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 16 }}
              transition={{ duration: 0.22, ease: [0.33, 1, 0.68, 1] }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#c21219]/15 border border-[#c21219]/25">
                    <BarChart3 className="h-4 w-4 text-[#c21219]" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Request Custom Report</h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                  onClick={closeRequest}
                  className="rounded-xl border border-white/10 bg-white/5 p-2 text-gray-400 hover:text-white transition"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>

              <div className="px-5 py-4">
                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-3 py-4 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                      className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30"
                    >
                      <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                    </motion.div>
                    <div>
                      <p className="text-base font-bold text-white">Request Sent!</p>
                      <p className="text-sm text-gray-400 mt-1">Your PM will prepare the report and share it within 2–3 business days.</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      onClick={closeRequest}
                      className="mt-2 px-6 py-2 rounded-xl bg-[#c21219] text-sm font-semibold text-white hover:bg-red-700 transition"
                    >
                      Done
                    </motion.button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleRequest} className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">Report Title / Subject <span className="text-[#c21219]">*</span></label>
                      <input
                        required
                        value={reqSubject}
                        onChange={e => setReqSubject(e.target.value)}
                        placeholder="e.g. Q3 Programme Impact Report"
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c21219]/50 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1.5">Details <span className="text-[#c21219]">*</span></label>
                      <textarea
                        required
                        rows={4}
                        value={reqMsg}
                        onChange={e => setReqMsg(e.target.value)}
                        placeholder="Describe the report you need — projects to include, metrics, format, deadline…"
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#c21219]/50 resize-none transition"
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-1">
                      <button type="button" onClick={closeRequest} className="text-sm text-gray-400 hover:text-white transition px-3 py-2">Cancel</button>
                      <motion.button
                        type="submit"
                        disabled={sending || !reqSubject.trim() || !reqMsg.trim()}
                        whileHover={{ scale: 1.04, boxShadow: "0 4px 16px rgba(194,18,25,0.35)" }}
                        whileTap={{ scale: 0.96 }}
                        className="flex items-center gap-2 rounded-xl bg-[#c21219] px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-50"
                      >
                        {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                        {sending ? "Sending…" : "Submit Request"}
                      </motion.button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
