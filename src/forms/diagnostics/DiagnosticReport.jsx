"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Lightbulb, ArrowRight, Loader2 } from "lucide-react";

const SERVICE_COLORS = {
  BIZ:         { border: "border-blue-500",   bg: "bg-blue-500/10",   text: "text-blue-400" },
  HCD:         { border: "border-orange-500", bg: "bg-orange-500/10", text: "text-orange-400" },
  SDC:         { border: "border-emerald-500",bg: "bg-emerald-500/10",text: "text-emerald-400" },
  Marketplace: { border: "border-purple-500", bg: "bg-purple-500/10", text: "text-purple-400" },
};

export default function DiagnosticReport({ formData, onDone }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/ai/diagnose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ formData }),
        });
        const data = await res.json();
        setReport(data.report);
      } catch {
        setError("Unable to generate report. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [formData]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <Loader2 className="h-8 w-8 text-[#c21219] animate-spin" />
      <p className="text-sm text-gray-400">Analysing your submission…</p>
    </div>
  );

  if (error) return (
    <div className="text-center py-8">
      <p className="text-red-400 text-sm mb-4">{error}</p>
      <button onClick={onDone} className="px-4 py-2 rounded-lg bg-[#c21219] text-white text-sm">Close</button>
    </div>
  );

  const colors = SERVICE_COLORS[report.recommendedService] || SERVICE_COLORS.BIZ;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="text-center mb-2">
        <p className="text-xs font-semibold tracking-widest text-[#c21219] uppercase mb-1">Your AI Diagnostic Report</p>
        <p className="text-sm text-gray-300">{report.summary}</p>
      </div>

      {/* Recommended Service */}
      <div className={`rounded-xl border p-4 ${colors.border} ${colors.bg}`}>
        <p className="text-xs text-gray-400 mb-1">Recommended Service</p>
        <p className={`font-bold text-lg ${colors.text}`}>{report.recommendedService}</p>
        <p className="text-xs text-gray-300 mt-1">{report.recommendedServiceReason}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Strengths */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <p className="text-xs font-semibold text-emerald-400">Strengths</p>
          </div>
          <ul className="space-y-1">
            {(report.strengths || []).map((s, i) => (
              <li key={i} className="text-xs text-gray-300">• {s}</li>
            ))}
          </ul>
        </div>

        {/* Challenges */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertCircle className="h-3.5 w-3.5 text-orange-400" />
            <p className="text-xs font-semibold text-orange-400">Challenges</p>
          </div>
          <ul className="space-y-1">
            {(report.challenges || []).map((c, i) => (
              <li key={i} className="text-xs text-gray-300">• {c}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      {(report.recommendations || []).length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Lightbulb className="h-3.5 w-3.5 text-yellow-400" />
            <p className="text-xs font-semibold text-yellow-400">Recommendations</p>
          </div>
          <ul className="space-y-1.5">
            {report.recommendations.map((r, i) => (
              <li key={i} className="text-xs text-gray-300">
                <span className="text-white font-medium">{r.title}:</span> {r.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next Step */}
      <div className="rounded-xl border border-[#c21219]/30 bg-[#c21219]/10 p-3 flex items-start gap-2">
        <ArrowRight className="h-4 w-4 text-[#c21219] flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-200">{report.nextStep}</p>
      </div>

      <button
        onClick={onDone}
        className="w-full py-2.5 rounded-xl bg-[#c21219] hover:bg-red-700 text-white text-sm font-semibold transition"
      >
        Close
      </button>
    </motion.div>
  );
}
